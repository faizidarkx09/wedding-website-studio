// Placeholder-site builder for template previews.
// Builds a site object from a template with NEUTRAL placeholder content
// only — no fake couple, no invented story, no fake venue or gallery.
// Placeholder text is clearly marked as such so buyers can judge the
// design while knowing their own site will carry their words and photos.
// Preview sites are never saved to the store (slug "preview-<template>").

import type { TemplateMeta, WeddingSite } from "./types";

export function previewSiteForTemplate(template: TemplateMeta): WeddingSite {
  const now = new Date().toISOString();
  const weddingDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  const weddingDay = weddingDate.toISOString().slice(0, 10);

  return {
    id: `site-preview-${template.id}`,
    slug: `preview-${template.id}`,
    templateId: template.id,
    templateSnapshot: { ...template },
    ownerName: "Partner A & Partner B",
    ownerEmail: "",
    status: "published",
    weddingDate: weddingDate.toISOString(),
    timezone: "America/New_York",
    content: {
      partnerA: "Partner A",
      partnerB: "Partner B",
      subtitle: "Together with their families",
      welcome:
        "Welcome to your wedding website — this is placeholder text. Replace it with your own welcome message in the editor.",
      invitationText:
        "Together with their families, Partner A and Partner B request the honour of your presence at their wedding. This is placeholder text — replace it with your own invitation wording in the editor.",
      story:
        "Your story goes here — replace this text in the editor with the story of how you met.",
      dressCode: "Your dress code goes here — for example, semi-formal.",
      footerMessage: "Thank you for being part of our day.",
      heroImage: "https://picsum.photos/seed/wedding-preview/1600/1000",
      venueName: "Your venue",
      venueAddress: "Your venue address goes here",
      mapLink: "",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
      details: [
        {
          id: "d-sample-venue",
          kind: "venue",
          title: "The venue",
          body: "Sample details block — replace this with your own venue information, address and directions.",
          hidden: false,
        },
        {
          id: "d-sample-travel",
          kind: "travel",
          title: "Getting there",
          body: "Sample details block — replace this with your own travel and transport notes for guests.",
          hidden: false,
        },
        {
          id: "d-sample-stay",
          kind: "accommodation",
          title: "Where to stay",
          body: "Sample details block — replace this with your own accommodation suggestions.",
          hidden: false,
        },
        {
          id: "d-sample-dress",
          kind: "dress",
          title: "Dress code",
          body: "Sample details block — replace this with your own dress code guidance.",
          hidden: false,
        },
      ],
      faqs: [
        {
          id: "faq-sample-1",
          question: "Can I bring a plus-one?",
          answer:
            "Sample answer — replace this with your own answer in the editor. Add, edit, delete and reorder questions as you like.",
        },
        {
          id: "faq-sample-2",
          question: "When should I reply by?",
          answer:
            "Sample answer — replace this with your own RSVP deadline and any notes for guests.",
        },
      ],
    },
    design: {
      primary: template.palette.ink,
      accent: template.palette.accent,
      background: template.palette.bg,
      headingFont: "Georgia, serif",
      bodyFont: "system-ui, sans-serif",
      galleryLayout: "grid",
    },
    events: [
      {
        id: "ev-sample-ceremony",
        name: "The Ceremony",
        date: weddingDay,
        time: "4:00 PM",
        venue: "Your venue",
        address: "Your venue address",
        description: "Sample event — replace this with your own ceremony details.",
      },
      {
        id: "ev-sample-reception",
        name: "The Reception",
        date: weddingDay,
        time: "6:00 PM",
        venue: "Your venue",
        address: "Your venue address",
        description: "Sample event — replace this with your own reception details.",
      },
    ],
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/wedding-preview-1/1200/800", caption: "Your photo 1" },
      { id: "g2", url: "https://picsum.photos/seed/wedding-preview-2/1200/800", caption: "Your photo 2" },
      { id: "g3", url: "https://picsum.photos/seed/wedding-preview-3/1200/800", caption: "Your photo 3" },
    ],
    customQuestions: [],
    settings: {
      passwordEnabled: false,
      passwordHash: null,
      rsvpEnabled: true,
      rsvpDeadline: null,
      timezone: "America/New_York",
      countdownEnabled: true,
      countdownStyle: "classic",
      showStory: true,
      showGallery: true,
      showEvents: true,
      showDressCode: true,
      showCountdown: true,
      showInvitation: true,
      showDetails: true,
      showFaq: true,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
}
