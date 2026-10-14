# Velvet Keepsake Weddings

Luxury wedding photography site — black aesthetic, Framer Motion / GSAP, Cloudinary media, and a MySQL-backed admin curator panel.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Framer Motion** + **GSAP** for motion
- **MySQL** (`mysql2`) for content, admins, inquiries
- **Cloudinary** for image upload & CDN delivery
- **JWT cookies** (`jose` + `bcryptjs`) for `/admin` auth

## Quick start

### 1. Configure `.env.local`

```bash
cp .env.example .env.local
```

Set all values in `.env.example`. `JWT_SECRET` is required (long random string). Do not use weak or documented sample passwords in production.

### 2. Apply MySQL schema

```bash
npm run db:setup
```

Or:

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

First login creates the admin row **only when the `admins` table is empty**, using `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Architecture

```
app/
  page.tsx                 # Home (GSAP hero)
  portfolio/               # Gallery + spotlight
  about/ packages/ contact/ reserve/
  privacy/                 # Privacy notice
  admin/                   # Curator panel
  api/                     # Route handlers
lib/
  db.ts, auth.ts, env.ts, api.ts, rate-limit.ts
  cloudinary.ts, data.ts, content.ts
components/
  HomeHero.tsx, GalleryGrid.tsx, admin/*
scripts/
  schema.sql, setup-db.js, seed-content.js
```
