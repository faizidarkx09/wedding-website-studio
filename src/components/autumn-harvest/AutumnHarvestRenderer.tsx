// Autumn Harvest renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — AutumnHarvestCover (TYPOGRAPHIC cover: big Playfair
//                serif names over a leaf-pattern photograph, leaf
//                wreath with live monogram, drifting leaves, cinematic
//                opening: amber leaf-seal glow + barn-door panels)
//   invitation — AutumnHarvestEnvelope (burnt-orange envelope, live
//                SVG maple-leaf wax seal, card tucked INSIDE at rest)
//                + Introduction + Countdown (burnt-orange band,
//                kraft ticket-stub clock) + StoryPreview (MASONRY
//                grid) + DetailsCard (harvest table rows) +
//                RsvpSection (kraft-paper tag) + RSVP form + footer
//   story      — AutumnHarvestStory (masonry grid + paragraphs)
//   details    — AutumnHarvestDetails (harvest-table rows: schedule,
//                dress code, venue + travel, accommodations,
//                registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The leaf seal is the interaction
// instead; the cinematic toggle controls SFX only.
//
// Fonts: the .ah-* classes are defined by the <style> block below
// (self-contained in this folder — no globals.css edit needed,
// Aurora precedent). They use next/font variables already loaded
// by layout.tsx: Playfair Display display serif, Great Vibes
// script, Allura alternate script, Cormorant Garamond editorial
// serif, Lora body.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import AutumnHarvestCover from "./AutumnHarvestCover";
import {
  PanelsOverlay,
  playHarvestChime,
  playPaperSound,
  setCinematicSoundEnabled,
  type PanelsPhase,
} from "./CinematicOpening";
import AutumnHarvestEnvelope from "./AutumnHarvestEnvelope";
import {
  AutumnHarvestCountdown,
  AutumnHarvestIntroduction,
  AutumnHarvestStoryPreview,
} from "./AutumnHarvestHero";
import {
  AutumnHarvestDetailsCard,
  AutumnHarvestFooter,
  AutumnHarvestRsvpSection,
} from "./AutumnHarvestSections";
import AutumnHarvestStory from "./AutumnHarvestStory";
import AutumnHarvestDetails from "./AutumnHarvestDetails";
import AutumnHarvestRsvpForm from "./AutumnHarvestRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

const AUTUMN_FONT_CSS = `
.ah-font-script { font-family: var(--font-great-vibes), "Snell Roundhand", cursive; font-weight: 400; }
.ah-font-script-alt { font-family: var(--font-allura), "Snell Roundhand", cursive; font-weight: 400; }
.ah-font-display { font-family: var(--font-playfair), Georgia, "Times New Roman", serif; font-weight: 400; }
.ah-font-editorial { font-family: var(--font-cormorant), Georgia, "Times New Roman", serif; font-weight: 400; }
.ah-font-body { font-family: var(--font-lora), Georgia, "Times New Roman", serif; font-weight: 400; }
`;

export default function AutumnHarvestRenderer({
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
  // "closed" = barn doors covering the screen; "opening" = doors
  // sliding apart; "fading" = panels dissolve + leaf transition +
  // golden sweep.
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
  // starts, and the ~2s ceremony plays off-screen while the user sees
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
      // while the two kraft barn doors cover the screen, then slide apart.
      setInstantExit(true);
      setRevealZoom(true);
      setPanels("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playPaperSound();
      later(80, () => setPanels("opening"));
      // Phase 4: doors dissolve, leaf transition, golden sweep, chime.
      later(2280, () => {
        setPanels("fading");
        if (soundOnRef.current) playHarvestChime();
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
    const el = document.getElementById("ah-rsvp-form");
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
    <div ref={rootRef} className="autumn-harvest @container min-h-dvh w-full bg-[#FFF7E8]">
      {/* @container on the root: the countdown grid's
          `@min-[40rem]:flex` is a container query on the grid itself —
          an element cannot query itself, so without an ancestor
          container that variant never fired and the ticket stubs stayed
          3+2 at every width instead of one row on wide screens. The
          root is the ancestor container: viewport width on guest
          pages, preview-pane width in the editor, so the wide layout
          now applies exactly where intended. */}
      {/* Scoped Autumn Harvest font classes (see header comment). */}
      <style>{AUTUMN_FONT_CSS}</style>
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is a leaf-pattern
          photograph on cream, so this is invisible until the
          transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#3A2412] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Autumn Harvest template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <AutumnHarvestCover
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
              <AutumnHarvestEnvelope site={site} />
              {showWelcome && <AutumnHarvestIntroduction site={site} />}
            </PaperSurface>

            {/* Burnt-orange countdown band */}
            {showCountdown && (
              <PaperSurface variant="orange" className="px-4 pt-14">
                <AutumnHarvestCountdown site={site} />
              </PaperSurface>
            )}

            {/* Masonry story preview */}
            <AutumnHarvestStoryPreview site={site} onOpenStory={openStory} />

            {/* Harvest-table details + kraft-tag RSVP */}
            <AutumnHarvestDetailsCard site={site} onOpenDetails={openDetails} />
            {showRsvp && <AutumnHarvestRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
            {showRsvp && (
              <div id="ah-rsvp-form" className="scroll-mt-6 bg-[#FFF7E8] px-4 pb-20">
                <AutumnHarvestRsvpForm site={site} />
              </div>
            )}

            <AutumnHarvestFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <AutumnHarvestStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <AutumnHarvestDetails
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

      {/* Cinematic Phases 3–4: kraft barn doors + leaf transition,
          rendered outside AnimatePresence so they survive the cover
          unmount. */}
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
