// Aurora opening cover — view 01. Full-bleed night-lake aurora
// photograph, three ANIMATED aurora ribbons flowing across the sky,
// a glowing monogram ring, the couple names in ice-white script,
// and "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { AuroraLights, AuroraRibbon } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";
import { AuroraCanvas, SkipButton, SoundToggle } from "./CinematicOpening";

const SESSION_FLAG = "au-cinematic-played";

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

export default function AuroraCover({
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (sky panels).
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0F172A] px-5 pt-20 pb-12 text-[#F4F7FB] select-none"
    >
      {/* Full-bleed night-lake aurora photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple in silhouette holding hands at a mountain lake beneath the aurora borealis"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlays so the ice-white type stays readable over the
          bright aurora: heavier at top and bottom, lighter in the
          middle where the ribbons glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2, 6, 23, 0.72) 0%, rgba(2, 6, 23, 0.18) 30%, rgba(2, 6, 23, 0.14) 55%, rgba(2, 6, 23, 0.66) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(20, 184, 166, 0.10) 0%, rgba(2, 6, 23, 0.30) 100%)",
        }}
      />

      {/* Animated aurora ribbons across the sky */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 26, 0], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 14, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-none absolute inset-x-0 top-[8%] h-[38%] w-full"
        >
          <AuroraRibbon className="h-full w-full" />
        </motion.div>
      )}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -20, 0], opacity: [0.7, 0.95, 0.7] }}
          transition={{ duration: 18, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-none absolute inset-x-0 top-[30%] h-[30%] w-full opacity-70"
        >
          <AuroraRibbon className="h-full w-full -scale-y-100" />
        </motion.div>
      )}

      {/* Aurora light streaks + stars */}
      {!prefersReducedMotion && <AuroraLights />}

      {/* Cinematic Phase 1 — twinkling stars + falling snow (+ star burst on tap) */}
      {!prefersReducedMotion && (
        <AuroraCanvas particleCount={16} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.42 }} />
      )}

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Thin double hairline inner border framing the night card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#5EEAD4]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#8B5CF6]/20"
      />

      {/* Top eyebrow */}
      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="au-font-display relative z-10 text-xs font-semibold tracking-[0.38em] text-[#E2E8F0] uppercase drop-shadow-[0_2px_6px_rgba(2,6,23,0.85)]"
      >
        TOGETHER UNDER THE NORTHERN LIGHTS
      </motion.p>

      {/* Centre — glowing monogram ring + script names + date */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={
            sealing
              ? { opacity: 1, scale: [1, 1.05, 1] }
              : { opacity: 1, scale: 1 }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.22) 0%, rgba(139,92,246,0.14) 55%, transparent 72%)",
            boxShadow: "0 0 0 1px rgba(94,234,212,0.55), 0 0 34px rgba(20,184,166,0.35)",
          }}
        >
          {/* Phase 2 — teal→violet glow flare around the ring, once */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-45%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.55) 0%, rgba(139, 92, 246, 0.18) 55%, transparent 75%)",
            }}
            initial={{ opacity: 0 }}
            animate={sealing ? { opacity: [0, 0.95, 0.35] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-dashed border-[#5EEAD4]/50"
          />
          <span className="au-font-display text-[1.5rem] font-semibold tracking-[0.06em] text-white drop-shadow-[0_2px_8px_rgba(2,6,23,0.8)]">
            {initials(site)}
          </span>
        </motion.div>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="au-font-script mt-6 px-3 text-[3.6rem] leading-[1.05] font-normal text-[#F8FAFC] drop-shadow-[0_3px_14px_rgba(2,6,23,0.8)]"
        >
          {coupleNames(site)}
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-44 bg-gradient-to-r from-transparent via-[#5EEAD4] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-4 text-[11px] font-semibold tracking-[0.32em] text-[#E2E8F0] uppercase drop-shadow-[0_2px_6px_rgba(2,6,23,0.85)]"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </div>

      {/* Bottom Invitation Open Action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: sealing ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 au-font-display text-xs font-semibold tracking-[0.34em] text-[#F4F7FB] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(2,6,23,0.85)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#5EEAD4]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F4F7FB]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
