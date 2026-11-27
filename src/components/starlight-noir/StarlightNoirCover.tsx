// Starlight Noir opening cover — view 01. Full-bleed night-sky
// photograph with a gold constellation-line SVG overlay, "UNDER A
// SKY OF STARS", the couple names in gold Cinzel caps, the gold
// star constellation crest with the LIVE monogram overlaid as HTML
// text (never baked in), a twinkling-star particle layer, and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — the night sky
// twinkles while a constellation slowly draws itself line by line
// (~5s) with a soft gold glow; Phase 2 constellation activation
// on tap (~1.5s) — the constellation flares, a burst of gold
// starlight particles erupts, one slow pulse, a gold light sweep
// across the crest, button fades out; Phase 3+4 live in the
// renderer (NightPanelsOverlay): the cover exits instantly, the
// invitation card mounts underneath, two midnight panels part like
// night sky, then dissolve with a gold star transition + sweep,
// landing on the card BACK at rest ("Tap to Reveal") — the guest
// then taps the card and its back halves slide apart to reveal
// the front. There is no envelope anywhere in this opening.
// A reload in the same session, or a reduced-motion tap, takes the
// plain 1.0s ceremony instead. Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { StarCrest, Starfield } from "./Decor";
import {
  SkipButton,
  SoundToggle,
  StarlightCanvas,
  playStarTwinkleSound,
} from "./StarlightCinematicOpening";
import {
  COVER_IMAGE_URL,
  FONT_DISPLAY,
  FONT_SCRIPT,
  coupleNames,
  initials,
} from "./tokens";

const SESSION_FLAG = "sn-cinematic-played";

function alreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_FLAG) === "1";
  } catch {
    return false;
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_FLAG, "1");
  } catch {
    /* sessionStorage unavailable — sequence just replays on reload */
  }
}

/** Gold constellation lines drawn over the cover photo — a few
 * star polygons linked across the sky, echoing the photo's own
 * constellations. Pure SVG, no baked-in text. */
function CoverConstellations({ className = "" }: { className?: string }) {
  const stars: Array<[number, number, number]> = [
    [8, 12, 2.2],
    [22, 7, 1.6],
    [38, 14, 2.4],
    [55, 8, 1.8],
    [71, 13, 2.2],
    [86, 9, 1.7],
    [93, 22, 2.0],
    [14, 26, 1.5],
    [30, 30, 1.8],
    [63, 28, 1.6],
    [80, 32, 1.9],
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [2, 8],
    [7, 8],
    [8, 9],
    [9, 10],
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-x-0 top-0 h-[42%] w-full ${className}`}
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={stars[a][0]}
          y1={stars[a][1]}
          x2={stars[b][0]}
          y2={stars[b][1]}
          stroke="#D4AF37"
          strokeWidth="0.18"
          opacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#F2D98C" opacity="0.9" />
      ))}
    </svg>
  );
}

export default function StarlightNoirCover({
  site,
  onOpen,
  instantExit = false,
  soundEnabled = true,
  onToggleSound = () => {},
}: {
  site: WeddingSite;
  onOpen: (opts?: { cinematic?: boolean }) => void;
  instantExit?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  // "idle" = Phase 1 anticipation; "flare" = Phase 2 activation.
  const [phase, setPhase] = useState<"idle" | "flare">("idle");
  const [burstKey, setBurstKey] = useState(0);
  const [flareKey, setFlareKey] = useState(0);
  const startedRef = useRef(false);
  const flareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (flareTimerRef.current) clearTimeout(flareTimerRef.current);
    },
    []
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setPhase("flare");
    setBurstKey((k) => k + 1);
    setFlareKey((k) => k + 1);
    if (soundEnabled) playStarTwinkleSound();
    // Phase 2 lasts ~1.5s; then the renderer takes over (panels).
    flareTimerRef.current = setTimeout(() => {
      onOpen({ cinematic: true });
    }, 1500);
  };

  const handleOpen = () => {
    if (startedRef.current) return;
    // Reduced motion, or a replay in the same session: plain ceremony.
    if (prefersReducedMotion || alreadyPlayed()) {
      startedRef.current = true;
      onOpen();
      return;
    }
    startCinematic();
  };

  const handleSkip = () => {
    if (flareTimerRef.current) clearTimeout(flareTimerRef.current);
    startedRef.current = true;
    markPlayed();
    onOpen();
  };

  const flaring = phase === "flare";

  return (
    // Cover exit is a deliberate ~1.0s ceremony, not a quick fade.
    // During the cinematic sequence the exit is instant instead —
    // the midnight panels cover the screen while the invitation mounts.
    <motion.div
      role="region"
      aria-label="Wedding Invitation Cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        instantExit
          ? { opacity: 0, transition: { duration: 0.05, ease: [0.65, 0, 0.35, 1] } }
          : { opacity: 0, y: -96, scale: 0.97, transition: { duration: 1.05, ease: [0.33, 0, 0.67, 1] } }
      }
      onClick={handleOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0A0A0A] px-5 py-12 text-[#F5EFE0] select-none"
    >
      {/* Full-bleed night-sky photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple standing beneath a black night sky full of gold stars and constellation lines"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlays so the gold type stays readable over the
          bright star field: heavier at top and bottom, lighter in
          the middle where the couple stands. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 10, 10, 0.78) 0%, rgba(10, 10, 10, 0.22) 30%, rgba(10, 10, 10, 0.18) 55%, rgba(10, 10, 10, 0.72) 100%)",
        }}
      />

      {/* Gold constellation lines over the photo */}
      <CoverConstellations className="opacity-80" />

      {/* Twinkling stars — ~60 slow gold stars over the photograph */}
      {!prefersReducedMotion && <Starfield density={60} />}

      {/* Phase 1 — the constellation draws itself line by line
          (~5s); Phase 2 — it flares + bursts gold starlight. */}
      {!prefersReducedMotion && (
        <StarlightCanvas
          ambientStars={0}
          autoDrawMs={5200}
          burstKey={burstKey}
          flareKey={flareKey}
          burstOrigin={{ x: 0.5, y: 0.42 }}
        />
      )}

      {/* Double gold hairline inner border framing the night-sky feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#D4AF37]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#D4AF37]/20"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the flare sequence is running */}
      {flaring && <SkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography — gold Cinzel caps, not script */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-xs tracking-[0.38em] text-[#F2D98C] uppercase drop-shadow-[0_2px_6px_rgba(10,10,10,0.9)]"
        >
          Under a Sky of Stars
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 px-3 text-[2.6rem] leading-[1.12] font-normal tracking-[0.06em] text-[#D4AF37] uppercase drop-shadow-[0_3px_14px_rgba(10,10,10,0.85)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Gold rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_SCRIPT }}
          className="mt-4 text-[1.7rem] leading-none text-[#F5EFE0] drop-shadow-[0_2px_8px_rgba(10,10,10,0.9)]"
        >
          written in the stars
        </motion.p>
      </div>

      {/* Central-Lower Star Constellation Crest with live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        {/* Phase 2 — soft golden glow around the crest, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212, 175, 55, 0.6) 0%, rgba(212, 175, 55, 0.14) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={flaring ? { opacity: [0, 0.95, 0.4] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : flaring
                ? { y: [0, -5, 0], scale: [1, 1.05, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            flaring
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[280px]"
        >
          <StarCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(10,10,10,0.7)]" />

          {/* Phase 2 — one gold light sweep across the crest */}
          {!prefersReducedMotion && flaring && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(242,217,140,0.6) 50%, transparent 100%)",
                  transform: "skewX(-12deg)",
                }}
                initial={{ x: "-160%" }}
                animate={{ x: "360%" }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[1.7rem] font-medium tracking-[0.08em] text-[#F2D98C] drop-shadow-[0_2px_8px_rgba(10,10,10,0.9)]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the constellation flares */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: flaring ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: flaring ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={flaring}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 text-xs tracking-[0.34em] text-[#F5EFE0] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] disabled:pointer-events-none"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(10,10,10,0.9)]">Open the Invitation</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F5EFE0]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
