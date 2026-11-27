// Mint Serenity invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (blurred mint wash, slowly
// floating translucent bubbles, soft mist, "TAP TO REVEAL"); on tap
// the FRONT blooms from a single point at its centre — scale 0 → 1
// with a soft ease (~0.9s), a thin bubble-ring ripple expanding
// outward as it grows, and the mist clearing as it lands. The FRONT
// is the existing invitation content, unchanged. Tap again shrinks
// the card back to a point / back side. Ambient bubbles drift behind
// the card; a bubble burst lands the reveal. prefers-reduced-motion:
// instant swap, no ambient animation, no particles. No music on
// this template — the card is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BubbleDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { BubbleCanvas, playPopSound } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the invitation card FRONT (existing content,    */
/* unchanged: markup, typography, colours, borders).                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFFFF] px-4 py-3 text-center text-[#052E22] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(6,95,70,0.52),0_4px_12px_rgba(6,95,70,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(6,95,70,0.45)]"
      }`}
    >
      {/* Soft mint paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.4) 0%, rgba(236, 253, 245, 0.55) 100%)",
        }}
      />

      {/* Fine double mint & sage letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#065F46]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#10B981]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#065F46]/65"
      />

      {/* Editable HTML Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={FONT_DISPLAY}
          className="text-[9px] tracking-[0.26em] text-[#047857] uppercase @min-[29.375rem]:text-[10px]"
        >
          WE INVITE YOU
        </p>

        <h2
          style={FONT_DISPLAY}
          className="mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#052E22] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={FONT_EDITORIAL}
          className="my-0.5 text-base italic text-[#047857] @min-[29.375rem]:text-lg @max-[22rem]:text-sm"
        >
          &amp;
        </span>
        <h2
          style={FONT_DISPLAY}
          className="text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#052E22] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <BubbleDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p
          style={FONT_DISPLAY}
          className="text-[9px] tracking-[0.24em] text-[#052E22] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={FONT_DISPLAY}
          className="mt-1 text-[8.5px] tracking-[0.22em] text-[#047857] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the card's BACK at rest: blurred mint wash, slowly     */
/* floating translucent bubbles, soft mist, live monogram in a thin  */
/* bubble ring, "TAP TO REVEAL". Same footprint as the front         */
/* (absolute inset-0 of the bloom box), so the reveal never moves    */
/* layout.                                                           */
/* ------------------------------------------------------------------ */

const BACK_BUBBLES = [
  { left: "12%", size: 14, duration: 7, delay: 0 },
  { left: "24%", size: 9, duration: 9, delay: 1.6 },
  { left: "38%", size: 18, duration: 8, delay: 0.7 },
  { left: "55%", size: 11, duration: 10, delay: 2.4 },
  { left: "68%", size: 15, duration: 7.5, delay: 1.1 },
  { left: "82%", size: 10, duration: 9.5, delay: 3.0 },
] as const;

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#D1FAE5] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(6,95,70,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred mint wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(255, 255, 255, 0.75) 0%, rgba(209, 250, 229, 0.7) 55%, rgba(167, 243, 208, 0.85) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/50 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -bottom-10 h-44 w-44 rounded-full bg-[#6EE7B7]/50 blur-2xl"
      />

      {/* Slowly floating translucent bubbles over the wash */}
      {BACK_BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-white/80 bg-white/30"
          style={{
            left: b.left,
            bottom: "12%",
            width: b.size,
            height: b.size,
            boxShadow:
              "inset -1px -1px 2px rgba(255,255,255,0.9), inset 1px 1px 2px rgba(6,95,70,0.2)",
          }}
          animate={{ y: [0, -46, 0], opacity: [0.55, 0.95, 0.55] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: [0.37, 0, 0.63, 1],
          }}
        />
      ))}

      {/* Fine double mint & sage border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#065F46]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#10B981]/30 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p
          style={FONT_DISPLAY}
          className="text-[9px] tracking-[0.34em] text-[#047857] uppercase @min-[29.375rem]:text-[10px]"
        >
          WITH LOVE
        </p>

        {/* Live monogram in a thin bubble ring */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#065F46]/50 bg-white/50 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.7), 0 10px 22px -6px rgba(6,95,70,0.35)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#10B981]/40" />
          <span
            style={FONT_DISPLAY}
            className="relative text-[1.6rem] leading-none font-medium tracking-[0.06em] text-[#065F46] @min-[29.375rem]:text-[1.8rem]"
          >
            {initials(site)}
          </span>
        </div>

        <BubbleDivider className="mt-5 h-6 w-24 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p
          style={FONT_DISPLAY}
          className="mt-4 text-[9px] tracking-[0.3em] text-[#047857] uppercase @min-[29.375rem]:text-[10px]"
        >
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MintAmbience — slowly floating translucent bubbles + drifting     */
/* mist blobs behind the card, looping. Transform + opacity only     */
/* (GPU-friendly).                                                   */
/* ------------------------------------------------------------------ */

const AMBIENT_BUBBLES = [
  { left: "5%", size: 10, duration: 9, delay: 0 },
  { left: "14%", size: 16, duration: 11, delay: 1.4 },
  { left: "23%", size: 8, duration: 8, delay: 2.6 },
  { left: "33%", size: 13, duration: 10, delay: 0.8 },
  { left: "44%", size: 9, duration: 12, delay: 3.4 },
  { left: "55%", size: 17, duration: 9.5, delay: 2.0 },
  { left: "66%", size: 11, duration: 10.5, delay: 0.4 },
  { left: "76%", size: 15, duration: 8.5, delay: 4.2 },
  { left: "86%", size: 9, duration: 11.5, delay: 1.8 },
  { left: "93%", size: 12, duration: 9, delay: 5.0 },
] as const;

function MintAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Slow-drifting mist blobs — mint + white */}
      <motion.div
        className="absolute -left-10 top-8 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167,243,208,0.6) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.37, 0, 0.63, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-10 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.37, 0, 0.63, 1] }}
      />

      {/* Rising bubbles */}
      {AMBIENT_BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full border border-white/70 bg-white/25"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            boxShadow:
              "inset -1px -1px 2px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(6,95,70,0.25)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -440, opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBloom — the card-only bubble-bloom reveal                     */
/* ------------------------------------------------------------------ */

export default function MintSerenityEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bloomKey, setBloomKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // Reveal: bloom from a point + bubble burst + pop SFX.
      setBloomKey((k) => k + 1);
      setBurstKey((k) => k + 1);
      playPopSound();
    }
  };

  // Soft bloom ease, ~0.9s; instant under reduced motion.
  const bloomTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

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
                ? "Shrink the wedding invitation card back to its back side"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            {/* Ambient bubbles / drifting mist behind the card.
                Skipped under reduced motion (no animation at all). */}
            {!instant && <MintAmbience />}

            {/* Bloom scene — the FRONT is in flow (it defines the
                box height); the BACK is absolute inset-0. At rest
                the front is scaled to a point at its centre
                (invisible) and the back shows; on reveal the front
                grows 0 → 1 from the centre while the back shrinks
                to a point, so the reveal never moves layout. */}
            <div className="relative z-10 mx-auto w-[92%] @min-[29.375rem]:w-[90%]">
              {/* Soft mint glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(167,243,208,0.55) 0%, rgba(255,255,255,0.4) 55%, transparent 75%)",
                }}
              />

              {/* FRONT — the invitation (unchanged content), blooming
                  from a single point at its centre. */}
              <motion.div
                initial={false}
                animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                transition={bloomTransition}
                style={{ transformOrigin: "50% 50%" }}
                aria-hidden={!isOpen}
                className="relative w-full"
              >
                <InvitationCard site={site} isOpen={isOpen} />
              </motion.div>

              {/* BACK — blurred mint wash + floating bubbles. Shrinks
                  to a point as the front blooms. */}
              <motion.div
                initial={false}
                animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                transition={bloomTransition}
                style={{ transformOrigin: "50% 50%" }}
                aria-hidden={isOpen}
                className="absolute inset-0"
              >
                <CardBack site={site} />
              </motion.div>

              {/* Mist clearing — a soft mint mist over the card that
                  thins away as the bloom lands, and settles back
                  when the card shrinks. */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(236,253,245,0.55) 0%, rgba(209,250,229,0.35) 60%, transparent 100%)",
                }}
                initial={false}
                animate={{ opacity: isOpen ? 0 : 0.5 }}
                transition={bloomTransition}
              />

              {/* Bubble-ring ripple — thin rings expanding outward
                  from the card's centre as it grows. Remounts (key)
                  on every reveal so they replay. */}
              {!instant && isOpen && (
                <span key={bloomKey} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
                  <motion.span
                    className="absolute top-1/2 left-1/2 block h-48 w-48 rounded-full border-2 border-white/80 @min-[29.375rem]:h-64 @min-[29.375rem]:w-64"
                    style={{
                      boxShadow:
                        "0 0 40px rgba(255,255,255,0.6), inset 0 0 30px rgba(167,243,208,0.5)",
                    }}
                    initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
                    animate={{ scale: [0, 1, 1.7], opacity: [0, 0.9, 0], x: "-50%", y: "-50%" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.span
                    className="absolute top-1/2 left-1/2 block h-24 w-24 rounded-full border border-[#065F46]/50 @min-[29.375rem]:h-32 @min-[29.375rem]:w-32"
                    initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
                    animate={{ scale: [0, 1, 1.6], opacity: [0, 0.7, 0], x: "-50%", y: "-50%" }}
                    transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              )}

              {/* Bubble burst on the reveal landing. The canvas
                  renders nothing under reduced motion. */}
              {!instant && (
                <BubbleCanvas
                  particleCount={10}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.5 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue — on a soft pill so it stays legible. */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              style={FONT_DISPLAY}
              className="relative z-10 mt-4 inline-block rounded-full bg-[#ECFDF5]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#047857]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#052E22]"
            >
              {isOpen ? "Tap Card to Shrink Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
