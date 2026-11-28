// Vintage Lace renderer — view machine (cover → invitation →
// story → details) following the GoldenHourRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — VintageLaceCover (lace-FRAME: photo inside an
//                ornate lace frame on ivory linen, live monogram
//                medallion, soft dust motes)
//   invitation — VintageLaceEnvelope (folded lace letter: the
//                card back at rest, accordion-unfold on tap to the
//                ivory letterpress card) + Introduction + Countdown
//                (deep-sepia band) + StoryPreview (open photo-ALBUM
//                spread) + DetailsCard (vintage postcards) +
//                RsvpSection (lace-edged letter) + RSVP form + footer
//   story      — VintageLaceStory (album spreads + lined-paper
//                paragraphs)
//   details    — VintageLaceDetails (schedule letter, dress code,
//                venue postcard, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The folded card is the interaction instead.
//
// Cinematic opening (Phases 1–2 in the cover, 3–4 here): the lace
// veil unfurls over the cover, the medallion warms on tap, then
// two lace-veil panels part sideways like curtains and dissolve
// with a lace-rosette transition + warm light sweep, ending on the
// folded invitation card. Plays once per page session; reduced
// motion or a replay takes the plain ~1.05s ceremony instead.
//
// FONTS: this template touches no shared file, so it cannot add
// classes to globals.css. The .vl-font-* classes are defined by the
// self-contained <style> block below, using the Google-font
// variables layout.tsx already loads (Cinzel, Great Vibes,
// Cormorant Garamond, Lora) with Georgia fallbacks.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import VintageLaceCover from "./VintageLaceCover";
import {
  VeilPanelsOverlay,
  playLaceSound,
  playSoftChimeSound,
  setCinematicSoundEnabled,
  type VeilPhase,
} from "./VintageCinematicOpening";
import VintageLaceEnvelope from "./VintageLaceEnvelope";
import {
  VintageLaceCountdown,
  VintageLaceIntroduction,
  VintageLaceStoryPreview,
} from "./VintageLaceHero";
import {
  VintageLaceDetailsCard,
  VintageLaceFooter,
  VintageLaceRsvpSection,
} from "./VintageLaceSections";
import VintageLaceStory from "./VintageLaceStory";
import VintageLaceDetails from "./VintageLaceDetails";
import VintageLaceRsvpForm from "./VintageLaceRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

const VL_FONT_CSS = `
.vl-font-display { font-family: var(--font-cinzel), Georgia, "Times New Roman", serif; font-weight: 400; }
.vl-font-script { font-family: var(--font-great-vibes), "Snell Roundhand", cursive; font-weight: 400; }
.vl-font-editorial { font-family: var(--font-cormorant-garamond), Georgia, "Times New Roman", serif; font-weight: 400; }
.vl-font-body { font-family: var(--font-lora), Georgia, "Times New Roman", serif; font-weight: 400; }
`;

type View = "cover" | "invitation" | "story" | "details";

export default function VintageLaceRenderer({
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
  // "closed" = veil panels covering the screen; "parting" = panels
  // sliding apart like curtains; "fading" = panels dissolve +
  // lace-rosette transition + warm light sweep.
  const [panels, setPanels] = useState<"hidden" | VeilPhase>("hidden");
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
      // while the two lace-veil panels cover the screen, then part.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playLaceSound();
      later(80, () => setPanels("parting"));
      // Phase 4: panels dissolve, rosette transition, light sweep, chime.
      later(2380, () => {
        setPanels("fading");
        if (soundOnRef.current) playSoftChimeSound();
      });
      later(3580, () => {
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
    // Relayed fix from bug-fix agent 1 (2026-11-27): the old top-0
    // jump yanked the viewport above the renderer on /templates/[id]
    // preview pages; scrollToRendererTop() is top 0 on guest sites
    // and the renderer's own top in preview, so it is correct in both.
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
    const el = document.getElementById("vl-rsvp-form");
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
    <div ref={rootRef} className="vintage-lace min-h-dvh w-full bg-[#FDF8F0]">
      {/* Self-contained font classes for this template (see header). */}
      <style>{VL_FONT_CSS}</style>
      {/* Root bg matches the invitation's first (ivory) surface so
          the cover-exit → invitation-entrance dissolve passes through
          ivory, never a white flash. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-30 bg-[#4A3A2E] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Vintage Lace template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <VintageLaceCover
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
            {/* Ivory invitation body */}
            <PaperSurface variant="ivory">
              <VintageLaceEnvelope site={site} />
              {showWelcome && <VintageLaceIntroduction site={site} />}
            </PaperSurface>

            {/* Deep-sepia countdown band */}
            {showCountdown && (
              <PaperSurface variant="sepia" className="px-4 pt-14">
                <VintageLaceCountdown site={site} />
              </PaperSurface>
            )}

            {/* Open album spread */}
            <VintageLaceStoryPreview site={site} onOpenStory={openStory} />

            {/* Ivory details + RSVP */}
            <PaperSurface variant="ivory">
              <VintageLaceDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <VintageLaceRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="vl-rsvp-form" className="scroll-mt-6 px-4 pb-20">
                  <VintageLaceRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <VintageLaceFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <VintageLaceStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <VintageLaceDetails
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

      {/* Cinematic Phases 3–4: lace-veil panels + rosette transition,
          rendered outside AnimatePresence so they survive the cover unmount. */}
      {panels !== "hidden" && (
        <VeilPanelsOverlay
          phase={panels}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
