// Aurora invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK (a blurred aurora wash in the
// template's night-sky palette, slow-shimmering aurora ribbons,
// glowing monogram orb, "Tap to Reveal"); tap opens a camera-iris
// aperture from the centre of the card — the FRONT (the existing
// invitation content, unchanged) is revealed through an expanding
// clip-path circle, with aurora light spilling out as the iris
// widens and a small star-sparkle burst at full open. Tap again
// closes the iris back to the back side. prefers-reduced-motion:
// instant swap, no ambient animation, no particles. No music on
// this template — the iris is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { AuroraDivider } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ice-white letter card (front, unchanged)     */
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
      className={`relative mx-auto w-full overflow-hidden bg-[#F4F7FB] px-4 py-3 text-center text-[#0F172A] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(2,6,23,0.7),0_4px_12px_rgba(2,6,23,0.4)]"
          : "shadow-[0_10px_24px_-8px_rgba(2,6,23,0.6)]"
      }`}
    >
      {/* Ice-white paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(244, 247, 251, 0.5) 0%, rgba(226, 232, 240, 0.55) 100%)",
        }}
      />

      {/* Fine double teal & violet letter border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#14B8A6]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#8B5CF6]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0F172A]/60"
      />

      {/* Editable HTML Letter Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="au-font-display text-[9px] font-semibold tracking-[0.26em] text-[#0F766E] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="au-font-display mt-2 text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#0F172A] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="au-font-editorial my-0.5 text-base italic text-[#0F766E] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="au-font-display text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#0F172A] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <AuroraDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="au-font-display text-[9px] font-semibold tracking-[0.24em] text-[#0F172A] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="au-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#0F766E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time aurora light sweep across the card on reveal.
          Remounts (key) on every open so it replays; unmounted when
          the iris closes again. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(94,234,212,0.4) 50%, transparent 100%)",
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
/* CardBack — blurred aurora wash, night-sky palette. Same footprint */
/* as the front (absolute inset-0 of the card scene), so the iris    */
/* reveal never moves layout.                                       */
/* ------------------------------------------------------------------ */

function CardBack({ site, animate }: { site: WeddingSite; animate: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#020617] px-4 py-2 text-center shadow-[0_10px_24px_-8px_rgba(2,6,23,0.6)] @min-[29.375rem]:px-6 @min-[29.375rem]:py-8 @max-[22rem]:py-1.5">
      {/* Blurred aurora wash — soft teal/violet night gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 20% 0%, rgba(20,184,166,0.35) 0%, transparent 60%), radial-gradient(ellipse 90% 70% at 85% 100%, rgba(139,92,246,0.4) 0%, transparent 60%), linear-gradient(165deg, #020617 0%, #0F172A 55%, #134E4A 100%)",
        }}
      />

      {/* Slow-shimmering aurora ribbon gradients drifting across
          the back. Transform + opacity only (GPU-friendly). */}
      {animate && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-20%] top-[12%] h-16 rounded-full blur-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.55) 40%, rgba(139,92,246,0.5) 65%, transparent 100%)",
            }}
            animate={{ x: [0, 28, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 11, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-20%] bottom-[16%] h-14 rounded-full blur-2xl"
            style={{
              background:
                "linear-gradient(270deg, transparent 0%, rgba(139,92,246,0.5) 40%, rgba(94,234,212,0.45) 65%, transparent 100%)",
            }}
            animate={{ x: [0, -24, 0], opacity: [0.6, 0.95, 0.6] }}
            transition={{ duration: 14, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(94,234,212,0.14) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </>
      )}

      {/* Fine double teal & violet border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#5EEAD4]/50 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#8B5CF6]/40 @min-[29.375rem]:inset-[15px]"
      />

      {/* Back content — NO z-index here on purpose. The back wrapper is
          absolute (z-auto) and the front paints later in DOM order, so a
          z-10 on this content would lift the orb + eyebrow + cue ABOVE
          the revealed front (the seal-disc-over-names bug + ghosting).
          DOM order already keeps this content above its own back's wash
          and ribbons, which come earlier in the tree. */}
      <div className="relative flex flex-col items-center py-0 @min-[29.375rem]:py-2">
        <p className="au-font-display text-[9px] font-semibold tracking-[0.34em] text-[#CBD5E1] uppercase @min-[29.375rem]:text-[10px]">
          TOGETHER UNDER THE NORTHERN LIGHTS
        </p>

        {/* Aurora orb — glowing teal-violet disc with the monogram.
            Compact at small widths: the front (which defines the card
            height) is ~180px at 390 / ~155px at 320, so the back's
            content must fit inside that budget or the eyebrow / cue
            get clipped by the card's overflow-hidden. */}
        <div
          aria-hidden="true"
          className="relative mt-2 flex h-14 w-14 items-center justify-center rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28 @max-[22rem]:mt-1.5 @max-[22rem]:h-12 @max-[22rem]:w-12"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #5EEAD4 0%, #14B8A6 38%, #6D28D9 72%, #8B5CF6 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -4px 10px rgba(2,6,23,0.45), 0 10px 22px -6px rgba(2,6,23,0.6), 0 0 32px rgba(20,184,166,0.35)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-white/40" />
          <span className="au-font-display relative text-[1.05rem] font-semibold tracking-[0.06em] text-white drop-shadow-[0_2px_6px_rgba(2,6,23,0.7)] @min-[29.375rem]:text-[1.35rem]">
            {initials(site)}
          </span>
        </div>

        <AuroraDivider className="mt-2 h-5 w-20 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="au-font-display mt-2 text-[9px] font-semibold tracking-[0.3em] text-[#5EEAD4] uppercase @min-[29.375rem]:mt-4 @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraAmbience — slow aurora ribbon shimmer behind the card.     */
/* ------------------------------------------------------------------ */

function AuroraAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-8 -left-10 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute -right-8 -bottom-10 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StarBurst — small star-sparkle burst at full iris open. Twelve    */
/* four-point stars radiate from the card centre and fade. Keyed by */
/* burstKey so it replays on every open.                            */
/* ------------------------------------------------------------------ */

const BURST_PARTICLES = [
  { angle: 0, dist: 150, size: 14, teal: true },
  { angle: 30, dist: 110, size: 9, teal: false },
  { angle: 60, dist: 160, size: 11, teal: true },
  { angle: 90, dist: 120, size: 16, teal: false },
  { angle: 120, dist: 150, size: 9, teal: true },
  { angle: 150, dist: 105, size: 12, teal: false },
  { angle: 180, dist: 155, size: 10, teal: true },
  { angle: 210, dist: 115, size: 15, teal: false },
  { angle: 240, dist: 145, size: 9, teal: true },
  { angle: 270, dist: 125, size: 12, teal: false },
  { angle: 300, dist: 160, size: 10, teal: true },
  { angle: 330, dist: 108, size: 13, teal: false },
] as const;

function StarBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible"
    >
      {BURST_PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * p.dist;
        const dy = Math.sin(rad) * p.dist;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 100 100"
            className="absolute"
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              x: dx,
              y: dy,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              rotate: 90,
            }}
            transition={{
              duration: 0.9,
              delay: 0.85,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.35, 1],
            }}
          >
            <path
              d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z"
              fill={p.teal ? "#5EEAD4" : "#C4B5FD"}
            />
          </motion.svg>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraEnvelope — card-only iris reveal (kept file/export name so  */
/* AuroraRenderer needs no change).                                  */
/* ------------------------------------------------------------------ */

export default function AuroraEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // Reveal: aurora light spill + star burst land the iris opening.
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
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? "Close the iris and show the back of the wedding invitation card"
                : "Open the iris to reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            {/* Ambient aurora shimmer behind the card. Skipped under
                reduced motion (no animation at all). */}
            {!instant && <AuroraAmbience />}

            {/* Card scene — the FRONT is in flow (it defines the box
                height); the BACK is absolute inset-0, so the iris
                reveal never moves layout. */}
            <div className="relative z-10 mx-auto w-full">
              {/* Aurora light spill — glows out from behind the card
                  as the iris widens, then settles to a soft halo. */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(94,234,212,0.55) 0%, rgba(139,92,246,0.4) 55%, transparent 75%)",
                }}
                initial={false}
                animate={{ opacity: isOpen ? 0.9 : 0.3 }}
                transition={{ duration: instant ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* BACK — blurred aurora wash + monogram orb */}
              <div aria-hidden={isOpen} className="absolute inset-0">
                <CardBack site={site} animate={!instant} />
              </div>

              {/* FRONT — revealed through the expanding iris aperture:
                  clip-path circle grows from 0% to 150% at centre. */}
              <motion.div
                aria-hidden={!isOpen}
                initial={false}
                animate={{
                  clipPath: isOpen
                    ? "circle(150% at 50% 50%)"
                    : "circle(0% at 50% 50%)",
                }}
                transition={{
                  duration: instant ? 0 : 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "clip-path" }}
                className="relative w-full"
              >
                <InvitationCard
                  site={site}
                  isOpen={isOpen}
                  shimmerKey={isOpen && !instant ? shimmerKey : 0}
                />
              </motion.div>

              {/* Iris rim — a glowing ring that expands with the
                  aperture and fades as it reaches full open. */}
              {isOpen && !instant && (
                <motion.div
                  key={`rim-${burstKey}`}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#5EEAD4]/70"
                  style={{ boxShadow: "0 0 32px rgba(94,234,212,0.5)" }}
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Star-sparkle burst at full open. Renders nothing
                  under reduced motion. */}
              {!instant && <StarBurst burstKey={isOpen ? burstKey : 0} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="au-font-display relative z-10 mt-4 text-center text-[10px] font-semibold tracking-[0.26em] text-[#5EEAD4]/85 uppercase transition-colors group-hover:text-[#F4F7FB]"
            >
              {isOpen ? "Tap Card to Close" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
