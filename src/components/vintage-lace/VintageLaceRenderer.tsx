// Vintage Lace renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — VintageLaceCover (lace-FRAME: photo inside an
//                ornate lace frame on ivory linen, live monogram
//                medallion, soft dust motes)
//   invitation — VintageLaceEnvelope (lace doily seal + sliding
//                ivory card) + Introduction + Countdown (deep-sepia
//                band) + StoryPreview (open photo-ALBUM spread) +
//                DetailsCard (vintage postcards) + RsvpSection
//                (lace-edged letter) + RSVP form + footer
//   story      — VintageLaceStory (album spreads + lined-paper
//                paragraphs)
//   details    — VintageLaceDetails (schedule letter, dress code,
//                venue postcard, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The lace seal is the interaction instead.
//
// FONTS: this template touches no shared file, so it cannot add
// classes to globals.css. The .vl-font-* classes are defined by the
// self-contained <style> block below, using the Google-font
// variables layout.tsx already loads (Cinzel, Great Vibes,
// Cormorant Garamond, Lora) with Georgia fallbacks.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import VintageLaceCover from "./VintageLaceCover";
import VintageLaceEnvelope from "./VintageLaceEnvelope";
import {
  VintageLaceCountdown,
  VintageLaceIntroduction,
  VintageLaceStoryPreview,
} from "./VintageLaceHero";
import {
  VintageLaceDetailsCard,
  VintageLaceFooter,
  VintageLaceRsvpSection,
} from "./VintageLaceSections";
import VintageLaceStory from "./VintageLaceStory";
import VintageLaceDetails from "./VintageLaceDetails";
import VintageLaceRsvpForm from "./VintageLaceRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

const VL_FONT_CSS = `
.vl-font-display { font-family: var(--font-cinzel), Georgia, "Times New Roman", serif; font-weight: 400; }
.vl-font-script { font-family: var(--font-great-vibes), "Snell Roundhand", cursive; font-weight: 400; }
.vl-font-editorial { font-family: var(--font-cormorant-garamond), Georgia, "Times New Roman", serif; font-weight: 400; }
.vl-font-body { font-family: var(--font-lora), Georgia, "Times New Roman", serif; font-weight: 400; }
`;

type View = "cover" | "invitation" | "story" | "details";

export default function VintageLaceRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  // With no envelope (editor live preview) start on the invitation —
  // the cover would block editing there (same contract as the other
  // template renderers).
  const [currentView, setCurrentView] = useState<View>(envelope ? "cover" : "invitation");
  const savedScrollRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // On template preview pages (/templates/[id]) this renderer sits far
  // down a long page (SiteNav + facts + How-to-buy above it), so
  // document top 0 is NOT the cover — scrolling there yanks the
  // viewport ~2 screens above the cover at the exact moment its exit
  // starts, and the ceremony plays off-screen while the user sees
  // the template facts. On guest sites the renderer IS the whole page,
  // so top 0 is correct there. In preview, scroll to this renderer's
  // own top instead, keeping the viewport on the cover. (Same fix as
  // Sapphire/Blush Round 3 — do NOT "simplify" to window.scrollTo.)
  const scrollToRendererTop = () => {
    if (preview && rootRef.current) {
      const top = rootRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const openInvitation = () => {
    setCurrentView("invitation");
    scrollToRendererTop();
  };

  const openStory = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("story");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const openDetails = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("details");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const backToInvitation = () => {
    setCurrentView("invitation");
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollRef.current, behavior: "instant" as ScrollBehavior });
    });
  };

  const jumpToRsvp = () => {
    const el = document.getElementById("vl-rsvp-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToCover = () => {
    setCurrentView("cover");
    scrollToRendererTop();
  };

  const navigateFromFooter = (view: "cover" | "story" | "details") => {
    if (view === "cover") goToCover();
    else if (view === "story") openStory();
    else openDetails();
  };

  const heroSrc = resolveHeroSrc(site);
  const showWelcome = willRenderSection(site, "welcome");
  const showCountdown = willRenderSection(site, "countdown");
  const showRsvp = willRenderSection(site, "rsvp");

  return (
    <div ref={rootRef} className="vintage-lace min-h-dvh w-full bg-[#FDF8F0]">
      {/* Self-contained font classes for this template (see header). */}
      <style>{VL_FONT_CSS}</style>
      {/* Root bg matches the invitation's first (ivory) surface so
          the cover-exit → invitation-entrance dissolve passes through
          ivory, never a white flash. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#4A3A2E] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Vintage Lace template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <VintageLaceCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ivory invitation body */}
            <PaperSurface variant="ivory">
              <VintageLaceEnvelope site={site} />
              {showWelcome && <VintageLaceIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-sepia countdown band */}
            {showCountdown && (
              <PaperSurface variant="sepia" className="px-4 pt-14">
                <VintageLaceCountdown site={site} />
              </PaperSurface>
            )}

            {/* Open album spread */}
            <VintageLaceStoryPreview site={site} onOpenStory={openStory} />

            {/* Ivory details + RSVP */}
            <PaperSurface variant="ivory">
              <VintageLaceDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <VintageLaceRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="vl-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <VintageLaceRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <VintageLaceFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <VintageLaceStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <VintageLaceDetails
            key="details"
            site={site}
            onBack={backToInvitation}
            onJumpToRsvp={() => {
              setCurrentView("invitation");
              requestAnimationFrame(() => {
                requestAnimationFrame(() => jumpToRsvp());
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
