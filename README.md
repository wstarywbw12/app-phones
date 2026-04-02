# 📞 PhoneBook — CRUD App

Aplikasi manajemen kontak telepon dibangun dengan **Next.js 14** (App Router), **TypeScript**, dan **MySQL**.

## Fitur
- ✅ **Create** — Tambah kontak baru
- ✅ **Read** — Tampilkan semua kontak
- ✅ **Update** — Edit kontak langsung di tabel (inline edit)
- ✅ **Delete** — Hapus kontak dengan konfirmasi
- ✅ Validasi form
- ✅ Toast notifikasi
- ✅ Desain dark-mode industrial

---

## Cara Setup

### 1. Clone / Salin Project

```bash
cd phones-app
npm install
```

### 2. Setup Database MySQL

Buka MySQL client (phpMyAdmin, MySQL Workbench, atau terminal):

```bash
mysql -u root -p < schema.sql
```

Atau jalankan isi file `schema.sql` secara manual.

### 3. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` sesuai konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=phones_db
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Project

```
phones-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── phones/
│   │   │       ├── route.ts          # GET all, POST
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET one, PUT, DELETE
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # UI utama
│   ├── lib/
│   │   └── db.ts                     # Koneksi MySQL pool
│   └── types/
│       └── phone.ts                  # TypeScript types
├── schema.sql                         # Script setup database
├── .env.example
└── package.json
```

## API Endpoints

| Method | Endpoint           | Deskripsi              |
|--------|--------------------|------------------------|
| GET    | `/api/phones`      | Ambil semua kontak     |
| POST   | `/api/phones`      | Tambah kontak baru     |
| GET    | `/api/phones/:id`  | Ambil satu kontak      |
| PUT    | `/api/phones/:id`  | Update kontak          |
| DELETE | `/api/phones/:id`  | Hapus kontak           |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL 8+
- **Driver**: mysql2
- **Styling**: CSS Modules (pure CSS)
