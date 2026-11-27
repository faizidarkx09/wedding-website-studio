// Sakura Dream renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — SakuraDreamCover (branch-framed CIRCLE photo,
//                live monogram disc, falling sakura petals,
//                cinematic branch-bloom opening)
//   invitation — SakuraDreamEnvelope (blush envelope + live sakura
//                seal + sliding petal card) + welcome + countdown on
//                a deep-plum band + petal-path story preview +
//                folding-fan details card + petal-card RSVP section
//                + RSVP form + footer
//   story      — SakuraDreamStory (petal-path vertical scroll)
//   details    — SakuraDreamDetails (folding-fan panels, schedule,
//                dress code, venue + map, accommodations, registry,
//                RSVP jump)
//
// Cinematic opening (cover Phases 3–4): the petal curtain lifts
// strip by strip, then dissolves with a blossom swirl + shimmer +
// bloom chime. NO music on this template — SFX only, toggled from
// the cover / curtain controls.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import SakuraDreamCover from "./SakuraDreamCover";
import {
  FanOverlay,
  playBloomChimeSound,
  playPetalRustleSound,
  setCinematicSoundEnabled,
  type FanPhase,
} from "./SakuraCinematicOpening";
import SakuraDreamEnvelope from "./SakuraDreamEnvelope";
import {
  SakuraDreamCountdown,
  SakuraDreamIntroduction,
  SakuraDreamStoryPreview,
} from "./SakuraDreamHero";
import {
  SakuraDreamDetailsCard,
  SakuraDreamFooter,
  SakuraDreamRsvpSection,
} from "./SakuraDreamSections";
import SakuraDreamStory from "./SakuraDreamStory";
import SakuraDreamDetails from "./SakuraDreamDetails";
import SakuraDreamRsvpForm from "./SakuraDreamRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function SakuraDreamRenderer({
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
  // curtain; "closed" = curtain covering the screen; "lifting" =
  // strips rise with a stagger; "fading" = curtain dissolves +
  // blossom swirl + shimmer.
  const [fan, setFan] = useState<"hidden" | FanPhase>("hidden");
  // Instant cover exit while the curtain covers the screen, and a
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
    setFan("hidden");
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
  // own top instead, keeping the viewport on the cover. (Same fix as
  // Golden Hour / Sapphire / Blush — do NOT "simplify" to
  // window.scrollTo.)
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
      // while the petal curtain covers the screen, then lifts.
      setInstantExit(true);
      setRevealZoom(true);
      setFan("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playPetalRustleSound();
      later(80, () => setFan("lifting"));
      // Phase 4: curtain dissolves, blossom swirl, shimmer, chime.
      // Five strips × 0.12s stagger + 1.9s lift ≈ 2.4s.
      later(2480, () => {
        setFan("fading");
        if (soundOnRef.current) playBloomChimeSound();
      });
      later(3680, () => {
        setFan("hidden");
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
    const el = document.getElementById("sd-rsvp-form");
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
    <div ref={rootRef} className="sakura-dream min-h-dvh w-full bg-[#FFF7FB]">
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is blush-white
          with a circle photo, so this is invisible until the
          transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy / Golden Hour). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#6B21A8] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Sakura Dream template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <SakuraDreamCover
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
            {/* Blush invitation body */}
            <PaperSurface variant="blush">
              <SakuraDreamEnvelope site={site} />
              {showWelcome && <SakuraDreamIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-plum countdown band */}
            {showCountdown && (
              <PaperSurface variant="plum" className="px-4 pt-14">
                <SakuraDreamCountdown site={site} />
              </PaperSurface>
            )}

            {/* Petal-path story preview */}
            <SakuraDreamStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <PaperSurface variant="cream">
              <SakuraDreamDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <SakuraDreamRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="sd-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <SakuraDreamRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <SakuraDreamFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <SakuraDreamStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <SakuraDreamDetails
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

      {/* Cinematic Phases 3–4: petal curtain + blossom swirl, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {fan !== "hidden" && (
        <FanOverlay
          phase={fan}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
