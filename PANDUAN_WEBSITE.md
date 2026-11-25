# Panduan Pengelolaan Website Panitia Rojabiyyah

Dokumentasi lengkap pengelolaan konten, akses Dashboard Admin, dan konfigurasi teknis website **Panitia Rojabiyyah — Haul Abah Ke-5**.

---

## 1. Akses Halaman Publik & Dashboard Admin

Pastikan seluruh tab (Halaman Publik dan Dashboard Admin) dibuka pada **port/domain yang sama** agar data tersinkronisasi secara real-time melalui `IndexedDB` dan `BroadcastChannel`.

| Halaman | URL (Lokal Dev) | Keterangan |
| :--- | :--- | :--- |
| **Beranda Publik** | `http://localhost:5174/` | Halaman utama situs publik |
| **Tentang** | `http://localhost:5174/tentang` | Profil, struktur acara, dan sejarah |
| **Agenda** | `http://localhost:5174/agenda` | Jadwal kegiatan per hari |
| **Berita & Liputan** | `http://localhost:5174/berita` | Daftar berita yang berstatus *Terbit* |
| **Galeri Dokumentasi** | `http://localhost:5174/galeri` | Album dan foto dokumentasi acara |
| **Informasi Umum** | `http://localhost:5174/informasi` | Panduan, Tabbarukan Haul & Merchandise, Narahubung, dan Peta Lokasi |
| **Login Dashboard Admin** | `http://localhost:5174/panel-panitia` | Halaman masuk khusus panitia (tersembunyi dari navbar publik) |
| **Konten Situs (Admin)** | `http://localhost:5174/admin/content` | Pusat pengelolaan seluruh konten halaman publik |
| **Pengaturan Tampilan (Admin)** | `http://localhost:5174/admin/settings` | Pengaturan logo, tema warna publik, banner, footer, medsos, dan password |

---

## 2. Akun Login & Cara Mengganti Password Admin

### Kredensial Bawaan (Default)
Digunakan saat server API belum terhubung (mode lokal/offline):
- **Link Login:** `/panel-panitia`
- **Email:** `admin@rojabiyyah.id`
- **Password:** `Rojabiyyah2026!`

### Cara Mengganti Email & Password Admin
1. Masuk ke Dashboard Admin melalui `/panel-panitia`.
2. Buka menu **Pengaturan Tampilan** (`/admin/settings`).
3. Pilih tab **Keamanan & Password**.
4. Isi **Email Login Admin**, **Kata Sandi Saat Ini**, **Kata Sandi Baru** (minimal 6 karakter), dan **Konfirmasi Kata Sandi Baru**.
5. Klik **Simpan Password Baru**.

---

## 3. Fitur Utama Dashboard Admin

### A. Konten Situs (`/admin/content`)
- **Berita & Liputan:**
  - Tambah, ubah, terbitkan/draf, atau hapus artikel berita.
  - Unggah foto sampul dan sisipkan foto ke dalam isi berita (maksimal **10 MB**, format JPG/PNG/WebP).
  - Data berita dan gambar tersimpan di `IndexedDB` sehingga aman saat halaman di-refresh.
- **Agenda Acara:**
  - Tambah/hapus hari agenda dan kelola daftar sesi kegiatan beserta waktu, lokasi, dan penanggung jawab.
- **Galeri Foto:**
  - Kelola album dokumentasi, unggah banyak foto sekaligus, atur urutan tampil, dan status terbit/draf.
- **Beranda & Tentang:**
  - Atur headline, tagline, tanggal/lokasi header, banner halaman, item struktur acara, serta paragraf sejarah.
- **Informasi Umum:**
  - **Panduan & Fasilitas:** Kelola kategori dan item panduan (penginapan, transportasi, medis, dll).
  - **Tabbarukan Haul & Merchandise Haul:** Kelola katalog produk, foto, harga, dan kontak WhatsApp pemesanan.
  - **Narahubung Kesekretariatan:** Kelola daftar kontak panitia.
  - **Peta & Titik Lokasi Acara:** Atur tautan Google Maps embed/arah lokasi utama serta tambah/ubah/hapus bagan titik lokasi beserta foto kecil (*thumbnail*) masing-masing lokasi.

### B. Pengaturan Tampilan (`/admin/settings`)
- **Navbar, Logo & Icon:** Unggah logo kustom (otomatis tampil transparan pada latar gelap menggunakan `mix-blend-screen`), atur `site_title` (*PANITIA ROJABIYYAH*), `site_subtitle` (*HAUL ABAH KE-5*), dan favicon.
- **Tema & Palet Warna:** Pilih preset warna atau warna kustom untuk halaman publik. Perubahan tema **tidak memengaruhi** warna tampilan Dashboard Admin.
- **Foto Banner Halaman:** Atur gambar banner untuk Beranda, Tentang, Agenda, Berita, Galeri, dan Informasi Umum.
- **Footer & Media Sosial:** Atur teks hak cipta (*Panitia Rojabiyyah*), alamat sekretariat, kontak, dan tautan media sosial.

---

## 4. Penyimpanan & Sinkronisasi Data

- **Penyimpanan Utama (`IndexedDB`):** Menyimpan seluruh konten termasuk foto beresolusi tinggi dan banner tanpa batas kuota ketat `localStorage` (5 MB).
- **Sinkronisasi Real-Time (`BroadcastChannel`):** Setiap perubahan yang disimpan di Dashboard Admin langsung disinkronkan ke tab Halaman Publik yang sedang terbuka di browser pada port/origin yang sama.
- **Notifikasi & Konfirmasi Kustom:** Seluruh dialog hapus/reset dan peringatan validasi menggunakan modal dan toast internal website (bukan popup bawaan browser).

---

## 5. Perintah Pengembangan (Developer)

Jalankan perintah berikut dari folder `d:\WEBSITE\frontend`:

```bash
# Menjalankan server development lokal
npm run dev

# Cek tipe TypeScript dan build produksi
npm run build
```
