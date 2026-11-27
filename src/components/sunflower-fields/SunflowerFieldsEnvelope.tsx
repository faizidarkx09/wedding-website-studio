// Sunflower Fields invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a blurred sunflower-field
// wash in the template's yellow/green palette, a soft sun disc with
// the couple monogram, gently swaying blurred sunflower silhouettes,
// "TAP TO REVEAL"); tap pops the FRONT in with a springy bounce
// (scale 0.65 → 1.12 → 1, spring stiffness ~260, damping ~16) and
// sunflower petals burst outward as it lands. The FRONT is the
// existing invitation content, unchanged. Tap again pops back to the
// back side. Ambient pollen drifts and blurred sunflowers sway
// behind the card. prefers-reduced-motion: instant swap, no ambient
// animation, no particles. No music on this template.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SunflowerBloom, SunflowerDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { PollenCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream invitation card (front). Content,      */
/* typography and colours unchanged from the original card.          */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFEF5] px-4 py-3 text-center text-[#14532D] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(20,83,45,0.52),0_4px_12px_rgba(20,83,45,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(20,83,45,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 254, 245, 0.4) 0%, rgba(254, 243, 199, 0.55) 100%)",
        }}
      />

      {/* Fine double green & yellow letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#166534]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#EAB308]/50 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#166534]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[9px] tracking-[0.26em] text-[#166534] uppercase @min-[29.375rem]:text-[10px]"
        >
          WE INVITE YOU
        </p>

        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14532D] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={{ fontFamily: FONT_EDITORIAL }}
          className="my-0.5 text-base italic text-[#166534] @min-[29.375rem]:text-lg @max-[22rem]:text-sm"
        >
          &amp;
        </span>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14532D] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <SunflowerDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-6 @min-[29.375rem]:my-4 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[9px] tracking-[0.24em] text-[#14532D] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1 text-[8.5px] tracking-[0.22em] text-[#166534] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the card's back side: a blurred sunflower-field wash  */
/* in the template's yellow/green palette, a soft sun disc carrying */
/* the couple monogram, and gently swaying blurred sunflower         */
/* silhouettes along the bottom edge. Same footprint as the front    */
/* (absolute inset-0 of the card box), so the pop never moves the    */
/* layout.                                                           */
/* ------------------------------------------------------------------ */

function CardBack({ site, instant }: { site: WeddingSite; instant: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FEF9C3] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(20,83,45,0.45)] @min-[29.375rem]:px-6">
      {/* Sunflower-field wash — sunny sky melting into leaf green */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FEF9C3 0%, #FDE68A 42%, #BBF7D0 78%, #86EFAC 100%)",
        }}
      />

      {/* Soft sun glow behind the disc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[16%] left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#FDE68A]"
        style={{ boxShadow: "0 0 60px 28px rgba(253, 230, 138, 0.8)" }}
      />

      {/* Swaying blurred sunflower silhouettes along the bottom edge */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-7 -left-8 h-32 w-32 opacity-70 blur-[3px]"
        animate={instant ? { rotate: 0, y: 0 } : { rotate: [-4, 4, -4], y: [0, -5, 0] }}
        transition={
          instant
            ? { duration: 0 }
            : { duration: 7, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      >
        <SunflowerBloom className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-9 -bottom-8 h-36 w-36 opacity-60 blur-[3px]"
        animate={instant ? { rotate: 0, y: 0 } : { rotate: [5, -4, 5], y: [0, -6, 0] }}
        transition={
          instant
            ? { duration: 0 }
            : { duration: 8.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      >
        <SunflowerBloom className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 opacity-50 blur-[2px]"
        animate={instant ? { rotate: 0 } : { rotate: [-3, 3, -3] }}
        transition={
          instant
            ? { duration: 0 }
            : { duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      >
        <SunflowerBloom className="h-full w-full" />
      </motion.div>

      {/* Fine double green & yellow border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#166534]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#EAB308]/50 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[9px] tracking-[0.34em] text-[#166534] uppercase @min-[29.375rem]:text-[10px]"
        >
          WITH LOVE
        </p>

        {/* Sun disc — warm gold with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-28 w-28 items-center justify-center rounded-full @min-[29.375rem]:h-32 @min-[29.375rem]:w-32"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FEF08A 0%, #FACC15 45%, #EAB308 75%, #CA8A04 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(120,53,15,0.4), 0 10px 22px -6px rgba(20,83,45,0.45)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#FFFBEB]/60" />
          <span
            style={{ fontFamily: FONT_EDITORIAL }}
            className="relative text-[2rem] leading-none font-semibold tracking-[0.08em] text-[#14532D] @min-[29.375rem]:text-[2.2rem]"
          >
            {initials(site)}
          </span>
        </div>

        <SunflowerDivider className="mt-5 h-6 w-24 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 text-[9px] tracking-[0.3em] text-[#166534] uppercase @min-[29.375rem]:text-[10px]"
        >
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FieldAmbience — golden light blobs and blurred sunflower          */
/* silhouettes swaying behind the card. Skipped entirely under       */
/* reduced motion. Transform + opacity only (GPU-friendly).          */
/* ------------------------------------------------------------------ */

function FieldAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Slow-drifting light blobs — sun yellow + leaf green */}
      <motion.div
        className="absolute -left-10 top-8 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,0.55) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-10 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(22,101,52,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
      />

      {/* Blurred sunflower silhouettes peeking from behind the card */}
      <motion.div
        className="absolute -left-7 bottom-4 h-28 w-28 opacity-60 blur-[2px]"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      >
        <SunflowerBloom className="h-full w-full" />
      </motion.div>
      <motion.div
        className="absolute -right-6 top-6 h-24 w-24 opacity-50 blur-[2px]"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      >
        <SunflowerBloom className="h-full w-full" />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SunflowerFieldsEnvelope — card-only pop-with-bounce reveal. The   */
/* component keeps its old file/export name so the renderer needs    */
/* no change; there is no envelope anywhere in it.                   */
/* ------------------------------------------------------------------ */

export default function SunflowerFieldsEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // Reveal: sunflower petals burst outward as the card lands.
      setBurstKey((k) => k + 1);
    }
  };

  // Springy pop: 0.65 → 1.12 → 1 (stiffness ~260, damping ~16).
  const popTransition: Transition = instant
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 16 };
  const fadeTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

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
                ? "Pop the wedding invitation card back to its back side"
                : "Pop the wedding invitation card to reveal the invitation"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            {/* Ambient field light + swaying sunflowers behind the card.
                Skipped under reduced motion (no animation at all). */}
            {!instant && <FieldAmbience />}

            {/* Pop scene — the FRONT is in flow (it defines the box
                height); the BACK is absolute inset-0, so the pop
                never moves layout. Rest = back faces the viewer;
                revealed = front pops in with a springy bounce. */}
            <div className="relative z-10 mx-auto w-[92%] sm:w-[90%]">
              {/* Soft golden glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(250,204,21,0.5) 0%, rgba(22,101,52,0.3) 55%, transparent 75%)",
                }}
              />

              <div className="relative w-full">
                {/* FRONT — the invitation (unchanged content). Pops in
                    with the springy bounce on reveal. */}
                <motion.div
                  initial={false}
                  aria-hidden={!isOpen}
                  animate={
                    isOpen
                      ? { opacity: 1, scale: [0.65, 1.12, 1] }
                      : { opacity: 0, scale: 0.65 }
                  }
                  transition={popTransition}
                  className="relative w-full"
                >
                  <InvitationCard site={site} isOpen={isOpen} />
                </motion.div>

                {/* BACK — blurred sunflower-field wash + sun disc */}
                <motion.div
                  initial={false}
                  aria-hidden={isOpen}
                  animate={
                    isOpen
                      ? { opacity: 0, scale: 0.9 }
                      : { opacity: 1, scale: [0.9, 1.03, 1] }
                  }
                  transition={isOpen ? fadeTransition : popTransition}
                  className="absolute inset-0"
                >
                  <CardBack site={site} instant={instant} />
                </motion.div>
              </div>

              {/* Drifting pollen + petal burst on the reveal landing.
                  The canvas renders nothing under reduced motion. */}
              {!instant && (
                <PollenCanvas
                  particleCount={12}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.45 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue — on a soft pill so it stays legible over the
                background it sits on. */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              style={{ fontFamily: FONT_DISPLAY }}
              className="relative z-10 mt-4 inline-block rounded-full bg-[#FFFBEB]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#166534]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#14532D]"
            >
              {isOpen ? "Tap to See the Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
