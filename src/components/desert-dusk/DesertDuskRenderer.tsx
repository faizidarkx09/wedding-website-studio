// Desert Dusk renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — DesertDuskCover (dune-HORIZON photo, names in the
//                sky, sun emblem with live monogram, sand-glow dust)
//   invitation — DesertDuskEnvelope (terracotta envelope + gold sun
//                seal + sliding card) + welcome + dusk countdown
//                band + caravan-route story preview + oasis details
//                card + postcard RSVP section + RSVP form + footer
//   story      — DesertDuskStory (caravan route + paragraphs +
//                triptych)
//   details    — DesertDuskDetails (route-timeline schedule, dress
//                code, venue + travel, oasis arch accommodations,
//                registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's gold sun seal is the
// interaction instead. The cinematic opening adds synthesised SFX
// only (desert wind + warm chime), never music.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import DesertDuskCover from "./DesertDuskCover";
import {
  DunePanelsOverlay,
  playDesertChimeSound,
  playWindSound,
  setCinematicSoundEnabled,
  type DunePanelsPhase,
} from "./DesertCinematicOpening";
import DesertDuskEnvelope from "./DesertDuskEnvelope";
import {
  DesertDuskCountdown,
  DesertDuskIntroduction,
  DesertDuskStoryPreview,
} from "./DesertDuskHero";
import {
  DesertDuskDetailsCard,
  DesertDuskFooter,
  DesertDuskRsvpSection,
} from "./DesertDuskSections";
import DesertDuskStory from "./DesertDuskStory";
import DesertDuskDetails from "./DesertDuskDetails";
import DesertDuskRsvpForm from "./DesertDuskRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function DesertDuskRenderer({
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
  // "closed" = panels covering the screen; "opening" = panels slide
  // apart; "fading" = panels dissolve + sun-disc transition + sweep.
  const [panels, setPanels] = useState<"hidden" | DunePanelsPhase>("hidden");
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
      // while the two dune panels cover the screen, then slide apart.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playWindSound();
      later(80, () => setPanels("opening"));
      // Phase 4: panels dissolve, sun-disc transition, sweep, chime.
      later(2580, () => {
        setPanels("fading");
        if (soundOnRef.current) playDesertChimeSound();
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
    const el = document.getElementById("dd-rsvp-form");
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
    <div ref={rootRef} className="desert-dusk min-h-dvh w-full bg-[#F5E6D3]">
      {/* Root bg matches the invitation's first (sand) surface so
          the cover-exit → invitation-entrance dissolve passes through
          sand, never a white flash. The cover itself is full-bleed
          desert-dusk photo, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#3D2133] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Desert Dusk template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <DesertDuskCover
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
            {/* Sand invitation body */}
            <PaperSurface variant="sand">
              <DesertDuskEnvelope site={site} />
              {showWelcome && <DesertDuskIntroduction site={site} />}
            </PaperSurface>

            {/* Dusk-purple countdown band */}
            {showCountdown && (
              <PaperSurface variant="dusk">
                <DesertDuskCountdown site={site} />
              </PaperSurface>
            )}

            {/* Caravan-route story preview */}
            <DesertDuskStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <PaperSurface variant="cream">
              <DesertDuskDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <DesertDuskRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="dd-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <DesertDuskRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <DesertDuskFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <DesertDuskStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <DesertDuskDetails
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

      {/* Cinematic Phases 3–4: dune panels + sun-disc transition,
          rendered outside AnimatePresence so they survive the cover
          unmount. */}
      {panels !== "hidden" && (
        <DunePanelsOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
