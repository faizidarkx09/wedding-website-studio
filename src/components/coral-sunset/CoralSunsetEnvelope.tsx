// Coral Sunset invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a soft-focus sunset sky,
// plum → coral → peach, with a glowing sun disc straddling the
// horizon line and the couple monogram inside it, "Tap to Reveal");
// tap splits the back into TOP and BOTTOM halves that slide apart
// vertically — like a sun rising over the horizon — to reveal the
// FRONT (the existing invitation content, unchanged) beneath.
// Tap again slides the halves back together. Rising embers drift
// behind the card and a golden spark burst lands the reveal.
// prefers-reduced-motion: instant swap, no ambient animation,
// no particles. No music on this template.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SunsetDivider } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";
import { EmberCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the invitation face (unchanged content)           */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFBF5] px-4 py-3 text-center text-[#3D1F2B] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(46,20,32,0.52),0_4px_12px_rgba(46,20,32,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(46,20,32,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 251, 245, 0.4) 0%, rgba(255, 232, 214, 0.55) 100%)",
        }}
      />

      {/* Fine double coral & plum letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#E85D3D]/75 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5C2E3E]/30 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C2E3E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C2E3E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C2E3E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C2E3E]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="cs-font-display text-[9px] tracking-[0.26em] text-[#C94A2E] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="cs-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3D1F2B] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="cs-font-editorial my-0.5 text-base italic text-[#C94A2E] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="cs-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3D1F2B] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <SunsetDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="cs-font-display text-[9px] tracking-[0.24em] text-[#3D1F2B] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="cs-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#C94A2E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBackHalf — one half of the card BACK. Each half holds a       */
/* full-card-sized copy of the sunset back artwork, clipped by the   */
/* half's own overflow-hidden box, so the two halves join seamlessly */
/* at the horizon line (the sun disc + monogram sit centred on that  */
/* line and split cleanly when the halves slide apart). The inner    */
/* layer is h-[200%] of the half: the top half anchors it at top-0,  */
/* the bottom half at bottom-0, so both copies share one geometry.   */
/* ------------------------------------------------------------------ */

function CardBackHalf({
  site,
  position,
  isOpen,
  instant,
}: {
  site: WeddingSite;
  position: "top" | "bottom";
  isOpen: boolean;
  instant: boolean;
}) {
  const isTop = position === "top";
  const splitTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 0.95, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-x-0 overflow-hidden ${isTop ? "top-0" : "bottom-0"} h-1/2`}
      initial={false}
      animate={{ y: isOpen ? (isTop ? "-102%" : "102%") : "0%" }}
      transition={splitTransition}
    >
      {/* Full-card-sized back artwork (clipped to this half) */}
      <div
        className={`absolute inset-x-0 h-[200%] ${isTop ? "top-0" : "bottom-0"}`}
        style={{
          background:
            "linear-gradient(180deg, #2E1420 0%, #5C2E3E 26%, #C94A2E 52%, #FF7F50 74%, #FFDAB9 100%)",
        }}
      >
        {/* Soft-focus sunset glow — blurred warm blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[8%] left-[12%] h-24 w-24 rounded-full bg-[#FFDAB9]/50 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[10%] bottom-[12%] h-28 w-28 rounded-full bg-[#FF7F50]/60 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB38A]/45 blur-3xl"
        />

        {/* Fine double peach hairline border, matching the front */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 border border-[#FFDAB9]/60 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[13px] border border-[#FFF6EE]/30 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]"
        />

        {/* Eyebrow above the sun */}
        <p className="cs-font-display absolute inset-x-0 top-[9%] text-center text-[9px] tracking-[0.34em] text-[#FFE8D6] uppercase drop-shadow-[0_2px_6px_rgba(46,20,32,0.8)] @min-[29.375rem]:text-[10px]">
          AS THE SUN SETS
        </p>

        {/* Sun disc straddling the horizon, monogram at its centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            aria-hidden="true"
            className="relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_16px_30px_-8px_rgba(46,20,32,0.6),0_4px_10px_rgba(46,20,32,0.35)] ring-2 ring-[#FFDAB9]/60 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, #FFE8D6 0%, #FFB38A 42%, #FF7F50 72%, #E85D3D 100%)",
            }}
            animate={
              instant
                ? undefined
                : { scale: [1, 1.04, 1] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="cs-font-display relative text-[1.35rem] font-medium tracking-[0.06em] text-[#3D1F2B] @min-[29.375rem]:text-[1.5rem]">
              {initials(site)}
            </span>
          </motion.div>
        </div>

        {/* Tap hint below the sun */}
        <p className="cs-font-display absolute inset-x-0 bottom-[9%] text-center text-[9px] tracking-[0.3em] text-[#FFF6EE] uppercase drop-shadow-[0_2px_6px_rgba(46,20,32,0.8)] @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CoralSunsetEnvelope — card-only sunrise split reveal             */
/* (file + default export kept so the Renderer import is unchanged)  */
/* ------------------------------------------------------------------ */

export default function CoralSunsetEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [shimmerKey, setShimmerKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: golden ember burst + warm shimmer land the split.
      setBurstKey((k) => k + 1);
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
            aria-expanded={isRevealed}
            aria-label={
              isRevealed
                ? "Slide the invitation card back together again"
                : "Split the sunset card open to reveal the invitation"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D1F2B]"
          >
            {/* Soft sunset glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,127,80,0.5) 0%, rgba(255,218,185,0.35) 55%, transparent 75%)",
              }}
            />

            {/* Rising embers behind the card + golden burst on reveal.
                Skipped under reduced motion (no animation at all). */}
            {!instant && (
              <EmberCanvas
                emberCount={10}
                burstKey={burstKey}
                burstOrigin={{ x: 0.5, y: 0.45 }}
                className="z-0"
              />
            )}

            {/* Card stack — the FRONT is in flow (it defines the box
                height); the BACK halves are absolute inset-0 above
                it and slide apart vertically on reveal. The stack
                clips the halves so they vanish at the card edges
                instead of overlapping the rest of the page. */}
            <div className="relative z-10 mx-auto w-full overflow-hidden shadow-[0_24px_34px_rgba(46,20,32,0.28)]">
              {/* FRONT — the invitation (unchanged content) */}
              <div aria-hidden={!isRevealed} className="relative w-full">
                <InvitationCard site={site} isOpen={isRevealed} />
              </div>

              {/* One-time warm shimmer sweep across the front on
                  reveal. Remounts (key) on every reveal so it
                  replays; unmounted when covered again. */}
              {shimmerKey > 0 && isRevealed && !instant && (
                <motion.div
                  key={shimmerKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-10 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(255,218,185,0.55) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* BACK — sunset sky split at the horizon line */}
              <div
                aria-hidden={isRevealed}
                className="pointer-events-none absolute inset-0 z-20"
              >
                <CardBackHalf site={site} position="top" isOpen={isRevealed} instant={instant} />
                <CardBackHalf site={site} position="bottom" isOpen={isRevealed} instant={instant} />
                {/* Horizon line — fades as the halves part */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#FFDAB9] to-transparent"
                  initial={false}
                  animate={{ opacity: isRevealed ? 0 : 1 }}
                  transition={{ duration: instant ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Cue — on a soft pill so it stays legible */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="cs-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFF6EE]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#C94A2E]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#3D1F2B]"
            >
              {isRevealed ? "Tap to Cover Again" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
