// An Eternal Moment seed — the ONE source of truth for this template's
// sample content. Both the template PREVIEW (src/lib/preview.ts) and
// buyer ACTIVATION (createSiteFromTemplate in store-neon.ts /
// store-local.ts) build from eternalMomentSeed, so preview and
// activation can never drift. All copy is ORIGINAL placeholder text
// — never a real couple, venue or words — and every field is
// editable in the editor. The 6-event schedule (Rehearsal Dinner,
// Welcome Dinner, Ceremony, Cocktail Hour, Reception, Farewell
// Brunch) is US/UK/international — no Mehndi or other South-Asian
// events, per the user's 2026-11-28 decision. Rehearsal + welcome
// sit the day before the wedding, brunch the day after (shiftDay).
// Dress code, accommodations, travel + registry notes are seeded so
// a fresh buyer site renders full.
//
// Shape: EXACTLY the Golden Hour / Mint Serenity seed's shape — same
// interface fields (content / events / details / gallery), same event
// ids, same detail-block ids and body formats. Like mintSerenitySeed
// it is a const holding the seed function (the events still need the
// weddingDay parameter, exactly like goldenHourSeed), so the
// coordinator wires it identically: `eternalMomentSeed(weddingDay)`.
//
// EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos
// are demo assets and must never land on a real buyer's site (the
// buyer uploads their own photos in the editor, and the gallery
// lightbox uses them then). Activation deliberately does not copy
// seed.gallery.

import type { GalleryImage, SiteContent, SiteEvent } from "../types";

export interface EternalMomentSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("../types").DetailBlock[];
  gallery: GalleryImage[];
}

const ETERNAL_MOMENT_GALLERY_URLS = [
  "/images/themes/eternal-moment/hero.jpg",
  "/images/themes/eternal-moment/story-met.jpg",
  "/images/themes/eternal-moment/story-adventure.jpg",
  "/images/themes/eternal-moment/story-proposal.jpg",
  "/images/themes/eternal-moment/story-forever.jpg",
  "/images/themes/eternal-moment/gallery-01.jpg",
  "/images/themes/eternal-moment/gallery-02.jpg",
  "/images/themes/eternal-moment/gallery-03.jpg",
  "/images/themes/eternal-moment/gallery-04.jpg",
  "/images/themes/eternal-moment/gallery-05.jpg",
];

export const eternalMomentSeed = (weddingDay: string): EternalMomentSeed => {
  // Day offsets so the pre/post-wedding events land on the right
  // dates (noon-anchored to dodge timezone day-rollover).
  const shiftDay = (iso: string, days: number): string => {
    const d = new Date(`${iso}T12:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day — an evening of quiet elegance, gold light and the people we love most. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Chapter One — The First Meeting\n\nEvery love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected — a small, ordinary moment that turned out to be the start of everything.\n\nChapter Two — The Adventure\n\nFrom that first hello came shared days, long conversations and one unforgettable trip — the kind of days that turn two strangers into each other's favourite person.\n\nChapter Three — The Proposal\n\nThen came the question, asked with shaking hands and a steady heart — and the easiest yes either of us has ever said.\n\nChapter Four — Forever\n\nThis wedding is our promise to keep choosing each other, for all the days to come. Thank you for being part of the day it begins.\n\nSample story — replace these chapters with your own story in the editor.",
      dressCode:
        "Formal attire in soft neutrals, warm gold and dusty sage. Sample text — replace it in the editor.",
      mealOptions: [
        "Herb-Crusted Filet Mignon",
        "Pan-Seared Sea Bass",
        "Wild Mushroom & Truffle Risotto (Vegetarian)",
        "Roasted Heirloom Vegetable Tart (Vegan)",
        "Children’s Entrée",
      ],
      // A real, generic, geocodable garden address so the map embed
      // pins — NOT any real couple's venue.
      venueName: "The Garden Pavilion",
      venueAddress: "Central Park, 59th St & 5th Ave, New York, NY 10022",
    },
    events: [
      { id: "ev-sample-rehearsal", name: "Rehearsal Dinner", date: shiftDay(weddingDay, -1), time: "6:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own rehearsal-dinner details." },
      { id: "ev-sample-welcome", name: "Welcome Dinner", date: shiftDay(weddingDay, -1), time: "8:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own welcome-dinner details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-reception", name: "Reception", date: weddingDay, time: "6:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own reception details." },
      { id: "ev-sample-brunch", name: "Farewell Brunch", date: shiftDay(weddingDay, 1), time: "10:00 AM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own farewell-brunch details." },
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
    gallery: ETERNAL_MOMENT_GALLERY_URLS.map((url, i) => ({
      id: `g-eternal-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
};
