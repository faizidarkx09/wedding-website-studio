// Autumn Harvest invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (burnt-orange ember glow over
// a blurred leaf-pattern wash, leaf-wreath crest with the live
// monogram, "TAP TO REVEAL"); tap fades it into the FRONT (the
// existing cream harvest invitation, unchanged).
// Reveal concept — "ember fade" (distinct from Blush's 3D flip):
// the back glows warm (burnt orange, amber, harvest gold); on tap
// the embers rise and fade, the warm glow dims and cools, and the
// front emerges through the fading glow while a few autumn leaves
// drift down. No 3D flip, no flap, no pocket. Tap again returns to
// the back. prefers-reduced-motion: instant swap, no ambient
// animation, no particles. No music on this template.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LeafDivider, LeafWreath } from "./Decor";
import {
  COVER_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { LeafCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream harvest card (FRONT). Unchanged       */
/* content: names, date, venue, harvest borders and typography.     */
/* It is in flow (it defines the card box height); the back sits    */
/* absolute over it and fades away on reveal.                       */
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
      className={`relative mx-auto w-full overflow-hidden rounded-[6px] bg-[#FFFDF6] px-4 py-3 text-center text-[#5C3A21] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(58,36,18,0.52),0_4px_12px_rgba(58,36,18,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(58,36,18,0.45)]"
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

      {/* Fine double burnt-orange & brown harvest border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C05621]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5C3A21]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C3A21]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C3A21]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C3A21]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C3A21]/65"
      />

      {/* Editable HTML Harvest Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="ah-font-display text-[9px] font-semibold tracking-[0.26em] text-[#9C3D12] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="ah-font-display mt-2 text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#5C3A21] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="ah-font-editorial my-0.5 text-base italic text-[#9C3D12] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="ah-font-display text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#5C3A21] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <LeafDivider className="mt-4 mb-2 h-6 w-24 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="ah-font-display text-[9px] font-medium tracking-[0.24em] text-[#5C3A21] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="ah-font-display mt-1 text-[8.5px] font-medium tracking-[0.22em] text-[#9C3D12] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time warm amber shimmer sweep across the card on reveal.
          Remounts (key) on every reveal so it replays; unmounted
          when flipped back. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(217,142,50,0.45) 50%, transparent 100%)",
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
/* CardBack — the card's back side at rest: burnt-orange ember glow */
/* over a blurred leaf-pattern wash, leaf-wreath crest with the     */
/* live monogram, tap hint. Same footprint as the front (absolute   */
/* inset-0 of the card box), so the fade never changes the layout.  */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[6px] bg-[#9C3D12] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(58,36,18,0.45)] sm:px-6">
      {/* Blurred leaf-pattern wash — the cover photograph, softened
          so the back reads as glowing ember light, not a photo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-md"
      />

      {/* Warm ember gradient over the wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(232,160,92,0.55) 0%, rgba(192,86,33,0.55) 55%, rgba(58,36,18,0.55) 100%)",
        }}
      />

      {/* Fine double cream border, matching the front's double border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-[4px] border border-[#FFF7E8]/50 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] rounded-[3px] border border-[#FFF7E8]/25 sm:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="ah-font-display text-[9px] font-semibold tracking-[0.34em] text-[#FFF7E8]/90 uppercase sm:text-[10px]">
          WITH LOVE
        </p>

        {/* Leaf-wreath crest with the live monogram — the same crest
            as the cover, in cream on ember. */}
        <div className="relative mt-5 h-28 w-28 sm:h-32 sm:w-32">
          <LeafWreath className="absolute inset-0 h-full w-full drop-shadow-[0_8px_20px_rgba(58,36,18,0.5)]" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="ah-font-display text-[1.35rem] font-semibold tracking-[0.06em] text-[#FFF7E8] sm:text-[1.5rem]">
              {initials(site)}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#FFF7E8]/70 to-transparent sm:w-28"
        />

        <p className="ah-font-display mt-4 text-[9px] font-semibold tracking-[0.3em] text-[#FFF7E8]/90 uppercase sm:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmberAmbience — tiny glowing embers rising behind the card at    */
/* rest, looping. Transform + opacity only (GPU-friendly). Skipped   */
/* entirely under reduced motion.                                   */
/* ------------------------------------------------------------------ */

const EMBERS = [
  { left: "6%", size: 5, duration: 7, delay: 0 },
  { left: "15%", size: 8, duration: 9, delay: 1.2 },
  { left: "26%", size: 4, duration: 6.5, delay: 2.4 },
  { left: "38%", size: 7, duration: 8, delay: 0.6 },
  { left: "50%", size: 5, duration: 9.5, delay: 3.0 },
  { left: "62%", size: 8, duration: 7.5, delay: 1.8 },
  { left: "74%", size: 4, duration: 8.5, delay: 0.3 },
  { left: "85%", size: 6, duration: 9, delay: 2.0 },
  { left: "94%", size: 5, duration: 7, delay: 4.0 },
] as const;

function EmberAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Slow-drifting ember glow blobs — amber + harvest gold */}
      <motion.div
        className="absolute -left-10 top-8 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(217,142,50,0.55) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-10 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,92,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Rising embers — small glowing dots drifting up */}
      {EMBERS.map((b, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-[#FFD98A]"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            boxShadow:
              "0 0 6px 2px rgba(217,142,50,0.7), 0 0 12px 4px rgba(192,86,33,0.35)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -440, opacity: [0, 0.9, 0.9, 0] }}
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
/* AutumnHarvestEnvelope — the card-only reveal (file/component name */
/* kept so the existing Cover/Renderer import still resolves).      */
/* ------------------------------------------------------------------ */

export default function AutumnHarvestEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [leavesActive, setLeavesActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);
  const leavesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (leavesTimerRef.current) clearTimeout(leavesTimerRef.current);
    },
    []
  );

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: embers burst up, leaves drift down, amber shimmer
      // lands the fade. The leaf canvas mounts now (so the burst
      // fires from a fresh loop) and unmounts once the fade is done.
      setBurstKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
      if (!instant) {
        setLeavesActive(true);
        if (leavesTimerRef.current) clearTimeout(leavesTimerRef.current);
        leavesTimerRef.current = setTimeout(() => setLeavesActive(false), 3200);
      }
    }
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Autumn Harvest invitation card */}
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
                ? "Show the back of the wedding invitation card"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C3A21]"
          >
            {/* Ambient embers behind the card at rest. Skipped under
                reduced motion (no animation at all). */}
            {!instant && !isRevealed && <EmberAmbience />}

            {/* Card box — the FRONT is in flow (it defines the box
                height); the BACK is absolute inset-0 over it. At
                rest the back is opaque and the front is transparent;
                on reveal the back fades out (embers rise, glow dims
                and cools) and the front fades in through it. */}
            <div className="relative z-10 mx-auto w-full">
              {/* Warm ember glow behind the card — dims and cools on
                  reveal (opacity drops once the front emerges). */}
              <motion.div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(217,142,50,0.65) 0%, rgba(192,86,33,0.4) 55%, transparent 75%)",
                }}
                initial={false}
                animate={{ opacity: isRevealed ? 0.18 : 1 }}
                transition={{ duration: instant ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* FRONT — the invitation (unchanged content) */}
              <motion.div
                aria-hidden={!isRevealed}
                className="relative w-full"
                initial={false}
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={{
                  duration: instant ? 0 : 0.9,
                  delay: isRevealed && !instant ? 0.45 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <InvitationCard
                  site={site}
                  isOpen={isRevealed}
                  shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                />
              </motion.div>

              {/* BACK — ember glow + leaf-wreath crest + tap hint */}
              <motion.div
                aria-hidden={isRevealed}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: isRevealed ? 0 : 1 }}
                transition={{ duration: instant ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardBack site={site} />
              </motion.div>

              {/* Embers burst up + leaves drift down as the glow
                  fades. The canvas renders nothing under reduced
                  motion. Mounting it on reveal fires the burst
                  (burstKey already incremented); it unmounts after
                  ~3.2s so no loop keeps running over the front. */}
              {!instant && leavesActive && (
                <LeafCanvas
                  leafCount={8}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.6 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue — on a soft pill so it stays legible */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="ah-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFF7E8]/80 px-4 py-1 text-center text-[10px] font-medium tracking-[0.26em] text-[#9C3D12]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#5C3A21]"
            >
              {isRevealed ? "Tap to Show Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
