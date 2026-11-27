// Peacock Royale renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — PeacockRoyaleCover (deep teal night, shimmering
//                gold sparkles, radial feather FAN over an arch
//                photo, gold feather seal with live monogram)
//   invitation — PeacockRoyaleEnvelope (gold feather seal +
//                sliding ivory card) + welcome + countdown on a
//                deep-teal band + StoryPreview (fan-shaped photo
//                arc) + DetailsCard (jewel boxes) + RSVPSection
//                (feather-framed card) + RSVP form + footer
//   story      — PeacockRoyaleStory (fan arc + triptych +
//                paragraphs)
//   details    — PeacockRoyaleDetails (schedule, dress code, venue
//                + travel, accommodations, registry, RSVP jump)
//
// Cinematic opening (once per session): the cover runs Phases 1–2
// (floating feather, rising jewels, seal glow + burst) and this
// renderer runs Phases 3–4 (FanPanelsOverlay).
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's gold feather seal is
// the interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PeacockSurface } from "./Decor";
import PeacockRoyaleCover from "./PeacockRoyaleCover";
import {
  FanPanelsOverlay,
  playChimeSound,
  playShimmerSound,
  setCinematicSoundEnabled,
  type PanelsPhase,
} from "./CinematicOpening";
import PeacockRoyaleEnvelope from "./PeacockRoyaleEnvelope";
import {
  PeacockRoyaleCountdown,
  PeacockRoyaleIntroduction,
  PeacockRoyaleStoryPreview,
} from "./PeacockRoyaleHero";
import {
  PeacockRoyaleDetailsCard,
  PeacockRoyaleFooter,
  PeacockRoyaleRsvpSection,
} from "./PeacockRoyaleSections";
import PeacockRoyaleStory from "./PeacockRoyaleStory";
import PeacockRoyaleDetails from "./PeacockRoyaleDetails";
import PeacockRoyaleRsvpForm from "./PeacockRoyaleRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function PeacockRoyaleRenderer({
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

  // Cinematic opening state (cover Phases 3–4). "hidden" = no panels;
  // "closed" = panels covering the screen; "opening" = rotateY unfold
  // + feather-fan bloom; "fading" = panels dissolve + feather-eye
  // transition + shimmer.
  const [panels, setPanels] = useState<"hidden" | PanelsPhase>("hidden");
  // Instant cover exit while the panels cover the screen, and a subtle
  // 1.04 → 1 reveal zoom on the invitation mounting underneath.
  const [instantExit, setInstantExit] = useState(false);
  const [revealZoom, setRevealZoom] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);
  const cinematicTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      cinematicTimersRef.current.forEach((t) => clearTimeout(t));
    },
    []
  );

  const later = (ms: number, fn: () => void) => {
    cinematicTimersRef.current.push(setTimeout(fn, ms));
  };

  const clearCinematicTimers = () => {
    cinematicTimersRef.current.forEach((t) => clearTimeout(t));
    cinematicTimersRef.current = [];
  };

  const finishCinematic = () => {
    clearCinematicTimers();
    setPanels("hidden");
    setInstantExit(false);
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      soundOnRef.current = next;
      setCinematicSoundEnabled(next);
      return next;
    });
  };

  // On template preview pages (/templates/[id]) this renderer sits far
  // down a long page (SiteNav + facts + How-to-buy above it), so
  // document top 0 is NOT the cover — scrolling there yanks the
  // viewport ~2 screens above the cover at the exact moment its exit
  // starts, and the ~2s ceremony plays off-screen while the user sees
  // the template facts. On guest sites the renderer IS the whole page,
  // so top 0 is correct there. In preview, scroll to this renderer's
  // own top instead, keeping the viewport on the cover. (Sapphire /
  // Blush round-3 fix — the old window.scrollTo({top: 0}) is never
  // used for the cover ceremony.)
  const scrollToRendererTop = () => {
    if (preview && rootRef.current) {
      const top = rootRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const openInvitation = (opts?: { cinematic?: boolean }) => {
    if (opts?.cinematic) {
      // Phase 3: cover exits instantly, invitation mounts underneath
      // while the two jewel panels cover the screen, then rotate open
      // as the feather fan blooms.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playShimmerSound();
      later(80, () => setPanels("opening"));
      // Phase 4: panels dissolve, feather-eye transition, shimmer, chime.
      later(2580, () => {
        setPanels("fading");
        if (soundOnRef.current) playChimeSound();
      });
      later(3780, () => {
        setPanels("hidden");
        setInstantExit(false);
      });
      return;
    }
    setCurrentView("invitation");
    scrollToRendererTop();
  };

  const openStory = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("story");
    scrollToRendererTop();
  };

  const openDetails = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("details");
    scrollToRendererTop();
  };

  const backToInvitation = () => {
    setCurrentView("invitation");
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollRef.current, behavior: "instant" as ScrollBehavior });
    });
  };

  const jumpToRsvp = () => {
    const el = document.getElementById("pr-rsvp-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToCover = () => {
    finishCinematic();
    setRevealZoom(false);
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
    <div ref={rootRef} className="peacock-royale min-h-dvh w-full bg-[#FDFBF5]">
      {/* Root bg matches the invitation's first (ivory) surface so
          the cover-exit → invitation-entrance dissolve passes through
          ivory white, never a white flash. The cover itself is full-bleed
          deep teal, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#062E2B] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Peacock Royale template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <PeacockRoyaleCover
            key="cover"
            site={site}
            onOpen={openInvitation}
            instantExit={instantExit}
            soundEnabled={soundOn}
            onToggleSound={toggleSound}
          />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36, scale: revealZoom ? 1.04 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ivory invitation body */}
            <PeacockSurface variant="ivory">
              <PeacockRoyaleEnvelope site={site} />
              {showWelcome && <PeacockRoyaleIntroduction site={site} />}
            </PeacockSurface>

            {/* Deep-teal countdown band */}
            {showCountdown && (
              <PeacockSurface variant="teal" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <PeacockRoyaleCountdown site={site} />
              </PeacockSurface>
            )}

            {/* Fan-shaped photo arc */}
            <PeacockRoyaleStoryPreview site={site} onOpenStory={openStory} />

            {/* Ivory details + RSVP */}
            <PeacockSurface variant="ivory">
              <PeacockRoyaleDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <PeacockRoyaleRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                // @container for the RSVP form's own @min-[40rem]:
                // rules (the form cannot query its own container).
                <div id="pr-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6 @container">
                  <PeacockRoyaleRsvpForm site={site} />
                </div>
              )}
            </PeacockSurface>

            <PeacockRoyaleFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <PeacockRoyaleStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <PeacockRoyaleDetails
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

      {/* Cinematic Phases 3–4: jewel panels + feather-fan bloom +
          feather-eye transition, rendered outside AnimatePresence so
          they survive the cover unmount. */}
      {panels !== "hidden" && (
        <FanPanelsOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
