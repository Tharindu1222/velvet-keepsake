# Audit Fix-All Plan — velvet-keepsake

**Goal:** Close Critical/High/Medium gaps from full-stack audit. Lean: no new frameworks, no MFA/Upstash, in-memory rate limit OK for single-node.

**Do not commit** unless user asks. Read Next docs under `node_modules/next/dist/docs/` before Next-specific changes.

## File ownership

| Task | Owns |
|------|------|
| T1 Security core | `lib/env.ts`, `lib/rate-limit.ts`, `lib/auth.ts`, `proxy.ts`, `app/api/auth/login/route.ts`, `README.md`, `.env.example` |
| T2 API harden | `lib/api.ts`, `lib/schemas.ts`, all `app/api/**` (except login if T1 done), `scripts/schema.sql` indexes + inquiries status |
| T3 Photos admin | `app/admin/(dashboard)/photos/**`, `components/admin/PhotosManager.tsx`, `AdminSidebar.tsx`, `GalleryGrid.tsx`, photos API shape |
| T4 FE/UX | `app/error.tsx`, `not-found.tsx`, `loading.tsx`, `InquiryForm.tsx`, admin managers `res.ok`, package inquire query, `privacy/page.tsx` |
| T5 Headers/deps | `next.config.ts` headers, bump `next`+`eslint-config-next`, remove three/R3F, `app/api/upload/route.ts` |
| T6 A11y | `Navbar.tsx`, `FAQAccordion.tsx`, `PageTransition`/motion reduced-motion, `ScrollSetup.tsx` touch |

## Acceptance

1. No JWT fallback secret; missing `JWT_SECRET` fails closed everywhere.
2. Bootstrap admin only when `admins` COUNT = 0.
3. Login + inquiries rate-limited (in-memory).
4. Photos admin CRUD wired; empty gallery not fake Unsplash as real work.
5. Inquiry form shows field errors; max lengths; honeypot.
6. `error.tsx` / `not-found.tsx` exist; admin fetch checks `res.ok`.
7. Security headers in next.config; Next patched; unused 3D deps gone; upload size/MIME checked.
8. `npm run build` succeeds.

## Non-goals

Sentry, Redis, MFA, full OpenAPI, rewriting all hardcoded colors, email notifications.
