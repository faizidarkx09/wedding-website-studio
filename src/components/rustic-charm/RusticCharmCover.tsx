// Rustic Charm opening cover — view 01. Full-bleed barn
// photograph at dusk, the couple names on a plank-wood sign (CSS
// plank texture, live HTML text — never baked in), a small wood-disc
// monogram badge, a firefly particle layer, and "OPEN THE
// INVITATION". Only the data comes from the site (Partner A /
// Partner B placeholders). No music on this template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Fireflies, WoodSign } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";
import { DustCanvas, SkipButton, SoundToggle } from "./CinematicOpening";

const SESSION_FLAG = "rc-cinematic-played";

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

export default function RusticCharmCover({
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (barn doors).
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#2D1F14] px-5 py-12 text-[#FEF3C7] select-none"
    >
      {/* Full-bleed barn photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A rustic barn glowing with string lights at dusk, hay bales and wildflowers in the foreground"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlays so the cream type stays readable over the
          bright sky and hay: heavier at top and bottom, lighter in
          the middle where the barn glows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(45, 31, 20, 0.72) 0%, rgba(45, 31, 20, 0.18) 30%, rgba(45, 31, 20, 0.14) 55%, rgba(45, 31, 20, 0.68) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(120, 53, 15, 0.14) 0%, rgba(45, 31, 20, 0.3) 100%)",
        }}
      />

      {/* Fireflies — ~36 warm fireflies drifting over the photograph */}
      {!prefersReducedMotion && <Fireflies />}

      {/* Cinematic Phase 1 — fireflies + dust motes (+ firefly burst on tap) */}
      {!prefersReducedMotion && (
        <DustCanvas particleCount={14} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.55 }} />
      )}

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Double twine hairline inner border framing the sign */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#FEF3C7]/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#FEF3C7]/20"
      />

      {/* Top spacer for upper-middle placement */}
      <div className="h-6" />

      {/* Wooden sign with the couple names */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display text-xs tracking-[0.38em] text-[#FEF3C7] uppercase drop-shadow-[0_2px_6px_rgba(45,31,20,0.85)]"
        >
          WITH LOVE
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16, rotate: -1.2 }}
          animate={
            sealing
              ? { opacity: 1, y: 0, rotate: [-1.2, 0.8, -1.2] }
              : { opacity: 1, y: 0, rotate: -1.2 }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-5 w-full"
        >
          <WoodSign className="px-6 py-8">
            <p className="rc-font-display text-[10px] tracking-[0.3em] text-[#FDE68A] uppercase">
              YOU ARE INVITED TO THE WEDDING OF
            </p>
            <h1 className="rc-font-script mt-3 px-2 text-[3rem] leading-[1.1] font-normal text-[#FEF3C7] drop-shadow-[0_3px_10px_rgba(45,31,20,0.8)]">
              {coupleNames(site)}
            </h1>
            <div
              aria-hidden="true"
              className="mx-auto mt-4 h-px w-36 bg-gradient-to-r from-transparent via-[#FDE68A]/90 to-transparent"
            />
            <p className="rc-font-display mt-4 text-[11px] tracking-[0.28em] text-[#FEF3C7] uppercase">
              {formatDateDisplay(site.weddingDate, site.timezone)}
            </p>
          </WoodSign>
        </motion.div>

        {/* Wood-disc monogram badge hung below the sign */}
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
              : { duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative mt-6"
        >
          {/* Phase 2 — warm lantern glow flare around the wood disc, once */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-55%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(253, 230, 138, 0.6) 0%, rgba(253, 230, 138, 0.15) 55%, transparent 75%)",
            }}
            initial={{ opacity: 0 }}
            animate={sealing ? { opacity: [0, 0.95, 0.35] } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#451A03] bg-[#78350F] shadow-[0_12px_24px_-8px_rgba(45,31,20,0.7)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 35% 30%, rgba(254,243,199,0.22) 0%, transparent 55%), linear-gradient(160deg, #92400E 0%, #78350F 55%, #5C2A08 100%)",
            }}
          >
            <span className="rc-font-display text-[1.35rem] font-medium tracking-[0.06em] text-[#FEF3C7]">
              {initials(site)}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Invitation Open Action */}
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 rc-font-display text-xs tracking-[0.34em] text-[#FEF3C7] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FDE68A]"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(45,31,20,0.85)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FDE68A]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#FEF3C7]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
