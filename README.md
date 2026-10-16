# Frontend Peta Magang (Bun + Vite + Vue 3)

Frontend aplikasi pemetaan titik magang mahasiswa, dimigrasikan dari Laravel + Inertia.js ke arsitektur Single Page Application (SPA) berbasis Bun, Vue 3, Pinia, Vue Router, Tailwind CSS v4, Leaflet, dan AG-Grid.

## Fitur & Halaman

### 1. Halaman Publik
- **Beranda Interaktif (`/`)**:
  - Peta interaktif Leaflet dengan pin kustom dan klaster lokasi
  - Pencarian lokasi magang real-time dengan autocomplete
  - Filter multi-kategori
  - Panel drawer/detail lokasi responsif (mobile bottom sheet & desktop sidebar)
  - Slider/carousel foto dokumentasi lokasi magang
  - Integrasi WhatsApp Chat, Rute Google Maps, dan Maps pin
  - Mode Gelap (Dark Mode) & Terang otomatis
- **Formulir Pengajuan Lokasi (`/locations/add` & `/locations/create`)**:
  - Formulir mahasiswa: Nama, NIM, Fakultas, Jurusan
  - Pemilihan titik koordinat langsung di peta (Leaflet draggable marker) dan deteksi GPS
  - Formulir instansi / tempat magang & deskripsi
  - Dropzone multi-upload foto dokumentasi dengan preview
  - Notifikasi Toastify saat submit berhasil / gagal
- **Admin Login (`/login`)**:
  - Autentikasi JWT terintegrasi dengan backend Bun Hono (`/api/auth/login`)

### 2. Panel Admin (Dilindungi Auth Guard)
- **Dashboard (`/admin/dashboard`)**:
  - Statistik total pengajuan, lokasi disetujui, lokasi pending, dan total kategori
  - Grafik batang ApexCharts untuk distribusi kategori
  - Preview peta lokasi aktif
  - Tabel aktivitas pengajuan terbaru
- **Kelola Lokasi Magang (`/admin/locations`)**:
  - Tabel AG-Grid interaktif dengan quick search & ekspor CSV
  - Modal detail lokasi lengkap dengan galeri foto
  - Aksi Persetujuan lokasi (`PATCH /api/locations/:id/approve`)
  - Aksi Hapus lokasi dengan modal konfirmasi (`DELETE /api/locations/:id`)
  - Generator QR Code pengajuan (`/api/locations/generate-link`) dengan tombol unduh dan bagikan WhatsApp/Telegram
- **Kelola Kategori (`/admin/categories`)**:
  - Daftar kategori, tambah kategori baru, edit, dan hapus
- **Kelola Fakultas (`/admin/faculties`)**:
  - Daftar fakultas, tambah fakultas baru, edit, dan hapus
- **Kelola Jurusan (`/admin/departments`)**:
  - Daftar jurusan terhubung dengan fakultas & jenjang pendidikan, tambah, edit, dan hapus
- **Pengaturan Profil Website (`/admin/profile`)**:
  - Ubah nama aplikasi, deskripsi sistem, dan unggah logo website

## Cara Menjalankan

### Persyaratan
- [Bun](https://bun.sh/) (v1.0+)

### Menjalankan Backend API
```bash
cd backend
bun install
bun run dev
# API berjalan di http://localhost:3000
```

### Menjalankan Frontend
```bash
cd frontend
bun install
bun run dev
# Frontend berjalan di http://localhost:5173
```

### Build Produksi Frontend
```bash
cd frontend
bun run build
```
