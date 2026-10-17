# PCC — Pondok Kelapa Cycling Community (20th Anniversary)

Website sederhana, modern, dan classy untuk komunitas sepeda Pondok Kelapa. Siap diunggah ke GitHub dan dihosting gratis di **Netlify** — tanpa Python dan tanpa backend ribet.

## Struktur Folder

```
pcc-20th-anniversary/
├── index.html          # Website publik (beranda, galeri, cerita)
├── admin.html          # Halaman admin (upload foto & cerita)
├── css/style.css       # Styling
├── js/app.js           # Logika website publik
├── js/admin.js         # Logika halaman admin
├── data/posts.json     # Data cerita & foto (diisi melalui Admin)
├── assets/images/      # Foto contoh dan foto kegiatan
├── assets/uploads/     # Tempat foto hasil upload admin (opsional)
├── netlify.toml        # Konfigurasi Netlify
├── _redirects          # Redirect halaman admin
├── .gitignore
└── README.md
```

## Cara Pakai di Komputer (Offline)

1. Buka folder ini, lalu buka `index.html` di browser untuk melihat website publik.
2. Buka `admin.html` untuk menambah/mengedit cerita dan foto.
3. Data disimpan sementara di browser (localStorage).
4. Setelah selesai mengedit, buka **Admin → Impor / Ekspor → Ekspor ke JSON**, simpan file sebagai `data/posts.json` (timpa file yang ada).

## Cara Upload ke GitHub

1. Buat repository baru di GitHub (misalnya `pcc-20th-anniversary`).
2. Unggah semua file di folder ini ke repository (kecuali `node_modules` jika ada).
3. Pastikan `data/posts.json` sudah ada agar website tidak kosong.

## Cara Hosting di Netlify (Gratis)

1. Masuk ke [netlify.com](https://www.netlify.com).
2. Klik **"Add new site" → "Import an existing project" → pilih GitHub**.
3. Pilih repository `pcc-20th-anniversity` yang sudah dibuat.
4. Biarkan build settings kosong (default sudah benar), lalu klik **Deploy Site**.
5. Website akan langsung online dengan URL gratis dari Netlify.

## Cara Menambah Foto Kegiatan melalui Admin

1. Buka `admin.html` (atau `https://namasitumu.netlify.app/admin.html` setelah online).
2. Isi Judul, Tanggal, Cerita, dan pilih Foto.
3. Klik **Simpan Postingan**.
4. Foto akan disimpan sebagai data dalam JSON (base64). Untuk foto berkualitas besar, disarankan mengompres terlebih dahulu agar file `posts.json` tidak terlalu besar.
5. Setelah selesai, **Ekspor ke JSON** → ganti `data/posts.json` di GitHub → redeploy di Netlify (otomatis saat push ke GitHub).

## Catatan Penting

- Ini adalah website **statis**. Tidak ada server/database, jadi cocok untuk komunitas kecil hingga menengah.
- Foto disimpan dalam `data/posts.json` dalam format base64. Jika foto terlalu banyak/besar, ukuran JSON akan membesar. Untuk produksi sebaiknya foto diunggah ke layanan penyimpanan gambar (misalnya GitHub LFS, Cloudinary, atau ImgBB) lalu simpan URL-nya di JSON.
- Admin page tidak dilindungi password secara default. Jika ingin aman, tambahkan proteksi melalui Netlify Identity atau ganti nama file `admin.html` menjadi sesuatu yang sulit ditebak.

## Lisensi

Dibuat untuk komunitas PCC. Bebas digunakan dan dimodifikasi.