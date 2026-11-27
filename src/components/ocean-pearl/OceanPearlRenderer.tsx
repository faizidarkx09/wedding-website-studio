// Ocean Pearl renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — OceanPearlCover (full-bleed wave photo, clean sans
//                names over the water, wave divider, rising bubbles)
//   invitation — OceanPearlEnvelope (shell-seal envelope with a
//                scalloped pocket + welcome + countdown on a
//                deep-sea band) + StoryPreview (horizontal-scroll
//                strip) + DetailsCard (bubble cards) + RSVPSection
//                (message in a bottle) + RSVP form + footer
//   story      — OceanPearlStory (horizontal-scroll strip +
//                paragraphs)
//   details    — OceanPearlDetails (time bubbles, dress code, venue
//                + travel, bubble-card accommodations, registry,
//                RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's live shell seal is the
// interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import OceanPearlCover from "./OceanPearlCover";
import {
  TideOverlay,
  playOceanPearlPaperSound,
  playWaterChimeSound,
  setOceanPearlSoundEnabled,
  type TidePhase,
} from "./OceanPearlCinematic";
import OceanPearlEnvelope from "./OceanPearlEnvelope";
import {
  OceanPearlCountdown,
  OceanPearlIntroduction,
  OceanPearlStoryPreview,
} from "./OceanPearlHero";
import {
  OceanPearlDetailsCard,
  OceanPearlFooter,
  OceanPearlRsvpSection,
} from "./OceanPearlSections";
import OceanPearlStory from "./OceanPearlStory";
import OceanPearlDetails from "./OceanPearlDetails";
import OceanPearlRsvpForm from "./OceanPearlRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function OceanPearlRenderer({
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
  // tide; "closed" = wave parked above the screen; "opening" =
  // wave washes down and recedes off the bottom; "fading" = wave
  // gone, pearl + shimmer sweep.
  const [tide, setTide] = useState<"hidden" | TidePhase>("hidden");
  // Instant cover exit while the tide covers the screen, and a
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
    setTide("hidden");
    setInstantExit(false);
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      soundOnRef.current = next;
      setOceanPearlSoundEnabled(next);
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
      // while the wave is parked above the screen, then the wave
      // washes down and recedes off the bottom.
      setInstantExit(true);
      setRevealZoom(true);
      setTide("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playOceanPearlPaperSound();
      later(80, () => setTide("opening"));
      // Phase 4: wave gone, pearl + sweep, chime.
      later(2580, () => {
        setTide("fading");
        if (soundOnRef.current) playWaterChimeSound();
      });
      later(3780, () => {
        setTide("hidden");
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
    const el = document.getElementById("op-rsvp-form");
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
    <div ref={rootRef} className="ocean-pearl min-h-dvh w-full bg-[#F7FBFC]">
      {/* Root bg matches the invitation's first (pearl) surface so
          the cover-exit → invitation-entrance dissolve passes through
          pearl, never a white flash. The cover itself is a full-bleed
          wave photograph, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#0E3A45] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Ocean Pearl template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <OceanPearlCover
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
            {/* Pearl invitation body */}
            <PaperSurface variant="pearl">
              <OceanPearlEnvelope site={site} />
              {showWelcome && <OceanPearlIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-sea countdown band */}
            {showCountdown && (
              <PaperSurface variant="deep" className="px-4 pt-14">
                <OceanPearlCountdown site={site} />
              </PaperSurface>
            )}

            {/* Horizontal-scroll story strip */}
            <OceanPearlStoryPreview site={site} onOpenStory={openStory} />

            {/* Pearl details + RSVP */}
            <PaperSurface variant="pearl">
              <OceanPearlDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <OceanPearlRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="op-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <OceanPearlRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <OceanPearlFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <OceanPearlStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <OceanPearlDetails
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

      {/* Cinematic Phases 3–4: the tide + pearl, rendered outside
          AnimatePresence so they survive the cover unmount. */}
      {tide !== "hidden" && (
        <TideOverlay
          phase={tide}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
