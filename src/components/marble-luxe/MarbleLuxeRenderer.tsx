// Marble Luxe renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — MarbleLuxeCover (minimal white-marble slab,
//                thin gold rules, live monogram in a gold ring,
//                subtle gold dust)
//   invitation — MarbleLuxeEnvelope (card-only double-door reveal:
//                two white-marble panels swing open on outer-edge
//                hinges to reveal the invitation card) + StoryPreview
//                (gallery wall) + DetailsCard (line-divided list) +
//                RSVPSection (clean white card with gold rule on
//                marble) + RSVP form + footer
//   story      — MarbleLuxeStory (gallery wall of large single
//                photos with generous spacing)
//   details    — MarbleLuxeDetails (line-divided list: schedule,
//                venue, dress code, accommodations, travel, registry,
//                RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The card's marble double doors are the
// interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import MarbleLuxeCover from "./MarbleLuxeCover";
import MarbleLuxeEnvelope from "./MarbleLuxeEnvelope";
import {
  MarbleLuxeCountdown,
  MarbleLuxeIntroduction,
  MarbleLuxeStoryPreview,
} from "./MarbleLuxeHero";
import {
  MarbleLuxeDetailsCard,
  MarbleLuxeFooter,
  MarbleLuxeRsvpSection,
} from "./MarbleLuxeSections";
import MarbleLuxeStory from "./MarbleLuxeStory";
import MarbleLuxeDetails from "./MarbleLuxeDetails";
import MarbleLuxeRsvpForm from "./MarbleLuxeRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";
import {
  MarbleOverlay,
  isCinematicSoundEnabled,
  playGoldShimmer,
  playMarbleBell,
  setCinematicSoundEnabled,
  type MarblePhase,
} from "./CinematicOpening";

type View = "cover" | "invitation" | "story" | "details";

export default function MarbleLuxeRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  // With no cover (editor live preview) start on the invitation —
  // the cover would block editing there (same contract as the other
  // template renderers).
  const [currentView, setCurrentView] = useState<View>(envelope ? "cover" : "invitation");
  const savedScrollRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Cinematic opening (Phases 3 + 4): the white marble slabs part
  // left/right slowly to reveal the invitation CARD mounted
  // underneath — its closed double doors, which the guest then taps
  // to unfold — then a gold line expands and a soft shimmer
  // dissolves them away. Timers are tracked so Skip / goToCover can
  // cancel them cleanly. (Slower cadence than the other templates —
  // the slabs take 3.0s to part, so fading starts at 3200ms.)
  const [panels, setPanels] = useState<"hidden" | MarblePhase>("hidden");
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
      playMarbleBell();
      later(80, () => setPanels("parting"));
      later(3200, () => {
        setPanels("fading");
        playGoldShimmer();
      });
      later(4400, () => {
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
    const el = document.getElementById("ml-rsvp-form");
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
    <div ref={rootRef} className="marble-luxe min-h-dvh w-full bg-white">
      {/* Root bg matches the invitation's first (white) surface so
          the cover-exit → invitation-entrance dissolve passes through
          white, never a flash. The cover itself is full-bleed marble,
          so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#1F2937] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Marble Luxe template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <MarbleLuxeCover
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
            {/* White invitation body */}
            <PaperSurface variant="white">
              <MarbleLuxeEnvelope site={site} />
              {showWelcome && <MarbleLuxeIntroduction site={site} />}
            </PaperSurface>

            {/* Minimal countdown on white */}
            {showCountdown && (
              <PaperSurface variant="white" className="px-4">
                <MarbleLuxeCountdown site={site} />
              </PaperSurface>
            )}

            {/* Gallery wall */}
            <MarbleLuxeStoryPreview site={site} onOpenStory={openStory} />

            {/* White details + RSVP */}
            <PaperSurface variant="white">
              <MarbleLuxeDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <MarbleLuxeRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="ml-rsvp-form" className="scroll-mt-6 bg-[#F7F7F5] px-4 pb-20">
                  <MarbleLuxeRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <MarbleLuxeFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <MarbleLuxeStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <MarbleLuxeDetails
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
        <MarbleOverlay
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
