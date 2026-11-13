# ResumeForge

Resume builder with accounts, cloud-saved resumes, real PDF export and a job application tracker.

- **Free plan:** 3 resumes, 15 tracked applications, every template and font. Limits live in `lib/plans.ts` and are enforced on the server.
- **Editor:** live paged preview, 12 templates (design presets), full Customize panel, autosave.
- **PDF:** the print route renders the exact same component as the preview and headless Chromium prints it — selectable text, correct page breaks, embedded fonts.
- **Job tracker:** drag-and-drop board (Wishlist → Applied → Interview → Offer → Rejected), linked to the resume you used.

## Stack

Next.js 16 (App Router, server actions) · React 19 · Tailwind 4 · Zustand · Better Auth (email/password, optional Google) · Drizzle ORM on libSQL (SQLite file locally, Turso in production) · Puppeteer (`@sparticuz/chromium` on Vercel).

## Local development

```bash
npm install
cp .env.example .env.local   # then set BETTER_AUTH_SECRET
npm run db:push              # creates local.db
npm run dev
```

## Deploying (Vercel + Turso)

1. Create a Turso database and token (`turso db create resumeforge`, `turso db tokens create resumeforge`).
2. In Vercel set the project root to `cv-builder` and add the env vars from `.env.example`:
   `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your production origin), `DATABASE_URL` (`libsql://…`), `DATABASE_AUTH_TOKEN`, and optionally the Google OAuth pair.
3. Apply the schema once: `DATABASE_URL=… DATABASE_AUTH_TOKEN=… npm run db:push`.
4. Deploy. The PDF route needs the Node.js runtime with ≥1 GB memory (Vercel's default is fine).

## Where things are

| Path | What |
| --- | --- |
| `components/resume/` | The resume document: `blocks.tsx` (data → blocks), `PagedResume.tsx` (pagination), `resume.css` |
| `lib/templates.ts` | Template presets |
| `lib/actions/` | Server actions for resumes and applications (auth, validation, plan limits) |
| `lib/db/schema.ts` | Database schema |
| `app/api/resumes/[id]/pdf` + `app/print/[id]` | PDF generation |
| `components/features/editor/` | Editor UI |
| `components/app/` | Dashboard, job board, auth form |

## Not built yet

- Billing: `user.plan` can be `'pro'` (unlimited) but there is no checkout; set it in the database.
- Email verification and password reset (needs an email provider).
- Rate limiting on PDF generation.
