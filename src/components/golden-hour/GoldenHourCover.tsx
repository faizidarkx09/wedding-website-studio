// Golden Hour opening cover — view 01. Full-bleed golden-hour
// photograph, "WITH LOVE", the couple names in cream script, the
// gold sun-ray crest with the LIVE monogram overlaid as HTML text
// (never baked in), a golden-dust particle layer, and "OPEN THE
// INVITATION". Only the data comes from the site (Partner A /
// Partner B placeholders). No music on this template.
//
// Cinematic opening "Sunrise" (plays once per page session, never
// under prefers-reduced-motion): Phase 1 anticipation — slow
// rotating sun-ray halo behind the crest, golden dust, a warm sun
// glow pulse; Phase 2 sunburst on tap (~1.5s) — golden glow, one
// light sweep, one gentle crest pulse, a burst of golden dust, warm
// G-major chime, button fades out; Phase 3+4 live in the renderer
// (SunPanelsOverlay): the cover exits instantly, the invitation
// mounts underneath, two golden panels slide apart, then dissolve
// with a rising sun disc + light sweep. A reload in the same
// session, or a reduced-motion tap, takes the plain 1.05s ceremony
// instead. Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { GoldenDust, SunRayCrest } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials } from "./tokens";
import {
  GoldenHourSkipButton,
  GoldenHourSoundToggle,
  SunburstCanvas,
} from "./GoldenHourCinematic";

const SESSION_FLAG = "gh-cinematic-played";

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

export default function GoldenHourCover({
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
  // "idle" = Phase 1 anticipation; "seal" = Phase 2 sunburst.
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (panels).
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#3B2A12] px-5 py-12 text-[#FFF8EC] select-none"
    >
      {/* Full-bleed golden-hour photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple holding hands in a golden wheat field at sunset"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Warm dark overlays so the cream type stays readable over the
          bright sky: heavier at top and bottom, lighter in the middle
          where the sun glows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(36, 23, 8, 0.72) 0%, rgba(36, 23, 8, 0.18) 30%, rgba(36, 23, 8, 0.12) 55%, rgba(36, 23, 8, 0.62) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(201, 146, 14, 0.12) 0%, rgba(36, 23, 8, 0.28) 100%)",
        }}
      />

      {/* Golden dust — ~50 slow gold particles over the photograph */}
      {!prefersReducedMotion && <GoldenDust />}

      {/* Phase 2 — golden dust burst from the crest on tap */}
      {!prefersReducedMotion && (
        <SunburstCanvas burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.62 }} />
      )}

      {/* Double gold hairline inner border framing the luxury card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#E8A93D]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#E8A93D]/20"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <GoldenHourSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the sunburst sequence is running */}
      {sealing && <GoldenHourSkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="gh-font-display text-xs tracking-[0.38em] text-[#FBEED3] uppercase drop-shadow-[0_2px_6px_rgba(36,23,8,0.8)]"
        >
          WITH LOVE
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="gh-font-script mt-4 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFDF9] drop-shadow-[0_3px_14px_rgba(36,23,8,0.75)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Gold rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#E8A93D] to-transparent"
        />
      </div>

      {/* Central-Lower Sun-Ray Crest with the live monogram */}
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
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(246, 214, 138, 0.65) 0%, rgba(232, 169, 61, 0.18) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={sealing ? { opacity: [0, 0.95, 0.4] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : sealing
                ? { y: [0, -5, 0], scale: [1, 1.05, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[300px]"
        >
          {/* Phase 1 — slow rotating sun-ray halo behind the crest */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[-18%] rounded-full"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg at 50% 50%, rgba(246,214,138,0.28) 0deg 4deg, transparent 4deg 16deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
            />
          )}
          <SunRayCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(36,23,8,0.6)]" />

          {/* Phase 1 — gentle light sheen drifting across the crest;
              Phase 2 — one faster sweep across its golden surface. */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mx-auto overflow-hidden rounded-full"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,253,246,0.5) 50%, transparent 100%)",
                  transform: "skewX(-12deg)",
                }}
                initial={{ x: "-160%" }}
                animate={sealing ? { x: "360%" } : { x: ["-160%", "360%"] }}
                transition={
                  sealing
                    ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                    : { duration: 5.5, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], repeatDelay: 2.5 }
                }
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="gh-font-display gh-gold-embossed-text text-[1.95rem] font-medium tracking-[0.06em]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the sunburst activates */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: sealing ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 gh-font-display text-xs tracking-[0.34em] text-[#FFF8EC] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8A93D] disabled:pointer-events-none"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(36,23,8,0.8)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E8A93D]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#FFF8EC]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
