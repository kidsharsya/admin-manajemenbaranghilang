# 🧾 Aplikasi Admin Manajemen Barang Hilang

Aplikasi berbasis web untuk membantu proses pelaporan, pencocokan, dan pengelolaan barang hilang dan ditemukan di lingkungan tertentu, seperti kampus, perumahan, atau instansi publik.

## 🔧 Fitur Utama

### 👥 Manajemen Pengguna

- Role pengguna: **Admin**, **Satpam**, dan **Tamu**
- Admin dapat menambah, mengedit, dan menghapus pengguna
- Upload foto identitas untuk setiap pengguna

### 📝 Laporan Barang

- Pelaporan barang **hilang** dan **temuan**
- Upload foto barang
- Status laporan: _proses_, _cocok_, _selesai_

### 🔍 Pencocokan Barang

- Sistem pencocokan antara laporan hilang dan temuan
- Menampilkan _skor kecocokan_ antara dua laporan

### 📦 Klaim Barang

- Proses klaim oleh pihak terkait
- Upload foto bukti klaim
- Status klaim: _selesai_

### 📊 Dashboard Admin

- Statistik jumlah pengguna per role
- Jumlah laporan hilang & temuan
- Jumlah pencocokan & klaim

## 🖥️ Teknologi

- **Next.js (App Router)**
- **TypeScript**
- **TailwindCSS**
- **Axios**
- **Headless UI**
- **Express.js** (untuk backend)
- **Firebase / Google Cloud Storage** (opsional untuk gambar)

## 📁 Struktur Folder

├── components/
├── pages/
│ ├── dashboard/
│ ├── user/
│ ├── laporan/
│ └── klaim/
├── lib/
│ └── api.ts
├── public/
├── .env.local
├── README.md

## 📦 Instalasi

```bash
# Clone repo
git clone https://github.com/username/nama-repo.git
cd nama-repo

# Install dependencies
npm install

# Jalankan development server
npm run dev

🔐 Konfigurasi Environment
Buat file .env.local:
NEXT_PUBLIC_API_URL=https://your-api-url.com

👤 Akses Admin
Pastikan akun dengan role admin login melalui halaman /login.
```
