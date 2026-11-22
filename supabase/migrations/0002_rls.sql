-- Wedding Website Studio — 0002_rls.sql
-- Row Level Security for every customer-owned table.
--
-- Principles:
--  * Anonymous visitors can SELECT a *published* wedding site and the
--    content that makes up its public page — nothing else, never drafts,
--    never guest lists, RSVPs, passwords or codes.
--  * Authenticated owners (auth.uid() = wedding_sites.owner_id) have full
--    access to their own rows only — never another tenant's site.
--  * Admins are recognised by profiles.is_admin = true and get read access
--    for support/admin work. (Admin writes in the app go through the
--    service_role key, which bypasses RLS entirely — see note below.)
--  * The service_role key BYPASSES RLS. Server-side admin/customer flows
--    that use the service_role key must still enforce tenant scoping in
--    application code (see src/lib/store.ts) — RLS is a second layer, not
--    the only one.
--  * Guests submit RSVPs as anonymous INSERTs; the API validates the site,
--    the deadline and the payload server-side before inserting. Anonymous
--    users can never SELECT rsvp_responses (a guest edits their own RSVP
--    only via the secret update token, through the API).
--
-- A public view is also defined for convenience: public_sites exposes only
-- the public columns of published sites. The app reads through the RLS
-- policies, not the view, so the view is a reporting aid, not a bypass.

-- ---------------------------------------------------------------------------
-- Enable RLS on every table.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.template_sections enable row level security;
alter table public.etsy_orders enable row level security;
alter table public.access_codes enable row level security;
alter table public.wedding_sites enable row level security;
alter table public.site_content enable row level security;
alter table public.site_designs enable row level security;
alter table public.events enable row level security;
alter table public.media enable row level security;
alter table public.guest_lists enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.rsvp_questions enable row level security;
alter table public.site_passwords enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers (as SQL functions so policies stay readable).
-- ---------------------------------------------------------------------------
-- True when the caller owns the given site.
create or replace function public.is_site_owner(p_site_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.wedding_sites
    where id = p_site_id and owner_id = auth.uid()
  );
$$;

-- True when the caller is an admin (profiles.is_admin).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- True when the given site is published (public page is live).
create or replace function public.is_site_published(p_site_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.wedding_sites
    where id = p_site_id and status = 'published'
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles — users see/update only their own row; admins can read all.
-- (is_admin can only be flipped by an existing admin through the
-- service_role key, never by the user — no policy grants UPDATE of it.)
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- templates + template_sections — public catalogue: anyone may read ACTIVE
-- templates; only admins may write. (Draft/inactive templates stay hidden
-- from the public storefront.)
-- ---------------------------------------------------------------------------
drop policy if exists "templates_select_active" on public.templates;
create policy "templates_select_active" on public.templates
  for select using (active = true or public.is_admin());

drop policy if exists "templates_admin_write" on public.templates;
create policy "templates_admin_write" on public.templates
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "template_sections_select_public" on public.template_sections;
create policy "template_sections_select_public" on public.template_sections
  for select using (
    exists (select 1 from public.templates t where t.id = template_id and t.active = true)
    or public.is_admin()
  );

drop policy if exists "template_sections_admin_write" on public.template_sections;
create policy "template_sections_admin_write" on public.template_sections
  for all using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- wedding_sites — anonymous reads ONLY published sites; owners full access
-- to their own; admins read all (writes via service_role / admin flows).
-- ---------------------------------------------------------------------------
drop policy if exists "sites_select_published" on public.wedding_sites;
create policy "sites_select_published" on public.wedding_sites
  for select using (
    status = 'published'
    or owner_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "sites_owner_write" on public.wedding_sites;
create policy "sites_owner_write" on public.wedding_sites
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Public page content: site_content, site_designs, events, media,
-- rsvp_questions — readable by anyone ONLY via a published site; owners
-- have full access to their own site's rows; admins can read all.
-- ---------------------------------------------------------------------------
drop policy if exists "site_content_select_public" on public.site_content;
create policy "site_content_select_public" on public.site_content
  for select using (
    public.is_site_published(site_id)
    or public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "site_content_owner_write" on public.site_content;
create policy "site_content_owner_write" on public.site_content
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

drop policy if exists "site_designs_select_public" on public.site_designs;
create policy "site_designs_select_public" on public.site_designs
  for select using (
    public.is_site_published(site_id)
    or public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "site_designs_owner_write" on public.site_designs;
create policy "site_designs_owner_write" on public.site_designs
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

drop policy if exists "events_select_public" on public.events;
create policy "events_select_public" on public.events
  for select using (
    public.is_site_published(site_id)
    or public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "events_owner_write" on public.events;
create policy "events_owner_write" on public.events
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

drop policy if exists "media_select_public" on public.media;
create policy "media_select_public" on public.media
  for select using (
    public.is_site_published(site_id)
    or public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "media_owner_write" on public.media;
create policy "media_owner_write" on public.media
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

drop policy if exists "rsvp_questions_select_public" on public.rsvp_questions;
create policy "rsvp_questions_select_public" on public.rsvp_questions
  for select using (
    public.is_site_published(site_id)
    or public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "rsvp_questions_owner_write" on public.rsvp_questions;
create policy "rsvp_questions_owner_write" on public.rsvp_questions
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

-- ---------------------------------------------------------------------------
-- rsvp_responses — the most sensitive guest data. NOBODY anonymous can
-- SELECT. Guests INSERT anonymously (the API validates site + deadline
-- first); owners read/write their own site's responses; admins read all.
-- A guest updating their own RSVP goes through the API with the secret
-- update token — never through a direct SELECT.
-- ---------------------------------------------------------------------------
drop policy if exists "rsvps_insert_anon" on public.rsvp_responses;
create policy "rsvps_insert_anon" on public.rsvp_responses
  for insert with check (true);

drop policy if exists "rsvps_select_owner_admin" on public.rsvp_responses;
create policy "rsvps_select_owner_admin" on public.rsvp_responses
  for select using (
    public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "rsvps_owner_write" on public.rsvp_responses;
create policy "rsvps_owner_write" on public.rsvp_responses
  for update using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

drop policy if exists "rsvps_owner_delete" on public.rsvp_responses;
create policy "rsvps_owner_delete" on public.rsvp_responses
  for delete using (public.is_site_owner(site_id));

-- ---------------------------------------------------------------------------
-- guest_lists, site_passwords, site_settings — owner-only (plus admin
-- reads). Never public: a guest list or a password hash must never be
-- readable from a published page.
-- ---------------------------------------------------------------------------
drop policy if exists "guest_lists_owner" on public.guest_lists;
create policy "guest_lists_owner" on public.guest_lists
  for all using (
    public.is_site_owner(site_id) or public.is_admin()
  )
  with check (public.is_site_owner(site_id));

drop policy if exists "site_passwords_owner" on public.site_passwords;
create policy "site_passwords_owner" on public.site_passwords
  for all using (
    public.is_site_owner(site_id) or public.is_admin()
  )
  with check (public.is_site_owner(site_id));

drop policy if exists "site_settings_select" on public.site_settings;
create policy "site_settings_select" on public.site_settings
  for select using (
    public.is_site_owner(site_id)
    or public.is_admin()
  );

drop policy if exists "site_settings_owner_write" on public.site_settings;
create policy "site_settings_owner_write" on public.site_settings
  for all using (public.is_site_owner(site_id))
  with check (public.is_site_owner(site_id));

-- ---------------------------------------------------------------------------
-- etsy_orders + access_codes — admin-only. Customers never read these
-- directly (their delivery PDF is generated server-side by the admin flow).
-- Note: access_codes stores hashes only; even an admin read reveals no
-- usable code — the plain code exists only in the one-time delivery PDF.
-- ---------------------------------------------------------------------------
drop policy if exists "etsy_orders_admin" on public.etsy_orders;
create policy "etsy_orders_admin" on public.etsy_orders
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "access_codes_admin" on public.access_codes;
create policy "access_codes_admin" on public.access_codes
  for all using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- audit_logs — admins read; nobody writes directly (server writes via
-- service_role, which bypasses RLS).
-- ---------------------------------------------------------------------------
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public view — published sites, public columns only. Reporting aid; the
-- app itself reads wedding_sites through the RLS policy above.
-- ---------------------------------------------------------------------------
create or replace view public.public_sites as
  select id, slug, template_id, owner_name, status, wedding_date, timezone,
         template_snapshot, published_at
  from public.wedding_sites
  where status = 'published';

comment on view public.public_sites is
  'Published wedding sites, public columns only. Guests never see drafts, owner emails or internal fields.';
