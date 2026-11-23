// Template catalogue — the six original themes from the Premium Wedding
// Website Design System spec v1.0 (22 Nov 2026). Each theme is a real
// template with its own art direction: palette, typography pairing,
// section order and composition key (TemplateMeta.composition), which the
// renderer uses for distinct hero / divider / timeline / gallery / motion
// treatments. These are NOT one layout recolored six times.
//
// Each template carries its own FIXED access code (TemplateMeta.accessCode),
// baked into source once created, so it never changes after its delivery
// PDF is on Etsy. The same metadata drives the gallery preview AND the
// published site. New templates are added from the admin panel
// (Admin → Templates → New template).

import type { TemplateMeta } from "./types";

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "champagne-elegance",
    name: "Champagne Elegance",
    tagline: "Quiet luxury · editorial serif",
    description:
      "Warm ivory and antique gold, fine-line botanical engraving, thin rules and generous negative space. A European editorial stationery feel — refined, timeless, never gaudy.",
    priceUsd: 49,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-CHAMPAGNE-2026",
    heroImage: "/images/themes/champagne-elegance.jpg",
    palette: { bg: "#F7F3EA", ink: "#302820", accent: "#A98A58", accentSoft: "#F1E9D8" },
    fontClass: "font-champagne",
    layout:
      "Editorial single column, framed portrait hero, cream stationery invitation panel, asymmetric story, vertical gold-rule timeline, magazine gallery grid",
    composition: "champagne",
    sections: [
      "hero",
      "invitation",
      "countdown",
      "story",
      "events",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "blue-serenity",
    name: "Blue Serenity",
    tagline: "Coastal calm · pearl & mist blue",
    description:
      "Pearl paper, mist blue and deep slate — airy coastal elegance with fine wave lines and a soft open-letter invitation. Modern romantic minimalism, calm on every screen.",
    priceUsd: 49,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-BLUE-2026",
    heroImage: "/images/themes/blue-serenity.jpg",
    palette: { bg: "#F8F8F4", ink: "#202B33", accent: "#7893A8", accentSoft: "#E3EBF0" },
    fontClass: "font-blue",
    layout:
      "Wide landscape hero with pale-blue title block, open-letter invitation with side rule, horizontal milestone story, airy stacked itinerary, wide image-led gallery",
    composition: "blue",
    sections: [
      "hero",
      "invitation",
      "story",
      "events",
      "countdown",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "midnight-romance",
    name: "Midnight Romance",
    tagline: "Dark editorial · burgundy & brass",
    description:
      "Charcoal and burgundy with antique brass rules and warm ivory type — candlelit, black-tie drama. A dark editorial spread with an ivory invitation sheet and a brass timeline.",
    priceUsd: 59,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-MIDNIGHT-2026",
    heroImage: "/images/themes/midnight-romance.jpg",
    palette: { bg: "#171717", ink: "#F1E8DA", accent: "#B08B56", accentSoft: "#2A2524" },
    fontClass: "font-midnight",
    layout:
      "Dark full-screen photo hero with ivory names and burgundy date detail, ivory invitation sheet over charcoal, brass timeline, alternating dark and ivory detail panels, dark gallery",
    composition: "midnight",
    sections: [
      "hero",
      "invitation",
      "countdown",
      "story",
      "events",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "sage-botanical",
    name: "Sage Botanical",
    tagline: "Garden wedding · sage & forest",
    description:
      "Warm cream, pale sage and forest green with original botanical line illustrations and a garden-path timeline. Organic and understated — a sketchbook, not a farmhouse.",
    priceUsd: 49,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-SAGE-2026",
    heroImage: "/images/themes/sage-botanical.jpg",
    palette: { bg: "#F5F1E7", ink: "#3E5141", accent: "#8C9A7A", accentSoft: "#E6E9DC" },
    fontClass: "font-sage",
    layout:
      "Botanical-framed portrait hero, garden invitation with illustrated corner foliage, orderly scrapbook story, garden-path timeline, organic asymmetric gallery",
    composition: "sage",
    sections: [
      "hero",
      "invitation",
      "story",
      "events",
      "countdown",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "mediterranean-sunset",
    name: "Mediterranean Sunset",
    tagline: "Warm villa · terracotta & olive",
    description:
      "Limestone, terracotta and dusty rose with abstract arch shapes and olive-branch illustrations. Sun-washed, joyful and sophisticated — a warm coastal villa, not a travel poster.",
    priceUsd: 55,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-MEDITERRANEAN-2026",
    heroImage: "/images/themes/mediterranean-sunset.jpg",
    palette: { bg: "#F4EDE2", ink: "#46342C", accent: "#B9674E", accentSoft: "#EFE0D2" },
    fontClass: "font-mediterranean",
    layout:
      "Arch-framed hero image with bold names, terracotta/ivory split invitation, image-led story sequence, warm terracotta-marker timeline, mixed-size photo wall",
    composition: "mediterranean",
    sections: [
      "hero",
      "invitation",
      "events",
      "story",
      "countdown",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "lavender-dreams",
    name: "Lavender Dreams",
    tagline: "Soft romantic · lavender & plum",
    description:
      "Pearl white and lavender mist with soft plum accents — delicate floral stationery, translucent layered cards and a slim mauve timeline. Poetic, modern, never pastel overload.",
    priceUsd: 49,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-LAVENDER-2026",
    heroImage: "/images/themes/lavender-dreams.jpg",
    palette: { bg: "#FAF8F6", ink: "#514353", accent: "#B9A9C9", accentSoft: "#EFEAF3" },
    fontClass: "font-lavender",
    layout:
      "Pearl hero with framed portrait and lavender botanical detail, layered translucent stationery invitation, soft editorial collage story, slim mauve timeline, lightbox gallery grid",
    composition: "lavender",
    sections: [
      "hero",
      "invitation",
      "countdown",
      "story",
      "events",
      "venue",
      "details",
      "dress-code",
      "gallery",
      "faq",
      "rsvp",
    ],
  },
  {
    id: "eternel",
    name: "ÉTERNEL",
    tagline: "Luxury editorial · French countryside",
    description:
      "Warm ivory, champagne and antique gold with Cormorant Garamond display type — a cinematic European editorial invitation. 3D wax-seal envelope opening, full-screen parallax hero, animated story timeline, live countdown, masonry gallery with lightbox and a full RSVP form. The flagship template.",
    priceUsd: 69,
    etsyListingId: null,
    active: true,
    accessCode: "WWS-ETERNEL-2026",
    heroImage: "/images/themes/eternel.jpg",
    palette: { bg: "#F8F5EF", ink: "#302821", accent: "#B49A70", accentSoft: "#E8DDCA" },
    fontClass: "font-eternel",
    layout:
      "Luxury editorial single column: 3D envelope opening, full-screen cinematic hero, welcome letter, alternating story timeline, large countdown, event cards, venue with embedded map, masonry gallery with lightbox, full RSVP form, signature footer",
    composition: "eternel",
    sections: [
      "hero",
      "welcome",
      "story",
      "countdown",
      "events",
      "venue",
      "gallery",
      "rsvp",
    ],
  },
];

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
