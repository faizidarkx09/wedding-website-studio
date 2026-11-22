# Wedding Website Studio

Multi-template wedding website builder and RSVP manager. Customers buy a
template on Etsy, receive a personalised PDF with a private editor link and
a one-time access code, customise their site, publish it, and share the
public URL (or its QR code) with guests. Guests RSVP online; the couple
exports responses as CSV.

Stack: Next.js 16.4.6 (App Router) + React 19 + TypeScript (strict) +
Tailwind CSS 4. Mobile-first. One shared rendering engine, many
tenant-isolated wedding sites.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Copy `.env.example` to `.env.local` and fill in the values you have — the
app runs fully in **demo mode** with no keys at all (see below).

## Demo mode vs Supabase

**Demo mode (default, no keys needed).** When `NEXT_PUBLIC_SUPABASE_URL`
/ `NEXT_PUBLIC_SUPABASE_ANON_KEY` are absent, the app runs on an in-memory
store (`src/lib/store.ts`) seeded with the Sarah & James demo site
(`sarah-and-james`, published), 3 sample RSVPs and 1 delivered demo order.
Everything works — editor, RSVP, QR, PDF, CSV — but data resets on every
redeploy / cold start.

**Supabase (production store).** Exact steps:

1. Create a project at [supabase.com](https://supabase.com) → **New project**.
2. In the project dashboard go to **Settings → API** and copy the
   **Project URL** and the **anon public key** (and the **service_role**
   secret key for server-side admin flows).
3. Open the **SQL Editor** and run, in order:
   - `supabase/migrations/0001_init.sql` (schema)
   - `supabase/migrations/0002_rls.sql` (row level security)
   - `supabase/seed.sql` (5 templates + Sarah & James demo site — optional)
4. Set the env vars in `.env.local` (or in Vercel → Project → Settings →
   Environment Variables):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`, `ADMIN_PASSWORD`.
5. Restart the dev server / redeploy.

## Etsy manual workflow

Etsy has no automatic order sync yet — orders are handled manually:

1. **Register** — admin adds the Etsy order in the admin dashboard
   (order ID, listing, customer name + email, chosen template).
2. **Verify** — admin checks the payment / order details on Etsy and marks
   the order `verified`.
3. **Provision** — admin provisions the order. This creates exactly one
   site + one access code (idempotent: re-provisioning returns the existing
   site and never reveals the original code again). The admin's chosen
   template is authoritative — the Etsy listing only suggests it.
4. **PDF** — admin downloads the delivery PDF
   (`GET /api/pdf?orderId=…`, admin session required). It contains the
   private editor URL (clickable), the one-time access code in large text,
   and setup instructions. If the code was already shown, the admin must
   **reset the code first** — the plain code is never stored, so it cannot
   be recovered.
5. **Deliver** — upload the PDF to the Etsy order as a digital download
   (Etsy → Shop Manager → Orders → the order → add the PDF file) and mark
   the order delivered. The customer opens the PDF, follows the editor
   link, enters the code, customises, and publishes.

## Vercel deploy

```bash
npx vercel            # link the project, then set env vars
# or: push to GitHub and import the repo at vercel.com/new
```

Set in Vercel → Project → Settings → Environment Variables (Production):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (your domain, no
trailing slash), `ADMIN_PASSWORD`, `SESSION_SECRET`, and optionally
`RESEND_API_KEY`, `ETSY_API_KEY`, `ETSY_SHOP_ID`. Then redeploy. Use the
domain in `NEXT_PUBLIC_SITE_URL` — it is what QR codes and PDF links encode.

## Demo credentials (DEMO ONLY — change before going live)

| Who | How | Value |
| --- | --- | --- |
| Admin | Admin login password | `admin123` (set `ADMIN_PASSWORD` in production) |
| Demo customer | Access code for the Sarah & James demo site | `WWS-DEMO-2026` |

Both are demo-only placeholders. Never use them for a real customer.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Template storefront |
| `/w/[slug]` | Public guest website (published sites only) |
| `/w/[slug]/rsvp` | Guest RSVP form |
| `/editor` | Customer editor (access code required) |
| `/admin` | Admin dashboard (orders, provisioning, sites) |
| `POST /api/rsvp` | Submit a new RSVP, or update one via `updateToken` |
| `GET /api/rsvp?token=…` | Fetch one RSVP's own fields (for editing) |
| `GET /api/qr?slug=…&format=svg\|png` | QR code for the site's public URL |
| `GET /api/pdf?orderId=…` | Delivery PDF (admin session required) |
| `GET /api/csv?siteId=…` | RSVP CSV export (customer owner or admin) |

## Known limitations

- **Demo mode is in-memory**: data resets on redeploy / cold start. Use
  Supabase for anything real.
- **Email is not connected**: `RESEND_API_KEY` is accepted but no emails
  are sent yet — delivery happens through the Etsy digital-download
  workflow above.
- **Etsy API is not connected**: order sync is manual (see workflow).
  `ETSY_API_KEY` / `ETSY_SHOP_ID` are reserved for the future sync.
- **Uploads are stored as data URLs in demo mode** (no object storage yet).
- **Rate limiting is in-memory per process** (10 RSVP submissions /
  minute per IP + site); use Upstash / a gateway for multi-instance
  production.

## Security notes

- **Access codes are hash-only**: `access_codes.code_hash` is a SHA-256
  hex; the plain code exists only in the one-time delivery PDF and the
  admin screen at provisioning. It is never stored, logged or returned by
  any API. Resetting a code invalidates the old one.
- **Row Level Security**: every customer-owned table has RLS
  (`supabase/migrations/0002_rls.sql`). Anonymous users can read published
  sites and their public content only; owners see only their own rows;
  admins are gated on `profiles.is_admin`. The `service_role` key bypasses
  RLS, so server code still scopes every read/write by `siteId`/`orderId`.
- **Tenant isolation**: public pages receive only the public fields of a
  published site — never access codes, guest lists or other guests' RSVPs.
  The RSVP GET endpoint returns a single response by its secret token.
- **RSVP deadline is enforced server-side** (`POST /api/rsvp` returns
  410 `RSVP closed` after the deadline); the client notice is cosmetic.
- **Rate limits**: RSVP submissions are limited to 10/minute per IP +
  site; auth endpoints use the shared `rateLimit` helper in
  `src/lib/auth.ts`.
- **CSV exports are formula-injection safe**: cells starting with `=`,
  `+`, `-`, `@`, tab or CR are prefixed with `'` (see `src/lib/csv.ts`).
- **Secrets**: never commit `.env.local` or real keys. Placeholders only
  in `.env.example`. Set a long random `SESSION_SECRET` and a real
  `ADMIN_PASSWORD` in production.
