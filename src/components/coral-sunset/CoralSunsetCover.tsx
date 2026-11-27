// Coral Sunset opening cover — view 01. A sunset-GRADIENT sky
// (deep plum → coral → peach) with a glowing sun disc carrying the
// LIVE monogram as HTML text (never baked in), the couple names in
// cream script over the gradient, the hero photograph in a wide
// arch window at the bottom, warm ember particles, and "OPEN THE
// INVITATION". Only the data comes from the site (Partner A /
// Partner B placeholders). No music on this template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { EmberParticles, SunDisc } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials, resolveHeroSrc } from "./tokens";
import { EmberCanvas, SkipButton, SoundToggle, playWaveSound } from "./CinematicOpening";

export default function CoralSunsetCover({
  site,
  onOpen,
  instantExit,
  soundEnabled = true,
  onToggleSound,
}: {
  site: WeddingSite;
  onOpen: (opts?: { cinematic?: boolean }) => void;
  instantExit?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const heroSrc = resolveHeroSrc(site);

  // Cinematic opening (Phase 1 ambience + Phase 2 sun-disc flare):
  // plays once per session; reduced-motion or a repeat visit opens
  // the invitation directly. Double-taps are guarded by startedRef.
  const SESSION_FLAG = "cs-cinematic-played";
  const [flaring, setFlaring] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const startedRef = useRef(false);
  const flareTimerRef = useRef<number | null>(null);

  const alreadyPlayed = () => {
    try {
      return sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      return false;
    }
  };
  const markPlayed = () => {
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      /* session storage unavailable — cinematic may replay */
    }
  };

  useEffect(
    () => () => {
      if (flareTimerRef.current !== null) window.clearTimeout(flareTimerRef.current);
    },
    [],
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setFlaring(true);
    setBurstKey((k) => k + 1);
    playWaveSound();
    flareTimerRef.current = window.setTimeout(() => {
      onOpen({ cinematic: true });
    }, 1500);
  };

  const handleOpen = () => {
    if (startedRef.current) return;
    if (prefersReducedMotion || alreadyPlayed()) {
      startedRef.current = true;
      onOpen();
      return;
    }
    startCinematic();
  };

  const handleSkip = () => {
    if (flareTimerRef.current !== null) window.clearTimeout(flareTimerRef.current);
    startedRef.current = true;
    onOpen();
  };

  return (
    <motion.div
      role="region"
      aria-label="Wedding Invitation Cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        instantExit
          ? { opacity: 0, transition: { duration: 0.35, ease: [0.33, 0, 0.67, 1] } }
          : { opacity: 0, y: -96, scale: 0.97, transition: { duration: 1.05, ease: [0.33, 0, 0.67, 1] } }
      }
      onClick={handleOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden px-5 pt-10 pb-8 text-[#FFF6EE] select-none"
      style={{
        background:
          "linear-gradient(180deg, #2E1420 0%, #5C2E3E 26%, #C94A2E 52%, #FF7F50 74%, #FFDAB9 100%)",
      }}
    >
      {/* Warm embers — ~46 slow glowing particles over the gradient */}
      {!prefersReducedMotion && <EmberParticles />}

      {/* Cinematic layer — rising embers + the Phase 2 burst */}
      {!prefersReducedMotion && <EmberCanvas burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.42 }} />}

      {/* Sound toggle — always visible; Skip appears while flaring */}
      {onToggleSound && <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />}
      {flaring && <SkipButton onSkip={handleSkip} />}

      {/* Double hairline inner border framing the sunset-card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#FFDAB9]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#FFF6EE]/25"
      />

      {/* Upper eyebrow */}
      <div className="relative z-10 flex flex-col items-center pt-4 text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display text-xs tracking-[0.38em] text-[#FFE8D6] uppercase drop-shadow-[0_2px_6px_rgba(46,20,32,0.8)]"
        >
          AS THE SUN SETS
        </motion.p>
      </div>

      {/* Sun disc with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-2 w-full max-w-[420px]"
      >
        <motion.div
          animate={
            flaring
              ? { y: 0, scale: [1, 1.04, 1] }
              : prefersReducedMotion
                ? undefined
                : { y: [0, -5, 0] }
          }
          transition={
            flaring
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[248px]"
        >
          <SunDisc className="absolute inset-0 h-full w-full drop-shadow-[0_10px_28px_rgba(46,20,32,0.55)]" />

          {/* Phase 2 flare — warm glow + light sweep across the disc */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-18%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,218,185,0.95) 0%, rgba(255,127,80,0.55) 45%, rgba(255,127,80,0) 72%)",
            }}
            initial={{ opacity: 0 }}
            animate={flaring ? { opacity: [0, 0.9, 0.4] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {flaring && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 w-1/4"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,218,185,0.6) 50%, transparent 100%)",
                }}
                initial={{ x: "-160%" }}
                animate={{ x: "360%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Sun Disc */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="cs-font-display cs-sun-embossed-text text-[1.8rem] font-medium tracking-[0.06em]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Couple names over the gradient */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="cs-font-script px-3 text-[3.2rem] leading-[1.08] font-normal tracking-normal text-[#FFF6EE] drop-shadow-[0_3px_14px_rgba(46,20,32,0.75)]"
        >
          {coupleNames(site)}
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#FFDAB9] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display mt-3 text-[11px] tracking-[0.34em] text-[#FFE8D6] uppercase drop-shadow-[0_2px_6px_rgba(46,20,32,0.8)]"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>
      </div>

      {/* Hero photograph in a wide arch window */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-6 w-full max-w-[560px]"
      >
        <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[6px] shadow-[0_24px_44px_-12px_rgba(46,20,32,0.65)] ring-2 ring-[#FFDAB9]/60">
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroSrc || COVER_IMAGE_URL}
              alt="A couple holding hands on a beach at coral sunset"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1420]/35 via-transparent to-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Invitation Open Action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: flaring ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pt-5 pb-1 text-center"
      >
        <button
          type="button"
          disabled={flaring}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#2E1420]/70 px-7 py-3 cs-font-display text-xs tracking-[0.3em] text-[#FFF6EE] uppercase shadow-[0_10px_24px_-8px_rgba(46,20,32,0.7)] ring-1 ring-[#FFDAB9]/60 backdrop-blur-sm transition-colors duration-300 hover:bg-[#2E1420] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFDAB9]"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(46,20,32,0.8)]">OPEN THE INVITATION</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
