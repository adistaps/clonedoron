# TASKS.md — Daftar Kerjaan Konkret

> Pecahan operasional dari `PRD-Tassofly-v1.md`. Kerjakan **berurutan per fase** — jangan lompat ke Fase 2 sebelum Fase 1 selesai dan lolos test, karena Fase 2+ bergantung pada fondasi yang benar. Setiap task punya kriteria "selesai" eksplisit — cek `AGENTS.md` §5 untuk cara verifikasi.

Checklist: tandai `[x]` setelah task selesai DAN lolos test manual.

---

## FASE 1 — Perbaikan Fondasi (Blocker, kerjakan dulu semua sebelum lanjut)

### 1.1 Sambungkan halaman detail produk ke Supabase 🔴
- [ ] File: `src/app/product/[slug]/page.tsx` dan `src/app/product/[slug]/ProductDetailClient.tsx`
- [ ] Ganti `import { getProductBySlug, products } from "@/data/products"` menjadi fetch dari `supabase.from('products').select('*').eq('slug', slug).single()`
- [ ] Pastikan produk terkait (`getRelatedProducts`) juga fetch dari Supabase (misal produk lain dengan `category_id` sama atau `type` sama), bukan dari data statis
- [ ] Tangani kasus produk tidak ditemukan (404) dengan benar
- **Test:** tambah produk baru lewat `/admin/products`, buka `/product/[slug-baru]` di browser — harus muncul, bukan 404

### 1.2 Satukan logic tier diskon bundle 🟠
- [ ] Tambahkan/pastikan row `homepage_sections` dengan `key = 'build_bundle'` punya `content.tiers` sesuai struktur di PRD §6.3
- [ ] Refactor `src/components/DiscountTiers.tsx` — fetch `content.tiers` dari Supabase, render dinamis (bukan hardcode array tier)
- [ ] Refactor `getDiscount()` di `src/app/bundles/page.tsx` — hitung diskon berdasarkan `content.tiers` yang sama, bukan angka hardcode `if (count >= 8) return 0.25...`
- [ ] Refactor `src/sections/BuildBundle.tsx` (sudah dynamic untuk heading/subheading/CTA — pastikan juga render tier dari sumber sama kalau section ini menampilkan preview tier)
- [ ] Form admin `homepage_sections` (key=build_bundle): tambah editor list tier (min_items, discount_percent), input diskon dengan `min="0" max="90"`
- **Test:** ubah satu angka tier di admin → cek berubah konsisten di: (a) halaman `/bundles` saat mix & match, (b) komponen `DiscountTiers` di manapun dia dirender, (c) section `build_bundle` di homepage

### 1.3 Sambungkan `bundle_products` ke halaman publik 🟠
- [ ] File: `src/app/bundles/page.tsx`, fungsi `dbToBundle()`
- [ ] Tambah fetch `supabase.from('bundle_products').select('bundle_id, product_id')` saat load data
- [ ] Resolve `product_id` ke data produk lengkap (name, image, price) dan isi field `products` di objek bundle (saat ini selalu `[]`)
- [ ] Pastikan `BundleCard` component bisa menampilkan preview produk di dalam bundle (cek dulu apakah komponennya sudah support, kalau belum perlu ditambahkan)
- **Test:** buka `/admin/bundles`, pastikan satu bundle punya minimal 2 produk terhubung → buka `/bundles` di publik → produk itu harus terlihat sebagai isi bundle tersebut

### 1.4 Keamanan dasar — RLS & Auth Check 🔴
Lihat `SECURITY.md` untuk detail lengkap dan urutan pengerjaan. Task ini WAJIB selesai sebelum web menerima traffic publik dalam jumlah signifikan, boleh dikerjakan paralel dengan 1.1–1.3 kalau resource cukup.

---

## FASE 2 — Integrasi Konten Penuh

### 2.1 Portfolio Section (ganti dari Mission) 🟠
- [ ] Jalankan SQL update untuk ganti `key` dari `mission` ke `portfolio` (lihat draft di PRD atau minta ke user, karena ini mengubah data production)
- [ ] Buat/pastikan komponen `PortfolioSection.tsx` fetch `content.items` dari `homepage_sections` key=`portfolio`, render auto-slide
- [ ] Update `src/app/page.tsx` — ganti import `MissionSection` jadi `PortfolioSection`
- [ ] Tambah blok editor `content.items` (image_url, title, link) di `src/app/admin/homepage/page.tsx` khusus key `portfolio`
- **Test:** tambah 1 item portfolio dari admin → cek muncul di homepage dan auto-slide berjalan

### 2.2 Deals / Flash Sale Badge 🟠
- [ ] Buat helper function untuk cek deal aktif: `is_active_deal = start_date <= today <= end_date`
- [ ] Fetch `deals` aktif di halaman yang menampilkan `ProductCard` (Shop, homepage `crowd_favorites`)
- [ ] Update `ProductCard` component: kalau produk punya deal aktif, tampilkan badge "SALE -X%", harga asli dicoret + harga setelah diskon
- **Test:** buat deal aktif untuk satu produk di `/admin/deals` (start_date hari ini) → cek badge muncul di Shop dan homepage

### 2.3 FAQ Admin Baru 🟡
- [ ] Buat halaman `src/app/admin/faqs/page.tsx` — CRUD (question, answer, sort_order, is_active), pola sama seperti `admin/categories/page.tsx`
- [ ] Tambah menu "FAQ" di sidebar admin (`src/app/admin/layout.tsx`)
- [ ] Update `src/app/support/page.tsx` — fetch dari `supabase.from('faqs').select('*').eq('is_active', true).order('sort_order')`, hapus import `@/data/faqs`
- **Test:** tambah FAQ baru dari admin → cek muncul di `/support`

### 2.4 CategoryNav Dinamis 🟡
- [ ] File: `src/sections/CategoryNav.tsx`
- [ ] Ganti `import { shopCategoryNav } from "@/data/categories"` jadi fetch `supabase.from('categories').select('*').order('sort_order')`
- **Test:** tambah/ubah kategori dari `/admin/categories` → cek nav berubah

---

## FASE 3 — Kesiapan Transaksi Nyata *(belum di-detailkan, tunggu keputusan payment gateway)*

- [ ] Pilih payment gateway (Midtrans/Xendit untuk pasar Indonesia, atau Stripe kalau target internasional — perlu diskusi terpisah)
- [ ] Desain flow order & delivery file digital otomatis
- [ ] Tabel baru untuk `orders`, `order_items`

---

## FASE 4 — Penyempurnaan *(backlog, belum prioritas)*

- [ ] Review/rating produk
- [ ] Dashboard analytics penjualan

---

## Catatan untuk AI Agent

- Kerjakan satu task, jalankan test-nya, baru lanjut ke task berikutnya. Jangan kerjakan banyak task sekaligus lalu test di akhir — kalau ada yang salah, susah dilacak sumbernya.
- Task dengan 🔴 = blocker, harus selesai duluan. 🟠 = penting tapi tidak blocking task lain. 🟡 = boleh ditunda kalau waktu terbatas.
- Kalau satu task ternyata butuh perubahan skema database, update `SCHEMA.md` di commit yang sama.
