// Winter Frost opening cover — view 01. Full-bleed snowy
// photograph, "WITH LOVE", the couple names in white script, the
// snowflake-crest medallion with the LIVE monogram overlaid as HTML
// text (never baked in), a falling-snow particle layer, and "OPEN
// THE INVITATION". Only the data comes from the site (Partner A /
// Partner B placeholders). No music on this template. There is NO
// envelope anywhere: the cover opens onto the invitation CARD.
//
// Cinematic opening (plays once per page session, never under
// prefers-reduced-motion): Phase 1 anticipation — falling snow,
// ice shimmer, the snowflake-crest medallion; Phase 2 crest
// activation on tap (~1.5s) — snowflake crest glow with a frost
// burst and one gentle pulse; Phase 3+4 live in the renderer
// (PanelsOverlay): the cover exits instantly, the frost-mist veil
// thins, drifts upward and fades away to reveal the invitation
// card, with a snowflake burst + aurora shimmer. A reload in the
// same session, or a reduced-motion tap, takes the plain 1.05s
// ceremony instead. Skip jumps straight to the invitation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SnowflakeCrest } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials } from "./tokens";
import { SkipButton, SnowflakeCanvas, SoundToggle } from "./CinematicOpening";

const SESSION_FLAG = "wf-cinematic-played";

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

export default function WinterFrostCover({
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
  // "idle" = Phase 1 anticipation; "crest" = Phase 2 activation.
  const [phase, setPhase] = useState<"idle" | "crest">("idle");
  const [burstKey, setBurstKey] = useState(0);
  const startedRef = useRef(false);
  const crestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (crestTimerRef.current) clearTimeout(crestTimerRef.current);
    },
    []
  );

  const startCinematic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    markPlayed();
    setPhase("crest");
    setBurstKey((k) => k + 1);
    // Phase 2 lasts ~1.5s; then the renderer takes over (mist veil).
    crestTimerRef.current = setTimeout(() => {
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
    if (crestTimerRef.current) clearTimeout(crestTimerRef.current);
    startedRef.current = true;
    markPlayed();
    onOpen();
  };

  const activating = phase === "crest";

  return (
    // Cover exit is a deliberate ~1.05s ceremony. During the
    // cinematic sequence the exit is instant instead — the mist
    // veil covers the screen while the invitation card mounts.
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0B2540] px-5 py-12 text-[#FDFEFF] select-none"
    >
      {/* Full-bleed snowy photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple in winter wedding attire in a snowy pine forest at dusk"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Cool dark overlays so the white type stays readable over the
          bright snow: heavier at top and bottom, lighter in the middle
          where the couple stands. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11, 37, 64, 0.78) 0%, rgba(11, 37, 64, 0.22) 30%, rgba(11, 37, 64, 0.16) 55%, rgba(11, 37, 64, 0.68) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(127, 179, 217, 0.14) 0%, rgba(11, 37, 64, 0.3) 100%)",
        }}
      />

      {/* Phase 1 — falling snowflake asterisks (+ frost burst on crest tap) */}
      {!prefersReducedMotion && (
        <SnowflakeCanvas flakeCount={16} burstKey={burstKey} burstOrigin={{ x: 0.5, y: 0.58 }} />
      )}

      {/* Double ice hairline inner border framing the luxury card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#BDE0F5]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#BDE0F5]/20"
      />

      {/* Sound toggle — visible through the whole sequence, SFX only */}
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      {/* Skip — only while the crest sequence is running */}
      {activating && <SkipButton onSkip={handleSkip} />}

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display text-xs tracking-[0.38em] text-[#D6EBF9] uppercase drop-shadow-[0_2px_6px_rgba(11,37,64,0.85)]"
        >
          WITH LOVE
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="wf-font-script mt-4 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFFFF] drop-shadow-[0_3px_14px_rgba(11,37,64,0.8)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Ice rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#BDE0F5] to-transparent"
        />
      </div>

      {/* Central-Lower Snowflake-Crest Medallion with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        {/* Phase 2 — soft frost glow around the crest, once */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(189, 224, 245, 0.6) 0%, rgba(189, 224, 245, 0.14) 55%, transparent 75%)",
          }}
          initial={{ opacity: 0 }}
          animate={activating ? { opacity: [0, 0.95, 0.35] } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : activating
                ? { y: [0, -5, 0], scale: [1, 1.04, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            activating
              ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }
          }
          className="relative mx-auto aspect-square w-full max-w-[300px]"
        >
          <SnowflakeCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(11,37,64,0.65)]" />

          {/* Phase 1 — gentle ice sheen drifting across the crest;
              Phase 2 — one faster frost sweep across its surface. */}
          {!prefersReducedMotion && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[300px] overflow-hidden rounded-full"
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-y-[-10%] w-1/3"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.55) 50%, transparent 100%)",
                  transform: "skewX(-12deg)",
                }}
                initial={{ x: "-160%" }}
                animate={activating ? { x: "360%" } : { x: ["-160%", "360%"] }}
                transition={
                  activating
                    ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                    : { duration: 5.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1], repeatDelay: 2.5 }
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
              className="wf-font-display wf-frost-embossed-text text-[1.95rem] font-medium tracking-[0.06em]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action — fades out as the crest activates */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: activating ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: activating ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          disabled={activating}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 wf-font-display text-xs tracking-[0.34em] text-[#FDFEFF] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BDE0F5] disabled:pointer-events-none"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(11,37,64,0.85)]">OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#BDE0F5]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#FFFFFF]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
