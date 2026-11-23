// Template seeds — the ONE source of truth for a template's sample
// content. Both the template PREVIEW (src/lib/preview.ts) and buyer
// ACTIVATION (createSiteFromTemplate in store-neon.ts / store-local.ts)
// build Sacred Garden sites from sacredGardenSeed, so preview and
// activation can never drift again: the schedule, gallery, gift text
// and venue a buyer sees on the template page are exactly what their
// own site starts with (all ORIGINAL placeholder copy — never the
// source site's real couple, venue or text — and every field is
// editable in the editor).
//
// The 10 gallery/venue/closing photos are Phase B template chrome
// (public/images/themes/sacred-garden/*); the URLs 404 until that
// upload lands, which is expected — the seed must not wait for it.

import type { GalleryImage, SiteContent, SiteEvent } from "./types";

export interface SacredGardenSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  gallery: GalleryImage[];
}

const GALLERY_URLS = [
  "/images/themes/sacred-garden-detail.jpg",
  "/images/themes/sacred-garden/closing-01.jpg",
  "/images/themes/sacred-garden/couple-portrait-01.jpg",
  "/images/themes/sacred-garden/couple-walking-01.jpg",
  "/images/themes/sacred-garden/engagement-01.jpg",
  "/images/themes/sacred-garden/ceremony-01.jpg",
  "/images/themes/sacred-garden/reception-01.jpg",
  "/images/themes/sacred-garden/bouquet-01.jpg",
  "/images/themes/sacred-garden/swans-01.jpg",
  "/images/themes/sacred-garden/couple-final-01.jpg",
];

export function sacredGardenSeed(weddingDay: string): SacredGardenSeed {
  return {
    content: {
      tagline:
        "Two hearts, one garden, a lifetime of grace — sample tagline, replace it with your own words.",
      giftText:
        "Your gift preference goes here — for example, your presence is the greatest gift. Sample text — replace it in the editor.",
      dressCode: "Your dress code goes here — for example, semi-formal.",
      // A real, generic, geocodable garden address so the map embed
      // pins — NOT the source site's real venue.
      venueName: "The Rose Garden",
      venueAddress: "New York Botanical Garden, 2900 Southern Blvd, Bronx, NY 10458",
      venueImage: "/images/themes/sacred-garden/venue-01.jpg",
    },
    events: [
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "5 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-nikkah", name: "Nikkah Ceremony", date: weddingDay, time: "6 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-mocktail", name: "Mocktail Hour", date: weddingDay, time: "7 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own mocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "8 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-dance", name: "Dance", date: weddingDay, time: "9 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dance details." },
    ],
    gallery: GALLERY_URLS.map((url, i) => ({
      id: `g-sacred-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}
