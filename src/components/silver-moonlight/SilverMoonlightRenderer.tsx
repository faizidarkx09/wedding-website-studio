// Silver Moonlight renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — SilverMoonlightCover (night sky, crescent moon,
//                twinkling stars, silver crescent seal with live
//                monogram)
//   invitation — SilverMoonlightEnvelope (silver crescent seal +
//                sliding ice-white card) + welcome + countdown on a
//                deep-night band + StoryPreview (three moonlit photo
//                cards) + DetailsCard (slate panels) + RSVPSection
//                (silver-trimmed card) + RSVP form + footer
//   story      — SilverMoonlightStory (moonlit cards + triptych +
//                paragraphs)
//   details    — SilverMoonlightDetails (schedule, dress code, venue
//                + travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's silver crescent seal is
// the interaction instead.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { NightSurface } from "./Decor";
import SilverMoonlightCover from "./SilverMoonlightCover";
import {
  EclipseOverlay,
  playMoonChimeSound,
  playSilverMoonlightPaperSound,
  setSilverMoonlightSoundEnabled,
  type EclipsePhase,
} from "./SilverMoonlightCinematic";
import SilverMoonlightEnvelope from "./SilverMoonlightEnvelope";
import {
  SilverMoonlightCountdown,
  SilverMoonlightIntroduction,
  SilverMoonlightStoryPreview,
} from "./SilverMoonlightHero";
import {
  SilverMoonlightDetailsCard,
  SilverMoonlightFooter,
  SilverMoonlightRsvpSection,
} from "./SilverMoonlightSections";
import SilverMoonlightStory from "./SilverMoonlightStory";
import SilverMoonlightDetails from "./SilverMoonlightDetails";
import SilverMoonlightRsvpForm from "./SilverMoonlightRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function SilverMoonlightRenderer({
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
  // eclipse; "closed" = night overlay covering the screen;
  // "opening" = circular hole expands; "fading" = overlay dissolves
  // + crescent + silver sweep.
  const [eclipse, setEclipse] = useState<"hidden" | EclipsePhase>("hidden");
  // Instant cover exit while the eclipse covers the screen, and a
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
    setEclipse("hidden");
    setInstantExit(false);
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      soundOnRef.current = next;
      setSilverMoonlightSoundEnabled(next);
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
  // own top instead, keeping the viewport on the cover. (Sapphire /
  // Blush round-3 fix — the old window.scrollTo({top: 0}) is never
  // used for the cover ceremony.)
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
      // while the night overlay covers the screen, then the eclipse
      // hole expands from the seal outward.
      setInstantExit(true);
      setRevealZoom(true);
      setEclipse("closed");
      setCurrentView("invitation");
      scrollToRendererTop();
      if (soundOnRef.current) playSilverMoonlightPaperSound();
      later(80, () => setEclipse("opening"));
      // Phase 4: overlay dissolves, crescent + sweep, chime.
      later(2480, () => {
        setEclipse("fading");
        if (soundOnRef.current) playMoonChimeSound();
      });
      later(3680, () => {
        setEclipse("hidden");
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
    const el = document.getElementById("sm-rsvp-form");
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
    <div ref={rootRef} className="silver-moonlight min-h-dvh w-full bg-[#F4F7FA]">
      {/* Root bg matches the invitation's first (ice-white) surface so
          the cover-exit → invitation-entrance dissolve passes through
          ice white, never a white flash. The cover itself is full-bleed
          night, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#16202E] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Silver Moonlight template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <SilverMoonlightCover
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
            {/* Ice-white invitation body */}
            <NightSurface variant="ice">
              <SilverMoonlightEnvelope site={site} />
              {showWelcome && <SilverMoonlightIntroduction site={site} />}
            </NightSurface>

            {/* Deep-night countdown band */}
            {showCountdown && (
              <NightSurface variant="night" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <SilverMoonlightCountdown site={site} />
              </NightSurface>
            )}

            {/* Three moonlit photo cards */}
            <SilverMoonlightStoryPreview site={site} onOpenStory={openStory} />

            {/* Ice-white details + RSVP */}
            <NightSurface variant="ice">
              <SilverMoonlightDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <SilverMoonlightRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                // @container for the RSVP form's own @min-[40rem]:
                // rules (the form cannot query its own container).
                <div id="sm-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6 @container">
                  <SilverMoonlightRsvpForm site={site} />
                </div>
              )}
            </NightSurface>

            <SilverMoonlightFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <SilverMoonlightStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <SilverMoonlightDetails
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

      {/* Cinematic Phases 3–4: eclipse reveal + crescent, rendered
          outside AnimatePresence so they survive the cover unmount. */}
      {eclipse !== "hidden" && (
        <EclipseOverlay
          phase={eclipse}
          soundEnabled={soundOn}
          onToggleSound={toggleSound}
          onSkip={finishCinematic}
        />
      )}
    </div>
  );
}
