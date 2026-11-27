// Vintage Lace invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK, a folded lace letter in the
// vintage-lace palette (ivory linen, lace doily pattern, sepia/gold,
// monogram medallion, "Tap to Reveal"); tap unfolds it in
// horizontal ACCORDION folds — the top fold swings up, the middle
// fold follows, the bottom fold swings down — to reveal the FRONT
// (the existing invitation content, unchanged). Tap again refolds
// the letter to its back. Golden dust motes drift behind the card;
// a warm golden glow burst + gold shimmer land the unfold.
// prefers-reduced-motion: instant swap, no ambient animation, no
// particles. No music on this template — the tap plays only the
// soft lace-rustle SFX (lazily created Web Audio, never autoplay).
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LaceDivider } from "./Decor";
import { DustMoteCanvas, playLaceSound } from "./VintageCinematicOpening";
import { formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ivory letterpress card (FRONT, unchanged     */
/* content: sepia script names, date, venue, lace borders).          */
/* ------------------------------------------------------------------ */

function InvitationCard({
  site,
  isOpen,
  shimmerKey = 0,
}: {
  site: WeddingSite;
  isOpen: boolean;
  shimmerKey?: number;
}) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF8] px-4 py-3 text-center text-[#4A3A2E] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(74,58,46,0.52),0_4px_12px_rgba(74,58,46,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(74,58,46,0.45)]"
      }`}
    >
      {/* Ivory paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 248, 0.4) 0%, rgba(247, 235, 217, 0.55) 100%)",
        }}
      />

      {/* Fine double sepia & rose letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#8B7355]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#C08A8E]/45 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#6B563E]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="vl-font-display text-[9px] font-semibold tracking-[0.26em] text-[#6B563E] uppercase @min-[29.375rem]:text-[10px]">
          We invite you
        </p>

        <h2 className="vl-font-display mt-2 text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#4A3A2E] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="vl-font-editorial my-0.5 text-base italic text-[#96585D] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="vl-font-display text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#4A3A2E] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <LaceDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="vl-font-display text-[9px] font-semibold tracking-[0.24em] text-[#4A3A2E] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="vl-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#6B563E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time warm gold shimmer sweep across the card on reveal.
          Remounts (key) on every open so it replays; unmounted when
          refolded. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(212, 175, 105, 0.45) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Folded-letter BACK — shared lace-linen surface for one accordion  */
/* fold: faint scalloped lace-dot tiling over ivory linen, a dashed  */
/* fold line + soft inset seam shadow along its hinge edge, and a    */
/* sepia hairline frame segment so the three folds read as one       */
/* letter at rest.                                                   */
/* ------------------------------------------------------------------ */

const FOLD_BACKGROUND = [
  "radial-gradient(circle 9px at 12px 12px, rgba(139, 115, 85, 0.10) 8px, transparent 9.5px)",
  "radial-gradient(circle 9px at 34px 34px, rgba(192, 138, 142, 0.09) 8px, transparent 9.5px)",
  "linear-gradient(180deg, rgba(253, 248, 240, 0.55) 0%, rgba(247, 235, 217, 0.55) 100%)",
].join(", ");

const FOLD_BACKGROUND_SIZE = "44px 44px, 44px 44px, cover";

/* One accordion fold. At rest it lies flat (rotateX 0); on reveal it
 * swings away around its hinge edge (top folds hinge at the top and
 * swing up, the bottom fold hinges at the bottom and swings down)
 * and fades, in sequence — top, middle, bottom. Refolding runs the
 * sequence in reverse. Under reduced motion the transition is
 * duration 0: an instant swap. */
function FoldPanel({
  isOpen,
  instant,
  openRotateX,
  origin,
  openDelay,
  closeDelay,
  seamShadow,
  className = "",
  children,
}: {
  isOpen: boolean;
  instant: boolean;
  openRotateX: number;
  origin: string;
  openDelay: number;
  closeDelay: number;
  seamShadow: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ rotateX: isOpen ? openRotateX : 0, opacity: isOpen ? 0 : 1 }}
      transition={
        instant
          ? { duration: 0 }
          : { duration: 0.55, delay: isOpen ? openDelay : closeDelay, ease: [0.22, 1, 0.36, 1] }
      }
      style={{
        transformOrigin: origin,
        backgroundImage: FOLD_BACKGROUND,
        backgroundSize: FOLD_BACKGROUND_SIZE,
        backgroundColor: "#F7EBD9",
        boxShadow: seamShadow,
      }}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden border-[#8B7355]/50 px-3 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* VintageLaceEnvelope — the card-only reveal (file + export names   */
/* kept: the Renderer already imports this default export). The      */
/* FRONT (InvitationCard) is in flow and defines the box height;     */
/* the BACK is three accordion folds absolutely stacked over it.     */
/* ------------------------------------------------------------------ */

export default function VintageLaceEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [glowKey, setGlowKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    // Lace rustle on the fold/unfold — SFX only, lazily created on
    // this tap, never autoplay; no-ops when the sound toggle is off.
    playLaceSound();
    if (next) {
      // Reveal: golden glow burst + shimmer land the unfold.
      setGlowKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
    }
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px] @container"
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? "Fold the wedding invitation card back into its folded lace letter"
                : "Unfold the lace letter to reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
          >
            {/* Ambient golden dust motes + warm breathing glow behind
                the card. Skipped under reduced motion. */}
            {!instant && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 -left-6 h-40 w-40 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(212, 175, 105, 0.4) 0%, transparent 70%)",
                  }}
                  animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
                  transition={{
                    duration: 11,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: [0.45, 0.05, 0.55, 0.95],
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 -bottom-2 h-44 w-44 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(192, 138, 142, 0.35) 0%, transparent 70%)",
                  }}
                  animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
                  transition={{
                    duration: 13,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: [0.45, 0.05, 0.55, 0.95],
                  }}
                />
                <DustMoteCanvas moteCount={14} glowKey={glowKey} glowOrigin={{ x: 0.5, y: 0.45 }} />
              </>
            )}

            {/* Card scene — the FRONT is in flow (it defines the box
                height); the BACK folds are absolute inset-0 over it. */}
            <div className="relative z-10 mx-auto w-full">
              {/* Soft warm glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[6px] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212, 175, 105, 0.4) 0%, rgba(192, 138, 142, 0.25) 55%, transparent 75%)",
                }}
              />

              {/* FRONT — the invitation (unchanged content) */}
              <div aria-hidden={!isOpen} className="relative z-10 w-full">
                <InvitationCard
                  site={site}
                  isOpen={isOpen}
                  shimmerKey={isOpen && !instant ? shimmerKey : 0}
                />
              </div>

              {/* BACK — the folded lace letter: three horizontal
                  accordion folds stacked over the front. Perspective
                  lives on this overlay so each fold hinges in 3D. */}
              <div
                aria-hidden={isOpen}
                style={{
                  perspective: 1200,
                  pointerEvents: isOpen ? "none" : "auto",
                }}
                className="absolute inset-0 z-20 flex flex-col"
              >
                {/* Top fold — hinges at the top, swings up. */}
                <FoldPanel
                  isOpen={isOpen}
                  instant={instant}
                  openRotateX={-102}
                  origin="50% 0%"
                  openDelay={0}
                  closeDelay={0.3}
                  seamShadow="inset 0 -10px 14px -8px rgba(74, 58, 46, 0.28)"
                  className="rounded-t-[4px] border-t border-x py-1"
                >
                  <p className="vl-font-display text-[9px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase @min-[29.375rem]:text-[10px]">
                    With Love
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-px w-10 bg-[#8B7355]/50 @min-[29.375rem]:w-14"
                  />
                </FoldPanel>

                {/* Middle fold — hinges at the top, follows the top
                    fold; carries the monogram medallion. */}
                <FoldPanel
                  isOpen={isOpen}
                  instant={instant}
                  openRotateX={-102}
                  origin="50% 0%"
                  openDelay={0.14}
                  closeDelay={0.16}
                  seamShadow="inset 0 -10px 14px -8px rgba(74, 58, 46, 0.28), inset 0 10px 14px -8px rgba(74, 58, 46, 0.22)"
                  className="border-x py-1"
                >
                  {/* Soft blurred gold halo behind the medallion —
                      the back's blurred, glowing heart. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF69]/35 blur-xl"
                  />
                  <motion.div
                    aria-hidden="true"
                    className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#8B7355]/70 bg-[#FFFDF8] shadow-[0_10px_22px_-8px_rgba(74,58,46,0.5)] @min-[29.375rem]:h-14 @min-[29.375rem]:w-14"
                    animate={
                      instant ? undefined : { scale: [1, 1.05, 1] }
                    }
                    transition={
                      instant
                        ? { duration: 0 }
                        : { duration: 6, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
                    }
                  >
                    <span className="vl-font-display text-[1rem] font-semibold tracking-[0.04em] text-[#6B563E] @min-[29.375rem]:text-[1.05rem]">
                      {initials(site)}
                    </span>
                  </motion.div>
                </FoldPanel>

                {/* Bottom fold — hinges at the bottom, swings down. */}
                <FoldPanel
                  isOpen={isOpen}
                  instant={instant}
                  openRotateX={102}
                  origin="50% 100%"
                  openDelay={0.28}
                  closeDelay={0}
                  seamShadow="inset 0 10px 14px -8px rgba(74, 58, 46, 0.22)"
                  className="rounded-b-[4px] border-b border-x py-1"
                >
                  <LaceDivider className="h-5 w-20 @min-[29.375rem]:h-6 @min-[29.375rem]:w-24" />
                  <p className="vl-font-display mt-1.5 text-[9px] font-semibold tracking-[0.3em] text-[#6B563E] uppercase @min-[29.375rem]:text-[10px]">
                    Tap to Reveal
                  </p>
                </FoldPanel>
              </div>
            </div>

            {/* Cue — on a soft pill so it stays legible. */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="vl-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFFDF8]/85 px-4 py-1 text-center text-[10px] font-semibold tracking-[0.26em] text-[#6B563E] uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#4A3A2E]"
            >
              {isOpen ? "Tap to Fold Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
