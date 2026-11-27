// Coral Sunset renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — CoralSunsetCover (sunset-gradient sky, glowing sun
//                disc with live monogram, names over the gradient,
//                hero photo in an arch window, embers)
//   invitation — CoralSunsetEnvelope (coral sun-seal envelope +
//                welcome + countdown on a deep-plum band) +
//                StoryPreview (sunset strip) + DetailsCard (coral
//                rounded tiles) + RSVPSection (sunset postcard) +
//                RSVP form + footer
//   story      — CoralSunsetStory (sunset strip + paragraphs +
//                arch-top trio)
//   details    — CoralSunsetDetails (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's coral sun-disc seal is
// the interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SunsetSurface } from "./Decor";
import CoralSunsetCover from "./CoralSunsetCover";
import CoralSunsetEnvelope from "./CoralSunsetEnvelope";
import {
  CoralSunsetCountdown,
  CoralSunsetIntroduction,
  CoralSunsetStoryPreview,
} from "./CoralSunsetHero";
import {
  CoralSunsetDetailsCard,
  CoralSunsetFooter,
  CoralSunsetRsvpSection,
} from "./CoralSunsetSections";
import CoralSunsetStory from "./CoralSunsetStory";
import CoralSunsetDetails from "./CoralSunsetDetails";
import CoralSunsetRsvpForm from "./CoralSunsetRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";
import {
  SunsetOverlay,
  isCinematicSoundEnabled,
  playSunsetChime,
  playWaveSound,
  setCinematicSoundEnabled,
  type SunsetPhase,
} from "./CinematicOpening";

type View = "cover" | "invitation" | "story" | "details";

export default function CoralSunsetRenderer({
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

  // Cinematic opening (Phases 3 + 4): the sunset-gradient panels
  // split like a horizon while the invitation mounts underneath,
  // then a rising sun + warm shimmer dissolve them away. Timers
  // are tracked so Skip / goToCover can cancel them cleanly.
  const [panels, setPanels] = useState<"hidden" | SunsetPhase>("hidden");
  const [instantExit, setInstantExit] = useState(false);
  const [revealZoom, setRevealZoom] = useState(false);
  const [soundOn, setSoundOn] = useState(isCinematicSoundEnabled());
  const soundOnRef = useRef(isCinematicSoundEnabled());
  const cinematicTimersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      for (const t of cinematicTimersRef.current) window.clearTimeout(t);
      cinematicTimersRef.current = [];
    },
    [],
  );

  const later = (ms: number, fn: () => void) => {
    cinematicTimersRef.current.push(window.setTimeout(fn, ms));
  };

  const clearCinematicTimers = () => {
    for (const t of cinematicTimersRef.current) window.clearTimeout(t);
    cinematicTimersRef.current = [];
  };

  const finishCinematic = () => {
    clearCinematicTimers();
    setPanels("hidden");
    setInstantExit(false);
  };

  const toggleSound = () => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    setCinematicSoundEnabled(next);
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
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      playWaveSound();
      later(80, () => setPanels("parting"));
      later(2580, () => {
        setPanels("fading");
        playSunsetChime();
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
    const el = document.getElementById("cs-rsvp-form");
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
    <div ref={rootRef} className="coral-sunset min-h-dvh w-full bg-[#FFF6EE]">
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#2E1420] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Coral Sunset template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <CoralSunsetCover
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
            <SunsetSurface variant="cream">
              <CoralSunsetEnvelope site={site} />
              {showWelcome && <CoralSunsetIntroduction site={site} />}
            </SunsetSurface>

            {/* Deep-plum countdown band */}
            {showCountdown && <CoralSunsetCountdown site={site} />}

            {/* Sunset strip */}
            <CoralSunsetStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <SunsetSurface variant="cream">
              <CoralSunsetDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <CoralSunsetRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="cs-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <CoralSunsetRsvpForm site={site} />
                </div>
              )}
            </SunsetSurface>

            <CoralSunsetFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <CoralSunsetStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <CoralSunsetDetails
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

      {/* Cinematic overlay (Phases 3 + 4) — outside AnimatePresence
          so it survives the cover → invitation view swap. */}
      {panels !== "hidden" && (
        <SunsetOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={() => {
            finishCinematic();
            setRevealZoom(false);
          }}
        />
      )}
    </div>
  );
}
