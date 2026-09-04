# Velvet Keepsake Weddings

Luxury wedding photography site — premium black aesthetic, 3D hero, Framer Motion, Cloudinary media, and a MySQL-backed admin curator panel.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Three.js** via `@react-three/fiber` + `@react-three/drei`
- **Framer Motion** for scroll reveals
- **MySQL** (`mysql2`) for photos, admins, inquiries
- **Cloudinary** for image upload & CDN delivery
- **JWT cookies** (`jose` + `bcryptjs`) for `/admin` auth

## Quick start

### 1. Configure `.env.local`

```bash
cp .env.example .env.local
```

Fill in:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=velvet_keepsake

CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

JWT_SECRET=long-random-string
ADMIN_EMAIL=admin@velvetkeepsake.com
ADMIN_PASSWORD=VelvetAdmin2026!
```

### 2. Apply MySQL schema

```bash
npm run db:setup
```

Or manually:

```bash
mysql -u root -p < scripts/schema.sql
```

### 3. Cloudinary

1. Open https://cloudinary.com/console  
2. Copy **Cloud name**, **API Key**, **API Secret** into `.env.local`  
3. Admin uploads land in folder `velvet-keepsake`

### 4. Dev server

```bash
npm run dev
```

| URL | Purpose |
|---|---|
| http://localhost:3000 | Public site |
| http://localhost:3000/admin/login | Curator panel |

First successful login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` creates the admin row in MySQL.

## Architecture

```
app/
  page.tsx                 # 3D hero home
  gallery/                 # Filterable masonry
  about/ packages/ contact/
  admin/login|dashboard/   # Auth + Cloudinary uploader
  api/
    auth/login|logout
    upload                 # → Cloudinary
    photos|photos/create   # → MySQL
    inquiries              # Contact form
lib/
  db.ts                    # mysql2 pool
  cloudinary.ts
  auth.ts                  # JWT session cookies
components/
  Hero3DCanvas.tsx
  GalleryGrid.tsx
  LuxuryFadeIn.tsx
scripts/
  schema.sql
  setup-db.js
```
