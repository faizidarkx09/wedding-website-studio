// The Sacred Garden design tokens + small shared helpers.
// Palette is the audit's exact set (rea-runs/sacred-garden/
// DESIGN_SYSTEM.md §3.1); the four template-palette colours
// (bg/ink/accent/accentSoft) also live in templates.ts so the Studio's
// design-tab overrides keep working — tokens here only ADD the extra
// Sacred Garden tones (cream, beige, burgundy, bronze, taupe).
import type { WeddingSite } from "@/lib/types";

export const SACRED = {
  cream: "#F9F0E0",
  lighterCream: "#F6F1E8",
  beige: "#E8DDCF",
  gold: "#A67D2B",
  goldAlt: "#A07B33",
  countdownGold: "#B48C3D",
  brown: "#6C513F",
  welcomeBrown: "#6A5140",
  burgundy: "#5A0F1B",
  bronze: "rgba(140,100,60,0.75)",
  bronzeChevron: "rgba(140,100,60,0.6)",
  taupe: "#846F61",
  white: "#FFFFFF",
} as const;

/** The envelope artwork — the AI-generated ivory envelope with the
 * embossed florals and burgundy wax seal. The gold "A&B" monogram is
 * baked into the image, but it is NEVER shown as-is: the envelope
 * component covers it with a burgundy disc carrying the couple's LIVE
 * initials (initials(site)), so the seal reads correctly for any
 * couple. */
export const ENVELOPE_IMAGE_URL = "/images/themes/sacred-garden-detail.jpg";

/** Default background-music track (CC0, verified — "Romantic
 * Inspiration" by Rafael Krux, FreePD, CC0 1.0 Public Domain
 * Dedication). Shared with ÉTERNEL: the file already ships in the
 * repo at public/audio/eternel-wedding-piano.mp3. Never the Einaudi
 * recording from the source site. The toggle hides itself if the
 * file is missing. */
export const DEFAULT_MUSIC_URL = "/audio/eternel-wedding-piano.mp3";

/** Server-side RSVP cap (matches POST /api/rsvp MAX_GUEST_COUNT). */
export const MAX_GUESTS_SERVER = 10;

/** Configured per-site guest cap (editor Settings tab), else server cap. */
export function maxGuests(site: WeddingSite): number {
  const configured = site.settings.rsvpMaxGuests;
  if (typeof configured === "number" && Number.isFinite(configured)) {
    return Math.min(MAX_GUESTS_SERVER, Math.max(1, Math.floor(configured)));
  }
  return MAX_GUESTS_SERVER;
}

/** Effective music URL: the couple's configured URL, else the default
 * template track. Empty string means "no music" (toggle hidden). */
export function musicUrl(site: WeddingSite): string {
  const configured = site.settings.musicUrl?.trim();
  if (configured) return configured;
  return DEFAULT_MUSIC_URL;
}

export function initials(site: WeddingSite): string {
  const a = site.content.partnerA.trim().charAt(0);
  const b = site.content.partnerB.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "W";
}

export function coupleNames(site: WeddingSite): string {
  return `${site.content.partnerA} & ${site.content.partnerB}`;
}

export function formatLongDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return new Date(dateIso).toLocaleDateString("en-US");
  }
}

export function formatShortDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return "";
  }
}

/** Dotted hero date (audit §2): "27.09.26" — DD.MM.YY, derived from
 * site.weddingDate, the SINGLE source of truth for the hero date AND
 * the countdown (this fixes the source site's date-conflict bug). */
export function formatDottedDate(dateIso: string, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).formatToParts(new Date(dateIso));
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")}.${get("month")}.${get("year")}`;
  } catch {
    return "";
  }
}

export function formatEventDate(date: string): string {
  const parsed = Date.parse(`${date}T12:00:00`);
  if (Number.isNaN(parsed)) return date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed));
}

/** Google Maps embed without an API key. */
export function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** Google Maps directions/search link (no API key). */
export function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function rsvpHref(site: WeddingSite): string {
  return site.slug.startsWith("preview-") ? "/activate" : `/w/${site.slug}/rsvp`;
}

export function isPreviewSite(site: WeddingSite): boolean {
  return site.slug.startsWith("preview-");
}

/** Does this section actually render? Sections with no content never
 * render — a dead anchor is worse than no link. */
export function willRenderSection(site: WeddingSite, key: string): boolean {
  switch (key) {
    case "welcome":
      // The welcome section renders whenever the couple has a tagline
      // or welcome text — the activation default is non-empty, and
      // clearing both in the editor hides the section.
      return (
        (site.content.tagline ?? "").trim().length > 0 ||
        (site.content.welcome ?? "").trim().length > 0
      );
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      return site.settings.showGallery === true && site.gallery.length > 0;
    case "countdown":
      return site.settings.showCountdown === true && site.settings.countdownEnabled === true;
    case "dress-code":
      return (
        site.settings.showDressCode === true &&
        (site.content.dressCode.trim().length > 0 ||
          (site.content.giftText ?? "").trim().length > 0)
      );
    case "rsvp":
      return site.settings.rsvpEnabled === true;
    default:
      return false;
  }
}
