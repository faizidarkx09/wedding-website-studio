// Forest Whisper opening cover — view 01. SPLIT-SCREEN (never a
// full-bleed centred cover): the forest-trail photograph on the left
// (~55%) and a deep-green panel on the right with the couple names,
// the leaf-ring crest with the LIVE monogram overlaid as HTML text
// (never baked in), and "OPEN THE INVITATION". Fireflies drift over
// the whole cover. In narrow containers the two halves stack (photo
// on top, panel below); in wide containers they sit side by side —
// container queries only (@container / @min-[40rem]:), so the
// editor preview renders the stacked layout. Only the data comes
// from the site (Partner A / Partner B placeholders). No music on
// this template.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — forest mist
// drifting, fireflies glowing, leaves falling; Phase 2 leaf-seal
// activation on tap (~1.5s) — soft green-gold glow, one gentle
// pulse, a firefly burst + leaf swirl, button fades out; Phase 3+4
// live in the renderer (MistPanelsOverlay): the cover exits
// instantly, the invitation mounts underneath, two mist curtains
// slide apart, then dissolve with a firefly burst + leaf swirl +
// soft light. A reload in the same session, or a reduced-motion tap,
// takes the plain ~1.05s ceremony instead. Skip jumps straight to
// the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Fireflies, LeafCrest } from "./Decor";
import { FireflyLeafCanvas, SkipButton, SoundToggle } from "./CinematicOpening";
import { COVER_IMAGE_URL, coupleNames, formatCardDate, initials } from "./tokens";

const SESSION_FLAG = "fw-cinematic-played";

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

export default function ForestWhisperCover({
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
    // Phase 2 lasts ~1.5s; then the renderer takes over (mist panels).
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
      className="@container relative flex min-h-[100dvh] w-full cursor-pointer flex-col overflow-hidden bg-[#1B4332] text-[#F4F1E6] select-none @min-[40rem]:flex-row"
    >
      {/* Left half — the forest-trail photograph (~55% wide on wide
          containers; the top block when stacked). */}
      <div className="relative h-[38dvh] w-full shrink-0 overflow-hidden @min-[40rem]:h-auto @min-[40rem]:w-[55%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COVER_IMAGE_URL}
          alt="A couple holding hands, walking down a mossy forest trail"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft green shade so the panel edge reads cleanly and the
            photo never glares. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20, 48, 31, 0.18) 0%, rgba(20, 48, 31, 0.05) 50%, rgba(20, 48, 31, 0.42) 100%)",
          }}
        />
        {/* Phase 1 — forest mist drifting slowly over the photo */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 22% at 30% 62%, rgba(232, 245, 220, 0.20) 0%, transparent 70%), radial-gradient(ellipse 50% 20% at 72% 38%, rgba(232, 245, 220, 0.14) 0%, transparent 70%)",
            }}
            animate={{ x: [0, 18, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 11, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
          />
        )}
        {/* A thin moss seam where the photo meets the panel on wide
            containers. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-[3px] bg-[#6A994E]/70 @min-[40rem]:block"
        />
        {/* Eyebrow on the photo, bottom-left — cream on the darker
            foot of the photograph. */}
        <p className="fw-font-display absolute bottom-5 left-5 z-10 text-[10px] tracking-[0.34em] text-[#F4F1E6] uppercase drop-shadow-[0_2px_6px_rgba(20,48,31,0.9)] @min-[40rem]:bottom-8 @min-[40rem]:left-8">
          BENEATH THE CANOPY
        </p>
      </div>

      {/* Right half — deep-green panel with the names (~45% wide on
          wide containers; the lower block when stacked). */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 text-center @min-[40rem]:py-12">
        {/* Deep-green panel glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(106, 153, 78, 0.28) 0%, rgba(27, 67, 50, 0.35) 60%, rgba(20, 48, 31, 0.55) 100%)",
          }}
        />

        {/* Fireflies over the whole cover (photo + panel). */}
        {!prefersReducedMotion && <Fireflies />}

        {/* Phase 1 — falling leaves (+ firefly burst + leaf swirl on seal tap) */}
        {!prefersReducedMotion && (
          <FireflyLeafCanvas fireflyCount={0} leafCount={10} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.45 }} />
        )}

        {/* Sound toggle — visible through the whole sequence, SFX only */}
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

        {/* Skip — only while the seal sequence is running */}
        {sealing && <SkipButton onSkip={handleSkip} />}

        {/* Leaf-ring crest with the live monogram */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.15, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[240px] @min-[40rem]:max-w-[260px]"
        >
          {/* Phase 2 — soft green-gold glow around the crest, once */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-12%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(214, 240, 140, 0.55) 0%, rgba(167, 201, 87, 0.14) 55%, transparent 75%)",
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
                : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
            }
            className="relative mx-auto aspect-square w-full max-w-[220px] @min-[40rem]:max-w-[240px]"
          >
            <LeafCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(20,48,31,0.6)]" />

            {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="fw-font-display text-[1.7rem] font-medium tracking-[0.06em] text-[#E7EAD9] drop-shadow-[0_2px_8px_rgba(20,48,31,0.8)]"
              >
                {initials(site)}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Couple names in cream script */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fw-font-script relative z-10 mt-6 px-3 text-[3rem] leading-[1.08] font-normal tracking-normal text-[#FBF9F1] drop-shadow-[0_3px_14px_rgba(20,48,31,0.75)] @min-[40rem]:mt-8 @min-[40rem]:text-[3.4rem]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Moss rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="relative z-10 mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#A7C957] to-transparent"
        />

        {/* Date line */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display relative z-10 mt-5 text-[11px] tracking-[0.3em] text-[#E7EAD9] uppercase"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </motion.p>

        {/* Bottom Invitation Open Action — fades out as the seal activates */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: sealing ? 0 : 1, y: 0 }}
          transition={{ duration: 0.9, delay: sealing ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-8 pb-2 text-center"
        >
          <button
            type="button"
            disabled={sealing}
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="group relative inline-flex min-h-[48px] items-center justify-center border border-[#A7C957]/70 px-6 py-3 fw-font-display text-xs tracking-[0.34em] text-[#F4F1E6] uppercase transition-colors duration-300 hover:border-[#F4F1E6] hover:bg-[#F4F1E6] hover:text-[#1B4332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7C957] disabled:pointer-events-none"
          >
            OPEN THE INVITATION
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
