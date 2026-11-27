// Marble Luxe opening cover — view 01. A minimal white-marble
// slab: the marble photograph full-bleed, "TOGETHER WITH THEIR
// FAMILIES", the couple names in large dark Cormorant, thin gold
// rules, the live monogram inside a thin double gold ring, a
// subtle gold-dust particle layer, and "OPEN THE INVITATION". Only
// the data comes from the site (Partner A / Partner B
// placeholders). Dark ink type on bright white marble — no thin
// light text on light backgrounds anywhere. No music on this
// template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { GoldDust, MonogramRing } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials } from "./tokens";
import { GoldDustCanvas, SkipButton, SoundToggle, playGoldShimmer } from "./CinematicOpening";

export default function MarbleLuxeCover({
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

  // Cinematic opening (Phase 1 ambience + Phase 2 ring glow):
  // plays once per session; reduced-motion or a repeat visit opens
  // the invitation directly. Double-taps are guarded by startedRef.
  const SESSION_FLAG = "ml-cinematic-played";
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
    playGoldShimmer();
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-white px-5 py-12 text-[#1F2937] select-none"
    >
      {/* Full-bleed white-marble photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="White marble slab with a gold wedding ring and white flowers"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft white veil so the dark type stays crisp over the
          marble veining: even and light, never a dark wash — the
          cover stays bright white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/35"
      />

      {/* Subtle gold dust — ~40 slow gold particles over the marble */}
      {!prefersReducedMotion && <GoldDust />}

      {/* Cinematic layer — drifting gold dust + the Phase 2 burst */}
      {!prefersReducedMotion && <GoldDustCanvas burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.45 }} />}

      {/* Sound toggle — always visible; Skip appears while sealing */}
      {onToggleSound && <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Thin gold hairline inner border framing the slab */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#B49A70]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#B49A70]/25"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display text-xs font-medium tracking-[0.38em] text-[#4B5563] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="ml-font-display mt-5 px-3 text-[2.9rem] leading-[1.08] font-medium tracking-[0.02em] text-[#1F2937]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Thin gold rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-5 text-[11px] tracking-[0.3em] text-[#6B7280] uppercase"
        >
          REQUEST THE HONOUR OF YOUR PRESENCE
        </motion.p>
      </div>

      {/* Central-Lower Monogram Ring with the live monogram */}
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
          className="relative mx-auto aspect-square w-full max-w-[220px]"
        >
          <MonogramRing className="absolute inset-0 h-full w-full" />

          {/* Phase 2 glow — soft gold halo + light sweep across the ring */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-18%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,105,0.55) 0%, rgba(196,162,98,0.3) 45%, rgba(196,162,98,0) 72%)",
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
                    "linear-gradient(100deg, transparent 0%, rgba(212,175,105,0.5) 50%, transparent 100%)",
                }}
                initial={{ x: "-160%" }}
                animate={{ x: "360%" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Ring */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="ml-font-display text-[1.7rem] font-medium tracking-[0.06em] text-[#8C7355]"
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 ml-font-display text-xs font-medium tracking-[0.34em] text-[#1F2937] uppercase transition-colors duration-300 hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent transition-all duration-300 group-hover:w-36"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
