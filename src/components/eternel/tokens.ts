// ÉTERNEL design tokens + small shared helpers.
// Palette is the PRD's exact set; the four template-palette colours
// (bg/ink/accent/accentSoft) also live in templates.ts so the Studio's
// design-tab overrides keep working — tokens here only ADD the extra
// ÉTERNEL tones (sage, taupe, secondary background).
import type { WeddingSite } from "@/lib/types";

export const ETERNEL = {
  ivory: "#F8F5EF",
  champagne: "#E8DDCA",
  espresso: "#302821",
  sage: "#929987",
  taupe: "#B9AA98",
  gold: "#B49A70",
  secondaryBg: "#F0ECE4",
  white: "#FFFFFF",
} as const;

/** Default background-music track (CC0, verified — "Romantic Inspiration"
 * by Rafael Krux, FreePD, CC0 1.0 Public Domain Dedication). The file
 * ships with the template at public/audio/eternel-wedding-piano.mp3
 * (Phase B upload); the toggle hides itself if the file is missing. */
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

/** Milestones with at least a title or text — empty rows never render. */
export function visibleMilestones(site: WeddingSite) {
  return (site.content.storyMilestones ?? []).filter(
    (m) => m.title.trim() || m.text.trim(),
  );
}

/** Does this section actually render? The ÉTERNEL nav only links to
 * sections that will be on the page — a dead anchor is worse than no link. */
export function willRenderSection(site: WeddingSite, key: string): boolean {
  switch (key) {
    case "welcome":
      // The welcome letter (PRD §02) renders whenever the couple has
      // welcome text — the activation default is non-empty, and clearing
      // the text in the editor hides the section.
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
    case "rsvp":
      return site.settings.rsvpEnabled === true;
    default:
      return false;
  }
}
