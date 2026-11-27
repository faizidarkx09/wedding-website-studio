// Peacock Royale opening cover — view 01. Deep teal night with
// shimmering gold sparkles, a radial FAN of peacock-feather eyes
// arcing over a tall arch-framed couple photo, the couple names in
// ivory script, a gold feather seal with the LIVE monogram overlaid
// as HTML text (never baked in), and "OPEN THE INVITATION". Only
// the data comes from the site (Partner A / Partner B
// placeholders). No music on this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — a floating
// peacock feather, rising jewel sparkles, a teal-gold shimmer
// across the seal; Phase 2 seal activation on tap (~1.5s) —
// feather-eye glow, one gentle pulse, a burst of jewel particles,
// button fades out; Phase 3+4 live in the renderer
// (FanPanelsOverlay): the cover exits instantly, the invitation
// mounts underneath, two jewel panels rotate open as a feather
// fan blooms, then dissolve with a feather-eye transition +
// shimmer. A reload in the same session, or a reduced-motion tap,
// takes the plain 1.05s ceremony instead. Skip jumps straight to
// the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FeatherEye, FeatherFan, ShimmeringSparkles } from "./Decor";
import { JewelCanvas, SkipButton, SoundToggle } from "./CinematicOpening";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

const SESSION_FLAG = "pr-cinematic-played";

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

export default function PeacockRoyaleCover({
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (fan panels).
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#062E2B] px-5 py-10 text-[#FDFBF5] select-none sm:py-14"
    >
      {/* Deep teal backdrop + gold shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(18, 140, 126, 0.42) 0%, rgba(6, 46, 43, 0.9) 62%, #04211F 100%)",
        }}
      />
      <ShimmeringSparkles count={64} />

      {/* Phase 1 — rising jewel diamonds (+ jewel burst on seal tap) */}
      {!prefersReducedMotion && (
        <JewelCanvas jewelCount={12} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.72 }} />
      )}

      {/* Phase 1 — one loose feather eye drifting gently, top right */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-[16%] right-[9%] z-10 sm:right-[16%]"
          animate={{ y: [0, -12, 0], rotate: [-8, 6, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        >
          <FeatherEye className="h-12 w-9 opacity-80 drop-shadow-[0_2px_8px_rgba(4,33,31,0.6)] sm:h-14 sm:w-10" />
        </motion.div>
      )}

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Double gold hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#D4AF37]/40 sm:inset-7"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#D4AF37]/20 sm:inset-9"
      />

      {/* Top eyebrow */}
      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="er-font-display relative z-10 text-center text-xs font-semibold tracking-[0.38em] text-[#E7C86A] uppercase drop-shadow-[0_2px_6px_rgba(4,33,31,0.9)] sm:text-sm"
      >
        TOGETHER WITH THEIR FAMILIES
      </motion.p>

      {/* Fan + arch photo */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-6 flex w-full flex-col items-center"
      >
        {/* Radial fan of feather eyes, pivoting at the arch top */}
        <FeatherFan className="top-0 left-1/2 z-20 h-24 w-24 -translate-x-1/2" blades={9} />
        <div className="relative mt-14 w-[min(74vw,300px)] overflow-hidden rounded-t-[999px] shadow-[0_24px_48px_-12px_rgba(4,33,31,0.8)] ring-2 ring-[#D4AF37]/80 sm:w-[340px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_IMAGE_URL}
            alt="Bride and groom beneath a fan of peacock feathers"
            referrerPolicy="no-referrer"
            className="aspect-[3/4] w-full object-cover object-[50%_30%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04211F]/55 via-transparent to-transparent"
          />
        </div>

        {/* Couple names in ivory script, overlapping the arch base */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="er-font-script -mt-9 px-3 text-center text-[3.2rem] leading-[1.08] font-normal text-[#FFFFFF] drop-shadow-[0_3px_14px_rgba(4,33,31,0.85)] sm:-mt-10 sm:text-[4.4rem]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Gold rule + date */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent sm:w-56"
        />
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-center text-[11px] tracking-[0.3em] text-[#FDFBF5] uppercase drop-shadow-[0_2px_6px_rgba(4,33,31,0.9)] sm:text-xs"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </motion.div>

      {/* Gold feather seal with live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-6"
      >
        {/* Phase 2 — soft teal-gold glow around the feather eye, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(231, 200, 106, 0.6) 0%, rgba(18, 140, 126, 0.25) 55%, transparent 75%)",
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
          className="relative mx-auto flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36"
        >
          {/* Phase 1 — gentle teal-gold sheen drifting across the seal;
              Phase 2 — one faster sweep across its metallic surface. */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-full"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
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
          {/* Gold seal disc — radial gold gradient + ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full shadow-[0_18px_36px_rgba(4,33,31,0.7)] ring-2 ring-[#E7C86A]/60"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F6E27A 0%, #E7C86A 34%, #D4AF37 60%, #9A7B2D 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-2.5 rounded-full border border-[#062E2B]/30"
          />
          {/* Feather eye emblem */}
          <FeatherEye className="absolute top-3 left-1/2 h-8 w-6 -translate-x-1/2 opacity-95 sm:top-4" />

          {/* Real HTML Typography Monogram Overlaid Inside the Seal */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="er-font-display relative z-10 mt-7 text-[1.5rem] font-semibold tracking-[0.06em] text-[#062E2B] sm:mt-8 sm:text-[1.7rem]"
            style={{
              textShadow:
                "0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(6, 46, 43, 0.25), 0 2px 3px rgba(6, 46, 43, 0.3)",
            }}
          >
            {initials(site)}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the seal activates */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: sealing ? 0 : 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-6 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 er-font-display text-xs tracking-[0.34em] text-[#FDFBF5] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] disabled:pointer-events-none sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/90 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F6E27A]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
