// Template seeds — the ONE source of truth for a template's sample
// content. Both the template PREVIEW (src/lib/preview.ts) and buyer
// ACTIVATION (createSiteFromTemplate in store-neon.ts / store-local.ts)
// build Sacred Garden sites from sacredGardenSeed, so preview and
// activation can never drift again: the schedule, gift text
// and venue a buyer sees on the template page are exactly what their
// own site starts with (all ORIGINAL placeholder copy — never the
// source site's real couple, venue or text — and every field is
// editable in the editor).
//
// EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its 10
// photos are a fictional couple's demo assets and must never land on
// a real buyer's site (the buyer uploads their own photos in the
// editor, and the gallery appears then). Activation deliberately does
// not copy seed.gallery. The original source site has no gallery at
// all, so a gallery-less buyer site is also closer to the original.
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

/* ------------------------------------------------------------------ */
/* ROYAL BURGUNDY — the same pattern as Sacred Garden. The seed is   */
/* the ONE source of truth for the template's sample content: both    */
/* the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION     */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from royalBurgundySeed, so preview and activation can never drift. */
/* All copy is ORIGINAL placeholder text — never the source app's     */
/* real couple, venue, hotels or words — and every field is editable  */
/* in the editor. The 5-event schedule, dress code, accommodations,   */
/* travel + registry notes are seeded so a fresh buyer site renders   */
/* full (the Sacred Garden lesson: empty sections read as broken).    */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are a fictional couple's demo assets and must never land on a real */
/* buyer's site (the buyer uploads their own photos in the editor,    */
/* and the film strip + triptych use them then). Activation            */
/* deliberately does not copy seed.gallery.                            */
/* ------------------------------------------------------------------ */

export interface RoyalBurgundySeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const ROYAL_BURGUNDY_GALLERY_URLS = [
  "/images/themes/royal-burgundy-detail.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
  "/images/themes/royal-burgundy/photo-toast.jpg",
  "/images/themes/royal-burgundy/photo-meadow.jpg",
];

export function royalBurgundySeed(weddingDay: string): RoyalBurgundySeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Black Tie Optional",
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
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:45 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:15 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
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
    gallery: ROYAL_BURGUNDY_GALLERY_URLS.map((url, i) => ({
      id: `g-royal-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* EMERALD ROYALE — the same pattern as Royal Burgundy. The seed is   */
/* the ONE source of truth for the template's sample content: both    */
/* the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION     */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from emeraldRoyaleSeed, so preview and activation can never drift. */
/* All copy is ORIGINAL placeholder text — never a real couple,       */
/* venue, hotels or words — and every field is editable in the        */
/* editor. The 5-event schedule, dress code, accommodations, travel  */
/* + registry notes are seeded so a fresh buyer site renders full.   */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are demo assets and must never land on a real buyer's site (the    */
/* buyer uploads their own photos in the editor). Activation           */
/* deliberately does not copy seed.gallery.                            */
/* ------------------------------------------------------------------ */

export interface EmeraldRoyaleSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const EMERALD_ROYALE_GALLERY_URLS = [
  "/images/themes/emerald-royale-detail.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
  "/images/themes/royal-burgundy/photo-toast.jpg",
  "/images/themes/royal-burgundy/photo-meadow.jpg",
];

export function emeraldRoyaleSeed(weddingDay: string): EmeraldRoyaleSeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Black Tie Optional",
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
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:45 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:15 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
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
    gallery: EMERALD_ROYALE_GALLERY_URLS.map((url, i) => ({
      id: `g-emerald-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* SAPPHIRE ROYALE — the same pattern as Royal Burgundy. The seed is */
/* the ONE source of truth for the template's sample content: both    */
/* the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION     */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from sapphireRoyaleSeed, so preview and activation can never drift.*/
/* All copy is ORIGINAL placeholder text — never any other template's */
/* real couple, venue, hotels or words — and every field is editable  */
/* in the editor. The 5-event schedule, dress code, accommodations,   */
/* travel + registry notes are seeded so a fresh buyer site renders   */
/* full (the Sacred Garden lesson: empty sections read as broken).    */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are demo assets and must never land on a real buyer's site (the    */
/* buyer uploads their own photos in the editor, and the three        */
/* horizontal photo cards use them then). Activation deliberately      */
/* does not copy seed.gallery.                                         */
/* ------------------------------------------------------------------ */

export interface SapphireRoyaleSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const SAPPHIRE_ROYALE_GALLERY_URLS = [
  "/images/themes/sapphire-royale-detail.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
  "/images/themes/royal-burgundy/photo-toast.jpg",
  "/images/themes/royal-burgundy/photo-meadow.jpg",
];

export function sapphireRoyaleSeed(weddingDay: string): SapphireRoyaleSeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day — an evening under a midnight sky, lit in silver. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Black Tie Optional",
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
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:45 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:15 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
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
    gallery: SAPPHIRE_ROYALE_GALLERY_URLS.map((url, i) => ({
      id: `g-sapphire-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* BLUSH ROYALE — the same pattern as Royal Burgundy. The seed is    */
/* the ONE source of truth for the template's sample content: both    */
/* the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION     */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from blushRoyaleSeed, so preview and activation can never drift.   */
/* All copy is ORIGINAL placeholder text — never invented couple,     */
/* venue or words — and every field is editable in the editor. The    */
/* 5-event schedule, dress code, accommodations, travel + registry    */
/* notes are seeded so a fresh buyer site renders full.               */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are demo assets and must never land on a real buyer's site (the    */
/* buyer uploads their own photos in the editor, and the floral-ring  */
/* circles use them then). Activation deliberately does not copy       */
/* seed.gallery.                                                       */
/* ------------------------------------------------------------------ */

export interface BlushRoyaleSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const BLUSH_ROYALE_GALLERY_URLS = [
  "/images/themes/blush-royale-detail.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
  "/images/themes/royal-burgundy/photo-toast.jpg",
  "/images/themes/royal-burgundy/photo-meadow.jpg",
];

export function blushRoyaleSeed(weddingDay: string): BlushRoyaleSeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day. Your love, your laughter and your friendship have coloured our story in the softest shades of blush, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Formal Attire in Soft Pastel Tones",
      mealOptions: [
        "Herb-Crusted Chicken",
        "Pan-Seared Salmon",
        "Wild Mushroom & Truffle Risotto (Vegetarian)",
        "Roasted Garden Vegetable Tart (Vegan)",
        "Children’s Entrée",
      ],
      venueName: "The Grand Ballroom",
      venueAddress: "123 Rosewood Avenue, Your Town, ST 12345",
    },
    events: [
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
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
    gallery: BLUSH_ROYALE_GALLERY_URLS.map((url, i) => ({
      id: `g-blush-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* GOLDEN HOUR — the same pattern as Royal Burgundy. The seed is the */
/* ONE source of truth for the template's sample content: both the    */
/* template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION        */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from goldenHourSeed, so preview and activation can never drift.    */
/* All copy is ORIGINAL placeholder text — never invented couple,     */
/* venue or words — and every field is editable in the editor. The    */
/* 5-event schedule, dress code, accommodations, travel + registry    */
/* notes are seeded so a fresh buyer site renders full.               */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are demo assets and must never land on a real buyer's site (the    */
/* buyer uploads their own photos in the editor, and the warm photo   */
/* cards use them then). Activation deliberately does not copy         */
/* seed.gallery.                                                       */
/* ------------------------------------------------------------------ */

export interface GoldenHourSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const GOLDEN_HOUR_GALLERY_URLS = [
  "/images/themes/golden-hour-detail.jpg",
  "/images/themes/golden-hour/story-wheat.jpg",
  "/images/themes/royal-burgundy/photo-hands.jpg",
  "/images/themes/royal-burgundy/photo-veil.jpg",
  "/images/themes/royal-burgundy/photo-sunset.jpg",
  "/images/themes/royal-burgundy/photo-toast.jpg",
  "/images/themes/royal-burgundy/photo-meadow.jpg",
];

export function goldenHourSeed(weddingDay: string): GoldenHourSeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day — an evening bathed in golden light. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Black Tie Optional",
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
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:45 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:15 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
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
    gallery: GOLDEN_HOUR_GALLERY_URLS.map((url, i) => ({
      id: `g-golden-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/* SILVER MOONLIGHT — the same pattern as Royal Burgundy. The seed is */
/* the ONE source of truth for the template's sample content: both    */
/* the template PREVIEW (src/lib/preview.ts) and buyer ACTIVATION     */
/* (createSiteFromTemplate in store-neon.ts / store-local.ts) build   */
/* from silverMoonlightSeed, so preview and activation can never      */
/* drift. All copy is ORIGINAL placeholder text — never a real        */
/* couple, venue, hotels or words — and every field is editable in    */
/* the editor. The 5-event schedule, dress code, accommodations,      */
/* travel + registry notes are seeded so a fresh buyer site renders   */
/* full.                                                               */
/*                                                                     */
/* EXCEPTION — the gallery: seed.gallery is PREVIEW-ONLY. Its photos  */
/* are demo assets and must never land on a real buyer's site (the    */
/* buyer uploads their own photos in the editor, and the three        */
/* moonlit photo cards use them then). Activation deliberately does    */
/* not copy seed.gallery.                                              */
/* ------------------------------------------------------------------ */

export interface SilverMoonlightSeed {
  content: Partial<SiteContent>;
  events: SiteEvent[];
  details: import("./types").DetailBlock[];
  gallery: GalleryImage[];
}

const SILVER_MOONLIGHT_GALLERY_URLS = [
  "/images/themes/silver-moonlight-detail.jpg",
  "/images/themes/silver-moonlight-story-1.jpg",
  "/images/themes/silver-moonlight-story-2.jpg",
  "/images/themes/silver-moonlight.jpg",
];

export function silverMoonlightSeed(weddingDay: string): SilverMoonlightSeed {
  return {
    content: {
      welcome:
        "Together with our families, we invite you to share in the joy of our wedding day — an evening beneath a silver moon, lit by stars. Your love, your laughter and your friendship have shaped our story, and we would be so happy to celebrate the beginning of our married life with you beside us.\n\nSample welcome text — replace it with your own words in the editor.",
      story:
        "Every love story is beautiful, but ours is our favourite. It began with a first hello that neither of us expected, and grew — slowly, then all at once — into the life we share today.\n\nThrough quiet mornings and loud celebrations, through every ordinary day in between, we kept choosing each other. This wedding is our promise to keep choosing each other, for all the days to come.\n\nSample story — replace these paragraphs with your own story in the editor.",
      dressCode: "Black Tie Optional",
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
      { id: "ev-sample-arrival", name: "Guest Arrival", date: weddingDay, time: "4:00 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
      { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "4:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
      { id: "ev-sample-cocktail", name: "Cocktail Hour", date: weddingDay, time: "5:45 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
      { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "7:15 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
      { id: "ev-sample-first-dance", name: "First Dance", date: weddingDay, time: "9:30 PM", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own first-dance details." },
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
    gallery: SILVER_MOONLIGHT_GALLERY_URLS.map((url, i) => ({
      id: `g-silver-${i + 1}`,
      url,
      caption: `Your photo ${i + 1}`,
    })),
  };
}
