# SECURITY.md — Checklist Keamanan & Rencana Perbaikan

> Hasil audit langsung terhadap kode berjalan (1 Juli 2026). Semua temuan di sini terverifikasi dari source code, bukan asumsi. Dokumen ini adalah bagian dari Fase 1 (`TASKS.md` §1.4) — **wajib selesai sebelum web menerima traffic publik dalam skala berarti**, karena beberapa temuan memungkinkan siapa saja menghapus/mengubah seluruh data toko tanpa login.

---

## Ringkasan Risiko (Urut Prioritas)

| # | Temuan | Tingkat | File Terkait |
|---|---|---|---|
| 1 | Tidak ada Row Level Security di database | 🔴 Kritis | Semua tabel Supabase |
| 2 | Admin CRUD langsung dari client pakai anon key | 🔴 Kritis | `src/app/admin/**/page.tsx` |
| 3 | `/api/seed` dan `/api/upload` tanpa auth check | 🔴 Kritis | `src/app/api/seed/route.ts`, `src/app/api/upload/route.ts` |
| 4 | Middleware tidak verifikasi signature JWT | 🟠 Tinggi | `src/middleware.ts` |
| 5 | Cookie session tanpa `HttpOnly`/`Secure` | 🟠 Tinggi | `src/app/admin/login/page.tsx` |
| 6 | `/api/send-email` tanpa rate limit/auth | 🟡 Sedang | `src/app/api/send-email/route.ts` |

---

## 1. Tidak Ada RLS 🔴

**Kondisi saat ini:** Semua tabel di schema `public` tidak punya `ROW LEVEL SECURITY` aktif. `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada di client bundle (publicly readable oleh siapa saja yang buka DevTools). Tanpa RLS, anon key = akses penuh read/write/delete ke semua tabel.

**Perbaikan:**
```sql
-- Aktifkan RLS di semua tabel
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.bundles enable row level security;
alter table public.bundle_products enable row level security;
alter table public.deals enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.section_items enable row level security;
alter table public.faqs enable row level security;
alter table public.transactions enable row level security;
alter table public.videos enable row level security;

-- Policy: publik boleh SELECT data yang aktif/visible saja
create policy "public_read_active_products" on public.products
  for select using (is_active = true);

create policy "public_read_categories" on public.categories
  for select using (true);

create policy "public_read_active_bundles" on public.bundles
  for select using (is_active = true);

create policy "public_read_bundle_products" on public.bundle_products
  for select using (true);

create policy "public_read_active_deals" on public.deals
  for select using (current_date between start_date and end_date);

create policy "public_read_visible_homepage_sections" on public.homepage_sections
  for select using (is_visible = true);

create policy "public_read_section_items" on public.section_items
  for select using (true);

create policy "public_read_active_faqs" on public.faqs
  for select using (is_active = true);

-- transactions: TIDAK ADA akses publik sama sekali (data internal)
-- (tidak buat policy select untuk anon — otomatis tertutup)

-- Policy: hanya authenticated user yang boleh write
create policy "authenticated_write_products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- Ulangi pola yang sama untuk: categories, bundles, bundle_products, deals,
-- homepage_sections, section_items, faqs, transactions, videos
```
> Catatan: karena semua admin (maks. 4 akun) punya akses setara (lihat PRD §9), policy `authenticated` generik untuk write sudah cukup — tidak perlu role-based granular di fase ini.

**Test setelah diterapkan:** buka DevTools di halaman publik, coba `supabase.from('products').delete().eq('id', 'xxx')` di console — harus gagal dengan error permission denied kalau belum login.

---

## 2. Admin CRUD Langsung dari Client 🔴

**Kondisi saat ini:** `src/app/admin/*/page.tsx` memanggil `supabase.from(...).insert/update/delete()` langsung dari komponen client, mengandalkan anon key + status login di browser.

**Perbaikan jangka pendek (cukup dengan RLS aktif di atas):** karena RLS sudah membatasi write hanya untuk `authenticated`, risiko utama (siapa saja bisa tulis data) sudah tertutup meski pola client-side masih dipakai.

**Perbaikan jangka panjang (direkomendasikan, tidak wajib langsung):** pindahkan write operations ke API routes server-side (`src/app/api/admin/*`) yang:
1. Verifikasi sesi user server-side (`supabase.auth.getUser()` dengan service role atau session dari cookie yang benar)
2. Baru eksekusi write dengan service role key
Ini mengurangi exposure logic bisnis di client dan memudahkan audit log di masa depan.

---

## 3. `/api/seed` dan `/api/upload` Tanpa Auth Check 🔴

**Kondisi saat ini:** Kedua endpoint pakai `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS sepenuhnya) tanpa cek siapa pemanggilnya. `/api/seed` bisa dipanggil `GET` oleh siapa saja untuk reset/upsert data produk. `/api/upload` bisa dipanggil siapa saja untuk upload file ke storage (habiskan kuota).

**Perbaikan wajib:**
```ts
// Di awal setiap handler POST/GET di kedua route ini:
import { createClient } from '@supabase/supabase-js';

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value; // atau cara ambil token yang sesuai setelah middleware diperbaiki (lihat §4)
  if (!token) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... lanjut logic yang sudah ada
}
```
**`/api/seed` khususnya:** pertimbangkan juga ubah dari `GET` ke `POST` (GET seharusnya tidak punya side effect/mengubah data — ini juga best practice REST, bukan cuma soal auth), dan idealnya dihapus/dinonaktifkan sepenuhnya di production setelah tidak dibutuhkan lagi (endpoint seed biasanya cuma untuk setup awal).

---

## 4. Middleware Tidak Verifikasi Signature JWT 🟠

**Kondisi saat ini:** `src/middleware.ts` men-decode payload JWT secara manual (`atob` + `JSON.parse`) dan hanya cek `exp`, **tidak verifikasi signature**. Secara teori token bisa dipalsukan.

**Perbaikan:** ganti pendekatan pakai `@supabase/ssr`:
```ts
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => response.cookies.set(name, value, options),
      remove: (name, options) => response.cookies.set(name, '', options),
    },
  });

  const { data: { user } } = await supabase.auth.getUser(); // ini verifikasi signature ke Supabase, bukan decode lokal
  const authenticated = !!user;
  // ... lanjut logic redirect yang sudah ada, ganti isTokenValid(token) dengan `authenticated`
}
```
Ini juga sekaligus memperbaiki §5 (cookie handling) karena `@supabase/ssr` mengelola cookie session dengan aman secara default.

---

## 5. Cookie Session Tanpa `HttpOnly`/`Secure` 🟠

**Kondisi saat ini:** `src/app/admin/login/page.tsx` set cookie manual lewat `document.cookie` — bisa dibaca JavaScript, rentan XSS.

**Perbaikan:** Setelah migrasi ke `@supabase/ssr` (§4), cookie session otomatis dikelola dengan `HttpOnly` oleh library-nya sendiri lewat server action/route handler login, bukan `document.cookie` manual di client. Hapus baris `document.cookie = \`sb-access-token=...\`` dari halaman login setelah migrasi ini.

---

## 6. `/api/send-email` Tanpa Rate Limit 🟡

**Kondisi saat ini:** Endpoint publik, siapa saja bisa `POST` untuk kirim email pakai akun Gmail Arif tanpa batasan jumlah.

**Perbaikan (prioritas lebih rendah, tapi tetap perlu):**
- Tambah rate limiting sederhana (misal max 5 request/menit per IP, pakai in-memory map kalau belum butuh Redis)
- Pertimbangkan tambah auth check kalau endpoint ini memang hanya dipakai internal admin (bukan form kontak publik) — cek dulu dipakai untuk apa persisnya sebelum putuskan level proteksinya

---

## Urutan Pengerjaan yang Disarankan

1. **RLS (§1)** — dampak terbesar, bisa dikerjakan sendiri tanpa ubah kode aplikasi sama sekali, cukup jalankan SQL di Supabase.
2. **Auth check di `/api/seed` & `/api/upload` (§3)** — cepat dikerjakan, dampak besar.
3. **Migrasi middleware ke `@supabase/ssr` (§4 + §5)** — sekaligus beresin dua temuan.
4. **Rate limit email (§6)** — kerjakan terakhir, dampak paling kecil.
5. Refactor admin CRUD ke server-side API routes (§2) — boleh jadi improvement bertahap, tidak blocking selama §1 sudah aktif.
