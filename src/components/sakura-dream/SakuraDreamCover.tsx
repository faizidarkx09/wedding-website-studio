// Sakura Dream opening cover — view 01. NOT a full-bleed photo:
// a branch-framed CIRCLE photo — the couple's photo inside a
// circle ringed by sakura branches, on a blush-white ground, with
// the names in deep-plum script above it, a live monogram disc
// overlapping the circle's foot, the date line, falling petals and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — soft pink wash
// drift, cherry petals falling with sway, a branch silhouette
// gently swaying over the circle; Phase 2 on tap (~1.5s) — a burst
// of petals + a soft pink glow + the branch blooms (blossoms scale
// in); Phase 3+4 live in the renderer (FanOverlay): a petal
// curtain lifts strip by strip, then dissolves with a blossom
// swirl + shimmer + chime. A reload in the same session, or a
// reduced-motion tap, takes the plain ~1.0s ceremony instead.
// Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Blossom, BlossomBranch } from "./Decor";
import {
  SakuraPetalCanvas,
  SkipButton,
  SoundToggle,
  playPetalRustleSound,
} from "./SakuraCinematicOpening";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

const SESSION_FLAG = "sd-cinematic-played";

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

export default function SakuraDreamCover({
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
  // "idle" = Phase 1 anticipation; "bloom" = Phase 2 activation.
  const [phase, setPhase] = useState<"idle" | "bloom">("idle");
  const [burstKey, setBurstKey] = useState(0);
  const startedRef = useRef(false);
  const bloomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (bloomTimerRef.current) clearTimeout(bloomTimerRef.current);
    },
    []
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setPhase("bloom");
    setBurstKey((k) => k + 1);
    if (soundEnabled) playPetalRustleSound();
    // Phase 2 lasts ~1.5s; then the renderer takes over (curtain).
    bloomTimerRef.current = setTimeout(() => {
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
    if (bloomTimerRef.current) clearTimeout(bloomTimerRef.current);
    startedRef.current = true;
    markPlayed();
    onOpen();
  };

  const blooming = phase === "bloom";

  return (
    // Cover exit is a deliberate ~1.0s ceremony. During the
    // cinematic sequence the exit is instant instead — the petal
    // curtain covers the screen while the invitation mounts.
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#FDF2F8] px-5 py-12 text-[#2E0A3D] select-none"
    >
      {/* Phase 1 — soft pink wash drift */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.03, 1], x: [0, -6, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(249, 168, 212, 0.45) 0%, rgba(253, 242, 248, 0.0) 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(251, 207, 232, 0.5) 0%, rgba(253, 242, 248, 0.0) 65%)",
        }}
      />

      {/* Phase 1 — falling cherry petals (+ petal burst on tap) */}
      {!prefersReducedMotion && (
        <SakuraPetalCanvas petalCount={16} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.55 }} />
      )}

      {/* Double pink hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#EC4899]/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#EC4899]/20"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the bloom sequence is running */}
      {blooming && <SkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography — deep plum on blush, high contrast */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display text-xs tracking-[0.38em] text-[#6B21A8] uppercase"
        >
          WITH LOVE
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="sd-font-script mt-4 px-3 text-[3.2rem] leading-[1.08] font-normal tracking-normal text-[#2E0A3D]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Pink rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#EC4899]/90" />
          <Blossom className="h-5 w-5" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#EC4899]/90" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-4 text-[11px] tracking-[0.3em] text-[#6B21A8] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </div>

      {/* Branch-framed CIRCLE photo — the cover composition that
          makes Sakura Dream different: the photo lives in a circle,
          sakura branches arch over its top from both sides, and the
          live monogram sits in a plum disc overlapping its foot. */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        {/* Phase 2 — soft pink glow around the circle, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(236, 72, 153, 0.5) 0%, rgba(249, 168, 212, 0.18) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={blooming ? { opacity: [0, 0.9, 0.35] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : blooming
                ? { y: [0, -5, 0], scale: [1, 1.03, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            blooming
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[320px]"
        >
          {/* Circle photo */}
          <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_20px_44px_-12px_rgba(107,33,168,0.45)] ring-4 ring-white ring-offset-4 ring-offset-[#FBCFE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COVER_IMAGE_URL}
              alt="A couple holding hands beneath blooming cherry blossom trees"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Sakura branches arching over the circle — left branch
              and its mirror, meeting above the top of the circle.
              Phase 1: they sway gently; Phase 2: they bloom
              (blossoms scale in once). */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ transformOrigin: "50% 100%" }}
            animate={
              prefersReducedMotion
                ? undefined
                : blooming
                  ? { rotate: [0, -1.5, 0], scale: [1, 1.06, 1] }
                  : { rotate: [-1.2, 1.2, -1.2] }
            }
            transition={
              blooming
                ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                : { duration: 7, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
            }
          >
            <BlossomBranch className="pointer-events-none absolute -top-6 -left-10 w-[62%] -rotate-[8deg] drop-shadow-[0_4px_10px_rgba(107,33,168,0.25)]" />
            <BlossomBranch className="pointer-events-none absolute -top-6 -right-10 w-[62%] -scale-x-100 rotate-[8deg] drop-shadow-[0_4px_10px_rgba(107,33,168,0.25)]" />
          </motion.div>

          {/* Live monogram disc overlapping the circle's foot */}
          <div className="absolute -bottom-3 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#6B21A8] shadow-[0_12px_24px_-6px_rgba(46,10,61,0.55)] ring-4 ring-white">
            <span className="sd-font-display text-lg font-medium tracking-[0.06em] text-white">
              {initials(site)}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the branch blooms */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: blooming ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: blooming ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={blooming}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 sd-font-display text-xs tracking-[0.34em] text-[#6B21A8] uppercase transition-colors duration-300 hover:text-[#2E0A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EC4899] disabled:pointer-events-none"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#EC4899]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#6B21A8]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
