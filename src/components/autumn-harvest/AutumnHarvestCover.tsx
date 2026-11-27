// Autumn Harvest opening cover — view 01. TYPOGRAPHIC cover (the
// layout-diversity brief): big Playfair serif names over the
// leaf-pattern photograph — no full-bleed couple photo here. Leaf
// wreath with the LIVE monogram overlaid as HTML text (never baked
// in), a drifting-leaf particle layer, the date line, and "OPEN THE
// INVITATION". Only the data comes from the site (Partner A /
// Partner B placeholders). No music on this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — slow glow drift,
// drifting amber leaves, a warm sheen across the leaf wreath;
// Phase 2 leaf-seal activation on tap (~1.5s) — amber glow, one
// warm light pulse, a burst of golden particles, button fades out;
// Phase 3+4 live in the renderer (PanelsOverlay): the cover exits
// instantly, the invitation mounts underneath, two kraft barn-door
// panels slide apart, then dissolve with a maple-leaf transition +
// golden sweep. A reload in the same session, or a reduced-motion
// tap, takes the plain ~1.0s ceremony instead. Skip jumps straight
// to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FallingLeaves, LeafWreath } from "./Decor";
import { LeafCanvas, SkipButton, SoundToggle } from "./CinematicOpening";
import { COVER_IMAGE_URL, formatDateDisplay, initials } from "./tokens";

const SESSION_FLAG = "ah-cinematic-played";

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

export default function AutumnHarvestCover({
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
    // Cover exit is a deliberate ~1.0s ceremony, not a quick fade.
    // During the cinematic sequence the exit is instant instead —
    // the barn-door panels cover the screen while the invitation mounts.
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#FFF7E8] px-5 py-12 text-[#3A2412] select-none"
    >
      {/* Full-bleed leaf-pattern photograph (leaves frame the edges,
          the centre is empty cream — the type sits on it). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="Autumn maple and oak leaves framing a warm cream background"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft cream glow in the centre so the dark-brown type stays
          readable over the photograph at every size. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 247, 232, 0.88) 0%, rgba(255, 247, 232, 0.55) 55%, rgba(255, 247, 232, 0.08) 100%)",
        }}
      />

      {/* Drifting leaves — ~26 slow maple leaves over the pattern */}
      {!prefersReducedMotion && <FallingLeaves />}

      {/* Phase 2 — golden leaf burst from the wreath on seal tap
          (burst-only canvas; Phase 1 leaves come from FallingLeaves). */}
      {!prefersReducedMotion && (
        <LeafCanvas leafCount={0} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.42 }} />
      )}

      {/* Double burnt-orange hairline inner border framing the type */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#C05621]/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#C05621]/20"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the seal sequence is running */}
      {sealing && <SkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Leaf-wreath crest with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Phase 2 — soft amber glow around the wreath, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(217, 142, 50, 0.55) 0%, rgba(217, 142, 50, 0.12) 55%, transparent 75%)",
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
              : {
                  duration: 6.5,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                }
          }
          className="relative mx-auto aspect-square w-full max-w-[150px]"
        >
          <LeafWreath className="absolute inset-0 h-full w-full drop-shadow-[0_8px_20px_rgba(92,58,33,0.35)]" />

          {/* Phase 1 — gentle warm sheen drifting across the wreath;
              Phase 2 — one faster sweep across it. */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,247,232,0.6) 50%, transparent 100%)",
                  transform: "skewX(-12deg)",
                }}
                initial={{ x: "-160%" }}
                animate={sealing ? { x: "360%" } : { x: ["-160%", "360%"] }}
                transition={
                  sealing
                    ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                    : {
                        duration: 5.5,
                        repeat: Infinity,
                        ease: [0.45, 0.05, 0.55, 0.95],
                        repeatDelay: 2.5,
                      }
                }
              />
            </div>
          )}

          {/* Real HTML Typography Monogram Overlaid Inside the Wreath */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="ah-font-display text-[1.4rem] font-semibold tracking-[0.06em] text-[#5C3A21]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Typographic centre — the cover IS the type */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display text-xs font-semibold tracking-[0.38em] text-[#C05621] uppercase"
        >
          Together with their families
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="ah-font-display mt-5 px-3 text-[3.1rem] leading-[1.04] font-bold tracking-[0.01em] text-[#3A2412] sm:text-[4.2rem]"
        >
          {site.content.partnerA}
          <span className="ah-font-script mx-3 align-middle text-[2.6rem] font-normal text-[#C05621] sm:text-[3.4rem]">
            &amp;
          </span>
          {site.content.partnerB}
        </motion.h1>

        {/* Burnt-orange rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#C05621] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display mt-5 text-[11px] font-medium tracking-[0.3em] text-[#5C3A21] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="ah-font-script mt-4 text-[1.9rem] leading-none font-normal text-[#9C3D12]"
        >
          An autumn celebration of love
        </motion.p>
      </div>

      {/* Bottom Invitation Open Action — fades out as the seal activates */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: sealing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: sealing ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={sealing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center bg-[#C05621] px-7 py-3 ah-font-display text-xs font-semibold tracking-[0.3em] text-[#FFF7E8] uppercase shadow-[0_12px_24px_-8px_rgba(156,61,18,0.65)] transition-colors duration-300 hover:bg-[#9C3D12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C05621] disabled:pointer-events-none"
        >
          Open the Invitation
        </button>
      </motion.div>
    </motion.div>
  );
}
