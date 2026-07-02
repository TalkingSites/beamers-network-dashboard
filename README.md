# Beamers Network Dashboard

Wizard-facing dashboard. Verified Beamers log in to manage clients (Wishers), track the 3-wish punch card, view retainers, edit their public profile, and download their kit.

Admin access is via Authentik impersonation — no separate admin UI.

**Stack:** Next.js 16 (App Router) · Neon (Postgres) · Prisma 5 · Auth.js (Authentik OIDC) · Tailwind v4
**Subdomain:** `app.beamers.network`

## Status

- ✅ Phase 1 — Scaffold
- ✅ Phase 2 — DB schema + Authentik OIDC auth + first-login wizard creation
- ✅ Phase 3 — Wishers + punch card tracker
- ✅ Phase 3.5 — Public wish card + QR flip + Web Share API
- ⬜ Phase 4 — Retainer overview
- ⬜ Phase 5 — Public profile editor
- ⬜ Phase 6 — Kit downloads (business card, flyers)
- ⬜ Phase 7 — Meetups
- ⬜ Phase 8 — Stripe integration
- ⬜ Phase 10 — Polish & production

## Routes

```
/                 → overview
/wishers          → punch card tracker (clients + wishes)
/wishers/[id]     → wisher detail
/card/[token]     → public wish card (shareable, QR)
/retainers        → retainer overview (stub)
/profile          → public profile editor (stub)
/kit              → kit downloads (stub)
/meetups          → meetups (stub)
/login            → Authentik OIDC login
```

## Local dev

```bash
npm install
npx prisma generate    # after schema changes
npx prisma migrate dev # apply schema
npm run dev            # localhost:3000
```

Needs a `.env` with `DATABASE_URL` (Neon) and Authentik OIDC vars — see `.env.example`.

See `CLAUDE.md` for theme variables and key file locations.
