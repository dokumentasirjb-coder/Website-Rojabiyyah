# Panduan Publish Fullstack (cPanel / DirectAdmin)

Panduan ini disiapkan khusus untuk upload **Frontend (Vue 3)** dan **Backend (Laravel 11)** ke **Shared Hosting (cPanel / DirectAdmin)** menggunakan subdomain atau domain sementara dari hosting.

---

## Langkah 1 — Siapkan Database MySQL di cPanel

1. Masuk ke **cPanel → MySQL® Databases**.
2. Buat database baru (misal `u123456_rojabiyyah`).
3. Buat user database + password yang kuat, lalu klik **Add User to Database** dan centang **ALL PRIVILEGES**.

---

## Langkah 2 — Upload & Konfigurasi Backend Laravel

1. Kompres folder `d:\WEBSITE\backend` menjadi `backend.zip` (boleh kecualikan `node_modules` jika tidak dipakai, pastikan folder `vendor` ikut atau jalankan `composer install --no-dev --optimize-autoloader` di server).
2. Di **File Manager cPanel**, buat folder di luar `public_html`, misalnya `/home/username/rojabiyyah-api/`, lalu upload dan ekstrak `backend.zip` di sana.
3. Buat **Subdomain** di **cPanel → Domains** (misal `api.domain-anda.com`) dan arahkan **Document Root**-nya ke:
   `/home/username/rojabiyyah-api/public`
4. Salin file `.env.production.example` menjadi `.env` di `/home/username/rojabiyyah-api/.env`, lalu isi:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://api.domain-anda.com` (atau subdomain hosting Anda)
   - `FRONTEND_URL=https://domain-anda.com` (domain/subdomain tempat frontend dibuka)
   - `SANCTUM_STATEFUL_DOMAINS=domain-anda.com,www.domain-anda.com`
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` sesuai Langkah 1.
5. Buka **cPanel → Terminal** (atau SSH), lalu jalankan:

```bash
cd ~/rojabiyyah-api
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

> Pastikan SSL (**AutoSSL / Let's Encrypt**) aktif untuk domain utama dan subdomain `api.` agar keduanya berjalan via **HTTPS**.

---

## Langkah 3 — Build & Upload Frontend Vue 3

1. Di komputer lokal (`d:\WEBSITE\frontend`), buat file `.env.production` (salin dari `.env.production.example`) dan isi dengan URL API backend Anda:
   ```env
   VITE_API_BASE_URL=https://api.domain-anda.com/api/v1
   ```
2. Jalankan build produksi di terminal lokal:
   ```bash
   cd d:\WEBSITE\frontend
   npm run build
   ```
3. Buka folder `d:\WEBSITE\frontend\dist\` — kompres **seluruh isi di dalam folder `dist/`** (termasuk file `.htaccess` dan `index.html`, bukan folder `dist`-nya) menjadi `frontend-dist.zip`.
4. Upload dan ekstrak `frontend-dist.zip` ke dalam `public_html/` di cPanel.
   - File `.htaccess` sudah otomatis disertakan agar halaman seperti `/berita`, `/informasi`, dan `/panel-panitia` tidak error 404 saat di-refresh.

---

## Langkah 4 — Pengujian Setelah Online

1. Buka `https://domain-anda.com/` dan cek tab **Network** di browser: pastikan `GET /api/v1/settings` dan `GET /api/v1/articles` membalas status `200 OK`.
2. Buka `https://domain-anda.com/panel-panitia` dan login dengan akun admin.
3. Segera ganti password admin melalui **Pengaturan Tampilan → Keamanan & Password**.
4. Uji tambah/ubah berita atau banner lalu refresh halaman untuk memastikan data tersimpan permanen di database MySQL.
