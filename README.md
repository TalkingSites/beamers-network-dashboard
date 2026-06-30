# Beamers Network Dashboard

The Wizard-facing dashboard. Verified Beamers log in here to manage their clients, track wishes, access their kit, and view their retainers.

Admin Beamers use Authentik impersonation to access any Wizard's dashboard — no separate admin UI needed.

**Stack:** Next.js · Neon (Postgres) · Prisma · Auth.js (Authentik OIDC) · Vercel  
**Subdomain:** `app.beamers.network`

---

## Build plan

### Phase 1 — Project scaffold
- `create-next-app` with TypeScript and App Router
- Install and configure Prisma
- Connect to a Neon Postgres database
- Basic layout shell (sidebar nav, header, content area)
- Deploy to Vercel with environment variables, confirm subdomain works

---

### Phase 2 — Database schema
Design and migrate the core tables:

- `wizards` — linked to Authentik user ID, name, bio, city, status (pending / active / suspended)
- `clients` — belongs to a wizard, name, contact, notes
- `wishes` — belongs to a client, title, description, status (open / in progress / done), order (1–3)
- `retainers` — belongs to a client, start date, fortnightly rate, active flag, payment status
- `meetups` — date, location, description (admin-managed)

Seed with a couple of test Wizards and clients so development has real data to work with.

---

### Phase 3 — Client & wish tracker (punch card)
The core feature. A Wizard sees all their clients, each with a punch card showing wish 1, 2, 3.

- List all clients for the logged-in Wizard
- Add a new client
- Add / edit a wish for a client (title, description, status)
- Mark a wish as done — card punches
- When all 3 wishes are done, prompt to convert to a retainer
- Visual punch card component matching the branding

---

### Phase 4 — Retainer overview
- List all active retainers for the Wizard
- Show client name, start date, rate, and payment status
- Mark payment as received (manually for now, Stripe later)
- Simple status: active / paused / ended

---

### Phase 5 — Public profile editor
Each Wizard has a public page on beamers.network. This phase lets them edit it from the dashboard.

- Edit bio, city, skills / domains
- Upload a photo
- Toggle visibility (show / hide from public listing)
- Changes write to the database; the public site reads from the same source (need to connect beamers.network 11ty site to the DB or use an API endpoint)

---

### Phase 6 — Business card & kit downloads
- Display the Wizard's personalised business card (rendered from a template with their name, contact, QR code)
- Download as PDF
- Download flyer guide (static PDF, same for all Wizards)
- QR code links to their public profile page

---

### Phase 7 — Meetups
- List upcoming Beamer meetups (read-only for Wizards)
- Admin can create/edit meetups (or via a separate Authentik-gated route)
- RSVP button (nice to have)

---

### Phase 8 — Stripe integration
- Connect Stripe to handle retainer payments
- Client pays Beamers Network, Wizard receives payout on fortnightly cycle
- Webhook updates retainer payment status automatically
- Wizard sees payment history per retainer

---

### Phase 9 — Auth (Authentik)
- Set up Authentik OIDC client for the dashboard app
- Wire up Auth.js with the Authentik provider
- Protect all dashboard routes — redirect to login if not authenticated
- On first login, create a `wizard` row if one doesn't exist yet (or mark as pending if not yet approved)
- Store Authentik user ID on the wizard row so we can always link session → wizard

Impersonation (admin feature) is handled entirely in Authentik — no code needed in the dashboard.

---

### Phase 10 — Polish & production
- Email notifications (application approved, wish completed, retainer payment received)
- Mobile-responsive dashboard layout
- Dark / light mode matching beamers.network theme
- Error states, empty states, loading skeletons
- End-to-end testing of the Wizard journey (apply → approved → first client → first wish → retainer)
