// Neon-backed store (production mode).
// Same exported signatures as src/lib/store-local.ts; src/lib/store.ts
// delegates here whenever DATABASE_URL is set, otherwise to the local
// in-memory store. Every row stores the full app object as JSONB plus
// indexed scalar columns (slug unique, status, template_id) — see
// supabase/migrations/0003_neon.sql for the schema.
//
// The 6 launch themes still live in code (src/lib/templates.ts); the
// wedding.templates table holds ONLY admin-created templates, and a DB
// row with the same id overlays the code version (matching the local
// store, where saveTemplate upserts into a list seeded from code).
//
// Tenant isolation is enforced in code by siteId scoping, exactly as in
// the local store — there is no Supabase Auth / RLS on Neon.

import type {
  AuditLog,
  RsvpResponse,
  TemplateMeta,
  WeddingSite,
} from "./types";
import { TEMPLATES } from "./templates";
import { royalBurgundySeed, sacredGardenSeed } from "./template-seeds";
import { sha256 } from "./auth";
import { neonQuery } from "./neon";

/** The /sql endpoint returns jsonb as a parsed object or a string. */
function fromJsonb<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

/** Fresh copy — JSONB round-trips already detach, but parse/stringify
 *  keeps the copy semantics of the local store explicit. */
function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// --- Templates ---
async function mergedTemplates(): Promise<TemplateMeta[]> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.templates",
  );
  const byId = new Map<string, TemplateMeta>();
  for (const t of TEMPLATES) byId.set(t.id, { ...t });
  for (const row of rows) {
    const t = fromJsonb<TemplateMeta>(row.data);
    byId.set(t.id, t);
  }
  return [...byId.values()];
}

export async function listTemplates(): Promise<TemplateMeta[]> {
  return mergedTemplates();
}

export async function getTemplateById(id: string): Promise<TemplateMeta | null> {
  const templates = await mergedTemplates();
  return templates.find((t) => t.id === id) || null;
}

export async function saveTemplate(t: TemplateMeta): Promise<void> {
  await neonQuery(
    `insert into wedding.templates (id, data, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (id) do update set data = excluded.data, updated_at = now()`,
    [t.id, JSON.stringify(t)],
  );
  await audit("admin", "template.save", `Template ${t.id} saved.`);
}

export async function findTemplateByAccessCodeHash(
  codeHash: string,
): Promise<TemplateMeta | null> {
  const templates = await mergedTemplates();
  return (
    templates.find(
      (t) =>
        typeof t.accessCode === "string" &&
        t.accessCode.length > 0 &&
        sha256(t.accessCode) === codeHash,
    ) || null
  );
}

// --- Sites ---
export async function listSites(): Promise<WeddingSite[]> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.sites order by created_at asc",
  );
  return rows.map((r) => fromJsonb<WeddingSite>(r.data));
}

export async function getSiteById(id: string): Promise<WeddingSite | null> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.sites where id = $1",
    [id],
  );
  return rows.length ? fromJsonb<WeddingSite>(rows[0].data) : null;
}

export async function getSiteBySlug(slug: string): Promise<WeddingSite | null> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.sites where slug = $1",
    [slug],
  );
  return rows.length ? fromJsonb<WeddingSite>(rows[0].data) : null;
}

/** Public view: only published sites, only public fields. */
export async function getPublicSite(slug: string): Promise<WeddingSite | null> {
  const site = await getSiteBySlug(slug);
  if (!site || site.status !== "published") return null;
  return site;
}

async function upsertSite(site: WeddingSite): Promise<void> {
  await neonQuery(
    `insert into wedding.sites (id, slug, template_id, status, data, published_at)
     values ($1, $2, $3, $4, $5::jsonb, $6::timestamptz)
     on conflict (id) do update set
       slug = excluded.slug,
       template_id = excluded.template_id,
       status = excluded.status,
       data = excluded.data,
       updated_at = now(),
       published_at = excluded.published_at`,
    [
      site.id,
      site.slug,
      site.templateId,
      site.status,
      JSON.stringify(site),
      site.publishedAt,
    ],
  );
}

export async function saveSite(site: WeddingSite): Promise<void> {
  site.updatedAt = new Date().toISOString();
  await upsertSite(site);
}

export async function setSiteStatus(
  id: string,
  status: WeddingSite["status"],
): Promise<void> {
  const site = await getSiteById(id);
  if (!site) return;
  site.status = status;
  if (status === "published") site.publishedAt = new Date().toISOString();
  await saveSite(site);
  await audit("admin", "site.status", `Site ${site.slug} → ${status}.`);
}

async function slugTaken(slug: string): Promise<boolean> {
  const rows = await neonQuery<{ one: number }>(
    "select 1 as one from wedding.sites where slug = $1 limit 1",
    [slug],
  );
  return rows.length > 0;
}

/**
 * Create a BRAND-NEW private site from a template, for one buyer.
 * Same construction and slug-dedup rules as the local store; the unique
 * index on wedding.sites.slug is the backstop — on a race collision the
 * insert fails with a duplicate-key error and we retry with the next
 * suffix instead of surfacing the error to the buyer.
 */
export async function createSiteFromTemplate(
  template: TemplateMeta,
  partnerA: string,
  partnerB: string,
): Promise<WeddingSite> {
  const ownerName = `${partnerA} & ${partnerB}`;

  const slugBase =
    ownerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "wedding";
  let slug = slugBase;
  let n = 2;
  while (await slugTaken(slug)) slug = `${slugBase}-${n++}`;

  const now = new Date().toISOString();
  const site: WeddingSite = {
    id: `site-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    templateId: template.id,
    templateSnapshot: { ...template },
    ownerName,
    ownerEmail: "",
    status: "draft",
    weddingDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: "America/New_York",
    content: {
      partnerA,
      partnerB,
      subtitle: "Together with their families",
      welcome: "Welcome to our wedding website! We cannot wait to celebrate with you.",
      invitationText: `Together with their families, ${partnerA} and ${partnerB} request the honour of your presence at their wedding celebration.`,
      story: "Our story begins here — edit this text in your editor.",
      dressCode: "Semi-formal.",
      footerMessage: "Thank you for being part of our day.",
      heroImage: template.heroImage ?? "https://picsum.photos/seed/wedding-hero/1600/1000",
      venueName: "Venue to be confirmed",
      venueAddress: "",
      mapLink: "",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
      details: [
        {
          id: "d-venue",
          kind: "venue",
          title: "The venue",
          body: "Venue details go here — add the address and directions in the editor.",
          hidden: false,
        },
        {
          id: "d-dress",
          kind: "dress",
          title: "Dress code",
          body: "Semi-formal.",
          hidden: false,
        },
      ],
      faqs: [],
    },
    design: {
      primary: template.palette.ink,
      accent: template.palette.accent,
      background: template.palette.bg,
      headingFont: "Georgia, serif",
      bodyFont: "system-ui, sans-serif",
      galleryLayout: "grid",
    },
    events: [],
    gallery: [],
    customQuestions: [],
    settings: {
      passwordEnabled: false,
      passwordHash: null,
      rsvpEnabled: true,
      rsvpDeadline: null,
      timezone: "America/New_York",
      countdownEnabled: true,
      countdownStyle: "classic",
      showStory: true,
      showGallery: true,
      showEvents: true,
      showDressCode: true,
      showCountdown: true,
      showInvitation: true,
      showDetails: true,
      showFaq: true,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };

  // THE SACRED GARDEN: seed the activation from the shared template
  // seed (src/lib/template-seeds.ts) — the same sample schedule,
  // gift text and venue the template preview shows. Without this,
  // buyer sites start with empty events and no tagline/gift/venue,
  // so those sections never render. The gallery is deliberately NOT
  // seeded: its 10 photos are a fictional couple's preview assets
  // and must never land on a real buyer's site — the buyer uploads
  // their own photos in the editor, and the gallery appears then.
  // Other templates keep their generic defaults.
  if (template.composition === "sacred-garden") {
    const seed = sacredGardenSeed(site.weddingDate.slice(0, 10));
    site.content = { ...site.content, ...seed.content };
    site.events = seed.events;
  }

  // ROYAL BURGUNDY: same pattern — seed the activation from the
  // shared template seed (the 5-event schedule, dress code, meal
  // menu, venue + the 2 accommodations, travel + registry notes).
  // The gallery is deliberately NOT seeded (preview-only, same
  // rule as Sacred Garden — a fictional couple's photos must never
  // land on a real buyer's site).
  if (template.composition === "royal-burgundy") {
    const seed = royalBurgundySeed(site.weddingDate.slice(0, 10));
    site.content = { ...site.content, ...seed.content };
    site.events = seed.events;
    site.content.details = seed.details;
  }

  // Insert with a slug-collision retry (unique index backstop).
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await neonQuery(
        `insert into wedding.sites (id, slug, template_id, status, data, published_at)
         values ($1, $2, $3, $4, $5::jsonb, $6::timestamptz)`,
        [site.id, site.slug, site.templateId, site.status, JSON.stringify(site), null],
      );
      break;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate key") && attempt < 9) {
        site.slug = `${slugBase}-${n++}`;
        site.updatedAt = new Date().toISOString();
        continue;
      }
      throw err;
    }
  }

  await audit(
    "system",
    "site.create",
    `New site /w/${site.slug} created from template ${template.name} (${template.id}).`,
  );
  return site;
}

// --- RSVPs (tenant-scoped) ---
export async function listRsvps(siteId: string): Promise<RsvpResponse[]> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.rsvps where site_id = $1 order by submitted_at asc",
    [siteId],
  );
  return rows.map((r) => fromJsonb<RsvpResponse>(r.data));
}

export async function getRsvpByToken(token: string): Promise<RsvpResponse | null> {
  const rows = await neonQuery<{ data: unknown }>(
    "select data from wedding.rsvps where update_token = $1",
    [token],
  );
  return rows.length ? fromJsonb<RsvpResponse>(rows[0].data) : null;
}

export async function saveRsvp(r: RsvpResponse): Promise<void> {
  await neonQuery(
    `insert into wedding.rsvps (id, site_id, update_token, data, updated_at)
     values ($1, $2, $3, $4::jsonb, now())
     on conflict (id) do update set
       site_id = excluded.site_id,
       update_token = excluded.update_token,
       data = excluded.data,
       updated_at = now()`,
    [r.id, r.siteId, r.updateToken, JSON.stringify(r)],
  );
}

export async function deleteRsvp(id: string, siteId: string): Promise<void> {
  await neonQuery(
    "delete from wedding.rsvps where id = $1 and site_id = $2",
    [id, siteId],
  );
}

// --- Audit ---
const MAX_AUDIT_ENTRIES = 500;

export async function audit(
  actor: string,
  action: string,
  detail: string,
): Promise<void> {
  const id = `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await neonQuery(
    `insert into wedding.audit_logs (id, actor, action, detail)
     values ($1, $2, $3, $4)`,
    [id, actor, action, detail],
  );
  // Cap the log so it cannot grow without bound (listAudit only ever
  // returns the first 100). Best-effort: a trim failure must never fail
  // the caller's operation.
  try {
    await neonQuery(
      `delete from wedding.audit_logs
       where id not in (
         select id from wedding.audit_logs
         order by created_at desc, id desc limit $1
       )`,
      [MAX_AUDIT_ENTRIES],
    );
  } catch {
    // Ignore trim failures.
  }
}

export async function listAudit(): Promise<AuditLog[]> {
  const rows = await neonQuery<{
    id: string;
    actor: string;
    action: string;
    detail: string;
    created_at: string;
  }>(
    `select id, actor, action, detail, created_at
     from wedding.audit_logs order by created_at desc, id desc limit 100`,
  );
  return rows.map((r) => ({
    id: r.id,
    actor: r.actor,
    action: r.action,
    detail: r.detail,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

// --- Stats for admin overview ---
export async function getStats() {
  const rows = await neonQuery<{
    total_sites: string | number;
    published_sites: string | number;
    draft_sites: string | number;
    suspended_sites: string | number;
    total_rsvps: string | number;
    attending_count: string | number;
    declined_count: string | number;
    total_attendees: string | number;
  }>(
    `select
       (select count(*) from wedding.sites) as total_sites,
       (select count(*) from wedding.sites where status = 'published') as published_sites,
       (select count(*) from wedding.sites where status in ('draft', 'unpublished')) as draft_sites,
       (select count(*) from wedding.sites where status = 'suspended') as suspended_sites,
       (select count(*) from wedding.rsvps) as total_rsvps,
       (select count(*) from wedding.rsvps where (data->>'attending')::boolean) as attending_count,
       (select count(*) from wedding.rsvps where not (data->>'attending')::boolean) as declined_count,
       (select coalesce(sum((data->>'guestCount')::int), 0) from wedding.rsvps where (data->>'attending')::boolean) as total_attendees`,
  );
  const r = rows[0] ?? {
    total_sites: 0,
    published_sites: 0,
    draft_sites: 0,
    suspended_sites: 0,
    total_rsvps: 0,
    attending_count: 0,
    declined_count: 0,
    total_attendees: 0,
  };
  return {
    totalSites: Number(r.total_sites),
    publishedSites: Number(r.published_sites),
    draftSites: Number(r.draft_sites),
    suspendedSites: Number(r.suspended_sites),
    totalRsvps: Number(r.total_rsvps),
    attendingCount: Number(r.attending_count),
    declinedCount: Number(r.declined_count),
    totalAttendees: Number(r.total_attendees),
  };
}
