// Blush Royale renderer — view machine (cover → invitation →
// story → details) following the Studio's renderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — BlushRoyaleCover (blush wash, rose-gold script,
//                wax-seal emblem + live monogram)
//   invitation — BlushRoyaleEnvelope + Introduction + Countdown
//                (blush wash band) + StoryPreview (CIRCULAR photos
//                with floral rings) + DetailsCard (blush rounded
//                cards) + RSVPSection (blush watercolor card) +
//                RSVP form + footer
//   story      — BlushRoyaleStory (ringed circles + paragraphs)
//   details    — BlushRoyaleDetails (blush rounded cards)
//
// NO music engine: this template ships without music by design.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { WashSurface } from "./Decor";
import BlushRoyaleCover from "./BlushRoyaleCover";
import {
  PanelsOverlay,
  playChimeSound,
  playPaperSound,
  setCinematicSoundEnabled,
  type PanelsPhase,
} from "./CinematicOpening";
import BlushRoyaleEnvelope from "./BlushRoyaleEnvelope";
import {
  BlushRoyaleCountdown,
  BlushRoyaleIntroduction,
  BlushRoyaleStoryPreview,
} from "./BlushRoyaleHero";
import {
  BlushRoyaleDetailsCard,
  BlushRoyaleFooter,
  BlushRoyaleRsvpSection,
} from "./BlushRoyaleSections";
import BlushRoyaleStory from "./BlushRoyaleStory";
import BlushRoyaleDetails from "./BlushRoyaleDetails";
import BlushRoyaleRsvpForm from "./BlushRoyaleRsvpForm";
import { resolveHeroSrc, willRenderSection, CREAM_IMAGE_URL, WASH_IMAGE_URL } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function BlushRoyaleRenderer({
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
  // "closed" = panels covering the screen; "opening" = rotateY unfold;
  // "fading" = panels dissolve + heart transition + shimmer.
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
  // own top instead, keeping the viewport on the cover.
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
      // while the two paper panels cover the screen, then rotate open.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playPaperSound();
      later(80, () => setPanels("opening"));
      // Phase 4: panels dissolve, heart transition, shimmer, chime.
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
    const el = document.getElementById("br-rsvp-form");
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
    <div ref={rootRef} className="blush-royale min-h-dvh w-full bg-[#FBF6F3]">
      {/* Root bg matches the invitation's first (cream) surface so the
          cover-exit → invitation-entrance dissolve passes through cream,
          never a white flash. The cover itself is full-bleed blush, so
          this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (same fix as
          Royal Burgundy / ÉTERNEL / Blossom). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#B76E79] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Blush Royale template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <BlushRoyaleCover
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
            {/* Cream invitation body */}
            <WashSurface variant="cream">
              <BlushRoyaleEnvelope site={site} />
              {showWelcome && <BlushRoyaleIntroduction site={site} />}
            </WashSurface>

            {/* Blush wash countdown band */}
            {showCountdown && (
              <WashSurface variant="wash" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <BlushRoyaleCountdown site={site} />
              </WashSurface>
            )}

            {/* Circular floral-ring story preview */}
            <BlushRoyaleStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <WashSurface variant="cream">
              <BlushRoyaleDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <BlushRoyaleRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="br-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6">
                  <BlushRoyaleRsvpForm site={site} />
                </div>
              )}
            </WashSurface>

            <BlushRoyaleFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <BlushRoyaleStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <BlushRoyaleDetails
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

      {/* Cinematic Phases 3–4: paper panels + heart transition, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {panels !== "hidden" && (
        <PanelsOverlay
          phase={panels}
          washUrl={WASH_IMAGE_URL}
          creamUrl={CREAM_IMAGE_URL}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
