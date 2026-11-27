// Amethyst Royale invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (deep-violet faceted crystal,
// lavender glow, hexagonal crest with the couple monogram, "Tap to
// Reveal"); tap and the back CLEAVES along a diagonal — the two
// halves slide apart along the diagonal (top-left half down-left,
// bottom-right half up-right, like a crystal facet cleaving) to
// reveal the FRONT (the existing invitation content, unchanged).
// Tap again and the halves slide back together. A violet shimmer
// sweep + crystal sparkle burst land the reveal. Ambient violet
// glow drifts behind the card. prefers-reduced-motion: instant
// reveal, no ambient animation, no particles. No music on this
// template — the card is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CrystalCrest, FacetDivider } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";
import { CrystalCanvas } from "./CinematicOpening";

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
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDFF] px-4 py-3 text-center text-[#2E1065] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(46,16,101,0.52),0_4px_12px_rgba(46,16,101,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(46,16,101,0.45)]"
      }`}
    >
      {/* Pale lavender paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 255, 0.4) 0%, rgba(243, 232, 255, 0.55) 100%)",
        }}
      />

      {/* Fine double amethyst & violet letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7C3AED]/75 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#4C1D95]/30 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#4C1D95]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#4C1D95]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#4C1D95]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#4C1D95]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="ar-font-display text-[9px] tracking-[0.26em] text-[#5B21B6] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="ar-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#2E1065] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="ar-font-editorial my-0.5 text-base italic text-[#5B21B6] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="ar-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#2E1065] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <FacetDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="ar-font-display text-[9px] tracking-[0.24em] text-[#2E1065] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="ar-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#5B21B6] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time violet shimmer sweep across the card on reveal.
          Remounts (key) on every open so it replays; unmounted when
          the halves close again. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(221,214,254,0.5) 50%, transparent 100%)",
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
/* CardBackFace — one full-size face of the card BACK: deep-violet   */
/* crystal gradient, translucent facet polygons, soft blurred        */
/* lavender glow. Rendered twice (once per cleave half), each copy  */
/* clipped to its diagonal triangle.                                */
/* ------------------------------------------------------------------ */

function CardBackFace() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(140deg, #2E1065 0%, #5B21B6 45%, #7C3AED 78%, #4C1D95 100%)",
      }}
    >
      {/* Soft blurred lavender light */}
      <div
        className="absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(233,213,255,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-6 -bottom-10 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Translucent crystal facets + facet edge strokes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <polygon points="0,0 55,0 30,45 0,30" fill="#E9D5FF" opacity="0.18" />
        <polygon points="100,0 100,40 70,25 55,0" fill="#FFFFFF" opacity="0.1" />
        <polygon points="0,100 0,60 35,75 45,100" fill="#C4B5FD" opacity="0.15" />
        <polygon points="100,100 60,100 80,60 100,55" fill="#A78BFA" opacity="0.16" />
        <polygon points="30,45 70,25 80,60 35,75" fill="#DDD6FE" opacity="0.08" />
        <g stroke="#DDD6FE" strokeWidth="0.4" opacity="0.4" fill="none">
          <polyline points="0,0 55,0 30,45 0,30" />
          <polyline points="100,0 100,40 70,25 55,0" />
          <polyline points="0,100 0,60 35,75 45,100" />
          <polyline points="100,100 60,100 80,60 100,55" />
          <polyline points="30,45 70,25 80,60 35,75" />
        </g>
      </svg>

      {/* Fine double lavender border, matching the front */}
      <div className="pointer-events-none absolute inset-2.5 border border-[#E9D5FF]/60 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1" />
      <div className="pointer-events-none absolute inset-[13px] border border-[#C4B5FD]/40 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CrystalAmbience — violet glow blobs drifting slowly behind the    */
/* card, looping. Transform + opacity only (GPU-friendly). Skipped   */
/* under reduced motion.                                             */
/* ------------------------------------------------------------------ */

function CrystalAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -top-6 -left-8 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -14, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute -right-6 -bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      {/* Slow diagonal light sweep across the whole card area */}
      <motion.div
        className="absolute inset-y-0 w-1/4"
        animate={{ x: ["-120%", "480%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="h-full w-full"
          style={{
            transform: "skewX(-12deg)",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(221,214,254,0.35) 50%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AmethystRoyaleEnvelope — the card-only diagonal-split reveal.     */
/* (File + export name kept: the Renderer already imports this path. */
/*  There is no envelope here — only the invitation card.)           */
/*                                                                    */
/* The FRONT is in flow (it defines the box height). The BACK is an  */
/* absolute inset-0 overlay: two full-size CardBackFace copies, each */
/* clipped to one side of the top-right → bottom-left diagonal. At   */
/* rest the halves are joined and the crest + monogram + tap hint    */
/* sit centred on top. On reveal the halves slide apart ALONG the   */
/* diagonal (top-left half down-left, bottom-right half up-right)    */
/* until they are clipped away at the card edge, the centre content  */
/* fades, and the front shows through the widening cleave. Tap again */
/* slides them back together.                                        */
/* ------------------------------------------------------------------ */

export default function AmethystRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: crystal burst + shimmer land the cleave.
      setBurstKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
    }
  };

  // The cleave: halves travel the full card span along the diagonal
  // so nothing of the back is left showing once they arrive.
  const cleaveTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 0.95, ease: [0.22, 1, 0.36, 1] };

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
            aria-expanded={isRevealed}
            aria-label={
              isRevealed
                ? "Close the invitation card to show its faceted crystal back"
                : "Reveal the wedding invitation card — the faceted back splits open along a diagonal"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1065]"
          >
            {/* Ambient violet glow behind the card. Skipped under
                reduced motion (no animation at all). */}
            {!instant && <CrystalAmbience />}

            <div className="relative z-10 mx-auto w-[92%] sm:w-[90%]">
              {/* Soft violet glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(124,58,237,0.45) 0%, rgba(196,181,253,0.3) 55%, transparent 75%)",
                }}
              />

              <div className="relative w-full">
                {/* FRONT — the invitation (unchanged content) */}
                <div aria-hidden={!isRevealed} className="relative w-full">
                  <InvitationCard
                    site={site}
                    isOpen={isRevealed}
                    shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                  />
                </div>

                {/* BACK — two diagonal halves + cleave line + centre
                    content. overflow-hidden clips the halves as they
                    slide off the card edge. */}
                <div
                  aria-hidden={isRevealed}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    boxShadow: isRevealed
                      ? undefined
                      : "0 10px 24px -8px rgba(46,16,101,0.45)",
                  }}
                >
                  {/* Half A — top-left triangle, slides down-left
                      along the diagonal on reveal. */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                    }}
                    initial={false}
                    animate={
                      isRevealed ? { x: "-100%", y: "100%" } : { x: "0%", y: "0%" }
                    }
                    transition={cleaveTransition}
                  >
                    <CardBackFace />
                  </motion.div>

                  {/* Half B — bottom-right triangle, slides up-right
                      along the diagonal on reveal. */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    }}
                    initial={false}
                    animate={
                      isRevealed ? { x: "100%", y: "-100%" } : { x: "0%", y: "0%" }
                    }
                    transition={cleaveTransition}
                  >
                    <CardBackFace />
                  </motion.div>

                  {/* Bright facet edge along the cleave line
                      (top-right → bottom-left). Fades as the halves
                      part. */}
                  <motion.svg
                    aria-hidden="true"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 z-10 h-full w-full"
                    initial={false}
                    animate={{ opacity: isRevealed ? 0 : 1 }}
                    transition={{ duration: instant ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <line
                      x1="100"
                      y1="0"
                      x2="0"
                      y2="100"
                      stroke="#C4B5FD"
                      strokeWidth="5"
                      vectorEffect="non-scaling-stroke"
                      opacity="0.35"
                    />
                    <line
                      x1="100"
                      y1="0"
                      x2="0"
                      y2="100"
                      stroke="#F5F0FA"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                      opacity="0.9"
                    />
                  </motion.svg>

                  {/* Centre content — crest + monogram + tap hint.
                      Fades and settles as the halves part; returns
                      when they close. */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden px-4 py-3 text-center"
                    initial={false}
                    animate={
                      isRevealed
                        ? { opacity: 0, scale: 0.94 }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{
                      duration: instant ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="ar-font-display text-[9px] tracking-[0.34em] text-[#E9D5FF] uppercase @min-[29.375rem]:text-[10px]">
                      WITH LOVE
                    </p>

                    {/* Faceted hexagonal gem crest with the live
                        monogram — the template's own crest, reused
                        from the cover. */}
                    <div className="relative mt-2 flex h-[4.25rem] w-[4.25rem] items-center justify-center @min-[29.375rem]:mt-3 @min-[29.375rem]:h-24 @min-[29.375rem]:w-24">
                      <div
                        aria-hidden="true"
                        className="absolute inset-[-18%] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(221,214,254,0.55) 0%, rgba(124,58,237,0.25) 55%, transparent 75%)",
                        }}
                      />
                      <CrystalCrest className="absolute inset-0 h-full w-full drop-shadow-[0_6px_16px_rgba(46,16,101,0.6)]" />
                      <span className="ar-font-display ar-amethyst-embossed-text relative text-base font-medium tracking-[0.06em] @min-[29.375rem]:text-xl">
                        {initials(site)}
                      </span>
                    </div>

                    <p className="ar-font-display mt-2 text-[9px] tracking-[0.3em] text-[#E9D5FF] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[10px]">
                      TAP TO REVEAL
                    </p>
                  </motion.div>
                </div>

                {/* Crystal sparkles + burst on the reveal landing.
                    The canvas renders nothing under reduced motion. */}
                {!instant && (
                  <CrystalCanvas
                    sparkleCount={8}
                    burstKey={burstKey}
                    burstOrigin={{ x: 0.5, y: 0.45 }}
                    className="z-20"
                  />
                )}
              </div>

              {/* Cue */}
              <motion.p
                key={isRevealed ? "front" : "back"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: instant ? 0 : 0.4 }}
                className="ar-font-display relative z-10 mt-4 text-center text-[10px] tracking-[0.26em] text-[#5B21B6]/80 uppercase transition-colors group-hover:text-[#2E1065]"
              >
                {isRevealed ? "Tap Card to Close" : "Tap Card to Reveal"}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
