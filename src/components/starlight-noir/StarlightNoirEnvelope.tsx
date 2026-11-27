// Starlight Noir invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (blurred night-sky photo,
// twinkling gold stars, constellation crest with the couple
// monogram, "Tap to Reveal"); tap splits the back into LEFT and
// RIGHT halves that slide apart horizontally like curtains parting
// to reveal the FRONT (the existing invitation content, unchanged).
// A gold starlight burst + gold shimmer sweep land the reveal. Tap
// again slides the halves back together. prefers-reduced-motion:
// instant swap, no ambient animation, no particles. No music on
// this template — a soft star twinkle SFX on reveal only.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider, StarCrest, Starfield } from "./Decor";
import {
  COVER_IMAGE_URL,
  FONT_DISPLAY,
  FONT_SCRIPT,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { playStarTwinkleSound, StarlightCanvas } from "./StarlightCinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the black invitation card with gold type        */
/* (the FRONT — unchanged content).                                 */
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
      aria-hidden={!isOpen}
      className={`relative mx-auto w-full overflow-hidden border border-[#D4AF37]/70 bg-[#0A0A0A] px-4 py-2 text-center text-[#F5EFE0] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.5)]"
          : "shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)]"
      }`}
    >
      {/* Faint gold glow at the card's heart */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(212, 175, 55, 0.14) 0%, rgba(10, 10, 10, 0.4) 100%)",
        }}
      />

      {/* Fine double gold hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#D4AF37]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Editable HTML Typography — gold on black, high contrast */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[8px] tracking-[0.26em] text-[#F2D98C] uppercase @min-[29.375rem]:text-[10px]"
        >
          We Invite You
        </p>

        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1.5 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#D4AF37] uppercase @min-[22rem]:mt-2 @min-[22rem]:text-[17px] @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1 @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={{ fontFamily: FONT_SCRIPT }}
          className="my-0.5 text-sm text-[#F2D98C] @min-[29.375rem]:text-lg @max-[22rem]:text-xs"
        >
          &amp;
        </span>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#D4AF37] uppercase @min-[22rem]:text-[17px] @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <ConstellationDivider className="mt-3 mb-1.5 h-5 w-20 @min-[22rem]:mt-4 @min-[22rem]:mb-2 @min-[22rem]:h-6 @min-[22rem]:w-24 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mt-2.5 @max-[22rem]:mb-1 @max-[22rem]:h-4" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[8.5px] tracking-[0.24em] text-[#F5EFE0] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1 text-[8px] tracking-[0.22em] text-[#F2D98C] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time gold shimmer sweep across the card on reveal.
          Remounts (key) on every reveal so it replays; unmounted
          when the halves close again. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(242,217,140,0.45) 50%, transparent 100%)",
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
/* CardBackHalf — ONE half of the card BACK. Each half renders the  */
/* FULL back design at 200% width, clipped to its own side, so the  */
/* two halves join seamlessly at the centre seam when closed and    */
/* the crest / monogram / type split down the middle as they part.  */
/* The back is a blurred night-sky photo under twinkling gold      */
/* stars, with the constellation crest + live monogram.            */
/* ------------------------------------------------------------------ */

function CardBackHalf({ site, side }: { site: WeddingSite; side: "left" | "right" }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`absolute inset-y-0 w-[200%] ${side === "left" ? "left-0" : "right-0"}`}
    >
      {/* Blurred night-sky photo — the back side is deliberately
          out of focus, so the crisp front reads as the reveal. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(8px) brightness(0.5)", transform: "scale(1.15)" }}
      />

      {/* Dark veil so the gold type stays legible over the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.25) 45%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {/* Twinkling gold stars over the blurred sky */}
      <Starfield density={26} />

      {/* Slow-breathing gold glow at the crest's heart. Static
          under reduced motion. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 50% 46%, rgba(212,175,55,0.28) 0%, transparent 70%)",
        }}
        animate={
          prefersReducedMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Fine double gold hairline border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#D4AF37]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Centred back content — crest + monogram + tap hint.
          Kept compact so it fits inside the front card's height
          at every width (front min height ~147px at 320px; this
          stack is ~124px there). */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-2 text-center">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[8px] tracking-[0.3em] text-[#F2D98C] uppercase @min-[29.375rem]:text-[9px]"
        >
          Written in the Stars
        </p>

        <div className="relative mt-1.5 h-14 w-14 @min-[22rem]:h-20 @min-[22rem]:w-20 @min-[29.375rem]:mt-3 @min-[29.375rem]:h-24 @min-[29.375rem]:w-24">
          <StarCrest className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-base font-medium tracking-[0.08em] text-[#F2D98C] @min-[22rem]:text-lg @min-[29.375rem]:text-xl"
            >
              {initials(site)}
            </span>
          </div>
        </div>

        <ConstellationDivider className="mt-1.5 h-3.5 w-16 @min-[29.375rem]:mt-3 @min-[29.375rem]:h-5 @min-[29.375rem]:w-20" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1.5 text-[8px] tracking-[0.3em] text-[#F5EFE0]/90 uppercase @min-[29.375rem]:text-[10px]"
        >
          Tap to Reveal
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StarlightNoirEnvelope — card-only vertical-split reveal. The     */
/* FRONT (InvitationCard) is in flow and defines the box height;    */
/* the BACK is two absolute halves over it that slide apart         */
/* horizontally on tap. No 3D flip, no envelope anywhere.           */
/* ------------------------------------------------------------------ */

export default function StarlightNoirEnvelope({
  site,
  soundEnabled = true,
}: {
  site: WeddingSite;
  soundEnabled?: boolean;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: gold starlight burst + shimmer + soft twinkle SFX.
      setBurstKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
      if (soundEnabled) playStarTwinkleSound();
    }
  };

  // Halves slide apart fully visible, then fade at the end of the
  // slide; on close they fade back in immediately as they slide
  // together. Reduced motion: instant swap, no slide, no fade.
  const halfTransition = {
    x: { duration: instant ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] as const },
    opacity: {
      duration: instant ? 0 : 0.35,
      delay: instant ? 0 : isRevealed ? 0.55 : 0,
      ease: [0.22, 1, 0.36, 1] as const,
    },
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
                ? "Close the invitation card back over the invitation"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            {/* Card — sized by CONTAINER width (@container on the
                outer wrapper — never viewport `sm:` — so the
                editor's Mobile (390px) preview gets the mobile card
                and desktop (490px container) gets the larger card). */}
            <div className="relative mx-auto w-[92%] @min-[29.375rem]:w-[90%]">
              {/* Soft gold glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.12) 55%, transparent 75%)",
                }}
              />

              {/* Clip box — the front defines the height; the back
                  halves slide apart inside it and are clipped at
                  the card's edges. */}
              <div className="relative overflow-hidden shadow-[0_24px_34px_rgba(0,0,0,0.6)]">
                {/* FRONT — the invitation (unchanged content) */}
                <InvitationCard
                  site={site}
                  isOpen={isRevealed}
                  shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                />

                {/* BACK — two halves joined at the centre seam */}
                <div
                  aria-hidden={isRevealed}
                  className="absolute inset-0 z-20"
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full w-1/2 overflow-hidden"
                    initial={false}
                    animate={{ x: isRevealed ? "-102%" : "0%", opacity: isRevealed ? 0 : 1 }}
                    transition={halfTransition}
                  >
                    <CardBackHalf site={site} side="left" />
                  </motion.div>

                  <motion.div
                    className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
                    initial={false}
                    animate={{ x: isRevealed ? "102%" : "0%", opacity: isRevealed ? 0 : 1 }}
                    transition={halfTransition}
                  >
                    <CardBackHalf site={site} side="right" />
                  </motion.div>

                  {/* Centre seam — a hairline gold split line that
                      fades as the halves part. */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 left-1/2 z-10 w-px -translate-x-1/2"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(212,175,55,0.8) 20%, rgba(212,175,55,0.8) 80%, transparent)",
                    }}
                    initial={false}
                    animate={{ opacity: isRevealed ? 0 : 1 }}
                    transition={{ duration: instant ? 0 : 0.3 }}
                  />
                </div>

                {/* Gold starlight burst on the reveal landing.
                    The canvas renders nothing under reduced motion. */}
                {!instant && (
                  <StarlightCanvas
                    ambientStars={0}
                    burstKey={burstKey}
                    burstOrigin={{ x: 0.5, y: 0.45 }}
                    className="z-30"
                  />
                )}
              </div>
            </div>

            {/* Subtle interactive cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-3 text-center text-[10px] tracking-[0.26em] text-[#F2D98C]/80 uppercase transition-colors group-hover:text-[#F5EFE0]"
            >
              {isRevealed ? "Tap to Close" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
