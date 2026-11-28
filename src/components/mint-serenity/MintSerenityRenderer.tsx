// Mint Serenity renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — MintSerenityCover (mint wash with soft circles,
//                circular hero medallion, leaf-wreath live monogram,
//                soft bubbles)
//   invitation — MintSerenityEnvelope (mint leaf-seal envelope +
//                welcome + countdown on a deep-sage band) +
//                StoryPreview (floating bubble photos) + DetailsCard +
//                RSVPSection (mint bubble card) + RSVP form + footer
//   story      — MintSerenityStory (floating bubble photos +
//                paragraphs)
//   details    — MintSerenityDetails (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's sage leaf seal is the
// interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, SoftBubbles } from "./Decor";
import MintSerenityCover from "./MintSerenityCover";
import {
  MistOverlay,
  playChimeSound,
  playPopSound,
  setCinematicSoundEnabled,
  type PanelsPhase,
} from "./CinematicOpening";
import MintSerenityEnvelope from "./MintSerenityEnvelope";
import {
  MintSerenityCountdown,
  MintSerenityIntroduction,
  MintSerenityStoryPreview,
} from "./MintSerenityHero";
import {
  MintSerenityDetailsCard,
  MintSerenityFooter,
  MintSerenityRsvpSection,
} from "./MintSerenitySections";
import MintSerenityStory from "./MintSerenityStory";
import MintSerenityDetails from "./MintSerenityDetails";
import MintSerenityRsvpForm from "./MintSerenityRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function MintSerenityRenderer({
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

  // Cinematic opening state (cover Phases 3–4). "hidden" = no mist;
  // "closed" = mint mist covering the screen; "opening" = mist
  // thinning; "fading" = bubble-pop ring + mint sweep.
  const [panels, setPanels] = useState<"hidden" | PanelsPhase>("hidden");
  // Instant cover exit while the mist covers the screen, and a subtle
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

  const openInvitation = (opts?: { cinematic?: boolean }) => {
    if (opts?.cinematic) {
      // Phase 3: cover exits instantly, invitation mounts underneath
      // while the mint mist covers the screen, then dissolves.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playPopSound();
      later(80, () => setPanels("opening"));
      // Phase 4: bubble-pop ring + mint sweep, chime.
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
    const el = document.getElementById("ms-rsvp-form");
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
    <div ref={rootRef} className="mint-serenity min-h-dvh w-full bg-[#ECFDF5]">
      {/* Root bg matches the invitation's first (wash) surface so
          the cover-exit → invitation-entrance dissolve passes through
          mint wash, never a white flash. The cover itself is a mint
          wash with a circular medallion, so this is invisible until
          the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-30 bg-[#065F46] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Mint Serenity template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <MintSerenityCover
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
            {/* Mint wash invitation body — soft bubbles drift over it */}
            <PaperSurface variant="wash">
              <SoftBubbles />
              <MintSerenityEnvelope site={site} />
              {showWelcome && <MintSerenityIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-sage countdown band */}
            {showCountdown && (
              <PaperSurface variant="sage" className="px-4 pt-14">
                <MintSerenityCountdown site={site} />
              </PaperSurface>
            )}

            {/* Floating bubble photos */}
            <MintSerenityStoryPreview site={site} onOpenStory={openStory} />

            {/* Wash details + RSVP */}
            <PaperSurface variant="wash">
              <MintSerenityDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <MintSerenityRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="ms-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <MintSerenityRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <MintSerenityFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <MintSerenityStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <MintSerenityDetails
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

      {/* Cinematic Phases 3–4: mint mist dissolve + bubble-pop ring,
          rendered outside AnimatePresence so they survive the cover
          unmount. */}
      {panels !== "hidden" && (
        <MistOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
