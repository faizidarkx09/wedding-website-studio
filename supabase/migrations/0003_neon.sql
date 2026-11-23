-- Wedding Website Studio — 0003_neon.sql
-- Neon (Postgres) adaptation of the production store, run 2026-11-23.
--
-- WHY THIS FILE EXISTS (and why 0001/0002 were NOT run as-is):
-- * 0001_init.sql is a NORMALISED schema built for Supabase. It cannot run
--   on Neon: public.profiles references auth.users (Supabase Auth does not
--   exist on Neon), and public.access_codes references public.etsy_orders.
-- * The per-order model (etsy_orders + access_codes) was REMOVED from the
--   app (2026-11-22): every template now has ONE fixed code baked into
--   src/lib/templates.ts, and activation creates a brand-new site per
--   buyer. Those two tables are dead and must never be created.
-- * The app has no user accounts and no Supabase Auth; it uses its own
--   HMAC cookie sessions (src/lib/auth.ts). The normalised content /
--   design / events / media / questions / settings / passwords tables
--   would need 7+ joins per site load for no benefit.
-- * 0002_rls.sql is SKIPPED entirely: its 30 policies call auth.uid(),
--   which does not exist on Neon (CREATE POLICY would fail). Tenant
--   isolation is enforced in code by siteId scoping (src/lib/store.ts),
--   exactly as the in-memory store did. The app connects with the owner
--   connection string server-side only (DATABASE_URL, never exposed);
--   no browser client ever talks to the database directly.
--
-- DESIGN: document store in a dedicated `wedding` schema (ClipForge keeps
-- its own `public` tables in the same Neon database — no collisions).
-- Each row stores the full app object as JSONB plus indexed scalar
-- columns (slug unique, status, template_id) so the store semantics
-- match the in-memory store exactly. Tables:
--   wedding.templates   — admin-created templates only (the 6 launch
--                          themes live in code, src/lib/templates.ts).
--   wedding.sites       — one row per buyer site (full WeddingSite JSONB).
--   wedding.rsvps       — one row per guest RSVP (full RsvpResponse JSONB).
--   wedding.audit_logs  — append-only admin/audit trail (newest 500 kept).
--
-- Run with: one statement per call against the Neon HTTP /sql endpoint
-- (POST https://<host>/sql, header Neon-Connection-String: <DATABASE_URL>).
-- Every statement is idempotent (IF NOT EXISTS / ON CONFLICT).

create schema if not exists wedding;

create table if not exists wedding.templates (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wedding.sites (
  id text primary key,
  slug text not null unique,
  template_id text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished', 'suspended', 'archived')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists wedding_sites_status_idx on wedding.sites (status);
create index if not exists wedding_sites_template_id_idx on wedding.sites (template_id);

create table if not exists wedding.rsvps (
  id text primary key,
  site_id text not null,
  update_token text not null unique,
  data jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wedding_rsvps_site_id_idx on wedding.rsvps (site_id);

create table if not exists wedding.audit_logs (
  id text primary key,
  actor text not null,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists wedding_audit_logs_created_at_idx
  on wedding.audit_logs (created_at desc);
