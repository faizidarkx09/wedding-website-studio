// Tropical Palm renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — TropicalPalmCover (full-bleed beach photo with palm
//                shadows, palm-leaf crest with live monogram,
//                floating leaves, sand-cream name card)
//   invitation — TropicalPalmEnvelope (palm-seal envelope +
//                welcome + countdown on a deep-palm band) +
//                StoryPreview (island-hop strip) + DetailsCard +
//                RSVPSection (palm-leaf card) + RSVP form + footer
//   story      — TropicalPalmStory (island-hop journey + paragraphs
//                + beach band)
//   details    — TropicalPalmDetails (schedule, dress code, venue +
//                map, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's palm-frond seal is the
// interaction instead.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import TropicalPalmCover from "./TropicalPalmCover";
import TropicalPalmEnvelope from "./TropicalPalmEnvelope";
import {
  TropicalPalmCountdown,
  TropicalPalmIntroduction,
  TropicalPalmStoryPreview,
} from "./TropicalPalmHero";
import {
  TropicalPalmDetailsCard,
  TropicalPalmFooter,
  TropicalPalmRsvpSection,
} from "./TropicalPalmSections";
import TropicalPalmStory from "./TropicalPalmStory";
import TropicalPalmDetails from "./TropicalPalmDetails";
import TropicalPalmRsvpForm from "./TropicalPalmRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function TropicalPalmRenderer({
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
    const el = document.getElementById("tp-rsvp-form");
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
    <div ref={rootRef} className="tropical-palm min-h-dvh w-full bg-[#FFFBEB]">
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is full-bleed
          beach photo, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#14532D] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Tropical Palm template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <TropicalPalmCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Cream invitation body */}
            <PaperSurface variant="cream">
              <TropicalPalmEnvelope site={site} />
              {showWelcome && <TropicalPalmIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-palm countdown band */}
            {showCountdown && (
              <PaperSurface variant="palm" className="px-4 pt-14">
                <TropicalPalmCountdown site={site} />
              </PaperSurface>
            )}

            {/* Island-hop strip */}
            <TropicalPalmStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <PaperSurface variant="cream">
              <TropicalPalmDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <TropicalPalmRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="tp-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <TropicalPalmRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <TropicalPalmFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <TropicalPalmStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <TropicalPalmDetails
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
