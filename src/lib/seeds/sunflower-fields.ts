// SUNFLOWER FIELDS — the same pattern as Golden Hour. The seed is
// the ONE source of truth for the template's sample content: both
// the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION
// (createSiteFromTemplate in store-neon.ts / store-local.ts) build
// from sunflowerFieldsSeed, so preview and activation can never
// drift. All copy is ORIGINAL placeholder text — never a real
// couple, venue, hotels or words — and every field is editable in
// the editor. The 5-event schedule, dress code, accommodations,
// travel + registry notes are seeded so a fresh buyer site renders
// full.
//
// EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos
// are demo assets and must never land on a real buyer's site (the
// buyer uploads their own photos in the editor, and the field-row
// photos use them then). Activation deliberately does not copy
// seed.gallery.

import type { GalleryImage, SiteContent, SiteEvent } from "../types";

export interface SunflowerFieldsSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("../types").DetailBlock[];
  gallery: GalleryImage[];
}

const SUNFLOWER_FIELDS_GALLERY_URLS = [
  "/images/themes/sunflower-fields-detail.jpg",
  "/images/themes/sunflower-fields/story-field.jpg",
  "/images/themes/sunflower-fields/seed-packet.jpg",
  "/images/themes/sunflower-fields.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
];

export const sunflowerFieldsSeed = (weddingDay: string): SunflowerFieldsSeed => {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day — a sunny celebration among the sunflowers. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Garden Party",
      mealOptions: [
        "Herb-Crusted Filet Mignon",
        "Pan-Seared Sea Bass",
        "Wild Mushroom & Truffle Risotto (Vegetarian)",
        "Roasted Heirloom Vegetable Tart (Vegan)",
        "Children’s Entrée",
      ],
      venueName: "The Grand Ballroom",
      venueAddress: "123 Rosewood Avenue, Your Town, ST 12345",
    },
    events: [
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "3:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-golden-hour", name: "Golden-Hour Photos", date: weddingDay, time: "5:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own golden-hour photo details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
    ],
    details: [
      {
        id: "d-sample-hotel-1",
        kind: "accommodation",
        title: "The Grand Hotel",
        body: "0.5 miles from the venue\nA block of rooms is held under the couple's name — sample text, replace it in the editor.\nBooking Code: WEDDING",
        hidden: false,
      },
      {
        id: "d-sample-hotel-2",
        kind: "accommodation",
        title: "The Rosewood Inn",
        body: "1.2 miles from the venue\nA cosy boutique stay a short walk from the venue — sample text, replace it in the editor.\nBooking Code: ROSEWOOD",
        hidden: false,
      },
      {
        id: "d-sample-travel",
        kind: "travel",
        title: "Getting there",
        body: "Sample travel notes — the venue is a short drive from the city centre, with parking on site. Replace this with your own travel guidance in the editor.",
        hidden: false,
      },
      {
        id: "d-sample-registry",
        kind: "registry",
        title: "Gifts & Registry",
        body: "Your presence is the greatest gift. If you would like to give something more, a wishing well will be at the reception. Sample text — replace it in the editor.",
        hidden: false,
      },
    ],
    gallery: SUNFLOWER_FIELDS_GALLERY_URLS.map((url, i) => ({
      id: `g-sunflower-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
};
