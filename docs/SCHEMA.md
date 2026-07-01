# SCHEMA.md — Struktur Database (Supabase / Postgres)

> ⚠️ **PENTING:** Dokumen ini disusun dari **audit kode** (migration files + query pattern di admin pages + type definitions di `src/lib/supabase.ts`) — **BUKAN** dari `pg_dump` langsung ke database production. Beberapa tabel (`bundle_products`, `section_items`, `videos`) tidak ada di file migration manapun di repo, artinya dibuat manual lewat Supabase dashboard dan strukturnya di sini adalah **hasil inferensi dari kode yang memakainya**, bisa jadi ada kolom yang terlewat.
>
> **Sebelum AI agent mulai kerja berat**, jalankan query ini di Supabase SQL Editor dan update dokumen ini dengan hasil aktualnya:
> ```sql
> select table_name, column_name, data_type, is_nullable, column_default
> from information_schema.columns
> where table_schema = 'public'
> order by table_name, ordinal_position;
> ```

---

## Daftar Tabel

| Tabel | Sumber Kode | RLS Aktif? |
|---|---|---|
| `products` | migration + `admin/products` | ❌ Tidak (lihat `SECURITY.md`) |
| `categories` | migration + `admin/categories` | ❌ Tidak |
| `bundles` | `admin/bundles` | ❌ Tidak |
| `bundle_products` | `admin/bundles` (tidak ada di migration file) | ❌ Tidak |
| `deals` | migration + `admin/deals` | ❌ Tidak |
| `homepage_sections` | `admin/homepage` (tidak ada di migration file) | ❌ Tidak |
| `section_items` | `admin/homepage` (tidak ada di migration file) | ❌ Tidak |
| `faqs` | terlihat di Supabase dashboard, belum ada kode yang pakai | ❌ Tidak |
| `transactions` | migration + `admin/cashflow` | ❌ Tidak |
| `videos` | terlihat di Supabase dashboard, belum dipastikan dipakai di kode mana | ❌ Tidak |

---

## `products`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug         text UNIQUE NOT NULL
name         text NOT NULL
sku          text UNIQUE
type         text                  -- "Plugin" | "Textures" | "Template" | "Font" | "Action Set"
category_id  uuid REFERENCES categories(id)
price        numeric NOT NULL
image_url    text
description  text
features     text[]
includes     text[]
created_by   text                  -- default "DORON'S SUPPLY" di data seed
compatibility text
badge        text
is_freebie   boolean DEFAULT false
is_active    boolean DEFAULT true
created_at   timestamptz DEFAULT now()
updated_at   timestamptz DEFAULT now()
```

## `categories`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL
name        text NOT NULL
parent_id   uuid REFERENCES categories(id)   -- nullable, untuk sub-kategori
sort_order  integer DEFAULT 0
```

## `bundles`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug         text UNIQUE NOT NULL
name         text NOT NULL
color        text                  -- hex color untuk badge/tema visual bundle
save_amount  numeric               -- nominal hemat (bukan persen) dibanding beli satuan
image_url    text
is_active    boolean DEFAULT true
created_at   timestamptz DEFAULT now()
```

## `bundle_products` (relasi many-to-many)
```sql
bundle_id    uuid REFERENCES bundles(id) ON DELETE CASCADE
product_id   uuid REFERENCES products(id) ON DELETE CASCADE
-- PRIMARY KEY (bundle_id, product_id) — rekomendasi, verifikasi ke DB aktual
```
⚠️ **Belum dikonsumsi di halaman publik** — lihat `TASKS.md` §1.3

## `deals`
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id        uuid REFERENCES products(id) ON DELETE CASCADE
title             text NOT NULL
discount_percent  integer NOT NULL
start_date        date NOT NULL
end_date          date NOT NULL
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```
⚠️ **Belum dikonsumsi di halaman publik sama sekali** — lihat `TASKS.md` §2.2. Aktif jika `start_date <= today <= end_date`.

## `homepage_sections`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
key          text UNIQUE NOT NULL   -- 'crowd_favorites' | 'popular_bundles' | 'shop_by_type' | 'build_bundle' | 'portfolio' (dulu 'mission')
label        text
heading      text
subheading   text
cta_text     text
cta_link     text
is_visible   boolean DEFAULT true
sort_order   integer DEFAULT 0
content      jsonb                 -- struktur berbeda per section key, lihat PRD §6.2–6.3
```
Isi `content` per key:
- `build_bundle`: `{ "tiers": [{ "min_items": number, "discount_percent": number }] }`
- `portfolio`: `{ "items": [{ "image_url": string, "title": string, "link"?: string }] }`
- key lain: `content` tidak dipakai / null

## `section_items` (relasi section homepage ↔ produk/bundle)
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
section_id    uuid REFERENCES homepage_sections(id) ON DELETE CASCADE
item_type     text NOT NULL    -- 'product' | 'bundle'
item_id       uuid NOT NULL    -- FK ke products.id atau bundles.id tergantung item_type (tidak ada FK constraint langsung karena tipe berbeda)
sort_order    integer DEFAULT 0
```
Hanya dipakai untuk `homepage_sections.key IN ('crowd_favorites', 'popular_bundles')`.

## `faqs`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
question    text NOT NULL
answer      text NOT NULL
sort_order  integer DEFAULT 0
is_active   boolean DEFAULT true
created_at  timestamptz DEFAULT now()
```
⚠️ Struktur ini **asumsi berdasarkan konvensi** tabel lain — belum ada kode yang query tabel ini. Verifikasi struktur aktual sebelum bikin admin FAQ (`TASKS.md` §2.3), sesuaikan kalau beda.

## `transactions`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
type         text CHECK (type IN ('income', 'expense')) NOT NULL
amount       numeric NOT NULL
date         date NOT NULL
description  text
created_at   timestamptz DEFAULT now()
```
Untuk pembukuan internal Arif (Cashflow admin), **tidak terhubung** ke alur pembelian pengunjung.

## `videos`
```sql
-- Struktur belum dipastikan dari kode (dulu dipakai MissionSection yang sudah diganti Portfolio)
-- Kemungkinan: id, title, youtube_url/video_id, thumbnail_url, sort_order
```
⚠️ Status pemakaian tidak jelas — cek apakah masih dipakai (misal di halaman About) sebelum dianggap tabel mati.

---

## Rekomendasi Setelah Verifikasi Schema Aktual

1. Update dokumen ini dengan hasil query `information_schema.columns` yang sebenarnya.
2. Tambahkan constraint yang hilang (foreign key, unique, not null) yang teridentifikasi dari pola pemakaian di atas tapi mungkin belum ada di DB aktual.
3. Setelah RLS diaktifkan (`SECURITY.md`), dokumentasikan policy apa saja yang berlaku per tabel di file ini juga.
