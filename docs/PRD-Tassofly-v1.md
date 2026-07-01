# PRD — Tassofly
### Product Requirements Document
**Versi:** 1.0 (Final, disusun ulang dari nol pasca-audit)
**Disusun oleh:** Peran Senior Web Developer & System Analyst (Claude), bersama Arif (Product Owner)
**Tanggal:** 1 Juli 2026
**Status:** Approved — jadi acuan tunggal untuk seluruh pengembangan lanjutan

---

## 1. Ringkasan Eksekutif

**Tassofly** adalah platform e-commerce digital asset — menjual plugin Photoshop, texture pack, action set, template, dan font untuk desainer grafis dan kreator konten. Terinspirasi dari doronsupply.com, dengan positioning: alat desain profesional yang mudah dipakai ("Design Smarter, Not Harder").

Sistem terdiri dari dua aplikasi dalam satu codebase:

| Aplikasi | Domain | Fungsi |
|---|---|---|
| **Web Publik** | `tassofly.com` | Toko: browsing produk, bundle, checkout, halaman informasi |
| **Web Admin (CMS)** | `admin.tassofly.com` | Panel kelola seluruh konten & data yang tampil di web publik |

**Prinsip produk yang tidak bisa ditawar:**
> Tidak boleh ada satu pun konten produk/bundle/promo di web publik yang datanya di-hardcode di kode. Semua harus bersumber dari database, dikelola lewat admin. Pengecualian hanya untuk konten yang eksplisit didefinisikan "statis by design" di §5.

---

## 2. Tujuan Produk

1. Pengunjung bisa menemukan, membandingkan, dan membeli aset digital dengan mudah.
2. Arif (dan tim admin, maksimum 4 orang) bisa mengelola **seluruh** konten toko — produk, bundle, promo, tampilan homepage — tanpa perlu sentuh kode atau redeploy.
3. Sistem aman untuk menyimpan data transaksi dan kredensial di lingkungan produksi publik.
4. Codebase cukup terdokumentasi sehingga developer atau AI agent baru bisa lanjutkan pekerjaan tanpa menebak-nebak arsitektur.

## 3. Target Pengguna

| Peran | Kebutuhan |
|---|---|
| **Pembeli** (desainer grafis, kreator konten, percetakan) | Cari aset sesuai kebutuhan, lihat detail & preview, beli satuan atau bundle hemat |
| **Admin** (Arif + maks. 3 admin lain) | Kelola produk, kategori, bundle, promo, tampilan homepage, FAQ, tanpa bantuan developer |

## 4. Lingkup (Scope)

### 4.1 Dalam Lingkup
- Katalog produk dengan kategori & tipe (Plugin, Textures, Template, Font, Action Set)
- Sistem bundle (paket produk dengan harga hemat)
- Sistem promo/flash sale per produk dengan periode waktu
- Tier diskon otomatis untuk "build your own bundle"
- Homepage yang komposisinya bisa diatur admin (section apa muncul, urutan, konten)
- Portfolio showcase karya Arif (auto-slide)
- FAQ terkelola
- Panel admin dengan autentikasi

### 4.2 Luar Lingkup (Fase Ini)
- Payment gateway terintegrasi (checkout saat ini UI-only, belum ada proses pembayaran nyata — lihat §11 Roadmap)
- Multi-currency / multi-bahasa
- Review & rating produk dari pembeli
- Program afiliasi/referral

---

## 5. Arsitektur Informasi & Peta Halaman

### 5.1 Web Publik

| Route | Fungsi | Sumber Data |
|---|---|---|
| `/` (Homepage) | Landing page, komposisi section diatur admin | `homepage_sections` |
| `/shop` | Katalog semua produk, filter kategori/tipe | `products`, `categories` |
| `/product/[slug]` | Detail produk | `products` |
| `/category/[slug]` | Produk per kategori | `products`, `categories` |
| `/bundles` | Daftar bundle + mix & match "build your own bundle" | `bundles`, `bundle_products`, `products` |
| `/about` | Profil brand | Statis (lihat §5.3) |
| `/support` | FAQ | `faqs` |

### 5.2 Web Admin

| Route | Fungsi |
|---|---|
| `/admin/login` | Autentikasi (Supabase Auth) |
| `/admin` | Dashboard ringkas |
| `/admin/products` | CRUD produk |
| `/admin/categories` | CRUD kategori |
| `/admin/bundles` | CRUD bundle + kelola isi produk per bundle (`bundle_products`) |
| `/admin/deals` | CRUD promo/flash sale per produk |
| `/admin/homepage` | Kelola tiap section homepage (teks, visibility, item terkait, tier diskon, portfolio) |
| `/admin/faqs` | CRUD FAQ |
| `/admin/cashflow` | Pembukuan internal (bukan transaksi pembeli) |
| `/admin/email` | Kirim email manual (support/notifikasi) |

### 5.3 Konten yang Sengaja Statis (by design, bukan bug)
- **Hero section** homepage — dikelola manual lewat kode, tidak lewat CMS.
- **About page** — konten profil brand, cukup diedit lewat kode saat perlu (frekuensi perubahan rendah, tidak butuh overhead CMS).

---

## 6. Model Data (Skema Database)

### 6.1 Tabel Inti

**`products`**
`id, slug, name, sku, type, category_id, price, image_url, description, features[], includes[], created_by, compatibility, badge, is_freebie, is_active, created_at`

**`categories`**
`id, slug, name, parent_id, sort_order`

**`bundles`**
`id, slug, name, color, save_amount, image_url, is_active, created_at`

**`bundle_products`** (relasi many-to-many)
`bundle_id, product_id` — mendefinisikan produk apa saja yang termasuk dalam satu bundle. **Wajib dipakai di sisi publik saat render bundle**, bukan hanya di admin.

**`deals`** (flash sale per produk)
`id, product_id, title, discount_percent, start_date, end_date, created_at, updated_at`
- Sebuah deal dianggap **aktif** jika `start_date <= today <= end_date`.
- Produk dengan deal aktif tampil dengan badge "SALE -X%" dan harga dicoret di `ProductCard`, di halaman Shop maupun section homepage yang menampilkan produk.

**`homepage_sections`**
`id, key, label, heading, subheading, cta_text, cta_link, is_visible, sort_order, content (jsonb)`
- `content` adalah kolom fleksibel untuk data section-spesifik yang tidak cocok masuk kolom standar (contoh: `tiers` untuk build_bundle, `items` untuk portfolio).

**`section_items`** (relasi section ↔ produk/bundle)
`section_id, item_type ('product'|'bundle'), item_id, sort_order`
- Dipakai untuk section yang menampilkan kurasi produk/bundle tertentu (`crowd_favorites`, `popular_bundles`).

**`faqs`**
`id, question, answer, sort_order, is_active, created_at`

**`transactions`**
`id, type ('income'|'expense'), amount, date, description, created_at` — untuk pembukuan internal Arif, tidak terhubung ke alur pembelian pengunjung.

### 6.2 Aturan Bisnis per Section Homepage (`homepage_sections.key`)

| `key` | Field yang dipakai | Catatan |
|---|---|---|
| `hero` | — (tidak ada row di DB, murni kode) | Dikecualikan dari CMS |
| `crowd_favorites` | heading, subheading, `section_items` (type=product) | |
| `popular_bundles` | heading, subheading, `section_items` (type=bundle) | |
| `shop_by_type` | heading, subheading | Tidak pakai CTA |
| `build_bundle` | heading, subheading, cta_text, cta_link, `content.tiers` | Lihat §6.3 untuk struktur tier |
| `portfolio` | heading, subheading, `content.items` | Auto-slide showcase karya. Item: `{ image_url, title, link? }`. Tidak pakai `section_items` (bukan produk/bundle). |

### 6.3 Struktur Tier Diskon (Single Source of Truth)

```json
// homepage_sections.content, WHERE key = 'build_bundle'
{
  "tiers": [
    { "min_items": 2, "discount_percent": 15 },
    { "min_items": 3, "discount_percent": 20 },
    { "min_items": 5, "discount_percent": 25 }
  ]
}
```

**Aturan wajib:** setiap tempat di kode yang menampilkan atau menghitung diskon bundle — `DiscountTiers` component, section `build_bundle` di homepage, dan logic perhitungan di `/bundles` (mix & match) — **harus membaca dari struktur ini, tidak boleh ada nilai hardcode terpisah.**

- Format: persentase saja (tidak ada nominal tetap).
- Validasi form admin: `min=0, max=90` (batas atas sebagai jaring pengaman human error, bukan pembatas keputusan bisnis — Arif bertanggung jawab penuh atas nilai yang diinput).

---

## 7. Alur Pengguna Kunci

### 7.1 Pembeli — Membeli Produk Satuan
1. Landing di Homepage → lihat produk unggulan (`crowd_favorites`) atau promo aktif.
2. Klik produk → halaman detail (`/product/[slug]`), lihat deskripsi, fitur, harga (dengan diskon jika ada deal aktif).
3. Checkout (di luar lingkup fase ini — UI saja).

### 7.2 Pembeli — Build Your Own Bundle
1. Buka `/bundles`, scroll ke grid produk di bawah.
2. Tambah produk satu per satu ke "keranjang bundle".
3. Sistem hitung diskon otomatis berdasarkan jumlah item, sesuai `content.tiers`.
4. Checkout.

### 7.3 Admin — Update Homepage
1. Login `admin.tassofly.com`.
2. Buka Homepage CMS, pilih section.
3. Edit teks/visibility/item terkait → Save.
4. **Definisi selesai:** perubahan harus langsung terlihat di web publik setelah refresh, tanpa redeploy.

---

## 8. Kebutuhan Non-Fungsional

| Aspek | Requirement |
|---|---|
| **Keamanan** | Row Level Security aktif di semua tabel Supabase. Write operation sensitif lewat API route server-side dengan validasi sesi, bukan langsung dari client dengan anon key. Endpoint admin (`/api/seed`, `/api/upload`) wajib ada pengecekan autentikasi. |
| **Autentikasi** | Supabase Auth, session diverifikasi penuh (signature-checked) di middleware — bukan sekadar decode payload. Maksimum 4 akun admin, semua dengan hak akses penuh (tidak ada tiering role di fase ini). |
| **Performa** | Data section homepage & produk yang sering diakses sebaiknya di-cache/revalidate berkala (ISR atau client cache), bukan fetch penuh di setiap render jika traffic sudah signifikan. |
| **Konsistensi Data** | Tidak ada nilai bisnis (harga, diskon, tier) yang boleh hardcode di lebih dari satu tempat. |
| **Testability** | Setiap fitur admin→publik harus lolos test: ubah data di admin → refresh halaman publik → perubahan terlihat, tanpa rebuild. |

---

## 9. Keputusan Desain Kunci (Rationale)

Bagian ini penting supaya developer/agent berikutnya tidak "memperbaiki" sesuatu yang sebenarnya sudah sengaja diputuskan begini:

- **Hero tetap statis** — karena perubahan hero jarang terjadi dan butuh kontrol desain presisi (bukan sekadar ganti teks), lebih efisien lewat kode langsung daripada bikin CMS form kompleks untuk satu section.
- **Tier diskon disimpan di kolom `content` (JSONB), bukan tabel terpisah** — karena strukturnya sederhana (list kecil, jarang berubah drastis), tidak butuh overhead tabel & migration terpisah. Kalau ke depannya kompleksitas tier meningkat (misal per kategori produk), baru layak dipisah jadi tabel sendiri.
- **Deals diimplementasikan sebagai badge, bukan halaman terpisah** — karena "Deals" secara konsep adalah atribut tambahan pada produk yang sudah ada (waktu terbatas + diskon), bukan entitas katalog baru. Menyatukan ke `ProductCard` yang sudah ada mengurangi duplikasi UI dan lebih intuitif bagi pembeli (deal terlihat di konteks produk aslinya, bukan di halaman terpisah yang harus dicari).
- **Portfolio pakai kolom `content.items`, bukan tabel baru** — pola sama seperti tier, cocok untuk list kecil yang dikelola manual oleh satu admin.
- **Admin dibatasi 4 akun tanpa role-tiering** — skala tim masih kecil, kompleksitas role-based access control belum sepadan dengan risikonya saat ini. Ini keputusan yang perlu ditinjau ulang kalau tim admin bertambah signifikan.

---

## 10. Known Risks & Technical Debt (Wajib Ditangani Sebelum Traffic Publik Signifikan)

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Tidak ada RLS di database | Siapa pun dengan anon key (publik, ada di bundle JS) bisa read/write/delete semua data | Aktifkan RLS + policy per tabel |
| Admin CRUD langsung dari client dengan anon key | Bypass proteksi login jika RLS belum aktif | Pindahkan write sensitif ke API routes server-side |
| `/api/seed`, `/api/upload` tanpa auth check | Endpoint publik yang bisa disalahgunakan (reset data, habiskan kuota storage) | Tambahkan pengecekan sesi admin |
| Middleware tidak verifikasi signature JWT | Token bisa dipalsukan untuk lewati proteksi route admin | Ganti ke `@supabase/ssr` dengan verifikasi penuh |
| Cookie session tanpa `HttpOnly`/`Secure` | Rentan dicuri lewat XSS | Gunakan cookie handling bawaan `@supabase/ssr` |

---

## 11. Roadmap Bertahap

**Fase 1 — Perbaikan Fondasi (prioritas tertinggi, blocker)**
- Sambungkan halaman detail produk (`/product/[slug]`) ke Supabase — saat ini statis total, produk baru dari admin tidak akan bisa diakses pembeli.
- Sambungkan `bundle_products` ke halaman publik `/bundles`.
- Satukan logic tier diskon ke satu sumber (`content.tiers`).
- Tutup celah keamanan di §10.

**Fase 2 — Integrasi Konten Penuh**
- Portfolio section (ganti dari Mission).
- Deals/flash sale badge di ProductCard.
- FAQ admin + koneksi ke `/support`.
- CategoryNav dinamis dari tabel `categories`.

**Fase 3 — Kesiapan Transaksi Nyata**
- Payment gateway.
- Order & delivery flow (pengiriman file digital otomatis pasca-bayar).

**Fase 4 — Penyempurnaan**
- Review/rating produk.
- Analytics & laporan penjualan di dashboard admin.

---

## 12. Kriteria Penerimaan (Acceptance Criteria) — Ringkasan

Sebuah fitur dianggap **selesai** jika:
1. Data bersumber dari Supabase, bukan file statis (`@/data/*`) — kecuali untuk item di §5.3.
2. Perubahan dari admin CMS langsung terlihat di halaman publik terkait tanpa redeploy.
3. Tidak ada duplikasi logic bisnis (harga, diskon) di lebih dari satu file.
4. Endpoint yang melakukan write/delete data punya pengecekan autentikasi.

---

*Dokumen ini adalah sumber kebenaran tunggal untuk arah pengembangan Tassofly. Perubahan scope atau keputusan arsitektur harus di-update di sini agar tetap jadi acuan yang valid bagi developer maupun AI agent berikutnya.*
