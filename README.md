# Wedding Website Studio

Multi-template wedding website builder and RSVP manager. Customers buy a
template on Etsy, receive a delivery PDF with the template link and the
template's fixed access code, activate it with their names to create their
own private website, customise their site, publish it, and share the
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
app runs fully in **local mode** with no keys at all (see below).

## Local mode vs Supabase

**Local mode (default, no keys needed).** When `NEXT_PUBLIC_SUPABASE_URL`
/ `NEXT_PUBLIC_SUPABASE_ANON_KEY` are absent, the app runs on an in-memory
store (`src/lib/store.ts`) that starts empty — no demo content, no sample
sites. The 6 real themes are the only built-in data.
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
   - `supabase/seed.sql` (6 themes — optional)
4. Set the env vars in `.env.local` (or in Vercel → Project → Settings →
   Environment Variables):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`, `ADMIN_PASSWORD`.
5. Restart the dev server / redeploy.

## Etsy delivery model — one static PDF per template

There is no per-order provisioning and no mail system. Each of the 6
themes has ONE fixed access code (baked into `src/lib/templates.ts` —
never change it after the PDF is on Etsy):

| Template | Access code |
| --- | --- |
| Champagne Elegance | `WWS-CHAMPAGNE-2026` |
| Blue Serenity | `WWS-BLUE-2026` |
| Midnight Romance | `WWS-MIDNIGHT-2026` |
| Sage Botanical | `WWS-SAGE-2026` |
| Mediterranean Sunset | `WWS-MEDITERRANEAN-2026` |
| Lavender Dreams | `WWS-LAVENDER-2026` |

1. **PDF** — admin downloads the template's delivery PDF from
   **Admin → Templates** (`GET /api/pdf/template?templateId=…`, admin
   session required). It contains the template (activate) link, the
   template preview link, numbered setup instructions, and the template's
   fixed access code in large text.
2. **List** — upload that PDF ONCE to the Etsy listing as the digital
   download file (alongside the template's video/images).
3. **Buy** — every buyer of that template gets the same PDF and the same
   code.
4. **Activate** — the buyer opens the link in the PDF, enters the code and
   their names on `/activate`. Activating creates a BRAND-NEW private
   website from that template, just for that buyer — buyers never share a
   site and never overwrite each other's customisations. The buyer then
   customises in the editor, presses Publish, and shares the link/QR code
   with guests.

## Vercel deploy

```bash
npx vercel            # link the project, then set env vars
# or: push to GitHub and import the repo at vercel.com/new
```

Set in Vercel → Project → Settings → Environment Variables (Production):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (your domain, no
trailing slash), `ADMIN_PASSWORD`, `SESSION_SECRET`, and optionally
`ETSY_API_KEY`, `ETSY_SHOP_ID`. Then redeploy. Use the
domain in `NEXT_PUBLIC_SITE_URL` — it is what QR codes and PDF links encode.

## Admin credentials (change before going live)

| Who | How | Value |
| --- | --- | --- |
| Admin | Admin login password | Set via `ADMIN_PASSWORD` env var in Vercel (strong secret; the `admin123` default is disabled) |

The admin password is managed through the `ADMIN_PASSWORD` environment
variable in Vercel. The `admin123` default in the code is a placeholder
only — it never works in production once the env var is set.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Template storefront |
| `/w/[slug]` | Public guest website (published sites only) |
| `/w/[slug]/rsvp` | Guest RSVP form |
| `/editor` | Customer editor (access code required) |
| `/admin` | Admin dashboard (templates, sites) |
| `POST /api/rsvp` | Submit a new RSVP, or update one via `updateToken` |
| `GET /api/rsvp?token=…` | Fetch one RSVP's own fields (for editing) |
| `GET /api/qr?slug=…&format=svg\|png` | QR code for the site's public URL |
| `GET /api/pdf/template?templateId=…` | Per-template delivery PDF (admin session required) |
| `GET /api/csv?siteId=…` | RSVP CSV export (customer owner or admin) |

## Known limitations

- **Local mode is in-memory**: data resets on redeploy / cold start. Use
  Supabase for anything real.
- **Email is not connected**: there is no mail system by design — delivery
  happens through the Etsy digital-download PDF (see delivery model above).
- **Etsy API is not connected**: there is no automatic order sync; delivery
  is one static PDF per listing (see delivery model above).
  `ETSY_API_KEY` / `ETSY_SHOP_ID` are reserved for a future sync.
- **Uploads are stored as data URLs in local mode** (no object storage yet).
- **Rate limiting is in-memory per process** (10 RSVP submissions /
  minute per IP + site); use Upstash / a gateway for multi-instance
  production.

## Security notes

- **Access codes**: template codes are fixed strings in source
  (`src/lib/templates.ts`) — they ship in the static Etsy PDF, so they
  must never change after the PDF is listed. Their plain form is never
  stored, logged or returned by any API.
- **Row Level Security**: every customer-owned table has RLS
  (`supabase/migrations/0002_rls.sql`). Anonymous users can read published
  sites and their public content only; owners see only their own rows;
  admins are gated on `profiles.is_admin`. The `service_role` key bypasses
  RLS, so server code still scopes every read/write by `siteId`.
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
