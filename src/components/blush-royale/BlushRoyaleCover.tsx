// Blush Royale opening cover — view 01. Blush watercolor wash,
// "WITH LOVE", the couple names in rose-gold script, the rose-gold
// wax-seal emblem with the LIVE monogram overlaid as HTML text
// (never baked in), and "OPEN THE INVITATION". Only the data comes
// from the site (Partner A / Partner B placeholders).
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — slow wash drift,
// drifting rose petals, a light sheen across the heart; Phase 2
// seal activation on tap (~1.5s) — golden glow, one light sweep,
// one gentle pulse, a burst of golden particles, button fades out;
// Phase 3+4 live in the renderer (PanelsOverlay): the cover exits
// instantly, the invitation mounts underneath, two paper panels
// rotate open, then dissolve with a heart transition + shimmer.
// A reload in the same session, or a reduced-motion tap, takes the
// plain 1.0s ceremony instead. Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { COVER_EMBLEM_URL, WASH_IMAGE_URL, coupleNames, initials } from "./tokens";
import { PetalCanvas, SkipButton, SoundToggle } from "./CinematicOpening";

const SESSION_FLAG = "br-cinematic-played";

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

export default function BlushRoyaleCover({
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
    // Cover exit is a deliberate ~1.0s ceremony, not a quick fade:
    // the even [0.65, 0, 0.35, 1] ease spreads the dissolve across
    // the full second (the old front-loaded ease collapsed opacity
    // below 0.05 in ~0.5s) before the invitation rises 1.0s.
    // During the cinematic sequence the exit is instant instead —
    // the paper panels cover the screen while the invitation mounts.
    <motion.div
      role="region"
      aria-label="Wedding Invitation Cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        instantExit
          ? { opacity: 0, transition: { duration: 0.05, ease: [0.65, 0, 0.35, 1] } }
          : { opacity: 0, y: -48, scale: 0.97, transition: { duration: 1.0, ease: [0.65, 0, 0.35, 1] } }
      }
      onClick={handleOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#F6DDE0] px-5 py-12 text-[#5C323B] select-none sm:py-16"
    >
      {/* Phase 1 — extremely subtle slow drift on the watercolor wash */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.035, 1], x: [0, 8, 0] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${WASH_IMAGE_URL})` }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255, 253, 251, 0.4) 0%, rgba(239, 201, 206, 0.35) 100%)",
        }}
      />

      {/* Phase 1 — drifting rose petals (+ golden burst on seal tap) */}
      {!prefersReducedMotion && (
        <PetalCanvas petalCount={14} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.58 }} />
      )}

      {/* Delicate hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[2rem] border border-[#B76E79]/25 sm:inset-7"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display text-xs tracking-[0.38em] text-[#7A4A55]/90 uppercase sm:text-sm"
        >
          WITH LOVE
        </motion.p>

        {/* Rose-gold script reveal */}
        <motion.h1
          initial={
            prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="br-font-script mt-4 px-2 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#B76E79] drop-shadow-[0_2px_10px_rgba(183,110,121,0.25)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>
      </div>

      {/* Central-Lower Rose-Gold Wax Seal Emblem */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[560px] sm:my-6"
      >
        {/* Phase 2 — soft golden glow around the heart, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212, 175, 105, 0.55) 0%, rgba(212, 175, 105, 0.12) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={sealing ? { opacity: [0, 0.9, 0.35] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : sealing
                ? { y: [0, -5, 0], scale: [1, 1.04, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            sealing
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
          }
          className="relative mx-auto w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_EMBLEM_URL}
            alt="Rose-gold wax heart seal emblem framed by blush watercolor roses"
            referrerPolicy="no-referrer"
            className="br-mask-radial-soft mx-auto block w-full max-w-[520px] object-contain drop-shadow-[0_18px_36px_rgba(92,50,59,0.35)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
            }}
          />

          {/* Phase 1 — gentle light sheen drifting across the heart;
              Phase 2 — one faster sweep across its metallic surface. */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[520px] overflow-hidden"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,253,251,0.55) 50%, transparent 100%)",
                  transform: "skewX(-12deg)",
                }}
                initial={{ x: "-160%" }}
                animate={
                  sealing
                    ? { x: "360%" }
                    : { x: ["-160%", "360%"] }
                }
                transition={
                  sealing
                    ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                    : { duration: 5.5, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95], repeatDelay: 2.5 }
                }
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Seal */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="br-font-display br-rose-embossed-text -translate-y-[9%] text-[1.95rem] font-medium tracking-[0.06em] sm:text-[2.75rem] md:text-[3.1rem]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the seal activates */}
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 br-font-display text-xs tracking-[0.34em] text-[#5C323B] uppercase transition-colors duration-300 hover:text-[#B76E79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] disabled:pointer-events-none sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B76E79]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#B76E79]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
