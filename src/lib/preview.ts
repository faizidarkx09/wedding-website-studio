// Placeholder-site builder for template previews.
// Builds a site object from a template with NEUTRAL placeholder content
// only — no fake couple, no invented story, no fake venue or gallery.
// Placeholder text is clearly marked as such so buyers can judge the
// design while knowing their own site will carry their words and photos.
// Preview sites are never saved to the store (slug "preview-<template>").

import type { TemplateMeta, WeddingSite } from "./types";
import { amethystRoyaleSeed, auroraSeed, autumnHarvestSeed, blushRoyaleSeed, coralSunsetSeed, desertDuskSeed, emeraldRoyaleSeed, eternalMomentSeed, forestWhisperSeed, goldenHourSeed, marbleLuxeSeed, mintSerenitySeed, oceanPearlSeed, peacockRoyaleSeed, roseGardenSeed, royalBurgundySeed, rusticCharmSeedFor, sacredGardenSeed, sakuraDreamSeed, sapphireRoyaleSeed, silverMoonlightSeed, starlightNoirSeed, sunflowerFieldsSeed, tropicalPalmSeed, vintageLaceSeed, winterFrostSeed } from "./template-seeds";

// ÉTERNEL template photography (public/images/themes/eternel/*) — the full
// 30-image masonry gallery for the template preview: the detail close-up
// first, then the 29 gallery photographs (couple, engagement, ceremony,
// reception, venue, details). Other templates keep the two-image gallery.
const ETERNEL_GALLERY = [
  "/images/themes/eternel-detail.jpg",
  "/images/themes/eternel/couple-portrait-01.jpg",
  "/images/themes/eternel/engagement-01.jpg",
  "/images/themes/eternel/venue-exterior-01.jpg",
  "/images/themes/eternel/couple-walking-01.jpg",
  "/images/themes/eternel/rings-01.jpg",
  "/images/themes/eternel/engagement-02.jpg",
  "/images/themes/eternel/ceremony-02.jpg",
  "/images/themes/eternel/couple-portrait-02.jpg",
  "/images/themes/eternel/bouquet-01.jpg",
  "/images/themes/eternel/venue-interior-01.jpg",
  "/images/themes/eternel/couple-walking-02.jpg",
  "/images/themes/eternel/engagement-03.jpg",
  "/images/themes/eternel/table-detail-01.jpg",
  "/images/themes/eternel/reception-02.jpg",
  "/images/themes/eternel/bride-detail-01.jpg",
  "/images/themes/eternel/couple-final-01.jpg",
  "/images/themes/eternel/engagement-04.jpg",
  "/images/themes/eternel/venue-exterior-02.jpg",
  "/images/themes/eternel/groom-detail-01.jpg",
  "/images/themes/eternel/invitation-detail-01.jpg",
  "/images/themes/eternel/couple-closeup-02.jpg",
  "/images/themes/eternel/venue-interior-02.jpg",
  "/images/themes/eternel/bouquet-02.jpg",
  "/images/themes/eternel/table-detail-02.jpg",
  "/images/themes/eternel/rings-02.jpg",
  "/images/themes/eternel/bride-detail-02.jpg",
  "/images/themes/eternel/groom-detail-02.jpg",
  "/images/themes/eternel/invitation-detail-02.jpg",
  "/images/themes/eternel/couple-final-02.jpg",
];

// BLOSSOM & OUD template photography (public/images/themes/blossom/*) —
// the full 30-image masonry gallery for the template preview: the detail
// close-up first, then the 29 gallery photographs (couple, engagement,
// ceremony, reception, venue, details). Mirrors the ÉTERNEL structure.
const BLOSSOM_GALLERY = [
  "/images/themes/blossom-oud-detail.jpg",
  "/images/themes/blossom/couple-portrait-01.jpg",
  "/images/themes/blossom/engagement-01.jpg",
  "/images/themes/blossom/venue-exterior-01.jpg",
  "/images/themes/blossom/couple-walking-01.jpg",
  "/images/themes/blossom/rings-01.jpg",
  "/images/themes/blossom/engagement-02.jpg",
  "/images/themes/blossom/ceremony-02.jpg",
  "/images/themes/blossom/couple-portrait-02.jpg",
  "/images/themes/blossom/bouquet-01.jpg",
  "/images/themes/blossom/venue-interior-01.jpg",
  "/images/themes/blossom/couple-walking-02.jpg",
  "/images/themes/blossom/engagement-03.jpg",
  "/images/themes/blossom/table-detail-01.jpg",
  "/images/themes/blossom/reception-02.jpg",
  "/images/themes/blossom/bride-detail-01.jpg",
  "/images/themes/blossom/couple-final-01.jpg",
  "/images/themes/blossom/engagement-04.jpg",
  "/images/themes/blossom/venue-exterior-02.jpg",
  "/images/themes/blossom/groom-detail-01.jpg",
  "/images/themes/blossom/invitation-detail-01.jpg",
  "/images/themes/blossom/couple-closeup-02.jpg",
  "/images/themes/blossom/venue-interior-02.jpg",
  "/images/themes/blossom/bouquet-02.jpg",
  "/images/themes/blossom/table-detail-02.jpg",
  "/images/themes/blossom/rings-02.jpg",
  "/images/themes/blossom/bride-detail-02.jpg",
  "/images/themes/blossom/groom-detail-02.jpg",
  "/images/themes/blossom/invitation-detail-02.jpg",
  "/images/themes/blossom/couple-final-02.jpg",
];

// DOLCE VITA template photography (public/images/themes/dolce-vita/*)
// — the standalone's 10 slider photos: the hands/rings close-up
// (detail) first, then gallery-01…09, so the slider shows all 10
// standalone photos with no duplicates (gallery-10 IS the detail).
const DOLCE_GALLERY = [
  "/images/themes/dolce-vita-detail.jpg",
  "/images/themes/dolce-vita/gallery-01.jpg",
  "/images/themes/dolce-vita/gallery-02.jpg",
  "/images/themes/dolce-vita/gallery-03.jpg",
  "/images/themes/dolce-vita/gallery-04.jpg",
  "/images/themes/dolce-vita/gallery-05.jpg",
  "/images/themes/dolce-vita/gallery-06.jpg",
  "/images/themes/dolce-vita/gallery-07.jpg",
  "/images/themes/dolce-vita/gallery-08.jpg",
  "/images/themes/dolce-vita/gallery-09.jpg",
];

export function previewSiteForTemplate(template: TemplateMeta): WeddingSite {
  const now = new Date().toISOString();
  const weddingDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  const weddingDay = weddingDate.toISOString().slice(0, 10);

  // THE SACRED GARDEN seed — the single source of truth shared with
  // activation (store-neon.ts / store-local.ts). Preview and buyer
  // sites start from exactly the same sample content.
  const sacredSeed = sacredGardenSeed(weddingDay);

  // ROYAL BURGUNDY seed — same pattern: the single source of truth
  // shared with activation. Its gallery is preview-only (see
  // template-seeds.ts); activation never copies it.
  const royalSeed = royalBurgundySeed(weddingDay);

  // EMERALD / SAPPHIRE / BLUSH ROYALE seeds — same pattern: the single
  // source of truth shared with activation. Their galleries are
  // preview-only (see template-seeds.ts); activation never copies them.
  const emeraldSeed = emeraldRoyaleSeed(weddingDay);
  const sapphireSeed = sapphireRoyaleSeed(weddingDay);
  const blushSeed = blushRoyaleSeed(weddingDay);
  const goldenSeed = goldenHourSeed(weddingDay);
  const silverSeed = silverMoonlightSeed(weddingDay);
  const roseSeed = roseGardenSeed(weddingDay);
  const oceanSeed = oceanPearlSeed(weddingDay);
  const forestSeed = forestWhisperSeed(weddingDay);
  const winterSeed = winterFrostSeed(weddingDay);
  const autumnSeed = autumnHarvestSeed(weddingDay);
  const peacockSeed = peacockRoyaleSeed(weddingDay);
  const sakuraSeed = sakuraDreamSeed(weddingDay);
  const desertSeed = desertDuskSeed(weddingDay);
  const vintageSeed = vintageLaceSeed(weddingDay);
  const starlightSeed = starlightNoirSeed(weddingDay);
  const coralSeed = coralSunsetSeed(weddingDay);
  const amethystSeed = amethystRoyaleSeed(weddingDay);
  const marbleSeed = marbleLuxeSeed(weddingDay);
  const tropicalSeed = tropicalPalmSeed(weddingDay);
  const auroraSiteSeed = auroraSeed(weddingDay);
  const rusticSeed = rusticCharmSeedFor(weddingDay);
  const sunflowerSeed = sunflowerFieldsSeed(weddingDay);
  const mintSeed = mintSerenitySeed(weddingDay);
  const eternalSeed = eternalMomentSeed(weddingDay);

  // The template's own AI-generated artwork (original, made for this
  // theme). Templates without one fall back to the old placeholder seeds.
  const themeHero = template.heroImage ?? "https://picsum.photos/seed/wedding-preview/1600/1000";
  const themeDetail = template.heroImage
    ? `/images/themes/${template.id}-detail.jpg`
    : "https://picsum.photos/seed/wedding-preview-1/1200/800";

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
      // ÉTERNEL only: four placeholder milestones for the animated
      // timeline. Marked as placeholder text, like the rest of the
      // preview content; the editor can replace or remove them.
      ...(template.composition === "eternel"
        ? {
            storyMilestones: [
              {
                id: "m-sample-1",
                date: "Spring 2018",
                title: "The first hello",
                text: "Sample milestone — replace this with your own first meeting, in your own words.",
                image: "/images/themes/eternel/story-01.jpg",
              },
              {
                id: "m-sample-2",
                date: "Summer 2019",
                title: "The first trip",
                text: "Sample milestone — replace this with your own favourite trip together.",
                image: "/images/themes/eternel/story-02.jpg",
              },
              {
                id: "m-sample-3",
                date: "Winter 2022",
                title: "Moving in",
                text: "Sample milestone — replace this with the moment you made a home together.",
                image: "/images/themes/eternel/story-03.jpg",
              },
              {
                id: "m-sample-4",
                date: "Autumn 2024",
                title: "The proposal",
                text: "Sample milestone — replace this with the day the question was asked.",
                image: "/images/themes/eternel/story-04.jpg",
              },
            ],
          }
        : {}),
      // BLOSSOM & OUD only: same four placeholder milestones, with the
      // Phase B story photos (mirrors the ÉTERNEL branch).
      ...(template.composition === "blossom"
        ? {
            storyMilestones: [
              {
                id: "m-sample-1",
                date: "Spring 2018",
                title: "The first hello",
                text: "Sample milestone — replace this with your own first meeting, in your own words.",
                image: "/images/themes/blossom/story-01.jpg",
              },
              {
                id: "m-sample-2",
                date: "Summer 2019",
                title: "The first trip",
                text: "Sample milestone — replace this with your own favourite trip together.",
                image: "/images/themes/blossom/story-02.jpg",
              },
              {
                id: "m-sample-3",
                date: "Winter 2022",
                title: "Moving in",
                text: "Sample milestone — replace this with the moment you made a home together.",
                image: "/images/themes/blossom/story-03.jpg",
              },
              {
                id: "m-sample-4",
                date: "Autumn 2024",
                title: "The proposal",
                text: "Sample milestone — replace this with the day the question was asked.",
                image: "/images/themes/blossom/story-04.jpg",
              },
            ],
          }
        : {}),
      // DOLCE VITA only: same four placeholder milestones. Story
      // photos REUSE gallery images (the standalone has no dedicated
      // story shoot — see dolcevita-assets/SLOT_MAP.md).
      ...(template.composition === "dolce-vita"
        ? {
            storyMilestones: [
              {
                id: "m-sample-1",
                date: "Spring 2018",
                title: "The first hello",
                text: "Sample milestone — replace this with your own first meeting, in your own words.",
                image: "/images/themes/dolce-vita/gallery-04.jpg",
              },
              {
                id: "m-sample-2",
                date: "Summer 2019",
                title: "The first trip",
                text: "Sample milestone — replace this with your own favourite trip together.",
                image: "/images/themes/dolce-vita/gallery-07.jpg",
              },
              {
                id: "m-sample-3",
                date: "Winter 2022",
                title: "Moving in",
                text: "Sample milestone — replace this with the moment you made a home together.",
                image: "/images/themes/dolce-vita/gallery-01.jpg",
              },
              {
                id: "m-sample-4",
                date: "Autumn 2024",
                title: "The proposal",
                text: "Sample milestone — replace this with the day the question was asked.",
                image: "/images/themes/dolce-vita/gallery-06.jpg",
              },
            ],
          }
        : {}),
      // AN ETERNAL MOMENT only: the same four placeholder milestones,
      // matching the seed's four story chapters, with the template's
      // own story photos.
      ...(template.composition === "eternal-moment"
        ? {
            storyMilestones: [
              {
                id: "m-sample-1",
                date: "Spring 2018",
                title: "The first hello",
                text: "Sample milestone — replace this with your own first meeting, in your own words.",
                image: "/images/themes/eternal-moment/story-met.jpg",
              },
              {
                id: "m-sample-2",
                date: "Summer 2019",
                title: "The first trip",
                text: "Sample milestone — replace this with your own favourite trip together.",
                image: "/images/themes/eternal-moment/story-adventure.jpg",
              },
              {
                id: "m-sample-3",
                date: "Winter 2022",
                title: "The proposal",
                text: "Sample milestone — replace this with the day the question was asked.",
                image: "/images/themes/eternal-moment/story-proposal.jpg",
              },
              {
                id: "m-sample-4",
                date: "Autumn 2024",
                title: "Forever",
                text: "Sample milestone — replace this with the promise you made each other.",
                image: "/images/themes/eternal-moment/story-forever.jpg",
              },
            ],
          }
        : {}),
      // THE SACRED GARDEN only: tagline + gift text + venue photo +
      // venue + dress code from the shared seed (src/lib/
      // template-seeds.ts) — the same values activation seeds into
      // buyer sites, so preview and activation can never drift.
      ...(template.composition === "sacred-garden" ? sacredSeed.content : {}),
      // ROYAL BURGUNDY only: welcome + story + dress code + meal
      // menu + venue from the shared seed — same values activation
      // seeds into buyer sites.
      ...(template.composition === "royal-burgundy" ? royalSeed.content : {}),
      // EMERALD / SAPPHIRE / BLUSH ROYALE only: welcome + story +
      // dress code + meal menu + venue from the shared seeds — same
      // values activation seeds into buyer sites.
      ...(template.composition === "emerald-royale" ? emeraldSeed.content : {}),
      ...(template.composition === "sapphire-royale" ? sapphireSeed.content : {}),
      ...(template.composition === "blush-royale" ? blushSeed.content : {}),
      ...(template.composition === "golden-hour" ? goldenSeed.content : {}),
      ...(template.composition === "silver-moonlight" ? silverSeed.content : {}),
      ...(template.composition === "rose-garden" ? roseSeed.content : {}),
      ...(template.composition === "ocean-pearl" ? oceanSeed.content : {}),
      ...(template.composition === "forest-whisper" ? forestSeed.content : {}),
      ...(template.composition === "winter-frost" ? winterSeed.content : {}),
      ...(template.composition === "autumn-harvest" ? autumnSeed.content : {}),
      ...(template.composition === "peacock-royale" ? peacockSeed.content : {}),
      ...(template.composition === "sakura-dream" ? sakuraSeed.content : {}),
      ...(template.composition === "desert-dusk" ? desertSeed.content : {}),
      ...(template.composition === "vintage-lace" ? vintageSeed.content : {}),
      ...(template.composition === "starlight-noir" ? starlightSeed.content : {}),
      ...(template.composition === "coral-sunset" ? coralSeed.content : {}),
      ...(template.composition === "amethyst-royale" ? amethystSeed.content : {}),
      ...(template.composition === "marble-luxe" ? marbleSeed.content : {}),
      ...(template.composition === "tropical-palm" ? tropicalSeed.content : {}),
      ...(template.composition === "aurora" ? auroraSiteSeed.content : {}),
      ...(template.composition === "rustic-charm" ? rusticSeed.content : {}),
      ...(template.composition === "sunflower-fields" ? sunflowerSeed.content : {}),
      ...(template.composition === "mint-serenity" ? mintSeed.content : {}),
      ...(template.composition === "eternal-moment" ? eternalSeed.content : {}),
      dressCode: "Your dress code goes here — for example, semi-formal.",
      // DOLCE VITA only: the standalone's own letter + dress-code
      // copy as the template defaults (template copy, not couple
      // data — the editor can replace it), plus the venue photo.
      ...(template.composition === "dolce-vita"
        ? {
            welcome:
              "As we count down the days to our wedding, our hearts are full of gratitude for the people who have shaped our story. Your love, your laughter and your friendship mean more to us than words can say, and we would be so happy to celebrate the beginning of our married life with you beside us.",
            dressCode:
              "We would love it if your outfit echoed the colours of our day — soft pastels, warm neutrals, and a touch of gold.",
            venueImage: "/images/themes/dolce-vita/venue-01.jpg",
          }
        : {}),
      footerMessage: "Thank you for being part of our day.",
      heroImage: themeHero,
      venueName: "Your venue",
      venueAddress: "Your venue address goes here",
      // THE SACRED GARDEN: the generic venue lines above would clobber
      // the seed — re-apply the seed's venue name/address here.
      ...(template.composition === "sacred-garden"
        ? {
            venueName: sacredSeed.content.venueName,
            venueAddress: sacredSeed.content.venueAddress,
          }
        : {}),
      // ROYAL BURGUNDY: same — re-apply the seed's venue, address and
      // dress code (the generic defaults above would clobber them).
      ...(template.composition === "royal-burgundy"
        ? {
            venueName: royalSeed.content.venueName,
            venueAddress: royalSeed.content.venueAddress,
            dressCode: royalSeed.content.dressCode,
          }
        : {}),
      // EMERALD / SAPPHIRE / BLUSH ROYALE: same — re-apply the seeds'
      // venue, address and dress code.
      ...(template.composition === "emerald-royale"
        ? {
            venueName: emeraldSeed.content.venueName,
            venueAddress: emeraldSeed.content.venueAddress,
            dressCode: emeraldSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "sapphire-royale"
        ? {
            venueName: sapphireSeed.content.venueName,
            venueAddress: sapphireSeed.content.venueAddress,
            dressCode: sapphireSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "blush-royale"
        ? {
            venueName: blushSeed.content.venueName,
            venueAddress: blushSeed.content.venueAddress,
            dressCode: blushSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "golden-hour"
        ? {
            venueName: goldenSeed.content.venueName,
            venueAddress: goldenSeed.content.venueAddress,
            dressCode: goldenSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "silver-moonlight"
        ? {
            venueName: silverSeed.content.venueName,
            venueAddress: silverSeed.content.venueAddress,
            dressCode: silverSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "rose-garden"
        ? {
            venueName: roseSeed.content.venueName,
            venueAddress: roseSeed.content.venueAddress,
            dressCode: roseSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "ocean-pearl"
        ? {
            venueName: oceanSeed.content.venueName,
            venueAddress: oceanSeed.content.venueAddress,
            dressCode: oceanSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "forest-whisper"
        ? {
            venueName: forestSeed.content.venueName,
            venueAddress: forestSeed.content.venueAddress,
            dressCode: forestSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "winter-frost"
        ? {
            venueName: winterSeed.content.venueName,
            venueAddress: winterSeed.content.venueAddress,
            dressCode: winterSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "autumn-harvest"
        ? {
            venueName: autumnSeed.content.venueName,
            venueAddress: autumnSeed.content.venueAddress,
            dressCode: autumnSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "peacock-royale"
        ? {
            venueName: peacockSeed.content.venueName,
            venueAddress: peacockSeed.content.venueAddress,
            dressCode: peacockSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "sakura-dream"
        ? {
            venueName: sakuraSeed.content.venueName,
            venueAddress: sakuraSeed.content.venueAddress,
            dressCode: sakuraSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "desert-dusk"
        ? {
            venueName: desertSeed.content.venueName,
            venueAddress: desertSeed.content.venueAddress,
            dressCode: desertSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "vintage-lace"
        ? {
            venueName: vintageSeed.content.venueName,
            venueAddress: vintageSeed.content.venueAddress,
            dressCode: vintageSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "starlight-noir"
        ? {
            venueName: starlightSeed.content.venueName,
            venueAddress: starlightSeed.content.venueAddress,
            dressCode: starlightSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "coral-sunset"
        ? {
            venueName: coralSeed.content.venueName,
            venueAddress: coralSeed.content.venueAddress,
            dressCode: coralSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "amethyst-royale"
        ? {
            venueName: amethystSeed.content.venueName,
            venueAddress: amethystSeed.content.venueAddress,
            dressCode: amethystSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "marble-luxe"
        ? {
            venueName: marbleSeed.content.venueName,
            venueAddress: marbleSeed.content.venueAddress,
            dressCode: marbleSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "tropical-palm"
        ? {
            venueName: tropicalSeed.content.venueName,
            venueAddress: tropicalSeed.content.venueAddress,
            dressCode: tropicalSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "aurora"
        ? {
            venueName: auroraSiteSeed.content.venueName,
            venueAddress: auroraSiteSeed.content.venueAddress,
            dressCode: auroraSiteSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "rustic-charm"
        ? {
            venueName: rusticSeed.content.venueName,
            venueAddress: rusticSeed.content.venueAddress,
            dressCode: rusticSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "sunflower-fields"
        ? {
            venueName: sunflowerSeed.content.venueName,
            venueAddress: sunflowerSeed.content.venueAddress,
            dressCode: sunflowerSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "mint-serenity"
        ? {
            venueName: mintSeed.content.venueName,
            venueAddress: mintSeed.content.venueAddress,
            dressCode: mintSeed.content.dressCode,
          }
        : {}),
      ...(template.composition === "eternal-moment"
        ? {
            venueName: eternalSeed.content.venueName,
            venueAddress: eternalSeed.content.venueAddress,
            dressCode: eternalSeed.content.dressCode,
          }
        : {}),
      mapLink: "",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
      // ROYAL BURGUNDY: the seed's own detail blocks (2 accommodations,
    // travel + registry) so the details card and details page render
    // full on the preview — the same blocks activation seeds.
    details:
      template.composition === "emerald-royale"
        ? emeraldSeed.details
      : template.composition === "sapphire-royale"
        ? sapphireSeed.details
      : template.composition === "blush-royale"
        ? blushSeed.details
      : template.composition === "golden-hour"
        ? goldenSeed.details
      : template.composition === "silver-moonlight"
        ? silverSeed.details
      : template.composition === "rose-garden"
        ? roseSeed.details
      : template.composition === "ocean-pearl"
        ? oceanSeed.details
      : template.composition === "forest-whisper"
        ? forestSeed.details
      : template.composition === "winter-frost"
        ? winterSeed.details
      : template.composition === "autumn-harvest"
        ? autumnSeed.details
      : template.composition === "peacock-royale"
        ? peacockSeed.details
      : template.composition === "sakura-dream"
        ? sakuraSeed.details
      : template.composition === "desert-dusk"
        ? desertSeed.details
      : template.composition === "vintage-lace"
        ? vintageSeed.details
      : template.composition === "starlight-noir"
        ? starlightSeed.details
      : template.composition === "coral-sunset"
        ? coralSeed.details
      : template.composition === "amethyst-royale"
        ? amethystSeed.details
      : template.composition === "marble-luxe"
        ? marbleSeed.details
      : template.composition === "tropical-palm"
        ? tropicalSeed.details
      : template.composition === "aurora"
        ? auroraSiteSeed.details
      : template.composition === "rustic-charm"
        ? rusticSeed.details
      : template.composition === "sunflower-fields"
        ? sunflowerSeed.details
      : template.composition === "mint-serenity"
        ? mintSeed.details
      : template.composition === "eternal-moment"
        ? eternalSeed.details
      : template.composition === "royal-burgundy"
        ? royalSeed.details
        : [
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
    // THE SACRED GARDEN: the audit's 5-event schedule (Guest Arrival
    // 5 PM, Nikkah Ceremony 6 PM, Mocktail Hour 7 PM, Dinner 8 PM,
    // Dance 9 PM), all marked as sample text. Events carry NO photos
    // in Phase A — the timeline renders names + times only.
    // DOLCE VITA: the standalone's 6-event schedule (Doors 16:30,
    // Ceremony 17:00, Cocktail 18:00, Dinner 20:00, Party 21:00, End
    // 23:00 — chronological, the standalone's fix for the source
    // site listing Dinner after Party), all marked as sample text.
    // Times stay 24-hour, exactly as the standalone shows them.
    events:
      template.composition === "dolce-vita"
        ? [
            { id: "ev-sample-doors", name: "Opening of the doors", date: weddingDay, time: "16:30", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own arrival details." },
            { id: "ev-sample-ceremony", name: "Ceremony", date: weddingDay, time: "17:00", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own ceremony details." },
            { id: "ev-sample-cocktail", name: "Cocktail and dancing time", date: weddingDay, time: "18:00", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own cocktail-hour details." },
            { id: "ev-sample-dinner", name: "Dinner", date: weddingDay, time: "20:00", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own dinner details." },
            { id: "ev-sample-party", name: "Party and Open Bar", date: weddingDay, time: "21:00", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own party details." },
            { id: "ev-sample-end", name: "End of the celebration", date: weddingDay, time: "23:00", venue: "Your venue", address: "Your venue address", description: "Sample event — replace this with your own closing details." },
          ]
        : template.composition === "sacred-garden"
          ? sacredSeed.events
        : template.composition === "emerald-royale"
          ? emeraldSeed.events
        : template.composition === "sapphire-royale"
          ? sapphireSeed.events
        : template.composition === "blush-royale"
          ? blushSeed.events
        : template.composition === "golden-hour"
          ? goldenSeed.events
        : template.composition === "silver-moonlight"
          ? silverSeed.events
        : template.composition === "rose-garden"
          ? roseSeed.events
        : template.composition === "ocean-pearl"
          ? oceanSeed.events
        : template.composition === "forest-whisper"
          ? forestSeed.events
        : template.composition === "winter-frost"
          ? winterSeed.events
        : template.composition === "autumn-harvest"
          ? autumnSeed.events
        : template.composition === "peacock-royale"
          ? peacockSeed.events
        : template.composition === "sakura-dream"
          ? sakuraSeed.events
        : template.composition === "desert-dusk"
          ? desertSeed.events
        : template.composition === "vintage-lace"
          ? vintageSeed.events
        : template.composition === "starlight-noir"
          ? starlightSeed.events
        : template.composition === "coral-sunset"
          ? coralSeed.events
        : template.composition === "amethyst-royale"
          ? amethystSeed.events
        : template.composition === "marble-luxe"
          ? marbleSeed.events
        : template.composition === "tropical-palm"
          ? tropicalSeed.events
        : template.composition === "aurora"
          ? auroraSiteSeed.events
        : template.composition === "rustic-charm"
          ? rusticSeed.events
        : template.composition === "sunflower-fields"
          ? sunflowerSeed.events
        : template.composition === "mint-serenity"
          ? mintSeed.events
        : template.composition === "eternal-moment"
          ? eternalSeed.events
        : template.composition === "royal-burgundy"
          ? royalSeed.events
        : [
      {
        id: "ev-sample-ceremony",
        name: "The Ceremony",
        date: weddingDay,
        time: "4:00 PM",
        venue: "Your venue",
        address: "Your venue address",
        description: "Sample event — replace this with your own ceremony details.",
        ...(template.composition === "eternel"
          ? { photo: "/images/themes/eternel/ceremony-01.jpg" }
          : {}),
        ...(template.composition === "blossom"
          ? { photo: "/images/themes/blossom/ceremony-01.jpg" }
          : {}),
      },
      {
        id: "ev-sample-reception",
        name: "The Reception",
        date: weddingDay,
        time: "6:00 PM",
        venue: "Your venue",
        address: "Your venue address",
        description: "Sample event — replace this with your own reception details.",
        ...(template.composition === "eternel"
          ? { photo: "/images/themes/eternel/reception-01.jpg" }
          : {}),
        ...(template.composition === "blossom"
          ? { photo: "/images/themes/blossom/reception-01.jpg" }
          : {}),
      },
    ],
    gallery:
      template.composition === "eternel"
        ? ETERNEL_GALLERY.map((url, i) => ({
            id: `g-eternel-${i + 1}`,
            url,
            caption: `Your photo ${i + 1}`,
          }))
        : template.composition === "blossom"
          ? BLOSSOM_GALLERY.map((url, i) => ({
              id: `g-blossom-${i + 1}`,
              url,
              caption: `Your photo ${i + 1}`,
            }))
          : template.composition === "sacred-garden"
            ? sacredSeed.gallery
          : template.composition === "emerald-royale"
            ? emeraldSeed.gallery
          : template.composition === "sapphire-royale"
            ? sapphireSeed.gallery
          : template.composition === "blush-royale"
            ? blushSeed.gallery
          : template.composition === "golden-hour"
            ? goldenSeed.gallery
          : template.composition === "silver-moonlight"
            ? silverSeed.gallery
          : template.composition === "rose-garden"
            ? roseSeed.gallery
          : template.composition === "ocean-pearl"
            ? oceanSeed.gallery
          : template.composition === "forest-whisper"
            ? forestSeed.gallery
          : template.composition === "winter-frost"
            ? winterSeed.gallery
          : template.composition === "autumn-harvest"
            ? autumnSeed.gallery
          : template.composition === "peacock-royale"
            ? peacockSeed.gallery
          : template.composition === "sakura-dream"
            ? sakuraSeed.gallery
          : template.composition === "desert-dusk"
            ? desertSeed.gallery
          : template.composition === "vintage-lace"
            ? vintageSeed.gallery
          : template.composition === "starlight-noir"
            ? starlightSeed.gallery
          : template.composition === "coral-sunset"
            ? coralSeed.gallery
          : template.composition === "amethyst-royale"
            ? amethystSeed.gallery
          : template.composition === "marble-luxe"
            ? marbleSeed.gallery
          : template.composition === "tropical-palm"
            ? tropicalSeed.gallery
          : template.composition === "aurora"
            ? auroraSiteSeed.gallery
          : template.composition === "rustic-charm"
            ? rusticSeed.gallery
          : template.composition === "sunflower-fields"
            ? sunflowerSeed.gallery
          : template.composition === "mint-serenity"
            ? mintSeed.gallery
          : template.composition === "eternal-moment"
            ? eternalSeed.gallery
          : template.composition === "royal-burgundy"
            ? royalSeed.gallery
          : template.composition === "dolce-vita"
            ? DOLCE_GALLERY.map((url, i) => ({
                id: `g-dolce-${i + 1}`,
                url,
                caption: `Your photo ${i + 1}`,
              }))
            : [
              // Detail shot first, so the story section uses it and the hero
              // image is not repeated three times on the preview page.
              { id: "g1", url: themeDetail, caption: "Your photo 1" },
              { id: "g2", url: themeHero, caption: "Your photo 2" },
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
