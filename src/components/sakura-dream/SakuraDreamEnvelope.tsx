// Sakura Dream invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a petal-pink watercolor
// wash in soft pink, blush and cream, with a plum monogram disc
// and "Tap to Reveal"); tap rinses the wash away — a soft diagonal
// wipe with the blur fading out, as if water is washing the
// pigment off the card — revealing the FRONT (the existing
// invitation content, unchanged) beneath, with a few sakura petals
// drifting across as it washes away. Tap again and the wash flows
// back over the card. Deliberately NOT a 3D flip (that is Blush
// Royale's concept). prefers-reduced-motion: instant swap, no
// ambient animation, no petals. No music on this template.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Blossom, PetalDivider } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";
import { SakuraPetalCanvas } from "./SakuraCinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream petal invitation card (FRONT,          */
/* unchanged content: couple names, date, venue).                    */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDFB] px-4 py-3 text-center text-[#2E0A3D] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(46,10,61,0.52),0_4px_12px_rgba(46,10,61,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(46,10,61,0.45)]"
      }`}
    >
      {/* Cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 251, 0.4) 0%, rgba(253, 242, 248, 0.55) 100%)",
        }}
      />

      {/* Fine double pink & plum letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#EC4899]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5B2A6E]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5B2A6E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5B2A6E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5B2A6E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5B2A6E]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="sd-font-display text-[9px] tracking-[0.26em] text-[#6B21A8] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="sd-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#2E0A3D] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="sd-font-editorial my-0.5 text-base italic text-[#EC4899] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="sd-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#2E0A3D] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <PetalDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="sd-font-display text-[9px] tracking-[0.24em] text-[#2E0A3D] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="sd-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#6B21A8] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the card's BACK at rest: a petal-pink watercolor wash */
/* (soft pink, blush, cream) with a blurred blossom watermark, a    */
/* plum monogram disc and the tap hint. Same footprint as the front */
/* (absolute inset-0 of the card box), so the reveal never moves    */
/* layout.                                                           */
/* ------------------------------------------------------------------ */

function CardBack({ site, animateWash }: { site: WeddingSite; animateWash: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FDE7F1] px-4 py-2 text-center shadow-[0_10px_24px_-8px_rgba(46,10,61,0.45)] @min-[29.375rem]:py-4">
      {/* Watercolor wash — layered pink / blush / cream pigment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 70% at 18% 12%, rgba(249, 168, 212, 0.85) 0%, rgba(249, 168, 212, 0) 62%), radial-gradient(ellipse 90% 75% at 85% 88%, rgba(236, 72, 153, 0.5) 0%, rgba(236, 72, 153, 0) 60%), radial-gradient(ellipse 80% 65% at 50% 50%, rgba(255, 253, 251, 0.75) 0%, rgba(253, 242, 248, 0) 70%), linear-gradient(135deg, #FBCFE8 0%, #FDE7F1 48%, #FFF7FB 100%)",
        }}
      />

      {/* Slow-drifting wash blobs — pigment swirling in water.
          Transform + opacity only (GPU-friendly). Skipped under
          reduced motion. */}
      {animateWash && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 -left-10 h-40 w-40 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 70%)",
            }}
            animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
            transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -bottom-10 h-44 w-44 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(249, 168, 212, 0.55) 0%, transparent 70%)",
            }}
            animate={{ x: [0, -18, 0], y: [0, -16, 0] }}
            transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
          />
        </>
      )}

      {/* Blurred blossom watermark — the wash seen through water */}
      <Blossom
        className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[2px] @min-[29.375rem]:h-64 @min-[29.375rem]:w-64"
        fill="#F9A8D4"
        center="#FDE68A"
      />

      {/* Fine double pink & plum border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#EC4899]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5B2A6E]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Back content — sized to FIT the front-defined card height
          (D-05: the old py-8 + 80px disc + loose margins made the
          content 41–64px taller than the card at every width, so
          WITH LOVE / TAP TO REVEAL were sliced mid-glyph by the
          frame. Compact at narrow widths, roomier at >=470px
          containers; the front is ~166px tall at 320, ~194px at
          390 and ~260px at 768/1280, and this content now measures
          ~146px / ~220px in those bands. */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="sd-font-display text-[9px] tracking-[0.34em] text-[#6B21A8] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Plum monogram disc ringed by a blossom */}
        <div className="relative mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#6B21A8] shadow-[0_12px_24px_-6px_rgba(46,10,61,0.55)] ring-4 ring-white/80 @min-[29.375rem]:mt-3 @min-[29.375rem]:h-20 @min-[29.375rem]:w-20">
          <span className="sd-font-display relative z-10 text-base font-medium tracking-[0.06em] text-white @min-[29.375rem]:text-xl">
            {initials(site)}
          </span>
        </div>
        <Blossom className="mt-1.5 h-4 w-4 @min-[29.375rem]:mt-2 @min-[29.375rem]:h-5 @min-[29.375rem]:w-5" />

        <PetalDivider className="mt-1.5 h-4 w-20 @min-[29.375rem]:mt-2 @min-[29.375rem]:h-6 @min-[29.375rem]:w-24" />

        <p className="sd-font-display mt-2 text-[9px] tracking-[0.3em] text-[#6B21A8] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Watercolor-wash wipe — the wash rinses off the card along a      */
/* slanted leading edge. Both polygons have 4 points so            */
/* framer-motion can interpolate them. "covered" is the full card;  */
/* "revealed" collapses to a zero-area diagonal line off the right  */
/* edge (top edge outruns the bottom edge, so the wipe edge stays   */
/* diagonal the whole way across). Blur + opacity fade with it, so  */
/* the pigment looks like it dissolves as the water carries it off. */
/* ------------------------------------------------------------------ */

const WASH_COVERED = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const WASH_REVEALED = "polygon(160% 0%, 160% 0%, 60% 100%, 60% 100%)";

export default function SakuraDreamEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [rinseKey, setRinseKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: petals drift across as the wash rinses away, then a
      // diagonal rinse shimmer sweeps the front.
      setBurstKey((k) => k + 1);
      setRinseKey((k) => k + 1);
    }
  };

  const washTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 1.15, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
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
                ? "Cover the wedding invitation card again"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            {/* Soft pink glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(249,168,212,0.55) 0%, rgba(251,207,232,0.35) 55%, transparent 75%)",
              }}
            />

            {/* Card stack — the FRONT is in flow (it defines the box
                height); the BACK is absolute inset-0 above it and
                rinses away on tap. Rest = wash covering the card;
                revealed = wash wiped off diagonally, front showing. */}
            <div className="relative z-10 mx-auto w-full">
              {/* FRONT — the invitation (unchanged content) */}
              <div aria-hidden={!isRevealed} className="relative w-full">
                <InvitationCard site={site} isOpen={isRevealed} />
              </div>

              {/* BACK — petal-pink watercolor wash */}
              <motion.div
                aria-hidden={isRevealed}
                initial={false}
                animate={{
                  clipPath: isRevealed ? WASH_REVEALED : WASH_COVERED,
                  opacity: isRevealed ? 0 : 1,
                  filter: isRevealed ? "blur(8px)" : "blur(0px)",
                }}
                transition={washTransition}
                className="absolute inset-0 z-10"
              >
                <CardBack site={site} animateWash={!instant} />
              </motion.div>

              {/* Rinse shimmer — a soft diagonal pink band sweeping
                  the front once the wash has rinsed away. Remounts
                  (key) on every reveal so it replays; unmounted
                  when covered again. */}
              {rinseKey > 0 && isRevealed && !instant && (
                <motion.div
                  key={rinseKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(249,168,212,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Petals drifting across as the wash rinses away.
                  The canvas renders nothing under reduced motion. */}
              {!instant && (
                <SakuraPetalCanvas
                  petalCount={8}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.45 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue — on a soft pill so it stays legible over the
                blush surface below the card. */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="sd-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFF7FB]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#6B21A8]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#2E0A3D]"
            >
              {isRevealed ? "Tap to Cover Again" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
