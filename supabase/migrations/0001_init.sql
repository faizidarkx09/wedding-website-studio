-- Wedding Website Studio — 0001_init.sql
-- Full PostgreSQL schema for every PRD table.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Access codes are stored as SHA-256 hashes ONLY (access_codes.code_hash);
-- there is deliberately no plain-code column anywhere in this schema.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh on every UPDATE.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one row per Supabase Auth user. is_admin gates the admin reads
-- in 0002_rls.sql. A user is an admin only when an existing admin flips
-- this flag; it is never settable by the user themselves (see RLS).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- templates — the 6 launch themes (seeded in supabase/seed.sql).
-- id is the stable text slug (e.g. 'champagne-elegance') used by the app.
-- composition is the art-direction key (see src/lib/templates.ts);
-- access_code is the theme's FIXED public code from the Etsy delivery
-- PDF — it only gates site creation, never access to an existing site.
-- ---------------------------------------------------------------------------
create table if not exists public.templates (
  id text primary key,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  price_usd numeric(10, 2) not null default 0 check (price_usd >= 0),
  etsy_listing_id text,
  active boolean not null default true,
  palette jsonb not null default '{}'::jsonb,
  font_class text not null default '',
  layout text not null default '',
  composition text not null default 'classic',
  access_code text not null default '',
  sections text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
  before update on public.templates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- template_sections — the named sections a template offers, in order.
-- ---------------------------------------------------------------------------
create table if not exists public.template_sections (
  id uuid primary key default gen_random_uuid(),
  template_id text not null references public.templates (id) on delete cascade,
  key text not null,
  title text not null,
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, key)
);
create index if not exists template_sections_template_id_idx
  on public.template_sections (template_id);
drop trigger if exists template_sections_set_updated_at on public.template_sections;
create trigger template_sections_set_updated_at
  before update on public.template_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- wedding_sites — one row per purchased wedding website.
-- slug is the public URL key and must be unique. template_snapshot freezes
-- the template config at purchase time so later template edits never
-- silently change a customer's live site. RESTRICT on template_id: a
-- template in use by a site cannot be deleted.
-- ---------------------------------------------------------------------------
create table if not exists public.wedding_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  template_id text not null references public.templates (id) on delete restrict,
  owner_id uuid references public.profiles (id) on delete set null,
  owner_name text not null,
  owner_email text not null,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished', 'suspended', 'archived')),
  wedding_date timestamptz,
  timezone text not null default 'America/New_York',
  template_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists wedding_sites_owner_id_idx on public.wedding_sites (owner_id);
create index if not exists wedding_sites_status_idx on public.wedding_sites (status);
drop trigger if exists wedding_sites_set_updated_at on public.wedding_sites;
create trigger wedding_sites_set_updated_at
  before update on public.wedding_sites
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_content — the editable copy of a site (one row per site).
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.wedding_sites (id) on delete cascade,
  partner_a text not null default '',
  partner_b text not null default '',
  subtitle text not null default '',
  welcome text not null default '',
  story text not null default '',
  dress_code text not null default '',
  footer_message text not null default '',
  hero_image text not null default '',
  venue_name text not null default '',
  venue_address text not null default '',
  map_link text not null default '',
  post_wedding_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_content_site_id_idx on public.site_content (site_id);
drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_designs — colours, fonts and gallery layout (one row per site).
-- ---------------------------------------------------------------------------
create table if not exists public.site_designs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.wedding_sites (id) on delete cascade,
  primary_color text not null default '#1c1917',
  accent_color text not null default '#8a6d3b',
  background_color text not null default '#fdfbf7',
  heading_font text not null default 'Georgia, serif',
  body_font text not null default 'system-ui, sans-serif',
  gallery_layout text not null default 'grid'
    check (gallery_layout in ('grid', 'masonry', 'carousel')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_designs_site_id_idx on public.site_designs (site_id);
drop trigger if exists site_designs_set_updated_at on public.site_designs;
create trigger site_designs_set_updated_at
  before update on public.site_designs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- events — ceremony / reception / brunch etc. (many per site).
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  name text not null,
  event_date date,
  event_time text not null default '',
  venue text not null default '',
  address text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_site_id_idx on public.events (site_id);
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- media — gallery images (and future video) for a site.
-- ---------------------------------------------------------------------------
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  url text not null,
  caption text not null default '',
  kind text not null default 'image' check (kind in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists media_site_id_idx on public.media (site_id);
drop trigger if exists media_set_updated_at on public.media;
create trigger media_set_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- rsvp_questions — the site owner's custom RSVP questions.
-- ---------------------------------------------------------------------------
create table if not exists public.rsvp_questions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  label text not null,
  type text not null default 'text' check (type in ('text', 'choice')),
  required boolean not null default false,
  options text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists rsvp_questions_site_id_idx on public.rsvp_questions (site_id);
drop trigger if exists rsvp_questions_set_updated_at on public.rsvp_questions;
create trigger rsvp_questions_set_updated_at
  before update on public.rsvp_questions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- rsvp_responses — guest RSVPs. update_token is the secret a guest uses to
-- edit their own response; it is a random token, never a password, and it
-- is unique so a token can never resolve to another guest's record.
-- ---------------------------------------------------------------------------
create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  guest_name text not null,
  email text not null default '',
  phone text not null default '',
  attending boolean not null default true,
  guest_count integer not null default 1
    check (guest_count >= 0 and guest_count <= 10),
  dietary text not null default '',
  allergies text not null default '',
  message text not null default '',
  answers jsonb not null default '{}'::jsonb,
  update_token text not null unique,
  status text not null default 'attending'
    check (status in ('attending', 'declined', 'updated')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Declining guests bring nobody; attending guests bring at least one.
  check ((attending = false and guest_count = 0) or (attending = true and guest_count >= 1))
);
create index if not exists rsvp_responses_site_id_idx on public.rsvp_responses (site_id);
create index if not exists rsvp_responses_update_token_idx on public.rsvp_responses (update_token);
drop trigger if exists rsvp_responses_set_updated_at on public.rsvp_responses;
create trigger rsvp_responses_set_updated_at
  before update on public.rsvp_responses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- guest_lists — the owner's guest list; rsvp_id links a guest to their
-- response when one exists (SET NULL keeps the guest if the RSVP is deleted).
-- ---------------------------------------------------------------------------
create table if not exists public.guest_lists (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  notes text not null default '',
  rsvp_id uuid references public.rsvp_responses (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists guest_lists_site_id_idx on public.guest_lists (site_id);
create index if not exists guest_lists_rsvp_id_idx on public.guest_lists (rsvp_id);
drop trigger if exists guest_lists_set_updated_at on public.guest_lists;
create trigger guest_lists_set_updated_at
  before update on public.guest_lists
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- etsy_orders — one row per Etsy purchase. RESTRICT on template_id: an
-- order must never vanish because its template was deleted, and a template
-- with orders cannot be deleted. site_id is SET NULL (not CASCADE) so
-- deleting a site never deletes the order that paid for it.
-- ---------------------------------------------------------------------------
create table if not exists public.etsy_orders (
  id uuid primary key default gen_random_uuid(),
  etsy_order_id text not null unique,
  etsy_listing_id text,
  customer_name text not null,
  customer_email text not null,
  template_id text not null references public.templates (id) on delete restrict,
  purchase_date timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'provisioned', 'delivered', 'refunded', 'cancelled', 'disputed')),
  site_id uuid references public.wedding_sites (id) on delete set null,
  access_code_id uuid,
  delivery_status text not null default 'not-started'
    check (delivery_status in ('not-started', 'pdf-ready', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists etsy_orders_site_id_idx on public.etsy_orders (site_id);
create index if not exists etsy_orders_customer_email_idx on public.etsy_orders (customer_email);
drop trigger if exists etsy_orders_set_updated_at on public.etsy_orders;
create trigger etsy_orders_set_updated_at
  before update on public.etsy_orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- access_codes — HASH ONLY. code_hash is the SHA-256 hex of the code; the
-- plain code exists only in the one-time delivery PDF / admin screen and is
-- never stored. One code per order (unique order_id). Deleting the order
-- deletes its code; deleting a site deletes its code.
-- ---------------------------------------------------------------------------
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.etsy_orders (id) on delete cascade,
  site_id uuid not null references public.wedding_sites (id) on delete cascade,
  code_hash text not null,
  status text not null default 'active'
    check (status in ('active', 'used', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  expires_at timestamptz
);
create index if not exists access_codes_site_id_idx on public.access_codes (site_id);

-- The orders table references access_codes; add that FK now that both exist.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'etsy_orders_access_code_id_fkey'
  ) then
    alter table public.etsy_orders
      add constraint etsy_orders_access_code_id_fkey
      foreign key (access_code_id) references public.access_codes (id)
      on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- site_passwords — guest password for a password-protected site, hash only.
-- ---------------------------------------------------------------------------
create table if not exists public.site_passwords (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.wedding_sites (id) on delete cascade,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_passwords_site_id_idx on public.site_passwords (site_id);
drop trigger if exists site_passwords_set_updated_at on public.site_passwords;
create trigger site_passwords_set_updated_at
  before update on public.site_passwords
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_settings — RSVP window, countdown, password flag, section toggles.
-- rsvp_deadline is stored as ISO UTC (timestamptz); the API enforces it
-- server-side against Date.now() — never client-only.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null unique references public.wedding_sites (id) on delete cascade,
  password_enabled boolean not null default false,
  rsvp_enabled boolean not null default true,
  rsvp_deadline timestamptz,
  timezone text not null default 'America/New_York',
  countdown_enabled boolean not null default true,
  countdown_style text not null default 'classic'
    check (countdown_style in ('classic', 'minimal', 'bold')),
  show_story boolean not null default true,
  show_gallery boolean not null default true,
  show_events boolean not null default true,
  show_dress_code boolean not null default true,
  show_countdown boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_settings_site_id_idx on public.site_settings (site_id);
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- audit_logs — append-only admin/audit trail.
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  detail text not null default '',
  site_id uuid references public.wedding_sites (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_site_id_idx on public.audit_logs (site_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
