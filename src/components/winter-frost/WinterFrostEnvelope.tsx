// Winter Frost invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a frosted mist layer in
// ice-blue / silver / white, frost crystals, drifting snow-mist, a
// snowflake medallion, "TAP TO REVEAL"); tap and the mist thins,
// drifts upward and fades away — the "mist dissolve" — revealing
// the FRONT (the existing invitation content, unchanged). Tap again
// and the mist settles back over the card. No music on this
// template. prefers-reduced-motion: instant swap, no ambient
// animation, no drifting mist.
//
// GEOMETRY — the card is sized by CONTAINER width (@container on
// the outer wrapper — never viewport `sm:` — so the editor's
// Mobile (390px) preview gets the mobile card and desktop (490px
// container) gets the larger card), in THREE bands, because the
// card's content is fixed px while the container shrinks with the
// viewport:
//   - <352px: compact card (15px names, tight padding)
//   - 352–383px: small card (17px names)
//   - >=470px: large card (22px names, py-5)
// DO NOT resize the bands without re-verifying at 320 / 390 /
// desktop. The FRONT is in flow (it defines the box height); the
// BACK is absolute inset-0 over it, so the reveal never moves
// layout. No fixed widths beyond the viewport; overflow-hidden
// where mist/blobs could spill.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SnowflakeDivider } from "./Decor";
import { formatCardDate, locationLabel } from "./tokens";
import { SnowflakeCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the white letterpress card (FRONT, unchanged     */
/* content: couple names, date, venue).                              */
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
      className={`relative mx-auto w-full overflow-hidden bg-[#FDFEFF] px-4 py-3 text-center text-[#12395B] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(11,37,64,0.55),0_4px_12px_rgba(11,37,64,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(11,37,64,0.45)]"
      }`}
    >
      {/* Cool white paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(253, 254, 255, 0.4) 0%, rgba(214, 235, 249, 0.55) 100%)",
        }}
      />

      {/* Fine double ice-blue & deep-blue letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7FB3D9]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#12395B]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#12395B]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="wf-font-display text-[9px] tracking-[0.26em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="wf-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#12395B] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="wf-font-editorial my-0.5 text-base italic text-[#1B4A6B] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="wf-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#12395B] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <SnowflakeDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="wf-font-display text-[9px] tracking-[0.24em] text-[#12395B] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="wf-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time ice shimmer sweep across the card as the mist
          clears. Remounts (key) on every reveal so it replays. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(189, 224, 245, 0.55) 50%, transparent 100%)",
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
/* SnowflakeMark — a small six-arm snowflake asterisk (same arm     */
/* geometry as the crest), used for the frost crystals on the back.  */
/* ------------------------------------------------------------------ */

function SnowflakeMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className={className}>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (
          <g key={i} stroke="currentColor" strokeLinecap="round">
            <line x1="50" y1="50" x2={50 + 34 * cos} y2={50 + 34 * sin} strokeWidth="2.4" />
            <line
              x1={50 + 20 * cos}
              y1={50 + 20 * sin}
              x2={50 + 20 * cos + 8 * -sin}
              y2={50 + 20 * sin + 8 * cos}
              strokeWidth="1.5"
            />
            <line
              x1={50 + 20 * cos}
              y1={50 + 20 * sin}
              x2={50 + 20 * cos - 8 * -sin}
              y2={50 + 20 * sin - 8 * cos}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the frosted mist layer. Ice-blue / silver / white,    */
/* frost crystals in the corners, a snowflake medallion at the      */
/* centre, drifting mist wisps, "TAP TO REVEAL". Same footprint as  */
/* the front (absolute inset-0 of the card box). On reveal the      */
/* whole layer thins, drifts upward and fades (opacity + blur +     */
/* slow upward drift); the wisps lift away first, staggered.       */
/* ------------------------------------------------------------------ */

const MIST_WISPS = [
  { top: "18%", duration: 8, delay: 0, dissolveDelay: 0 },
  { top: "46%", duration: 10, delay: 1.2, dissolveDelay: 0.12 },
  { top: "72%", duration: 9, delay: 2.1, dissolveDelay: 0.24 },
] as const;

function CardBack({ site: _site, isRevealed, instant }: { site: WeddingSite; isRevealed: boolean; instant: boolean }) {
  void _site;
  return (
    <motion.div
      aria-hidden={isRevealed}
      initial={false}
      animate={
        isRevealed
          ? { opacity: 0, y: -56, scale: 1.03, filter: "blur(10px)" }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: instant ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: isRevealed ? "none" : "auto" }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#D6EBF9] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(11,37,64,0.45)]"
    >
      {/* Frosted mist gradient — pale ice to silver-blue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(234, 244, 251, 0.95) 0%, rgba(189, 224, 245, 0.92) 48%, rgba(127, 179, 217, 0.9) 100%)",
        }}
      />
      {/* Soft white glow at the centre so the medallion reads */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 46%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Frost crystals — faint large snowflakes behind the content */}
      <SnowflakeMark className="pointer-events-none absolute -top-4 -left-4 h-24 w-24 text-white/50" />
      <SnowflakeMark className="pointer-events-none absolute -right-5 -bottom-5 h-28 w-28 text-white/40" />
      <SnowflakeMark className="pointer-events-none absolute top-6 right-8 h-10 w-10 text-white/55" />
      <SnowflakeMark className="pointer-events-none absolute bottom-8 left-7 h-8 w-8 text-white/55" />

      {/* Drifting mist wisps — slow horizontal drift at rest; on
          reveal each lifts upward and fades, staggered, so the mist
          visibly thins from the bottom up. Skipped entirely under
          reduced motion (the layer itself swaps instantly). */}
      {!instant &&
        MIST_WISPS.map((w, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute left-[-10%] h-10 w-[120%] rounded-full bg-white/45 blur-xl"
            style={{ top: w.top }}
            initial={false}
            animate={
              isRevealed
                ? { y: -110, opacity: 0 }
                : { y: [0, -10, 0], opacity: [0.55, 0.85, 0.55] }
            }
            transition={
              isRevealed
                ? { duration: 0.9, delay: w.dissolveDelay, ease: [0.22, 1, 0.36, 1] }
                : { duration: w.duration, delay: w.delay, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
            }
          />
        ))}

      {/* Fine double ice-blue border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7FB3D9]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#12395B]/30 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="wf-font-display text-[9px] tracking-[0.34em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Snowflake medallion — ice-blue disc with a white six-arm
            snowflake. It sits ON the card back, not on any envelope. */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #7FB3D9 0%, #1B4A6B 55%, #12395B 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -4px 10px rgba(11,37,64,0.45), 0 10px 22px -6px rgba(11,37,64,0.5)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#FDFEFF]/50" />
          <SnowflakeMark className="relative h-14 w-14 text-white @min-[29.375rem]:h-16 @min-[29.375rem]:w-16" />
        </div>

        <SnowflakeDivider className="mt-5 h-6 w-24 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="wf-font-display mt-4 text-[9px] tracking-[0.3em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MistAmbience — slow-drifting ice-blue blur blobs + falling snow  */
/* behind the card. Transform + opacity only (GPU-friendly).        */
/* Skipped under reduced motion.                                     */
/* ------------------------------------------------------------------ */

function MistAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(189, 224, 245, 0.6) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(127, 179, 217, 0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
      />
      <SnowflakeCanvas flakeCount={10} burstKey={0} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WinterFrostEnvelope — kept name/path/export: the Cover/Renderer  */
/* import this file as the invitation card. Card-only: no envelope  */
/* shape, no flap, no pocket, no seal-on-envelope anywhere.         */
/* ------------------------------------------------------------------ */

export default function WinterFrostEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);
  // Double-tap guard: ignore taps while the ~1.15s dissolve runs,
  // so a double-tap can never flip the card twice mid-animation.
  const busyRef = useRef(false);
  const busyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (busyTimerRef.current) clearTimeout(busyTimerRef.current);
    },
    []
  );

  const toggleCard = () => {
    if (busyRef.current) return;
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) setShimmerKey((k) => k + 1);
    if (!instant) {
      busyRef.current = true;
      busyTimerRef.current = setTimeout(() => {
        busyRef.current = false;
      }, 1150);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 pt-16 pb-10">
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
                ? "Cover the wedding invitation card with frost mist again"
                : "Reveal the wedding invitation card — the frost mist will dissolve"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B]"
          >
            {/* Ambient mist + falling snow behind the card. Skipped
                under reduced motion (no animation at all). */}
            {!instant && <MistAmbience />}

            {/* Card — the FRONT is in flow (it defines the box
                height); the BACK is absolute inset-0 over it, so
                the mist dissolve never moves layout. */}
            <div className="relative z-10 mx-auto w-[92%] @min-[24rem]:w-[90%]">
              {/* Soft ice-blue glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(189, 224, 245, 0.55) 0%, rgba(127, 179, 217, 0.35) 55%, transparent 75%)",
                }}
              />

              <div className="relative w-full">
                {/* FRONT — the invitation (unchanged content) */}
                <div aria-hidden={!isRevealed} className="relative w-full">
                  <InvitationCard
                    site={site}
                    isOpen={isRevealed}
                    shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                  />
                </div>

                {/* BACK — frosted mist + snowflake medallion. It
                    dissolves (opacity + blur + upward drift) on
                    reveal and settles back on tap again. */}
                <CardBack site={site} isRevealed={isRevealed} instant={instant} />
              </div>
            </div>

            {/* Cue — on a soft pill so it stays legible over the
                pale-ice surface below the card. */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="wf-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FDFEFF]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#1B4A6B]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#12395B]"
            >
              {isRevealed ? "Tap Card to Cover Again" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
