// Mint Serenity opening cover — view 01. A mint WASH (soft
// gradient + drifting circles, not a full-bleed photo), the hero
// photograph in a large CIRCULAR medallion, the couple names in
// soft Cormorant serif, the sage leaf-wreath with the LIVE monogram
// overlaid as HTML text (never baked in), a soft-bubble particle
// layer, and "OPEN THE INVITATION". Only the data comes from the
// site (Partner A / Partner B placeholders). No music on this
// template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LeafWreath, SoftBubbles } from "./Decor";
import { COVER_IMAGE_URL, FONT_DISPLAY, FONT_SCRIPT, coupleNames, initials } from "./tokens";
import { BubbleCanvas, SkipButton, SoundToggle } from "./CinematicOpening";

const SESSION_FLAG = "ms-cinematic-played";

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

export default function MintSerenityCover({
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (mist dissolve).
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#ECFDF5] px-5 py-12 text-[#052E22] select-none"
    >
      {/* Mint wash — soft radial gradients + large pale circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(167, 243, 208, 0.75) 0%, rgba(236, 253, 245, 0.4) 55%, rgba(236, 253, 245, 0) 100%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(209, 250, 229, 0.8) 0%, rgba(236, 253, 245, 0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#A7F3D0]/50 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-[#6EE7B7]/40 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[#D1FAE5]/70 blur-2xl"
      />

      {/* Soft bubbles — ~36 slow mint bubbles over the wash */}
      {!prefersReducedMotion && <SoftBubbles />}

      {/* Cinematic Phase 1 — rising glass bubbles + mist (+ bubble burst on tap) */}
      {!prefersReducedMotion && (
        <BubbleCanvas particleCount={14} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.5 }} />
      )}

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Double sage hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[2rem] border border-[#065F46]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] rounded-[1.6rem] border border-[#10B981]/20"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle: circular hero medallion + couple typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="text-xs tracking-[0.38em] text-[#065F46] uppercase"
        >
          WITH LOVE
        </motion.p>

        {/* Circular hero photo medallion */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative h-56 w-56 overflow-hidden rounded-full shadow-[0_20px_40px_-12px_rgba(6,95,70,0.45)] ring-4 ring-white sm:h-64 sm:w-64"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COVER_IMAGE_URL}
              alt="A couple holding hands, walking through a mint garden in soft morning light"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </motion.div>
          {/* Mint ring + floating bubble accents around the medallion */}
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 h-10 w-10 rounded-full border border-[#065F46]/50 bg-white/60"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-3 -left-3 h-7 w-7 rounded-full border border-[#065F46]/40 bg-white/50"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 -left-6 h-4 w-4 rounded-full bg-[#A7F3D0]/80"
          />
        </motion.div>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={FONT_SCRIPT}
          className="mt-6 px-3 text-[3.2rem] leading-[1.08] font-normal tracking-normal text-[#052E22]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Sage rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#065F46] to-transparent"
        />
      </div>

      {/* Central-Lower Leaf Wreath with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={
          sealing
            ? { opacity: 1, scale: [1, 1.05, 1] }
            : { opacity: 1, scale: 1 }
        }
        transition={
          sealing
            ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        {/* Phase 2 — mint glow flare around the leaf wreath, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(110, 231, 183, 0.6) 0%, rgba(110, 231, 183, 0.15) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={sealing ? { opacity: [0, 0.95, 0.35] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <LeafWreath className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(6,95,70,0.25)]" />

          {/* Real HTML Typography Monogram Overlaid Inside the Wreath Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={FONT_DISPLAY}
              className="text-[1.8rem] font-medium tracking-[0.06em] text-[#065F46]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Invitation Open Action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: sealing ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          style={FONT_DISPLAY}
          className="group relative inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#065F46] px-8 py-3 text-xs tracking-[0.3em] text-white uppercase shadow-[0_12px_24px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
        >
          OPEN THE INVITATION
        </button>
      </motion.div>
    </motion.div>
  );
}
