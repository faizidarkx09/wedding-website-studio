// Amethyst Royale opening cover — view 01. Full-bleed lavender
// photograph seen through a crystal-CLUSTER of geometric facets
// (FacetCluster SVG in the corners + a hexagonal CrystalCrest with
// the LIVE monogram overlaid as HTML text, never baked in), a
// crystal-sparkle particle layer, and "OPEN THE INVITATION". Only
// the data comes from the site (Partner A / Partner B placeholders).
// No music on this template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CrystalCrest, CrystalSparkles, FacetCluster } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials } from "./tokens";
import { CrystalCanvas, SkipButton, SoundToggle, playShimmerSound } from "./CinematicOpening";

export default function AmethystRoyaleCover({
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

  // Cinematic opening (Phase 1 ambience + Phase 2 crest flare):
  // plays once per session; reduced-motion or a repeat visit opens
  // the invitation directly. Double-taps are guarded by startedRef.
  const SESSION_FLAG = "ar-cinematic-played";
  const [sealing, setSealing] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const startedRef = useRef(false);
  const sealTimerRef = useRef<number | null>(null);

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
      if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current);
    },
    [],
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setSealing(true);
    setBurstKey((k) => k + 1);
    playShimmerSound();
    sealTimerRef.current = window.setTimeout(() => {
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
    if (sealTimerRef.current !== null) window.clearTimeout(sealTimerRef.current);
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#2E1065] px-5 py-12 text-[#F5F0FA] select-none"
    >
      {/* Full-bleed lavender photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple holding hands in a lavender field at dusk, framed by amethyst crystals"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Deep violet overlays so the lavender type stays readable
          over the bright sky: heavier at top and bottom, lighter in
          the middle where the couple stands. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(46, 16, 101, 0.72) 0%, rgba(46, 16, 101, 0.18) 30%, rgba(46, 16, 101, 0.12) 55%, rgba(46, 16, 101, 0.62) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(124, 58, 237, 0.12) 0%, rgba(46, 16, 101, 0.28) 100%)",
        }}
      />

      {/* Geometric crystal facets in the corners, over the photo */}
      <FacetCluster />

      {/* Crystal sparkles — ~45 slow twinkling 4-point stars */}
      {!prefersReducedMotion && <CrystalSparkles />}

      {/* Cinematic layer — twinkling sparkles + the Phase 2 burst */}
      {!prefersReducedMotion && <CrystalCanvas burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.45 }} />}

      {/* Sound toggle — always visible; Skip appears while sealing */}
      {onToggleSound && <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Double lavender hairline inner border framing the gem feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#E9D5FF]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#E9D5FF]/20"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display text-xs tracking-[0.38em] text-[#E9D5FF] uppercase drop-shadow-[0_2px_6px_rgba(46,16,101,0.8)]"
        >
          WITH LOVE
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="ar-font-script mt-4 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFDFF] drop-shadow-[0_3px_14px_rgba(46,16,101,0.75)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Amethyst rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#C4B5FD] to-transparent"
        />
      </div>

      {/* Central-Lower Hexagonal Crystal Crest with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        <motion.div
          animate={
            sealing
              ? { y: 0, scale: [1, 1.04, 1] }
              : prefersReducedMotion
                ? undefined
                : { y: [0, -5, 0] }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[300px]"
        >
          <CrystalCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(46,16,101,0.6)]" />

          {/* Phase 2 flare — violet glow + light sweep across the crest */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-18%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(221,214,254,0.95) 0%, rgba(124,58,237,0.55) 45%, rgba(124,58,237,0) 72%)",
            }}
            initial={{ opacity: 0 }}
            animate={sealing ? { opacity: [0, 0.9, 0.4] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {sealing && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 w-1/4"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(221,214,254,0.6) 50%, transparent 100%)",
                }}
                initial={{ x: "-160%" }}
                animate={{ x: "360%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="ar-font-display ar-amethyst-embossed-text text-[1.95rem] font-medium tracking-[0.06em]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 ar-font-display text-xs tracking-[0.34em] text-[#F5F0FA] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD]"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(46,16,101,0.8)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C4B5FD]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#FFFDFF]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
