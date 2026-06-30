@AGENTS.md

# Beamers Network — Wizard Dashboard

Next.js 16 app. The dashboard Wizards log in to and manage their work.
Admin access is handled via Authentik impersonation (Phase 9) — no separate admin UI needed.

## What this is
Wizard-facing dashboard for Beamers Network. Wizards manage clients, track the 3-wish punch card, view retainers, edit their public profile, and download their Beamer kit (business card, flyers).

## Stack
- **Next.js 16** with App Router + TypeScript
- **Tailwind CSS** (v4, CSS-first config via `@import "tailwindcss"`)
- **Prisma 5** (`prisma-client-js`) — do NOT upgrade to Prisma 6/7, breaking changes
- **Postgres** — Neon for now (free, easy to migrate off later via `pg_dump`)
- **Vercel** for deployment (planned)
- **Subdomain:** `app.beamers.network`

## Key files
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema — Prisma 5, `url = env("DATABASE_URL")` |
| `src/lib/prisma.ts` | Prisma client singleton (global to avoid hot-reload leaks) |
| `src/app/layout.tsx` | Root layout — Geist font, imports globals.css |
| `src/app/globals.css` | CSS variables (Beamers dark theme), Tailwind import |
| `src/app/(dashboard)/layout.tsx` | Dashboard shell — sidebar + header + scrollable main |
| `src/components/Sidebar.tsx` | Client component, `usePathname` for active nav links |
| `.env` | Local env vars — **not committed** |
| `.env.example` | Template for env vars — committed, safe |

## Route structure
```
/              → overview (stat cards)
/clients       → punch card tracker (Phase 3)
/retainers     → retainer overview (Phase 4)
/profile       → public profile editor (Phase 5)
/kit           → business card + flyer downloads (Phase 6)
/meetups       → upcoming meetups (Phase 7)
```
All routes live under `src/app/(dashboard)/` — the `(dashboard)` route group applies the sidebar layout without adding a URL segment.

## Theme / colours
CSS variables in `globals.css` match `beamers.network`:
- `--bg-base: #0B0F1A` — page background
- `--bg-surface: #111827` — sidebar, header
- `--bg-card: #141C2E` — cards
- `--gold: #F5C842` — primary accent
- `--text-primary: #F0EEE9`
- `--text-secondary: #9AA3C0`
- `--border: rgba(255,255,255,0.07)`

## Build phases (see README.md for full detail)
- ✅ Phase 1 — Project scaffold (done)
- ⬜ Phase 2 — Database schema (wizards, clients, wishes, retainers, meetups)
- ⬜ Phase 3 — Client & wish tracker (punch card UI)
- ⬜ Phase 4 — Retainer overview
- ⬜ Phase 5 — Public profile editor
- ⬜ Phase 6 — Business card & kit downloads
- ⬜ Phase 7 — Meetups
- ⬜ Phase 8 — Stripe integration
- ⬜ Phase 9 — Auth (Authentik OIDC via Auth.js)
- ⬜ Phase 10 — Polish & production

## Database setup
1. Create a Neon project at https://neon.tech
2. Copy the pooled connection string
3. Paste into `.env` as `DATABASE_URL`
4. Run `npx prisma migrate dev` to apply schema
- To self-host later: `pg_dump <neon-url> > beamers.sql` then restore to your own Postgres. Update `DATABASE_URL` and done.

## Running locally
```bash
npm install
npx prisma generate    # needed after schema changes
npm run dev            # localhost:3000
```
