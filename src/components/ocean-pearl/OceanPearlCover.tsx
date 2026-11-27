// Ocean Pearl opening cover — view 01. Full-bleed wave photograph,
// "WITH LOVE", the couple names in clean white sans (Manrope bold —
// NOT a centred crest or monogram cover), a rising-bubbles particle
// layer, a wave-shaped divider dissolving into the pearl invitation
// below, and "OPEN THE INVITATION". Only the data comes from the
// site (Partner A / Partner B placeholders). No music on this
// template.
//
// Cinematic opening "Tide" (plays once per page session, never
// under prefers-reduced-motion): Phase 1 anticipation — rising
// bubbles, a gentle wave sway; Phase 2 tide on tap (~1.5s) — a
// burst of bubbles from the names, a watery chime (D major), one
// gentle glow pulse on the names, a light sweep across the wave
// photo; Phase 3+4 live in the renderer (TideOverlay): the cover
// exits instantly, the invitation mounts underneath, a full-screen
// wave washes down and recedes off the bottom, then dissolves with
// a pearl + aqua shimmer. A reload in the same session, or a
// reduced-motion tap, takes the plain 1.05s ceremony instead. Skip
// jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CoverWave, RisingBubbles } from "./Decor";
import { COVER_IMAGE_URL, coupleNames } from "./tokens";
import {
  BubbleBurstCanvas,
  OceanPearlSkipButton,
  OceanPearlSoundToggle,
} from "./OceanPearlCinematic";

const SESSION_FLAG = "op-cinematic-played";

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

export default function OceanPearlCover({
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
  // "idle" = Phase 1 anticipation; "seal" = Phase 2 tide.
  const [phase, setPhase] = useState<"idle" | "seal">("idle");
  const [burstKey, setBurstKey] = useState(0);
  const startedRef = useRef(false);
  const sealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (sealTimerRef.current) clearTimeout(sealTimerRef.current);
    },
    []
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setPhase("seal");
    setBurstKey((k) => k + 1);
    // Phase 2 lasts ~1.5s; then the renderer takes over (tide).
    sealTimerRef.current = setTimeout(() => {
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
    if (sealTimerRef.current) clearTimeout(sealTimerRef.current);
    startedRef.current = true;
    markPlayed();
    onOpen();
  };

  const sealing = phase === "seal";

  return (
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0E3A45] px-5 pt-14 pb-24 text-[#F7FBFC] select-none"
    >
      {/* Full-bleed wave photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A turquoise ocean wave breaking on a sandy beach"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Deep-sea overlays so the white sans type stays readable over
          the bright foam: heavier at top and bottom, lighter in the
          middle where the wave glows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14, 58, 69, 0.66) 0%, rgba(14, 58, 69, 0.14) 32%, rgba(14, 58, 69, 0.10) 55%, rgba(14, 58, 69, 0.60) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(46, 139, 154, 0.14) 0%, rgba(14, 58, 69, 0.30) 100%)",
        }}
      />

      {/* Rising bubbles — ~36 slow bubbles over the photograph */}
      {!prefersReducedMotion && <RisingBubbles />}

      {/* Phase 2 — bubble burst from the names on tap */}
      {!prefersReducedMotion && (
        <BubbleBurstCanvas burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.42 }} />
      )}

      {/* Phase 1 — gentle aqua shimmer drifting across the wave;
          Phase 2 — one faster sweep. */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-[-10%] w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(216, 237, 239, 0.35) 50%, transparent 100%)",
              transform: "skewX(-12deg)",
            }}
            initial={{ x: "-160%" }}
            animate={sealing ? { x: "360%" } : { x: ["-160%", "360%"] }}
            transition={
              sealing
                ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                : { duration: 6, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], repeatDelay: 2.5 }
            }
          />
        </div>
      )}

      {/* Wave-shaped divider dissolving the cover into the pearl below */}
      <CoverWave />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <OceanPearlSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the tide sequence is running */}
      {sealing && <OceanPearlSkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography — clean sans over the water */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display text-xs font-semibold tracking-[0.42em] text-[#D8EDEF] uppercase drop-shadow-[0_2px_6px_rgba(14,58,69,0.85)]"
        >
          WITH LOVE
        </motion.p>

        {/* Phase 2 — soft aqua glow around the names, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-15%] top-[8%] bottom-[-10%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(216, 237, 239, 0.45) 0%, rgba(127, 196, 206, 0.12) 60%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={sealing ? { opacity: [0, 0.9, 0.35] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={
            sealing
              ? { opacity: 1, y: 0, scale: [1, 1.03, 1] }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="op-font-display mt-5 px-3 text-[2.6rem] leading-[1.12] font-bold tracking-[0.04em] text-white uppercase drop-shadow-[0_3px_14px_rgba(14,58,69,0.8)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Aqua rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#7FC4CE] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-body mt-5 text-sm font-medium tracking-[0.28em] text-[#F7FBFC] uppercase drop-shadow-[0_2px_6px_rgba(14,58,69,0.85)]"
        >
          By the Sea
        </motion.p>
      </div>

      {/* Bottom Invitation Open Action — fades out as the tide activates */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.9, delay: sealing ? 0 : 1.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 op-font-display text-xs font-semibold tracking-[0.34em] text-[#F7FBFC] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FC4CE] disabled:pointer-events-none"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(14,58,69,0.85)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#7FC4CE]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-white"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
