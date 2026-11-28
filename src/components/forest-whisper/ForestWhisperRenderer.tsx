// Forest Whisper renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — ForestWhisperCover (SPLIT-SCREEN: forest photo left
//                ~55%, deep-green panel right with the names, leaf
//                crest with live monogram, fireflies)
//   invitation — ForestWhisperEnvelope (leaf-seal envelope with a
//                twine band + welcome + countdown on a deep-forest
//                band) + StoryPreview (zigzag rows) + DetailsCard
//                (trail map) + RSVPSection (wooden signboard) + RSVP
//                form + footer
//   story      — ForestWhisperStory (zigzag alternating rows +
//                paragraphs)
//   details    — ForestWhisperDetails (full trail map, dress code,
//                venue + travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The leaf seal is the interaction
// instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import ForestWhisperCover from "./ForestWhisperCover";
import {
  MistPanelsOverlay,
  playDawnChimeSound,
  playRustleSound,
  setCinematicSoundEnabled,
  type MistPanelsPhase,
} from "./CinematicOpening";
import ForestWhisperEnvelope from "./ForestWhisperEnvelope";
import {
  ForestWhisperCountdown,
  ForestWhisperIntroduction,
  ForestWhisperStoryPreview,
} from "./ForestWhisperHero";
import {
  ForestWhisperDetailsCard,
  ForestWhisperFooter,
  ForestWhisperRsvpSection,
} from "./ForestWhisperSections";
import ForestWhisperStory from "./ForestWhisperStory";
import ForestWhisperDetails from "./ForestWhisperDetails";
import ForestWhisperRsvpForm from "./ForestWhisperRsvpForm";
import { COVER_IMAGE_URL, resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function ForestWhisperRenderer({
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
  // "closed" = mist curtains covering the screen; "opening" = slide
  // apart; "fading" = panels dissolve + firefly burst + leaf swirl.
  const [panels, setPanels] = useState<"hidden" | MistPanelsPhase>("hidden");
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
      // while the two mist curtains cover the screen, then slide apart.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playRustleSound();
      later(80, () => setPanels("opening"));
      // Phase 4: curtains dissolve, firefly burst + leaf swirl, chime.
      later(2580, () => {
        setPanels("fading");
        if (soundOnRef.current) playDawnChimeSound();
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
    const el = document.getElementById("fw-rsvp-form");
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
    <div ref={rootRef} className="forest-whisper @container min-h-dvh w-full bg-[#F4F1E6]">
      {/* @container on the root: the Cover's `@min-[40rem]:flex-row`
          and the countdown grid's `@min-[40rem]:flex` are container
          queries on the elements themselves — an element cannot query
          itself, so without an ancestor container those variants never
          fired and the cover photo collapsed to height 0 at >=640px
          (photo div got w-[55%]/h-auto but the cover stayed flex-col).
          The root is the ancestor container: on guest pages it is the
          viewport width, in the editor preview it is the preview-pane
          width, so the wide layouts now apply exactly where intended. */}
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is split-screen
          photo + deep green, so this is invisible until the
          transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-30 bg-[#1B4332] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Forest Whisper template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <ForestWhisperCover
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
            <PaperSurface variant="cream">
              <ForestWhisperEnvelope site={site} />
              {showWelcome && <ForestWhisperIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-forest countdown band */}
            {showCountdown && (
              <PaperSurface variant="forest" className="px-4 pt-14">
                <ForestWhisperCountdown site={site} />
              </PaperSurface>
            )}

            {/* Zigzag story preview */}
            <ForestWhisperStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <PaperSurface variant="cream">
              <ForestWhisperDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <ForestWhisperRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="fw-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <ForestWhisperRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <ForestWhisperFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <ForestWhisperStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <ForestWhisperDetails
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

      {/* Cinematic Phases 3–4: mist curtains + firefly burst, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {panels !== "hidden" && (
        <MistPanelsOverlay
          phase={panels}
          coverUrl={COVER_IMAGE_URL}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
