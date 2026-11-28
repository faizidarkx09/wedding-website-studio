// Rose Garden renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — RoseGardenCover (garden-arch photo, names below in
//                script, falling rose petals)
//   invitation — RoseGardenEnvelope (classic pocket + live rose wax
//                seal + welcome + countdown on a leaf-green band) +
//                StoryPreview (compact vertical timeline) +
//                DetailsCard (seed packets) + RSVPSection
//                (rose-bordered letter) + RSVP form + footer
//   story      — RoseGardenStory (full vertical timeline with rose
//                markers, alternating sides on wide containers)
//   details    — RoseGardenDetails (seed packets, schedule, dress
//                code, venue + travel, accommodations, registry,
//                RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The live rose wax seal is the
// interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import RoseGardenCover from "./RoseGardenCover";
import {
  GardenGatesOverlay,
  playRoseChimeSound,
  playRoseGardenPaperSound,
  setRoseGardenSoundEnabled,
  type GardenGatesPhase,
} from "./RoseGardenCinematic";
import RoseGardenEnvelope from "./RoseGardenEnvelope";
import {
  RoseGardenCountdown,
  RoseGardenIntroduction,
  RoseGardenStoryPreview,
} from "./RoseGardenHero";
import {
  RoseGardenDetailsCard,
  RoseGardenFooter,
  RoseGardenRsvpSection,
} from "./RoseGardenSections";
import RoseGardenStory from "./RoseGardenStory";
import RoseGardenDetails from "./RoseGardenDetails";
import RoseGardenRsvpForm from "./RoseGardenRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function RoseGardenRenderer({
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

  // Cinematic opening state (cover Phases 3–4). "hidden" = no
  // gates; "closed" = trellis gates covering the screen;
  // "opening" = gates swing open from their outer hinges;
  // "fading" = gates dissolve + blooming rose + shimmer sweep.
  const [gates, setGates] = useState<"hidden" | GardenGatesPhase>("hidden");
  // Instant cover exit while the gates cover the screen, and a
  // subtle 1.04 → 1 reveal zoom on the invitation mounting underneath.
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
    setGates("hidden");
    setInstantExit(false);
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      soundOnRef.current = next;
      setRoseGardenSoundEnabled(next);
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
      // while the gates cover the screen, then the gates swing open
      // from their outer hinges.
      setInstantExit(true);
      setRevealZoom(true);
      setGates("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playRoseGardenPaperSound();
      later(80, () => setGates("opening"));
      // Phase 4: gates dissolve, blooming rose + sweep, chime.
      later(2580, () => {
        setGates("fading");
        if (soundOnRef.current) playRoseChimeSound();
      });
      later(3780, () => {
        setGates("hidden");
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
    const el = document.getElementById("rg-rsvp-form");
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
    <div ref={rootRef} className="rose-garden min-h-dvh w-full bg-[#FFF7F2]">
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is a cream
          field with the arch photo, so this is invisible until the
          transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-30 bg-[#7E0C37] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Rose Garden template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <RoseGardenCover
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
              <RoseGardenEnvelope site={site} />
              {showWelcome && <RoseGardenIntroduction site={site} />}
            </PaperSurface>

            {/* Leaf-green countdown band */}
            {showCountdown && (
              <PaperSurface variant="leaf" className="px-4 pt-14">
                <RoseGardenCountdown site={site} />
              </PaperSurface>
            )}

            {/* Compact vertical timeline */}
            <RoseGardenStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <PaperSurface variant="cream">
              <RoseGardenDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <RoseGardenRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="rg-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <RoseGardenRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <RoseGardenFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <RoseGardenStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <RoseGardenDetails
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

      {/* Cinematic Phases 3–4: garden gates + blooming rose, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {gates !== "hidden" && (
        <GardenGatesOverlay
          phase={gates}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
