// Server-side store — switch between backends.
// DATABASE_URL set → Neon Postgres (src/lib/store-neon.ts, schema in
// supabase/migrations/0003_neon.sql). DATABASE_URL unset → in-memory
// local store (src/lib/store-local.ts, lost on redeploy / cold start).
// Every exported function keeps the exact signature the local store had,
// so no caller changes. The choice is made per call from the env, so a
// redeploy that adds DATABASE_URL takes effect without code changes.
//
// Delivery model (unchanged): one FIXED access code per template
// (TemplateMeta.accessCode, baked into source). Activating a code creates
// a brand-new private site per buyer. No per-order provisioning, no mail.

import type {
  AuditLog,
  RsvpResponse,
  TemplateMeta,
  WeddingSite,
} from "./types";
import * as local from "./store-local";
import * as neon from "./store-neon";

const useNeon = () => Boolean(process.env.DATABASE_URL);

export const isLocalStore = () => !useNeon();

// --- Templates ---
export async function listTemplates(): Promise<TemplateMeta[]> {
  return useNeon() ? neon.listTemplates() : local.listTemplates();
}

export async function getTemplateById(id: string): Promise<TemplateMeta | null> {
  return useNeon() ? neon.getTemplateById(id) : local.getTemplateById(id);
}

export async function saveTemplate(t: TemplateMeta): Promise<void> {
  return useNeon() ? neon.saveTemplate(t) : local.saveTemplate(t);
}

export async function findTemplateByAccessCodeHash(
  codeHash: string,
): Promise<TemplateMeta | null> {
  return useNeon()
    ? neon.findTemplateByAccessCodeHash(codeHash)
    : local.findTemplateByAccessCodeHash(codeHash);
}

// --- Sites ---
export async function listSites(): Promise<WeddingSite[]> {
  return useNeon() ? neon.listSites() : local.listSites();
}

export async function getSiteById(id: string): Promise<WeddingSite | null> {
  return useNeon() ? neon.getSiteById(id) : local.getSiteById(id);
}

export async function getSiteBySlug(slug: string): Promise<WeddingSite | null> {
  return useNeon() ? neon.getSiteBySlug(slug) : local.getSiteBySlug(slug);
}

export async function getPublicSite(slug: string): Promise<WeddingSite | null> {
  return useNeon() ? neon.getPublicSite(slug) : local.getPublicSite(slug);
}

export async function saveSite(site: WeddingSite): Promise<void> {
  return useNeon() ? neon.saveSite(site) : local.saveSite(site);
}

export async function setSiteStatus(
  id: string,
  status: WeddingSite["status"],
): Promise<void> {
  return useNeon() ? neon.setSiteStatus(id, status) : local.setSiteStatus(id, status);
}

export async function createSiteFromTemplate(
  template: TemplateMeta,
  partnerA: string,
  partnerB: string,
): Promise<WeddingSite> {
  return useNeon()
    ? neon.createSiteFromTemplate(template, partnerA, partnerB)
    : local.createSiteFromTemplate(template, partnerA, partnerB);
}

// --- RSVPs (tenant-scoped) ---
export async function listRsvps(siteId: string): Promise<RsvpResponse[]> {
  return useNeon() ? neon.listRsvps(siteId) : local.listRsvps(siteId);
}

export async function getRsvpByToken(token: string): Promise<RsvpResponse | null> {
  return useNeon() ? neon.getRsvpByToken(token) : local.getRsvpByToken(token);
}

export async function saveRsvp(r: RsvpResponse): Promise<void> {
  return useNeon() ? neon.saveRsvp(r) : local.saveRsvp(r);
}

export async function deleteRsvp(id: string, siteId: string): Promise<void> {
  return useNeon() ? neon.deleteRsvp(id, siteId) : local.deleteRsvp(id, siteId);
}

// --- Audit ---
// Sync by contract (callers never await it). On Neon the insert is
// fire-and-forget; the audit trail is non-critical, so a dropped write
// must never fail a caller's operation. The internal call sites in the
// Neon implementation await the insert directly.
export function audit(actor: string, action: string, detail: string): void {
  if (useNeon()) {
    void neon.audit(actor, action, detail).catch(() => {});
  } else {
    local.audit(actor, action, detail);
  }
}

export async function listAudit(): Promise<AuditLog[]> {
  return useNeon() ? neon.listAudit() : local.listAudit();
}

// --- Stats for admin overview ---
export async function getStats() {
  return useNeon() ? neon.getStats() : local.getStats();
}
