// Winter Frost renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — WinterFrostCover (full-bleed snowy photo,
//                snowflake-crest medallion with live monogram,
//                falling snow, cinematic opening)
//   invitation — WinterFrostEnvelope (snowflake wax-seal envelope +
//                welcome + countdown on a deep-blue band) +
//                StoryPreview (snow-globe carousel) + DetailsCard +
//                RSVPSection (ice-blue ticket) + RSVP form + footer
//   story      — WinterFrostStory (snow-globe carousel + paragraphs)
//   details    — WinterFrostDetails (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// Cinematic opening (Phases 3–4 in PanelsOverlay): frosted-glass
// ice panels slide apart, then dissolve with a snowflake burst +
// aurora shimmer. NO music on this template — SFX only, via Web
// Audio created lazily on tap. The envelope's snowflake wax seal is
// the interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FrostSurface } from "./Decor";
import WinterFrostCover from "./WinterFrostCover";
import {
  PanelsOverlay,
  playFrostSound,
  playIceChimeSound,
  setCinematicSoundEnabled,
  type PanelsPhase,
} from "./CinematicOpening";
import WinterFrostEnvelope from "./WinterFrostEnvelope";
import {
  WinterFrostCountdown,
  WinterFrostIntroduction,
  WinterFrostStoryPreview,
} from "./WinterFrostHero";
import {
  WinterFrostDetailsCard,
  WinterFrostFooter,
  WinterFrostRsvpSection,
} from "./WinterFrostSections";
import WinterFrostStory from "./WinterFrostStory";
import WinterFrostDetails from "./WinterFrostDetails";
import WinterFrostRsvpForm from "./WinterFrostRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function WinterFrostRenderer({
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
  // apart; "fading" = panels dissolve + snowflake burst + shimmer.
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
      // while the two frosted-glass ice panels cover the screen,
      // then slide apart.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playFrostSound();
      later(80, () => setPanels("opening"));
      // Phase 4: panels dissolve, snowflake burst, aurora shimmer, chime.
      later(2580, () => {
        setPanels("fading");
        if (soundOnRef.current) playIceChimeSound();
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
    // Relayed from bug-fix lane 2026-11-27: top-0 jump yanked preview
    // pages above the template — scroll to this renderer's own top.
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
    const el = document.getElementById("wf-rsvp-form");
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
    <div ref={rootRef} className="winter-frost @container min-h-dvh w-full bg-[#EAF4FB]">
      {/* @container on the root: the countdown grid's
          `@min-[40rem]:flex` is a container query on the grid itself —
          an element cannot query itself, so without an ancestor
          container that variant never fired and the hexagons stayed
          3+2 at every width instead of one row on wide screens. The
          root is the ancestor container: viewport width on guest
          pages, preview-pane width in the editor, so the wide layout
          now applies exactly where intended. */}
      {/* Root bg matches the invitation's first (pale ice) surface so
          the cover-exit → invitation-entrance dissolve passes through
          pale ice, never a white flash. The cover itself is full-bleed
          snowy photo, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#12395B] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Winter Frost template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <WinterFrostCover
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
            {/* Pale-ice invitation body */}
            <FrostSurface variant="pale">
              <WinterFrostEnvelope site={site} />
              {showWelcome && <WinterFrostIntroduction site={site} />}
            </FrostSurface>

            {/* Deep-blue countdown band */}
            {showCountdown && (
              <FrostSurface variant="deep" className="px-4 pt-14">
                <WinterFrostCountdown site={site} />
              </FrostSurface>
            )}

            {/* Snow-globe carousel */}
            <WinterFrostStoryPreview site={site} onOpenStory={openStory} />

            {/* Frosted-glass details + ticket RSVP */}
            <WinterFrostDetailsCard site={site} onOpenDetails={openDetails} />
            {showRsvp && <WinterFrostRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
            {showRsvp && (
              <div id="wf-rsvp-form" className="scroll-mt-6 bg-[#EAF4FB] px-4 pb-20">
                <WinterFrostRsvpForm site={site} />
              </div>
            )}

            <WinterFrostFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <WinterFrostStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <WinterFrostDetails
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

      {/* Cinematic Phases 3–4: ice panels + snowflake burst, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {panels !== "hidden" && (
        <PanelsOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
