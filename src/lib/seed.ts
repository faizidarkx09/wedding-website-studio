// Seed data — clearly labeled DEMO. One demo site (Sarah & James) and
// sample RSVPs. No real customer data. There are no orders in this model:
// every buyer of a template shares that template's fixed access code
// (see TemplateMeta.accessCode) and creates their own site on activation.

import type { AccessCode, AuditLog, RsvpResponse, WeddingSite } from "./types";
import { getTemplate } from "./templates";
import { sha256 } from "./auth";

export interface SeedData {
  sites: WeddingSite[];
  accessCodes: AccessCode[];
  rsvps: RsvpResponse[];
  audit: AuditLog[];
}

export function buildSeed(): SeedData {
  const now = new Date().toISOString();
  const template = getTemplate("the-editorial")!;
  const site: WeddingSite = {
    id: "site-sarah-james",
    slug: "sarah-and-james",
    templateId: "the-editorial",
    templateSnapshot: { ...template },
    ownerName: "Sarah & James",
    ownerEmail: "demo@example.com",
    status: "published",
    weddingDate: "2027-06-12T19:00:00.000Z",
    timezone: "America/New_York",
    content: {
      partnerA: "Sarah",
      partnerB: "James",
      subtitle: "Together with their families",
      welcome:
        "Welcome to our wedding website! We are so excited to celebrate with the people we love most. Here you will find everything you need — the schedule, the venue, and a place to let us know you are coming.",
      story:
        "Sarah and James met on a rainy Tuesday in Brooklyn, over two coffees and one shared umbrella. Five years, three apartments and one very patient dog later, James proposed on the same corner where they first met. This website is their invitation to you: come and be part of the day they have been dreaming about.",
      dressCode: "Semi-formal. Garden party colours are welcome — please avoid white and ivory.",
      footerMessage: "Thank you for being part of our story. We cannot wait to celebrate with you. — Sarah & James",
      heroImage: "https://picsum.photos/seed/wedding-hero/1600/1000",
      venueName: "The Rosewood Garden",
      venueAddress: "128 Willow Lane, Hudson Valley, New York",
      mapLink: "https://maps.google.com/?q=Hudson+Valley+New+York",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
    },
    design: {
      primary: "#1c1917",
      accent: "#8a6d3b",
      background: "#fdfbf7",
      headingFont: "Georgia, serif",
      bodyFont: "system-ui, sans-serif",
      galleryLayout: "grid",
    },
    events: [
      {
        id: "ev-ceremony",
        name: "The Ceremony",
        date: "2027-06-12",
        time: "4:00 PM",
        venue: "The Rosewood Garden",
        address: "128 Willow Lane, Hudson Valley, NY",
        description: "The ceremony begins promptly at four. Please arrive by 3:30 PM.",
      },
      {
        id: "ev-reception",
        name: "The Reception",
        date: "2027-06-12",
        time: "6:00 PM",
        venue: "The Rosewood Garden — The Barn",
        address: "128 Willow Lane, Hudson Valley, NY",
        description: "Dinner, dancing and cake under the string lights.",
      },
      {
        id: "ev-brunch",
        name: "Farewell Brunch",
        date: "2027-06-13",
        time: "10:00 AM",
        venue: "The Garden Café",
        address: "45 Main Street, Hudson Valley, NY",
        description: "A relaxed goodbye brunch for out-of-town guests.",
      },
    ],
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/wedding-1/1200/800", caption: "The proposal spot" },
      { id: "g2", url: "https://picsum.photos/seed/wedding-2/1200/800", caption: "Our first trip together" },
      { id: "g3", url: "https://picsum.photos/seed/wedding-3/1200/800", caption: "Sunday mornings" },
      { id: "g4", url: "https://picsum.photos/seed/wedding-4/1200/800", caption: "The dog approves" },
    ],
    customQuestions: [
      { id: "q-song", label: "What song should we play to get you dancing?", type: "text", required: false },
    ],
    settings: {
      passwordEnabled: false,
      passwordHash: null,
      rsvpEnabled: true,
      rsvpDeadline: "2027-05-15T23:59:00.000Z",
      timezone: "America/New_York",
      countdownEnabled: true,
      countdownStyle: "classic",
      showStory: true,
      showGallery: true,
      showEvents: true,
      showDressCode: true,
      showCountdown: true,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };

  const rsvps: RsvpResponse[] = [
    {
      id: "rsvp-1",
      siteId: site.id,
      guestName: "Emily Carter",
      email: "emily@example.com",
      phone: "",
      attending: true,
      guestCount: 2,
      dietary: "Vegetarian",
      allergies: "",
      message: "So excited! See you both there.",
      answers: { "q-song": "Dancing Queen" },
      updateToken: "demo-token-emily",
      status: "attending",
      submittedAt: now,
      updatedAt: now,
    },
    {
      id: "rsvp-2",
      siteId: site.id,
      guestName: "Michael Chen",
      email: "michael@example.com",
      phone: "",
      attending: true,
      guestCount: 1,
      dietary: "",
      allergies: "Peanuts",
      message: "",
      answers: {},
      updateToken: "demo-token-michael",
      status: "attending",
      submittedAt: now,
      updatedAt: now,
    },
    {
      id: "rsvp-3",
      siteId: site.id,
      guestName: "Laura Bennett",
      email: "laura@example.com",
      phone: "",
      attending: false,
      guestCount: 0,
      dietary: "",
      allergies: "",
      message: "Sad to miss it — congratulations!",
      answers: {},
      updateToken: "demo-token-laura",
      status: "declined",
      submittedAt: now,
      updatedAt: now,
    },
  ];

  const accessCode: AccessCode = {
    id: "code-demo-1",
    // Not tied to any order — the demo code opens the demo site.
    orderId: null,
    siteId: site.id,
    // Demo code for the labeled demo site only: WWS-DEMO-2026
    codeHash: sha256("WWS-DEMO-2026"),
    status: "active",
    createdAt: now,
    lastUsedAt: null,
    expiresAt: null,
  };

  const audit: AuditLog[] = [
    {
      id: "audit-1",
      actor: "system",
      action: "seed",
      detail: "Demo data seeded: Sarah & James site and 3 sample RSVPs.",
      createdAt: now,
    },
  ];

  return { sites: [site], accessCodes: [accessCode], rsvps, audit };
}
