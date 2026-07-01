# PRD — Tassofly Admin Panel & Headless CMS

**Produk:** Admin Dashboard untuk mengelola website Tassofly (tassofly.vercel.app)
**Versi:** 1.0
**Disusun untuk:** Adista Putra Suyatno
**Stack target:** Next.js (App Router) + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage)

---

## 1. Latar Belakang

Tassofly saat ini adalah situs marketing statis (klon Doron Supply) dibangun dengan Next.js 15 + Tailwind + Framer Motion + Three.js. Seluruh data — produk, bundle, kategori, FAQ, video — masih **hardcoded** di file `src/data/*.ts`. Tidak ada backend, database, atau auth.

Konsekuensinya: setiap kali Putra mau ganti produk yang ditampilkan, ubah harga, atau jalankan campaign musiman (mis. ganti kartu di "Beyond The Basics" tiap bulan), dia harus edit kode dan deploy ulang.

Tujuan proyek ini adalah membangun:
1. **Database Supabase** sebagai single source of truth untuk seluruh konten situs.
2. **Refactor situs utama (public site)** agar fetch data dari Supabase, bukan file statis.
3. **Admin Panel** (web terpisah atau route terproteksi) untuk mengelola semua itu tanpa sentuh kode.

---

## 2. Tujuan & Non-Tujuan

### Tujuan (Goals)
- Putra bisa mengatur isi tiap section homepage (teks, gambar, dan **produk/bundle yang ditampilkan**) tanpa redeploy.
- Putra bisa CRUD produk dan deals (bundle) secara mandiri, termasuk menentukan mana yang aktif/ditampilkan di publik.
- Section produk di homepage (Crowd Favorites, Popular Bundles, dll) bisa di-assign ulang dengan cepat untuk keperluan campaign bulanan.
- Putra bisa mencatat cashflow sederhana (income/expense) dari hasil penjualan.
- Putra bisa kirim email ke klien dengan satu form (isi judul, body, lampiran file) langsung dari admin panel, tanpa buka Gmail manual.

### Non-Tujuan (Out of Scope v1)
- Tidak ada sistem pembayaran/payment gateway otomatis (checkout asli) — situs publik tetap sebagai katalog/marketing, bukan e-commerce penuh dengan transaksi online.
- Tidak ada multi-user/role admin (cukup 1 akun admin).
- Tidak ada penyimpanan permanen file produk di Storage untuk email attachment (upload manual tiap kirim).
- Tidak membangun ulang desain visual situs publik — tampilan tetap sama, hanya sumber datanya yang berubah dari statis ke Supabase.

---

## 3. Arsitektur Sistem

```
┌─────────────────────┐         ┌──────────────────────┐
│   Public Site        │         │   Admin Panel          │
│   (tassofly.vercel)  │         │   (admin.tassofly...)  │
│   Next.js, fetch data │  <───   │   Next.js + Supabase   │
│   read-only dari DB   │         │   Auth (1 admin user)  │
└─────────┬────────────┘         └──────────┬────────────┘
          │                                  │
          └──────────────┬───────────────────┘
                          ▼
                 ┌─────────────────┐
                 │   Supabase        │
                 │  - Postgres DB    │
                 │  - Auth           │
                 │  - Storage         │
                 │    (images)        │
                 └─────────────────┘
```

**Rekomendasi struktur repo:** admin panel sebagai project Next.js terpisah (mempermudah scoping akses & deploy independen dari situs publik), keduanya connect ke Supabase project yang sama. Alternatif: route group `/admin` di repo yang sama dengan middleware proteksi — lebih simpel untuk maintenance solo developer, tapi bundle size & deploy jadi tercampur. **Rekomendasi final: repo terpisah**, karena situs publik harus tetap ringan & cepat (banyak animasi Framer Motion + Three.js), sementara admin panel bisa lebih berat (tabel, form, rich text editor) tanpa mempengaruhi performa publik.

**Auth:** Supabase Auth, email/password, 1 akun admin. Semua route `/admin/*` diproteksi oleh middleware yang cek session Supabase.

**Data fetching publik:** gunakan Next.js ISR (`revalidate`) atau on-demand revalidation (`revalidate path` dipanggil dari admin panel setiap kali ada perubahan data) supaya perubahan di admin langsung tampak di publik tanpa redeploy.

---

## 4. Skema Database (Supabase / Postgres)

### 4.1 `categories`
Menggantikan `categories.ts`. Mendukung struktur kategori → subkategori lewat `parent_id`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| slug | text unique | |
| name | text | |
| parent_id | uuid (FK → categories.id, nullable) | null = kategori utama |
| sort_order | int | |

### 4.2 `products`
Menggantikan `products.ts`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| slug | text unique | |
| name | text | |
| type | text | mis. "Plugin", "Textures", "Template" |
| category_id | uuid (FK → categories.id) | |
| price | numeric(10,2) | |
| image_url | text | dari Supabase Storage |
| description | text | |
| features | text[] / jsonb | list fitur |
| includes | text[] / jsonb | list isi paket |
| created_by | text | default "TASSOFLY" |
| compatibility | text | |
| badge | text nullable | mis. "NEW", "BEST SELLER" |
| is_freebie | boolean default false | |
| is_active | boolean default true | kontrol tampil/sembunyi di publik |
| created_at / updated_at | timestamptz | |

### 4.3 `bundles` (Deals)
Menggantikan `bundles.ts`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| slug | text unique | |
| name | text | |
| color | text | hex warna kartu |
| save_amount | numeric(10,2) | nominal hemat |
| image_url | text | |
| is_active | boolean default true | |
| created_at / updated_at | timestamptz | |

### 4.4 `bundle_products`
Relasi many-to-many bundle ↔ produk.

| Kolom | Tipe |
|---|---|
| bundle_id | uuid (FK) |
| product_id | uuid (FK) |
| sort_order | int |

### 4.5 `homepage_sections`
Satu baris per section homepage (Hero, Crowd Favorites, Shop By Type, Build Bundle, Popular Bundles, Mission). Field generik dipakai bersama, field spesifik per section disimpan di kolom `content` (jsonb) supaya fleksibel tanpa migrasi skema tiap section baru.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| key | text unique | `hero`, `crowd_favorites`, `shop_by_type`, `build_bundle`, `popular_bundles`, `mission` |
| label | text | teks kecil di atas heading, mis. "[Crowd Favorites]" |
| heading | text | judul besar section |
| subheading | text nullable | |
| cta_text | text nullable | |
| cta_link | text nullable | |
| is_visible | boolean default true | toggle tampil/sembunyikan section |
| sort_order | int | urutan tampil section di homepage |
| content | jsonb | data spesifik section (lihat di bawah) |
| updated_at | timestamptz | |

**Contoh isi `content` per section:**
- `hero`: `{ "badges": [{"icon":"refresh-cw","title":"FREE UPDATES","subtitle":"FOR LIFE"}, ...] }`
- `build_bundle`: `{ "discount_tiers": [{"min_items":2,"discount_percent":15}, {"min_items":4,"discount_percent":25}] }`
- `crowd_favorites`, `popular_bundles`: tidak butuh `content` khusus — datanya datang dari tabel `section_items` di bawah.

### 4.6 `section_items` — kunci fitur "campaign swap"
Tabel ini yang memungkinkan Putra ganti-ganti produk/bundle yang tampil di tiap section homepage kapan saja, tanpa ubah kode.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| section_id | uuid (FK → homepage_sections.id) | |
| item_type | text | `'product'` atau `'bundle'` |
| item_id | uuid | merujuk ke products.id atau bundles.id |
| sort_order | int | urutan tampil dalam section |

> Dengan ini, "Beyond The Basics" bulan ini bisa diisi 4 produk tertentu, lalu bulan depan Putra tinggal hapus/ganti baris di `section_items` lewat admin panel — tidak perlu sentuh tabel `products` itu sendiri.

### 4.7 `videos`
Menggantikan `videos.ts` (dipakai di Mission section).

| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| title | text |
| thumbnail_url | text |
| youtube_url | text |
| is_active | boolean |
| sort_order | int |

### 4.8 `faqs`
Menggantikan `faqs.ts`.

| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| question | text |
| answer | text |
| sort_order | int |
| is_active | boolean |

### 4.9 `cashflow_transactions`
Pencatatan keuangan sederhana, murni dokumentasi (sesuai konfirmasi Putra — tanpa link order, tanpa upload bukti).

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid (PK) | |
| date | date | |
| type | text | `'income'` atau `'expense'` |
| category | text | mis. "Penjualan Produk", "Platform Fee", "Refund", "Operasional" |
| amount | numeric(12,2) | |
| description | text nullable | catatan bebas |
| created_at | timestamptz | |

### 4.10 `email_logs` (opsional, rekomendasi)
Sekadar riwayat email yang pernah dikirim dari admin panel — berguna untuk tracking tanpa nyimpen file attachment.

| Kolom | Tipe |
|---|---|
| id | uuid (PK) |
| to_email | text |
| subject | text |
| project_name | text |
| sent_at | timestamptz |

---

## 5. Halaman Admin Panel

### 5.1 Dashboard
Ringkasan cepat saat login:
- Total produk aktif, total bundle aktif
- Total income/expense bulan berjalan (dari cashflow)
- Grafik sederhana cashflow 6 bulan terakhir
- Shortcut ke "Kirim Email" dan "Tambah Produk"

### 5.2 Homepage CMS
Daftar semua section (sesuai `homepage_sections`), masing-masing bisa:
- Edit label, heading, subheading, CTA text & link
- Toggle visibility (tampil/sembunyikan section di publik)
- Drag-reorder urutan section
- Khusus section berbasis produk (Crowd Favorites, Popular Bundles, Shop By Type kalau perlu): panel "Pilih Produk/Bundle untuk section ini" — search & pilih dari katalog, drag untuk urutan, ini yang dipakai untuk ganti campaign bulanan
- Khusus Hero: edit badges (icon, title, subtitle)
- Khusus Build Bundle: edit tabel discount tiers (jumlah item minimum → persen diskon)
- Upload/ganti gambar lewat Supabase Storage

### 5.3 Products
Tabel CRUD penuh:
- List dengan search, filter kategori, filter status aktif/nonaktif
- Form tambah/edit: nama, slug (auto-generate, bisa diedit), tipe, kategori, harga, gambar (upload), deskripsi, features (list dinamis), includes (list dinamis), compatibility, badge, freebie toggle, status aktif
- Hapus produk (dengan konfirmasi, cek dulu apakah dipakai di bundle/section supaya tidak orphan)

### 5.4 Deals (Bundles)
Tabel CRUD bundle:
- List dengan search & filter status
- Form tambah/edit: nama, slug, warna kartu, save amount, gambar, **pilih produk anggota bundle** (multi-select dari tabel products, drag untuk urutan)
- Hapus bundle

### 5.5 Cashflow
- List transaksi dengan filter tanggal & tipe (income/expense)
- Form tambah cepat: tanggal, tipe, kategori (dropdown + bisa tambah kategori baru), jumlah, catatan
- Ringkasan total income, expense, net per bulan/periode yang dipilih
- Export ke CSV (nice-to-have)

### 5.6 Kirim Email
Form satu langkah untuk kirim email ke klien dengan attachment manual:
- Input: Email tujuan, Nama Klien/Project, Judul Email (subject), Template body (bisa pilih template siap pakai atau tulis manual), Lampiran file (upload langsung dari device, dikirim sebagai attachment, tidak disimpan)
- Preview sebelum kirim
- Setelah kirim, otomatis tercatat di `email_logs` (subject, tujuan, waktu) untuk riwayat

---

## 6. Spesifikasi Fitur Kirim Email

- **Provider:** SMTP biasa (Gmail) via [Nodemailer](https://nodemailer.com/) dari API Route Next.js (`/app/api/send-email/route.ts`).
- **Autentikasi SMTP:** gunakan **Gmail App Password** (bukan password akun biasa) — wajib aktifkan 2FA di akun Gmail dulu untuk generate App Password.
- **Attachment:** diterima sebagai `multipart/form-data` dari form admin, diteruskan langsung ke Nodemailer sebagai buffer — tidak disimpan ke Storage, langsung dibuang setelah email terkirim.
- **Validasi:** batas ukuran lampiran (Gmail SMTP biasanya limit ~25MB total per email), validasi format email tujuan.
- **Template body:** sediakan 1-2 template default (mis. "Pengiriman File Project") dengan placeholder `{{nama_klien}}`, `{{nama_project}}` yang auto-terisi dari form.

---

## 7. Migrasi dari Statis ke Supabase (Situs Publik)

Langkah refactor situs publik (`tassofly` repo) agar baca dari Supabase:
1. Buat Supabase client (`@supabase/supabase-js` atau `@supabase/ssr` untuk Next.js).
2. Ganti import `from "@/data/products"` dkk di setiap section/page menjadi query Supabase (server component, fetch saat build/request dengan ISR).
3. `homepage/page.tsx` fetch `homepage_sections` (yang `is_visible = true`, order by `sort_order`) lalu render section secara dinamis sesuai urutan dari DB — bukan hardcode urutan komponen seperti sekarang.
4. Section `CrowdFavorites`, `PopularBundles` fetch produk/bundle via `section_items` join ke `products`/`bundles`.
5. Setup revalidation: setiap admin panel simpan perubahan, panggil Next.js `revalidatePath('/')` (lewat API route khusus atau Supabase webhook) supaya publik langsung update.

---

## 8. Roadmap

**v1 (MVP — prioritas sekarang):**
- Setup Supabase project & seed data dari file statis yang sudah ada
- Refactor situs publik baca dari Supabase
- Admin: Auth, Dashboard, Homepage CMS (full: teks + gambar + section-product assignment + reorder section), Products CRUD, Deals CRUD, Cashflow, Kirim Email

**v2 (nanti):**
- Email template library lebih lengkap + riwayat email lebih detail
- Export laporan cashflow (CSV/PDF)
- Audit log perubahan konten (siapa ubah apa kapan — relevan kalau nanti nambah staff)
- Auto-archive campaign section_items (simpan histori campaign per bulan)

---

## 9. Pertanyaan Terbuka

- Apakah perlu fitur "duplicate produk" untuk mempercepat input produk baru yang mirip (mis. varian texture kit)? Berguna mengingat ada cukup banyak produk SKU di kategori Textures.
- Untuk gambar produk/section, apakah Putra ingin admin panel otomatis resize/compress sebelum upload ke Storage (mengingat catatan PageSpeed/LCP issue yang pernah ditangani di portfolio site)?
