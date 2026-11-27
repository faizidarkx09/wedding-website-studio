// Golden Hour invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK (blurred golden-hour photograph
// under a deep-brown/gold wash, gold sun medallion with the couple
// monogram, "Tap to Reveal"); tap rises the card from below with a
// gentle tilt, the back fades away and the FRONT (the existing
// invitation content, unchanged) rises into place with a golden
// light sweep and a burst of golden dust. Tap again settles it back.
// prefers-reduced-motion: instant swap, no ambient animation, no
// particles. No music on this template — the card is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { GoldenDust, SunburstDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { SunburstCanvas } from "./GoldenHourCinematic";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream letterpress card (FRONT, unchanged)    */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-3 text-center text-[#3B2A12] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(36,23,8,0.52),0_4px_12px_rgba(36,23,8,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(36,23,8,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(251, 238, 211, 0.55) 100%)",
        }}
      />

      {/* Fine double honey-gold & brown letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9920E]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5C4423]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C4423]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="gh-font-display text-[9px] tracking-[0.26em] text-[#8A6408] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="gh-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3B2A12] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="gh-font-editorial my-0.5 text-base italic text-[#8A6408] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="gh-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3B2A12] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <SunburstDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="gh-font-display text-[9px] tracking-[0.24em] text-[#3B2A12] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="gh-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8A6408] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred golden-hour photograph under a deep-brown /   */
/* gold wash, gold sun medallion with the couple monogram, tap hint.*/
/* Same footprint as the front (absolute inset-0 of the reveal box), */
/* so the reveal never changes the layout.                           */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#3B2A12] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(36,23,8,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred golden-hour photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-brown / gold wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(59,42,18,0.25) 0%, rgba(59,42,18,0.62) 100%)",
        }}
      />

      {/* Fine double honey-gold border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#E8A93D]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#FBEED3]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="gh-font-display text-[9px] tracking-[0.34em] text-[#FBEED3] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Gold sun medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #F6D68A 0%, #E8A93D 38%, #C9920E 62%, #8A6408 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(59,42,18,0.45), 0 10px 22px -6px rgba(36,23,8,0.55)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#FFFDF6]/50" />
          <span className="gh-font-display relative text-[1.35rem] leading-none font-medium tracking-[0.06em] text-[#3B2A12] @min-[29.375rem]:text-[1.5rem]">
            {initials(site)}
          </span>
        </div>

        <SunburstDivider className="mt-4 h-6 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="gh-font-display mt-3 text-[9px] tracking-[0.3em] text-[#FBEED3] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GoldenAmbience — golden dust + slow-drifting warm light behind   */
/* the card. Transform + opacity only (GPU-friendly). Skipped under  */
/* reduced motion.                                                    */
/* ------------------------------------------------------------------ */

function GoldenAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,169,61,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(246,214,138,0.42) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <GoldenDust className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Sunrise rise + fade". At rest the BACK shows. Tap  */
/* lifts the card from below (rise + gentle tilt) while the back     */
/* fades away and the FRONT rises into place with a golden light     */
/* sweep and a burst of golden dust. Tap again settles it back.      */
/* ------------------------------------------------------------------ */

export default function GoldenHourEnvelope({ site }: { site: WeddingSite }) {
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
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2A12]"
          >
            {/* Ambient golden dust + warm light behind the card */}
            {!instant && <GoldenAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft golden glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(232,169,61,0.45) 0%, rgba(246,214,138,0.3) 55%, transparent 75%)",
                }}
              />

              {/* Rise + gentle tilt lift on reveal */}
              <motion.div
                initial={false}
                animate={{
                  y: isRevealed ? [0, -26, 0] : 0,
                  rotateX: isRevealed ? [0, 7, 0] : 0,
                }}
                transition={{
                  duration: instant ? 0 : 1.05,
                  times: [0, 0.45, 1],
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

                {/* BACK — blurred golden-hour photo + sun medallion */}
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

              {/* Golden light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(246,214,138,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Golden dust burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && (
                <SunburstCanvas
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
              className="gh-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFF8EC]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#8A6408]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#3B2A12]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
