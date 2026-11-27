// Vintage Lace opening cover — view 01. Lace-FRAME composition
// (the layout-diversity brief: never the Royale full-bleed photo):
// the photograph sits inside an ornate lace frame on ivory linen,
// with lace corner ornaments, a scalloped double border, the live
// monogram in a lace medallion overlapping the frame, the couple
// names in sepia script below, and "OPEN THE INVITATION". Golden
// dust motes drift up through a soft light glow over the linen.
// Only the data comes from the site (Partner A / Partner B
// placeholders). No music on this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — the lace veil
// slowly unfurls (frame halo breathing, warm light glow pulsing,
// golden dust motes rising in the light); Phase 2 medallion
// activation on tap (~1.5s) — the medallion warms with a gentle
// glow, a soft chime-worthy pulse, a golden glow bloom, button
// fades out; Phase 3+4 live in the renderer (VeilPanelsOverlay):
// the cover exits instantly, the folded invitation card mounts
// underneath, two lace-veil panels part sideways like curtains,
// then dissolve with a lace-rosette transition + warm light sweep,
// ending on the folded card (tap it to unfold). A reload in
// the same session, or a reduced-motion tap, takes the plain 1.0s
// ceremony instead. Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LaceCorner, LaceDivider } from "./Decor";
import {
  DustMoteCanvas,
  SkipButton,
  SoundToggle,
  playLaceSound,
} from "./VintageCinematicOpening";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

const SESSION_FLAG = "vl-cinematic-played";

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

export default function VintageLaceCover({
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
  // "idle" = Phase 1 anticipation; "seal" = Phase 2 activation.
  const [phase, setPhase] = useState<"idle" | "seal">("idle");
  const [glowKey, setGlowKey] = useState(0);
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
    setGlowKey((k) => k + 1);
    if (soundEnabled) playLaceSound();
    // Phase 2 lasts ~1.5s; then the renderer takes over (veil panels).
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
    // Cover exit is a deliberate ~1.05s ceremony, not a quick fade.
    // During the cinematic sequence the exit is instant instead —
    // the lace-veil panels cover the screen while the invitation mounts.
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#FDF8F0] px-5 py-10 text-[#4A3A2E] select-none"
    >
      {/* Ivory linen texture — fine crosshatch + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(139, 115, 85, 0.05) 0px, rgba(139, 115, 85, 0.05) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, rgba(139, 115, 85, 0.05) 0px, rgba(139, 115, 85, 0.05) 1px, transparent 1px, transparent 5px), radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 248, 0.7) 0%, rgba(247, 235, 217, 0.55) 100%)",
        }}
      />

      {/* Phase 1 — soft warm light glow pulsing over the linen */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 42%, rgba(212, 175, 105, 0.22) 0%, rgba(212, 175, 105, 0.05) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0.35 }}
          animate={sealing ? { opacity: [0.35, 0.9, 0.45] } : { opacity: [0.35, 0.6, 0.35] }}
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 7, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
          }
        />
      )}

      {/* Phase 1 — golden dust motes rising in the light (+ glow bloom on seal tap) */}
      {!prefersReducedMotion && (
        <DustMoteCanvas moteCount={20} glowKey={glowKey} glowOrigin={{ x: 0.5, y: 0.72 }} />
      )}

      {/* Outer lace hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-[#8B7355]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] border border-[#C08A8E]/35"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display text-[11px] font-semibold tracking-[0.38em] text-[#6B563E] uppercase"
        >
          Together with their families
        </motion.p>

        {/* Lace frame around the photograph */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 w-full max-w-[400px]"
        >
          {/* Scalloped lace edge — a soft rose halo behind the frame.
              Phase 1: it slowly "unfurls" (gentle breathing scale);
              Phase 2: one slow swell as the seal warms. */}
          <motion.div
            aria-hidden="true"
            className="absolute -inset-2.5 rounded-[6px] bg-[#EAD3D3]/70"
            style={{
              maskImage:
                "radial-gradient(circle 7px at 10px 10px, transparent 7px, #000 7.5px)",
              WebkitMaskImage:
                "radial-gradient(circle 7px at 10px 10px, transparent 7px, #000 7.5px)",
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : sealing
                  ? { scale: [1, 1.06, 1] }
                  : { scale: [1, 1.03, 1] }
            }
            transition={
              sealing
                ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                : { duration: 9, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
            }
          />
          <div className="relative overflow-hidden rounded-[4px] border-[3px] border-[#FFFDF8] bg-[#FFFDF8] shadow-[0_24px_44px_-16px_rgba(74,58,46,0.45)] ring-1 ring-[#8B7355]/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COVER_IMAGE_URL}
              alt="A bride in a vintage lace gown and a groom walking down a rose garden path, seen from behind"
              referrerPolicy="no-referrer"
              className="block aspect-[4/5] w-full object-cover"
            />
            {/* Sepia inner frame line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 border border-[#FDF8F0]/70"
            />
          </div>

          {/* Lace corner ornaments */}
          <LaceCorner className="absolute -top-3 -left-3 h-12 w-12" />
          <LaceCorner className="absolute -top-3 -right-3 h-12 w-12" flipX />
          <LaceCorner className="absolute -bottom-3 -left-3 h-12 w-12" flipY />
          <LaceCorner className="absolute -right-3 -bottom-3 h-12 w-12" flipX flipY />

          {/* Live monogram medallion overlapping the frame's bottom edge */}
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
            {/* Phase 2 — gentle warm glow around the medallion, once */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[-30%] rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212, 175, 105, 0.55) 0%, rgba(212, 175, 105, 0.12) 55%, transparent 75%)",
              }}
              initial={{ opacity: 0 }}
              animate={sealing ? { opacity: [0, 0.9, 0.35] } : { opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={
                sealing
                  ? { opacity: 1, scale: [1, 1.06, 1] }
                  : { opacity: 1, scale: 1 }
              }
              transition={
                sealing
                  ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }
              }
              className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#8B7355]/70 bg-[#FFFDF8] shadow-[0_10px_22px_-8px_rgba(74,58,46,0.5)]"
            >
              <span className="vl-font-display text-[1.05rem] font-semibold tracking-[0.04em] text-[#6B563E]">
                {initials(site)}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Couple names in sepia script */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="vl-font-script mt-12 px-3 text-[2.9rem] leading-[1.1] font-normal text-[#4A3A2E]"
        >
          {coupleNames(site)}
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 w-full"
        >
          <LaceDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-3 text-[11px] font-semibold tracking-[0.3em] text-[#6B563E] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>

        {/* Bottom Invitation Open Action — fades out as the seal activates */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: sealing ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6, delay: sealing ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 pb-2 text-center"
        >
          <button
            type="button"
            disabled={sealing}
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="group relative inline-flex min-h-[48px] items-center justify-center border border-[#8B7355]/70 bg-[#FFFDF8]/80 px-7 py-3 vl-font-display text-xs font-semibold tracking-[0.34em] text-[#4A3A2E] uppercase shadow-[0_10px_22px_-10px_rgba(74,58,46,0.45)] transition-colors duration-300 hover:bg-[#4A3A2E] hover:text-[#FDF8F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B7355] disabled:pointer-events-none"
          >
            Open the Invitation
          </button>
          <p className="vl-font-editorial mt-3 text-sm text-[#6E5B4A] italic">
            A vintage lace keepsake, made for two families becoming one
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
