# AGENTS.md — Instruksi untuk AI Coding Agent

> Baca file ini SEBELUM mengubah kode apapun di repo ini. Ini bukan dokumentasi produk (lihat `PRD-Tassofly-v1.md` untuk itu) — ini aturan main teknis yang wajib diikuti supaya hasil kerja konsisten dengan pola yang sudah ada.

---

## 0. Urutan Baca Wajib

1. `PRD-Tassofly-v1.md` — apa yang harus dibangun dan kenapa
2. `SCHEMA.md` — struktur database aktual
3. File ini (`AGENTS.md`) — cara mengerjakannya
4. `TASKS.md` — daftar kerjaan konkret, kerjakan satu per satu sesuai urutan Fase

**Jangan mulai coding sebelum baca ketiganya.** Kalau ada ketidaksesuaian antara PRD dan kondisi kode aktual, laporkan ke user dulu, jangan asumsi sendiri mana yang benar.

---

## 1. Prinsip Arsitektur yang WAJIB Dipatuhi

- **Tidak ada data produk/bundle/harga yang boleh hardcode di komponen.** Semua ambil dari Supabase. Kalau kamu terpaksa pakai fallback statis (misal untuk loading state), itu HARUS berupa fallback sementara, bukan sumber data utama — pola contoh yang benar ada di `src/sections/CrowdFavorites.tsx`.
- **Satu logic bisnis, satu tempat.** Kalau kamu menemukan nilai (misal persentase diskon) muncul di lebih dari satu file, itu tandanya perlu di-refactor ke satu sumber, bukan disalin ke tempat baru.
- **File di `src/data/*.ts` (data statis lama) HANYA boleh dipakai sebagai:**
  - Fallback UI saat loading (state awal sebelum fetch selesai)
  - Referensi struktur/shape data
  Jangan pernah jadikan ini sumber data yang benar-benar dirender ke user tanpa ada fetch Supabase yang menggantikannya.

## 2. Pola Fetch Data yang Benar (Copy Pola Ini)

Contoh pola fetch yang SUDAH BENAR dan harus dicontek persis untuk section/halaman baru:
- `src/sections/CrowdFavorites.tsx` — fetch by section key, ambil `section_items`, resolve ke data produk
- `src/app/shop/page.tsx` — fetch produk + kategori langsung
- `src/app/category/[slug]/page.tsx` — fetch produk terfilter kategori

Struktur umum:
```ts
useEffect(() => {
  async function load() {
    const { data, error } = await supabase.from('table_name').select('*')...;
    if (error) { /* handle, jangan silent fail */ }
    if (data) setState(data);
  }
  load();
}, []);
```

**Jangan** membuat pola fetch baru yang berbeda gaya kalau pola di atas sudah cukup — konsistensi lebih penting daripada "cara yang lebih elegan".

## 3. Pola Admin CRUD (Copy Pola Ini)

Contoh yang benar:
- `src/app/admin/products/page.tsx` — CRUD sederhana
- `src/app/admin/bundles/page.tsx` — CRUD dengan relasi many-to-many (`bundle_products`) — pakai ini sebagai acuan kalau bikin admin baru yang punya relasi

**Catatan penting soal keamanan (lihat `SECURITY.md` untuk detail):** pola admin CRUD saat ini memanggil Supabase langsung dari client dengan anon key. Ini technical debt yang diketahui, BUKAN pola yang harus ditiru untuk kode baru kalau kamu sedang mengerjakan task yang berhubungan dengan keamanan (lihat Fase 1 di `TASKS.md`). Untuk fitur CRUD baru yang bukan bagian dari perbaikan keamanan, tetap ikuti pola existing dulu supaya konsisten, lalu seluruh CRUD akan dimigrasi bersamaan saat task keamanan dikerjakan.

## 4. Section Homepage — Aturan Khusus

- Section `hero` **TIDAK BOLEH** disambungkan ke CMS. Ini keputusan produk yang sudah final (lihat PRD §5.3 dan §9). Kalau kamu diminta "integrasikan semua section homepage", section ini tetap dikecualikan kecuali ada instruksi eksplisit baru dari user yang membatalkan keputusan ini.
- Section baru yang butuh data list kecil (bukan produk/bundle) → simpan di kolom `homepage_sections.content` (JSONB), pola sama seperti `portfolio` (`content.items`) dan `build_bundle` (`content.tiers`). Jangan bikin tabel baru untuk data section kecuali listnya diprediksi akan besar/kompleks (>50 item atau butuh relasi).

## 5. Definisi Selesai (Wajib Dicek Sebelum Bilang "Done")

Untuk task integrasi data (admin → publik), fitur dianggap selesai HANYA jika lolos test ini:
1. Ubah data lewat halaman admin terkait.
2. Refresh halaman publik terkait — **tanpa restart dev server, tanpa rebuild.**
3. Perubahan harus langsung terlihat.

Kalau kamu tidak bisa menjalankan test ini sendiri (misal tidak ada akses ke instance Supabase yang sama), laporkan di akhir kerjaanmu bahwa test manual ini perlu dilakukan user sebelum task ditutup — jangan klaim selesai tanpa itu.

## 6. Larangan

- Jangan hapus atau modifikasi struktur tabel Supabase tanpa migration file yang jelas dan didokumentasikan di `SCHEMA.md`.
- Jangan commit `.env`, `.env.local`, atau kredensial apapun.
- Jangan ubah section `hero` (lihat §4).
- Jangan tambah dependency baru tanpa alasan kuat — cek dulu apakah kebutuhan sudah bisa dipenuhi library yang sudah dipakai (project ini pakai Tailwind, lucide-react, @supabase/supabase-js — cek `package.json` sebelum nambah).
- Jangan buat sistem role-based access control untuk admin di fase ini — cukup 4 akun dengan akses setara (lihat PRD §9).

## 7. Kalau Ragu

Kalau instruksi task tidak jelas atau bertentangan dengan PRD, **berhenti dan tanya user**, jangan lanjut dengan asumsi. Ini project yang sebelumnya bermasalah justru karena AI agent mengerjakan tiap bagian dengan asumsi berbeda-beda tanpa acuan bersama — jangan ulangi pola itu.
