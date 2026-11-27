// Ocean Pearl invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK (blurred ocean photograph under a
// deep-sea wash, shell-seal medallion with the couple monogram, "Tap
// to Reveal"); tap rises the card from below with a gentle wave sway
// while bubbles rise, the back fades away and the FRONT (the existing
// invitation content, unchanged) rises into place with an aqua light
// sweep and a bubble burst. Tap again settles it back.
// prefers-reduced-motion: instant swap, no ambient animation, no
// bubbles. No music on this template — the card is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { RisingBubbles, ShellSeal, WaveDivider } from "./Decor";
import { COVER_IMAGE_URL, formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the pearl invitation card (FRONT, unchanged)     */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-white px-4 py-3 text-center text-[#0E3A45] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(14,58,69,0.52),0_4px_12px_rgba(14,58,69,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(14,58,69,0.45)]"
      }`}
    >
      {/* Pearl paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.4) 0%, rgba(216, 237, 239, 0.55) 100%)",
        }}
      />

      {/* Fine double aqua & deep-sea border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#2E8B9A]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#0E3A45]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0E3A45]/55"
      />

      {/* Editable HTML Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="op-font-display text-[9px] font-semibold tracking-[0.26em] text-[#1F6B78] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="op-font-display mt-2 text-[17px] leading-none font-bold tracking-[0.08em] break-words text-[#0E3A45] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.1em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.06em]">
          {site.content.partnerA}
        </h2>
        <span className="op-font-body my-0.5 text-base text-[#2E8B9A] italic @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="op-font-display text-[17px] leading-none font-bold tracking-[0.08em] break-words text-[#0E3A45] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.1em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.06em]">
          {site.content.partnerB}
        </h2>

        <WaveDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:mt-6 @min-[29.375rem]:mb-3 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="op-font-display text-[9px] font-semibold tracking-[0.24em] text-[#0E3A45] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="op-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#1F6B78] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred ocean photograph under a deep-sea wash, shell  */
/* medallion with the couple monogram, tap hint. Same footprint as   */
/* the front (absolute inset-0 of the reveal box), so the reveal     */
/* never changes the layout.                                          */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0E3A45] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(14,58,69,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred ocean photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-sea wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(14,58,69,0.25) 0%, rgba(14,58,69,0.62) 100%)",
        }}
      />

      {/* Fine double aqua border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7FD4DE]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#E6F4F6]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="op-font-display text-[9px] font-semibold tracking-[0.34em] text-[#E6F4F6] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Shell-seal medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#F7FBFC] @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(14,58,69,0.35), 0 10px 22px -6px rgba(14,58,69,0.55)",
          }}
        >
          <ShellSeal className="absolute inset-0 h-full w-full" />
          <span className="op-font-display relative z-10 mt-5 text-[1.05rem] font-bold tracking-[0.06em] text-[#0E3A45]">
            {initials(site)}
          </span>
        </div>

        <WaveDivider className="mt-4 h-6 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="op-font-display mt-3 text-[9px] font-semibold tracking-[0.3em] text-[#E6F4F6] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OceanAmbience — rising bubbles + soft aqua light behind the card. */
/* Transform + opacity only (GPU-friendly). Skipped under reduced    */
/* motion.                                                            */
/* ------------------------------------------------------------------ */

function OceanAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(46,139,154,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(127,212,222,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <RisingBubbles className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BubbleBurst — on reveal, bubbles rise from the card and fade,    */
/* like air escaping a pearl. Renders nothing under reduced motion.  */
/* ------------------------------------------------------------------ */

const BURST_BUBBLES = [
  { x: -70, size: 14, delay: 0.05, dur: 1.0 },
  { x: -44, size: 20, delay: 0.12, dur: 1.15 },
  { x: -18, size: 11, delay: 0.08, dur: 0.95 },
  { x: 8, size: 24, delay: 0.05, dur: 1.2 },
  { x: 34, size: 15, delay: 0.15, dur: 1.05 },
  { x: 60, size: 19, delay: 0.1, dur: 1.1 },
  { x: 82, size: 12, delay: 0.18, dur: 0.9 },
  { x: -96, size: 10, delay: 0.2, dur: 0.9 },
];

function BubbleBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center overflow-hidden"
    >
      {BURST_BUBBLES.map((b, i) => (
        <motion.span
          key={`${burstKey}-${i}`}
          className="absolute bottom-1/4 rounded-full border border-white/70 bg-[#BFE9EE]/40"
          style={{ width: b.size, height: b.size, left: `calc(50% + ${b.x}px)` }}
          initial={{ y: 30, opacity: 0, scale: 0.6 }}
          animate={{ y: -150, opacity: [0, 0.9, 0], scale: 1 }}
          transition={{ duration: b.dur, delay: b.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Tide rise + sway". At rest the BACK shows. Tap     */
/* lifts the card from below with a gentle wave sway while bubbles   */
/* rise, the back fades away and the FRONT rises into place with an  */
/* aqua light sweep and a bubble burst. Tap again settles it back.   */
/* ------------------------------------------------------------------ */

export default function OceanPearlEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [sweepKey, setSweepKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      setBurstKey((k) => k + 1);
      setSweepKey((k) => k + 1);
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
                ? "Hide the wedding invitation card back to its back side"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45]"
          >
            {/* Ambient rising bubbles + soft aqua light behind the card */}
            {!instant && <OceanAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft aqua glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(46,139,154,0.4) 0%, rgba(127,212,222,0.28) 55%, transparent 75%)",
                }}
              />

              {/* Rise + gentle wave sway on reveal */}
              <motion.div
                initial={false}
                animate={{
                  y: isRevealed ? [0, -26, 0] : 0,
                  x: isRevealed ? [0, 6, -6, 0] : 0,
                  rotate: isRevealed ? [0, 1.2, -1.2, 0] : 0,
                }}
                transition={{
                  duration: instant ? 0 : 1.15,
                  times: [0, 0.3, 0.65, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full"
              >
                {/* FRONT — the invitation (unchanged content) */}
                <motion.div
                  aria-hidden={!isRevealed}
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    y: isRevealed ? 0 : 28,
                  }}
                  transition={{ duration: instant ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full"
                >
                  <InvitationCard site={site} isOpen={isRevealed} />
                </motion.div>

                {/* BACK — blurred ocean photo + shell medallion */}
                <motion.div
                  aria-hidden={isRevealed}
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 0 : 1,
                    y: isRevealed ? -14 : 0,
                  }}
                  transition={{ duration: instant ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <CardBack site={site} />
                </motion.div>
              </motion.div>

              {/* Aqua light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(127,212,222,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Bubble burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && <BubbleBurst burstKey={burstKey} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="op-font-display relative z-10 mt-4 inline-block rounded-full bg-white/80 px-4 py-1 text-center text-[10px] font-semibold tracking-[0.26em] text-[#1F6B78]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#0E3A45]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
