// Blush Royale envelope — the cream invitation card is tucked
// INSIDE the closed blush envelope (tap to reveal / tuck back)
// and blush floral corner sprigs. No music medallion: this
// template has no music engine by design.
//
// Ceremony (tap, ~1.4s): the wax seal glows, the envelope lifts
// and shakes once, then dissolves into a watercolor wash (blur +
// fade + shrink + tilt) while petals drift and a golden burst
// fires from the seal; the card rises UP out of the envelope's
// place (y +48 → 0, spring) with a one-time rose-gold shimmer
// sweep and a soft glow behind it. At rest the envelope image is
// fully visible and the card is invisible (absolute overlay,
// opacity 0 — no layout space); when open the envelope stays in
// layout at opacity 0 so nothing jumps, and the card sits centred
// where the envelope was. Tap again reverses: card sinks + fades,
// envelope blurs back in. prefers-reduced-motion: instant swap,
// no animation.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FloralCorner, FloralDivider } from "./Decor";
import { ENVELOPE_IMAGE_URL, formatCardDate, locationLabel } from "./tokens";
import { PetalCanvas } from "./CinematicOpening";

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
      className={`relative mx-auto w-full overflow-hidden rounded-[1.5rem] bg-[#FFFDFB] px-4 py-5 text-center text-[#5C323B] transition-shadow duration-700 sm:px-6 sm:py-7 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(92,50,59,0.4),0_4px_12px_rgba(92,50,59,0.18)]"
          : "shadow-[0_10px_24px_-8px_rgba(92,50,59,0.3)]"
      }`}
    >
      {/* Cream watercolor paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(/images/themes/blush-royale/cream.jpg)` }}
      />

      {/* Fine double rose-gold letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border border-[#B76E79]/60 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] rounded-[1rem] border border-[#E8B4B8]/50 sm:inset-[15px]"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-2 sm:py-3">
        <p className="br-font-display text-[9px] tracking-[0.26em] text-[#7A4A55] uppercase sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="br-font-script mt-3 text-[2rem] leading-none font-normal text-[#B76E79] sm:mt-4 sm:text-[2.4rem]">
          {site.content.partnerA}
        </h2>
        <span className="br-font-editorial my-1 text-base italic text-[#7A4A55] sm:text-lg">
          &amp;
        </span>
        <h2 className="br-font-script text-[2rem] leading-none font-normal text-[#B76E79] sm:text-[2.4rem]">
          {site.content.partnerB}
        </h2>

        <FloralDivider className="my-2.5 h-8 w-24 sm:my-3.5 sm:h-10 sm:w-28" />

        <p className="br-font-display text-[9px] tracking-[0.24em] text-[#5C323B] uppercase sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="br-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#7A4A55] uppercase sm:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time rose-gold shimmer sweep across the card on reveal.
          Remounts (key) on every open so it replays; unmounted when
          tucked back. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(232,180,184,0.45) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

export default function BlushRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [petalsOn, setPetalsOn] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const petalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  useEffect(
    () => () => {
      if (petalTimerRef.current) clearTimeout(petalTimerRef.current);
    },
    []
  );

  const toggleEnvelope = () => {
    const next = !isCardLifted;
    setIsCardLifted(next);
    if (next) {
      // Opening: petals on + golden burst from the seal + shimmer.
      if (petalTimerRef.current) {
        clearTimeout(petalTimerRef.current);
        petalTimerRef.current = null;
      }
      setPetalsOn(true);
      setBurstKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
    } else {
      // Tucking back: keep petals through the reverse, then unmount.
      if (petalTimerRef.current) clearTimeout(petalTimerRef.current);
      petalTimerRef.current = setTimeout(() => setPetalsOn(false), 1000);
    }
  };

  // Direction-aware transitions (instant under reduced motion).
  const envOpen: Transition = { duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] };
  const envClosed: Transition = { duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] };
  const cardOpen: Transition = { type: "spring", stiffness: 140, damping: 17, delay: 0.5 };
  const cardClosed: Transition = { duration: 0.6, ease: [0.5, 0, 0.75, 0] };
  const instantT: Transition = { duration: 0 };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      {/* Corner blush floral sprigs */}
      <FloralCorner position="top-left" />
      <FloralCorner position="bottom-right" />

      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px]"
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isCardLifted}
            aria-label={
              isCardLifted
                ? "Tuck wedding invitation card back into the envelope"
                : "Open blush envelope and reveal the wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            {/* Envelope + card stack. The envelope image (square
                artwork) defines the block height; the card is an
                absolute overlay centred on it, so rest layout is
                exactly the envelope + 16px cue, and opening moves
                no layout — the card rises in the envelope's place. */}
            <div className="relative w-full">
              {/* Blush envelope artwork — dissolves on open, stays in
                  layout at opacity 0 so nothing jumps. */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isCardLifted ? 0 : 1,
                  scale: isCardLifted ? 0.96 : 1,
                  rotate: isCardLifted ? -1.5 : 0,
                  filter: isCardLifted ? "blur(10px)" : "blur(0px)",
                }}
                transition={instant ? instantT : isCardLifted ? envOpen : envClosed}
                style={{ pointerEvents: isCardLifted ? "none" : "auto" }}
                aria-hidden={isCardLifted}
                className="relative"
              >
                {/* Seal moment — tiny lift + shake in the first 0.3s. */}
                <motion.div
                  initial={false}
                  animate={
                    isCardLifted
                      ? { y: [0, -7, 3, 0], rotate: [0, -0.9, 0.6, 0] }
                      : { y: 0, rotate: 0 }
                  }
                  transition={
                    instant ? instantT : { duration: 0.3, times: [0, 0.35, 0.7, 1], ease: "easeOut" }
                  }
                  className="relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ENVELOPE_IMAGE_URL}
                    alt="Soft blush watercolor wedding envelope with a rose-gold wax seal and blush roses"
                    referrerPolicy="no-referrer"
                    className="pointer-events-none block h-auto w-full rounded-[1.5rem] object-contain drop-shadow-[0_24px_34px_rgba(92,50,59,0.22)]"
                  />
                  {/* Wax-seal glow — flares then dies as the seal
                      "cracks". The seal sits at ~68% / ~66% of the
                      square artwork, so the glow box is offset to
                      centre on it (57% + 11% = 68%, 55% + 11% = 66%). */}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 rounded-full"
                    style={{
                      left: "57%",
                      top: "55%",
                      width: "22%",
                      aspectRatio: "1",
                      background:
                        "radial-gradient(circle, rgba(212,175,105,0.9) 0%, rgba(232,180,184,0.55) 45%, rgba(232,180,184,0) 70%)",
                    }}
                    initial={false}
                    animate={
                      isCardLifted
                        ? { opacity: [0, 0.95, 0], scale: [0.7, 1.3, 1.15] }
                        : { opacity: 0, scale: 0.7 }
                    }
                    transition={
                      instant ? instantT : { duration: 0.55, times: [0, 0.45, 1], ease: "easeOut" }
                    }
                  />
                </motion.div>
              </motion.div>

              {/* Invitation card — rises UP out of the envelope's place. */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isCardLifted ? 1 : 0,
                  y: isCardLifted ? 0 : 48,
                  scale: isCardLifted ? 1 : 0.94,
                }}
                transition={instant ? instantT : isCardLifted ? cardOpen : cardClosed}
                style={{ pointerEvents: isCardLifted ? "auto" : "none" }}
                aria-hidden={!isCardLifted}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <div className="relative w-[86%] sm:w-[84%]">
                  {/* Soft rose-gold glow behind the card */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-[2rem] blur-2xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(212,175,105,0.5) 0%, rgba(232,180,184,0.35) 55%, transparent 75%)",
                    }}
                  />
                  <InvitationCard
                    site={site}
                    isOpen={isCardLifted}
                    shimmerKey={isCardLifted && !instant ? shimmerKey : 0}
                  />
                </div>
              </motion.div>

              {/* Petals + golden burst from the seal while open. */}
              {petalsOn && (
                <PetalCanvas
                  petalCount={10}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.68, y: 0.66 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue — 16px below the envelope at rest, 16px below the
                card when open (the card sits inside the envelope's
                box, so the cue never moves). */}
            <motion.p
              key={isCardLifted ? "open" : "closed"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="br-font-display mt-4 text-center text-[10px] tracking-[0.26em] text-[#7A4A55]/80 uppercase transition-colors group-hover:text-[#5C323B]"
            >
              {isCardLifted ? "Tap Card to Tuck Back" : "Tap Envelope to Reveal Card"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
