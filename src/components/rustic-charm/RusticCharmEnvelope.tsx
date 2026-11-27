// Rustic Charm invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK (blurred barn-wood, warm lantern
// glow, drifting dust motes / fireflies, "TAP TO REVEAL"); on tap
// the card slowly zooms in from far away — scale ~0.45 → 1 over
// ~1.6s, the lantern glow intensifying and the blur clearing as it
// approaches — landing with a faint warm glow pulse on the FRONT
// (the existing invitation content, unchanged). Tap again zooms back
// out to the back side. Ambient dust motes / fireflies drift behind
// the card; a golden firefly burst lands the reveal.
// prefers-reduced-motion: instant swap, no ambient animation, no
// particles. No music on this template.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { TwineDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { DustCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream invitation card (the FRONT). The      */
/* markup / typography / colors are unchanged from the previous     */
/* version — only the opening ceremony around it changed.           */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-2 text-center text-[#451A03] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-4 @max-[22rem]:py-1.5 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(45,26,3,0.52),0_4px_12px_rgba(45,26,3,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(45,26,3,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(254, 243, 199, 0.55) 100%)",
        }}
      />

      {/* Fine double bark & twine border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#78350F]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#A16207]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#78350F]/65"
      />

      {/* Card Typography — sized by CONTAINER width (@container on
          the outer wrapper — never viewport `sm:` — so the editor's
          Mobile (390px) preview gets the mobile card and desktop
          (490px container) gets the larger card), in THREE bands:
          - <352px: compact card (14px names, tight padding)
          - 352–469px: small card (15px names)
          - >=470px: large card (22px names, py-4) */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-2 @max-[22rem]:py-0.5">
        <p className="rc-font-display text-[8px] tracking-[0.26em] text-[#92400E] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="rc-font-display mt-1.5 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#451A03] uppercase @min-[29.375rem]:mt-2 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1 @max-[22rem]:text-[14px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="rc-font-editorial my-0.5 text-sm italic text-[#92400E] @min-[29.375rem]:text-lg @max-[22rem]:text-xs">
          &amp;
        </span>
        <h2 className="rc-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#451A03] uppercase @min-[29.375rem]:mt-2 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1 @max-[22rem]:text-[14px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <TwineDivider className="mt-2 mb-1.5 h-5 w-24 @min-[24rem]:mt-8 @min-[29.375rem]:my-3 @min-[29.375rem]:h-7 @min-[29.375rem]:w-28 @max-[22rem]:mb-1 @max-[22rem]:h-4" />

        <p className="rc-font-display text-[9px] tracking-[0.24em] text-[#451A03] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="rc-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#92400E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the card's BACK at rest: blurred barn-wood photo      */
/* under a warm dark wash, a soft glowing lantern light, and a      */
/* glowing wood disc with the couple monogram. Same footprint as    */
/* the front (absolute inset-0 of the card column), so the reveal   */
/* never moves layout.                                              */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#2D1F14] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(45,26,3,0.45)] sm:px-6">
      {/* Blurred barn-wood texture (the template's barn detail
          photo, blurred + scaled past its edges so no sharp rim
          shows through the blur) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ENVELOPE_IMAGE_URL}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-[7px]"
      />

      {/* Warm dark wash so the cream type stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(45,31,20,0.55) 0%, rgba(45,31,20,0.32) 45%, rgba(45,31,20,0.65) 100%)",
        }}
      />

      {/* Soft lantern glow behind the disc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(253,230,138,0.55) 0%, rgba(253,230,138,0.12) 55%, transparent 75%)",
        }}
      />

      {/* Fine double bark & twine border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#FEF3C7]/50 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#FDE68A]/30 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="rc-font-display text-[9px] tracking-[0.34em] text-[#FDE68A] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Lantern disc — warm glowing wood disc with the monogram */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#451A03] @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(254,243,199,0.35) 0%, transparent 55%), linear-gradient(160deg, #92400E 0%, #78350F 55%, #5C2A08 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(254,243,199,0.35), inset 0 -4px 10px rgba(45,26,3,0.5), 0 0 32px 6px rgba(253,230,138,0.45), 0 10px 22px -6px rgba(45,26,3,0.6)",
          }}
        >
          <span className="rc-font-display text-[1.35rem] font-medium tracking-[0.06em] text-[#FEF3C7]">
            {initials(site)}
          </span>
        </div>

        <TwineDivider className="mt-5 h-5 w-24 @min-[29.375rem]:h-7 @min-[29.375rem]:w-28" />

        <p className="rc-font-display mt-4 text-[9px] tracking-[0.3em] text-[#FEF3C7] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RusticCharmEnvelope — card-only slow-zoom reveal.                */
/*                                                                    */
/* At rest the BACK fills the card column (the FRONT sits inside    */
/* it, scaled to 0.45, blurred and transparent — invisible, but     */
/* still in flow so it defines the column height and the back       */
/* always matches it exactly). On tap the FRONT slowly zooms in     */
/* from far away (scale 0.45 → 1, blur 10px → 0, ~1.6s gentle      */
/* ease) while the BACK dissolves, the lantern glow intensifies,    */
/* and a golden firefly burst + a faint warm glow pulse land the    */
/* reveal. Tap again zooms back out to the back side. Reduced       */
/* motion: instant swap, no ambient animation, no particles.        */
/* ------------------------------------------------------------------ */

export default function RusticCharmEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [glowKey, setGlowKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // Reveal: golden firefly burst + glow pulse land the zoom.
      setBurstKey((k) => k + 1);
      setGlowKey((k) => k + 1);
    }
  };

  // Slow zoom-in on reveal (~1.6s, gentle ease); a quicker zoom-out
  // when tucking back. Reduced motion: instant, no scale or blur.
  const zoomTransition: Transition = instant
    ? { duration: 0 }
    : isOpen
      ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
      : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

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
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? "Zoom the wedding invitation card back out to its back side"
                : "Reveal the wedding invitation card with a slow zoom-in"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03]"
          >
            {/* Ambient dust motes / fireflies behind the card.
                Skipped under reduced motion (no animation at all). */}
            {!instant && (
              <DustCanvas
                particleCount={14}
                burstKey={burstKey}
                burstOrigin={{ x: 0.5, y: 0.45 }}
                className="z-20"
              />
            )}

            {/* Card column — the FRONT is in flow (it defines the
                height); the BACK is absolute inset-0, so the reveal
                never moves layout. */}
            <div className="relative z-10 mx-auto w-[92%] sm:w-[90%]">
              {/* Soft warm glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(253,230,138,0.45) 0%, rgba(146,64,14,0.28) 55%, transparent 75%)",
                }}
              />

              {/* Faint warm glow pulse on landing — replays on every
                  reveal (key), timed to the end of the 1.6s zoom. */}
              {isOpen && !instant && (
                <motion.div
                  key={glowKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-5 z-0 rounded-[2rem] blur-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(253,230,138,0.6) 0%, rgba(146,64,14,0.35) 55%, transparent 75%)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1, 1.08] }}
                  transition={{ duration: 1.0, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* FRONT — the invitation, zooming in from far away */}
              <motion.div
                initial={false}
                animate={
                  instant
                    ? { scale: 1, opacity: isOpen ? 1 : 0, filter: "blur(0px)" }
                    : isOpen
                      ? { scale: 1, opacity: 1, filter: "blur(0px)" }
                      : { scale: 0.45, opacity: 0, filter: "blur(10px)" }
                }
                transition={zoomTransition}
                className="relative w-full"
              >
                <div aria-hidden={!isOpen}>
                  <InvitationCard site={site} isOpen={isOpen} />
                </div>
              </motion.div>

              {/* BACK — blurred barn-wood + lantern glow */}
              <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{
                  duration: instant ? 0 : isOpen ? 0.7 : 0.6,
                  delay: instant ? 0 : isOpen ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0"
                aria-hidden={isOpen}
              >
                <CardBack site={site} />
              </motion.div>
            </div>

            {/* Cue — on a soft pill so it stays legible */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="rc-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFFBEB]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#92400E]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#451A03]"
            >
              {isOpen ? "Tap to Zoom Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
