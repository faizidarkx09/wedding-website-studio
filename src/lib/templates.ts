// The five launch templates (PRD §13). Each has a genuinely distinct
// layout, typography, section order and palette — not just a colour swap.
// The same metadata drives the gallery preview AND the published site.

import type { TemplateMeta } from "./types";

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "the-editorial",
    name: "The Editorial",
    tagline: "Luxury minimalist",
    description:
      "Refined serif typography on ivory, generous white space, thin rules and a single-column editorial flow. For couples who want quiet luxury.",
    priceUsd: 49,
    etsyListingId: "WWS-EDT-001",
    active: true,
    palette: { bg: "#fdfbf7", ink: "#1c1917", accent: "#8a6d3b", accentSoft: "#f5efe4" },
    fontClass: "font-editorial",
    layout: "single-column, centred, thin rules, large serif names",
    sections: ["hero", "countdown", "story", "events", "gallery", "rsvp"],
  },
  {
    id: "the-romance",
    name: "The Romance",
    tagline: "Floral & soft",
    description:
      "Soft blush and rose, delicate floral framing, rounded cards and flowing script-style headings. Romantic, warm and gentle.",
    priceUsd: 49,
    etsyListingId: "WWS-RMN-001",
    active: true,
    palette: { bg: "#fff7f5", ink: "#4c2a33", accent: "#c2707e", accentSoft: "#fdeef0" },
    fontClass: "font-romance",
    layout: "rounded cards, floral dividers, story first, gallery as soft grid",
    sections: ["hero", "story", "countdown", "events", "gallery", "dress-code", "rsvp"],
  },
  {
    id: "the-modern",
    name: "The Modern",
    tagline: "Bold contemporary",
    description:
      "High-contrast black and white with one bold accent, oversized uppercase type and an asymmetric split layout. Clean, confident, current.",
    priceUsd: 59,
    etsyListingId: "WWS-MDN-001",
    active: true,
    palette: { bg: "#ffffff", ink: "#111111", accent: "#e11d48", accentSoft: "#f8f8f8" },
    fontClass: "font-modern",
    layout: "asymmetric split hero, uppercase display type, side-by-side events",
    sections: ["hero", "events", "countdown", "story", "gallery", "rsvp"],
  },
  {
    id: "the-countryside",
    name: "The Countryside",
    tagline: "Rustic & boho",
    description:
      "Warm natural tones, sage and terracotta, earthy textures and relaxed two-column storytelling. For barn, garden and outdoor weddings.",
    priceUsd: 45,
    etsyListingId: "WWS-CTR-001",
    active: true,
    palette: { bg: "#f7f3ea", ink: "#3f3a2e", accent: "#7d8c5c", accentSoft: "#ece7d8" },
    fontClass: "font-countryside",
    layout: "two-column story, earthy cards, gallery first, relaxed spacing",
    sections: ["hero", "gallery", "story", "events", "countdown", "dress-code", "rsvp"],
  },
  {
    id: "the-classic",
    name: "The Classic",
    tagline: "Timeless formal",
    description:
      "Navy and gold formality, centred formal composition, engraved-style dividers and traditional order. Elegant in the way weddings have always been.",
    priceUsd: 55,
    etsyListingId: "WWS-CLS-001",
    active: true,
    palette: { bg: "#fbfaf6", ink: "#1e2a44", accent: "#b08d3c", accentSoft: "#f0ead6" },
    fontClass: "font-classic",
    layout: "formal centred composition, gold rules, traditional section order",
    sections: ["hero", "countdown", "story", "events", "venue", "gallery", "rsvp"],
  },
];

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
