// Winter Frost renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — WinterFrostCover (full-bleed snowy photo,
//                snowflake-crest medallion with live monogram,
//                falling snow)
//   invitation — WinterFrostEnvelope (snowflake wax-seal envelope +
//                welcome + countdown on a deep-blue band) +
//                StoryPreview (snow-globe carousel) + DetailsCard +
//                RSVPSection (ice-blue ticket) + RSVP form + footer
//   story      — WinterFrostStory (snow-globe carousel + paragraphs)
//   details    — WinterFrostDetails (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's snowflake wax seal is
// the interaction instead.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FrostSurface } from "./Decor";
import WinterFrostCover from "./WinterFrostCover";
import WinterFrostEnvelope from "./WinterFrostEnvelope";
import {
  WinterFrostCountdown,
  WinterFrostIntroduction,
  WinterFrostStoryPreview,
} from "./WinterFrostHero";
import {
  WinterFrostDetailsCard,
  WinterFrostFooter,
  WinterFrostRsvpSection,
} from "./WinterFrostSections";
import WinterFrostStory from "./WinterFrostStory";
import WinterFrostDetails from "./WinterFrostDetails";
import WinterFrostRsvpForm from "./WinterFrostRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function WinterFrostRenderer({
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
    const el = document.getElementById("wf-rsvp-form");
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
    <div ref={rootRef} className="winter-frost min-h-dvh w-full bg-[#EAF4FB]">
      {/* Root bg matches the invitation's first (pale ice) surface so
          the cover-exit → invitation-entrance dissolve passes through
          pale ice, never a white flash. The cover itself is full-bleed
          snowy photo, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#12395B] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Winter Frost template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <WinterFrostCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Pale-ice invitation body */}
            <FrostSurface variant="pale">
              <WinterFrostEnvelope site={site} />
              {showWelcome && <WinterFrostIntroduction site={site} />}
            </FrostSurface>

            {/* Deep-blue countdown band */}
            {showCountdown && (
              <FrostSurface variant="deep" className="px-4 pt-14">
                <WinterFrostCountdown site={site} />
              </FrostSurface>
            )}

            {/* Snow-globe carousel */}
            <WinterFrostStoryPreview site={site} onOpenStory={openStory} />

            {/* Frosted-glass details + ticket RSVP */}
            <WinterFrostDetailsCard site={site} onOpenDetails={openDetails} />
            {showRsvp && <WinterFrostRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
            {showRsvp && (
              <div id="wf-rsvp-form" className="scroll-mt-6 bg-[#EAF4FB] px-4 pb-20">
                <WinterFrostRsvpForm site={site} />
              </div>
            )}

            <WinterFrostFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <WinterFrostStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <WinterFrostDetails
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
