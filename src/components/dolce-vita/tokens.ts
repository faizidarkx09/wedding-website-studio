// Dolce Vita design tokens + small shared helpers.
//
// This is a 1:1 port of the approved standalone site
// (~/workspace/dolcevita — live at https://dolce-vita-teal.vercel.app/):
// the same palette, fonts, copy values and interaction constants, only
// the couple names / date / venue are data-driven (Partner A / Partner
// B placeholders — never the standalone's demo couple). Palette and
// fonts are the audit's exact set (rea-runs/dolcevita/
// DESIGN_SYSTEM.md §3); the four template-palette colours
// (bg/ink/accent/accentSoft) also live in templates.ts so the Studio's
// design-tab overrides keep working — tokens here only ADD the extra
// Dolce Vita tones and the fixed asset paths.
import type { WeddingSite } from "@/lib/types";

export const DOLCE = {
  bg: "#FFFDFB",
  ink: "#3A3A3A",
  inkSoft: "#4A4A4A",
  blue: "#64A0BD",
  blueDeep: "#52839C",
  blueMist: "#7A9AAA",
  sky: "#9BC9E1",
  cream: "#F5EDE0",
  sand: "#F2E9DF",
  gold: "#D4C090",
  goldDeep: "#B89050",
  goldLight: "#E8D8A8",
  white: "#FFFFFF",
  // Flap tones (standalone styles.css .env-flap-*).
  flapTop: "#FBF7F0",
  flapRight: "#F6EFE3",
  flapBottom: "#FAF5EC",
  flapLeft: "#F3EAD9",
  // Dress-code swatches (audit §2 rec2442651113) — template-level,
  // never couple-editable.
  swatches: ["#7EBBFA", "#AFCFF1", "#F2CAC9", "#F5D9B1", "#FAF1DB"],
  // Scratch-tile coating gradient stops (standalone script.js
  // paintCoating) + confetti palette (audit §3.1).
  scratchGradient: ["#DCE8EE", "#C8D7DF", "#E3D3C4"],
  confetti: ["#C8AA78", "#DFC48E", "#EDE5CC", "#F5EDE0", "#1A1916", "#D4C090", "#B89050", "#E8D8A8"],
} as const;

/** Default background-music track (CC0, verified — "Romantic
 * Inspiration" by Rafael Krux, FreePD, CC0 1.0 Public Domain
 * Dedication). Shared with ÉTERNEL / The Sacred Garden: the file
 * already ships in the repo at public/audio/eternel-wedding-piano.mp3.
 * Never the Ryan Mack recording from the source site. The toggle
 * hides itself if the file is missing. */
export const DEFAULT_MUSIC_URL = "/audio/eternel-wedding-piano.mp3";

/** Fixed template artwork (Phase A — the standalone's original
 * AI-generated images, compressed progressive JPEG). The hero and
 * detail live at the template root; the rest under dolce-vita/. */
export const RSVP_HEADER_IMAGE_URL = "/images/themes/dolce-vita/rsvp-header.jpg";
export const CLOSING_IMAGE_URL = "/images/themes/dolce-vita/closing-01.jpg";
export const VENUE_IMAGE_URL = "/images/themes/dolce-vita/venue-01.jpg";

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

/** Day / Month / Year for the scratch-reveal tiles, derived from
 * site.weddingDate — the SINGLE source of truth for the hero date,
 * the scratch tiles AND the countdown. */
export function dateParts(
  dateIso: string,
  timezone: string,
): { day: string; month: string; year: string } {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(new Date(dateIso));
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return { day: get("day"), month: get("month"), year: get("year") };
  } catch {
    return { day: "", month: "", year: "" };
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

/** RSVP deadline line for the modal ("Please RSVP before …"): the
 * site's configured deadline when set, else 15 days before the
 * wedding — the standalone's own rule (14 Sep 2027 → 30 Aug). */
export function rsvpDeadlineLabel(site: WeddingSite): string {
  const configured = site.settings.rsvpDeadline
    ? Date.parse(site.settings.rsvpDeadline)
    : NaN;
  if (!Number.isNaN(configured)) {
    return formatShortDate(new Date(configured).toISOString(), site.timezone);
  }
  const weddingMs = Date.parse(site.weddingDate);
  if (Number.isNaN(weddingMs)) return "";
  return formatShortDate(
    new Date(weddingMs - 15 * 24 * 60 * 60 * 1000).toISOString(),
    site.timezone,
  );
}

/** Milestones with at least a title or text — empty rows never render. */
export function visibleMilestones(site: WeddingSite) {
  return (site.content.storyMilestones ?? []).filter(
    (m) => m.title.trim() || m.text.trim(),
  );
}

/** The site's own hero photo wins when the couple set one. Until then
 * (the default placeholder), use the theme's AI-generated hero image. */
export function resolveHeroSrc(site: WeddingSite): string {
  return !site.content.heroImage || site.content.heroImage.includes("picsum.photos")
    ? (site.templateSnapshot.heroImage ?? site.content.heroImage)
    : site.content.heroImage;
}

/** Does this section actually render? Sections with no content never
 * render — a dead anchor is worse than no link. */
export function willRenderSection(site: WeddingSite, key: string): boolean {
  switch (key) {
    case "welcome":
      return (site.content.welcome ?? "").trim().length > 0;
    case "story":
      return site.settings.showStory === true;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      return site.settings.showGallery === true && site.gallery.length > 0;
    case "countdown":
      return site.settings.showCountdown === true && site.settings.countdownEnabled === true;
    case "dress-code":
      return site.settings.showDressCode === true && site.content.dressCode.trim().length > 0;
    case "rsvp":
      return site.settings.rsvpEnabled === true;
    default:
      return false;
  }
}
