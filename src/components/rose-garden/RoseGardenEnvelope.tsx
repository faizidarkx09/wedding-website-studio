// Rose Garden invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK (blurred rose-garden photograph
// under a deep-rose wash, rose wax-seal medallion with the couple
// monogram, "Tap to Reveal"); tap rises the card from below with a
// gentle tilt while rose petals bloom outward, the back fades away
// and the FRONT (the existing invitation content, unchanged) rises
// into place with a rose light sweep and drifting petals. Tap again
// settles it back. prefers-reduced-motion: instant swap, no ambient
// animation, no petals. No music on this template — the card is the
// interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FallingPetals, RoseDivider, RoseMark } from "./Decor";
import { COVER_IMAGE_URL, formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream letterpress card (FRONT, unchanged)    */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFCF8] px-4 py-3 text-center text-[#3D1420] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(61,20,32,0.52),0_4px_12px_rgba(61,20,32,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(61,20,32,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 252, 248, 0.4) 0%, rgba(253, 237, 228, 0.55) 100%)",
        }}
      />

      {/* Fine double deep-rose & leaf letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#B3124F]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#3E6B3A]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C2A38]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C2A38]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C2A38]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C2A38]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="rg-font-display text-[9px] tracking-[0.26em] text-[#7E0C37] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="rg-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3D1420] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="rg-font-editorial my-0.5 text-base italic text-[#7E0C37] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="rg-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3D1420] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <RoseDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="rg-font-display text-[9px] tracking-[0.24em] text-[#3D1420] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="rg-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#7E0C37] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred rose-garden photograph under a deep-rose wash, */
/* rose wax-seal medallion with the couple monogram, tap hint. Same  */
/* footprint as the front (absolute inset-0 of the reveal box), so   */
/* the reveal never changes the layout.                               */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#3D1420] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(61,20,32,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred rose-garden photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-rose wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(61,20,32,0.25) 0%, rgba(61,20,32,0.62) 100%)",
        }}
      />

      {/* Fine double deep-rose border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D6336C]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#FADCE3]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="rg-font-display text-[9px] tracking-[0.34em] text-[#FADCE3] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Rose wax-seal medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #D6336C 0%, #B3124F 45%, #7E0C37 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(61,20,32,0.45), 0 10px 22px -6px rgba(61,20,32,0.55)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#FFF7F2]/50" />
          <span className="relative flex flex-col items-center text-[#FFF7F2]">
            <RoseMark className="h-6 w-6 text-[#FADCE3]" />
            <span className="rg-font-display mt-0.5 text-[13px] font-medium tracking-[0.08em]">
              {initials(site)}
            </span>
          </span>
        </div>

        <RoseDivider className="mt-4 h-6 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" light />

        <p className="rg-font-display mt-3 text-[9px] tracking-[0.3em] text-[#FADCE3] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RoseAmbience — drifting rose petals + soft rose light behind the  */
/* card. Transform + opacity only (GPU-friendly). Skipped under      */
/* reduced motion.                                                    */
/* ------------------------------------------------------------------ */

function RoseAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(214,51,108,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,167,185,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <FallingPetals className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PetalBloom — on reveal, eight rose petals bloom outward from the  */
/* card's centre and fade, like a rose opening. Renders nothing     */
/* under reduced motion.                                              */
/* ------------------------------------------------------------------ */

const BLOOM_PETALS = [
  { angle: -90, dist: 110, size: 22, color: "#D6336C", delay: 0.05 },
  { angle: -45, dist: 96, size: 18, color: "#E85D8A", delay: 0.1 },
  { angle: 0, dist: 110, size: 22, color: "#B3124F", delay: 0.05 },
  { angle: 45, dist: 96, size: 18, color: "#F4A7B9", delay: 0.1 },
  { angle: 90, dist: 110, size: 22, color: "#D6336C", delay: 0.05 },
  { angle: 135, dist: 96, size: 18, color: "#E85D8A", delay: 0.1 },
  { angle: 180, dist: 110, size: 22, color: "#B3124F", delay: 0.05 },
  { angle: -135, dist: 96, size: 18, color: "#F4A7B9", delay: 0.1 },
];

function PetalBloom({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {BLOOM_PETALS.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.dist;
        const y = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            className="absolute rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
            style={{ width: p.size, height: p.size * 1.25, background: p.color }}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.95, rotate: p.angle }}
            animate={{ x, y, scale: 1, opacity: 0, rotate: p.angle + 40 }}
            transition={{ duration: 1.1, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Bloom rise". At rest the BACK shows. Tap lifts the  */
/* card from below (rise + gentle tilt) while rose petals bloom      */
/* outward, the back fades away and the FRONT rises into place with  */
/* a rose light sweep and drifting petals. Tap again settles it     */
/* back.                                                              */
/* ------------------------------------------------------------------ */

export default function RoseGardenEnvelope({ site }: { site: WeddingSite }) {
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
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D1420]"
          >
            {/* Ambient drifting petals + soft rose light behind the card */}
            {!instant && <RoseAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft rose glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(214,51,108,0.4) 0%, rgba(244,167,185,0.28) 55%, transparent 75%)",
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

                {/* BACK — blurred rose-garden photo + rose seal medallion */}
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

              {/* Rose light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(244,167,185,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Rose petal bloom on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && <PetalBloom burstKey={burstKey} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="rg-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFFCF8]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#7E0C37]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#3D1420]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
