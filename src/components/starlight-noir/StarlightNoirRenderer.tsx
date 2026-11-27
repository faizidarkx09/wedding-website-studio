// Starlight Noir renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — StarlightNoirCover (full-bleed night-sky photo,
//                gold constellation lines, live monogram in a star
//                crest, twinkling stars)
//   invitation — StarlightNoirEnvelope (black envelope + gold star
//                wax seal + sliding black card) + welcome +
//                countdown on black + constellation-card story
//                preview + ledger details card + gold-foil ticket
//                RSVP section + RSVP form + footer
//   story      — StarlightNoirStory (story as a star chart)
//   details    — StarlightNoirDetails (full ledger + map)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's gold star wax seal is
// the interaction instead. The cinematic opening (cover Phases 1–2,
// renderer Phases 3–4) is SFX-only: a star twinkle on tap, a gold
// chime as the midnight panels part, never autoplay.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { NightSurface } from "./Decor";
import StarlightNoirCover from "./StarlightNoirCover";
import {
  NightPanelsOverlay,
  playStarChimeSound,
  playStarTwinkleSound,
  setCinematicSoundEnabled,
  type NightPanelsPhase,
} from "./StarlightCinematicOpening";
import StarlightNoirEnvelope from "./StarlightNoirEnvelope";
import {
  StarlightNoirCountdown,
  StarlightNoirIntroduction,
  StarlightNoirStoryPreview,
} from "./StarlightNoirHero";
import {
  StarlightNoirDetailsCard,
  StarlightNoirFooter,
  StarlightNoirRsvpSection,
} from "./StarlightNoirSections";
import StarlightNoirStory from "./StarlightNoirStory";
import StarlightNoirDetails from "./StarlightNoirDetails";
import StarlightNoirRsvpForm from "./StarlightNoirRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function StarlightNoirRenderer({
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
  // "closed" = midnight panels covering the screen; "parting" =
  // panels slide apart like night sky opening; "fading" = starfield
  // veil dissolves + gold star transition + sweep + chime.
  const [panels, setPanels] = useState<"hidden" | NightPanelsPhase>("hidden");
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
      // while the two midnight panels cover the screen, then part.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playStarTwinkleSound();
      later(80, () => setPanels("parting"));
      // Phase 4: veil dissolves, gold star transition, sweep, chime.
      later(2280, () => {
        setPanels("fading");
        if (soundOnRef.current) playStarChimeSound();
      });
      later(3480, () => {
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
    const el = document.getElementById("sn-rsvp-form");
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
    <div ref={rootRef} className="starlight-noir min-h-dvh w-full bg-[#0A0A0A]">
      {/* Root bg matches the invitation's first (black) surface so
          the cover-exit → invitation-entrance dissolve passes through
          black, never a white flash. The cover itself is a full-bleed
          night-sky photo, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#A8862A] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Starlight Noir template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <StarlightNoirCover
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
            {/* Black invitation body */}
            <NightSurface variant="black">
              <StarlightNoirEnvelope site={site} />
              {showWelcome && <StarlightNoirIntroduction site={site} />}
            </NightSurface>

            {/* Black star-clock countdown band */}
            {showCountdown && (
              <NightSurface variant="black" className="px-4 pt-14">
                <StarlightNoirCountdown site={site} />
              </NightSurface>
            )}

            {/* Constellation cards */}
            <StarlightNoirStoryPreview site={site} onOpenStory={openStory} />

            {/* Black ledger details + ticket RSVP */}
            <NightSurface variant="black">
              <StarlightNoirDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <StarlightNoirRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="sn-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <StarlightNoirRsvpForm site={site} />
                </div>
              )}
            </NightSurface>

            <StarlightNoirFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <StarlightNoirStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <StarlightNoirDetails
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

      {/* Cinematic Phases 3–4: midnight panels + gold star transition,
          rendered outside AnimatePresence so they survive the cover
          unmount. */}
      {panels !== "hidden" && (
        <NightPanelsOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
