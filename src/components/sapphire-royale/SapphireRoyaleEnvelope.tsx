// Sapphire Royale invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (blurred sapphire photograph
// under a deep-navy wash, silver monogram-seal medallion with the
// couple monogram, "Tap to Reveal"); tap lifts a silver shimmer
// veil off the card and the card rises from below, the back fades
// away and the FRONT (the existing invitation content, unchanged)
// rises into place with a silver light sweep and a sparkle burst.
// Tap again settles it back and the veil returns.
// prefers-reduced-motion: instant swap, no ambient animation, no
// sparkles. No music on this template — the card is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DecoDivider, SparkleField } from "./Decor";
import { COVER_IMAGE_URL, MONOGRAM_SEAL_URL, formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ice letterpress card (FRONT, unchanged).     */
/* Sized in cqw against the @container wrapper below (same base as   */
/* the old envelope container), so its proportions are preserved.    */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#F2F4F8] px-[4.5cqw] py-[3.4cqw] text-center text-[#12294D] transition-shadow duration-700 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(6,18,43,0.55),0_4px_12px_rgba(6,18,43,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(6,18,43,0.45)]"
      }`}
    >
      {/* Ice-silver texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(/images/themes/sapphire-royale/ice-texture.jpg)` }}
      />

      {/* Fine double silver art-deco border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2.8cqw] border border-[#C0C0C8]/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3.6cqw] border border-[#12294D]/25"
      />

      {/* Deco corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[3.4cqw] left-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-t border-l border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[3.4cqw] right-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-t border-r border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3.4cqw] left-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-b border-l border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[3.4cqw] bottom-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-r border-b border-[#12294D]/60"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-[1.1cqw]">
        <p className="sr-font-display text-[2.5cqw] leading-[1.5] tracking-[0.26em] text-[#12294D] uppercase">
          WE INVITE YOU
        </p>

        <h2 className="sr-font-display mt-[1.7cqw] text-[4.2cqw] leading-none font-normal tracking-[0.1em] text-[#0A1F44] uppercase">
          {site.content.partnerA}
        </h2>
        <span className="sr-font-editorial my-[0.6cqw] text-[3.9cqw] leading-[1.5] italic text-[#12294D]">
          &amp;
        </span>
        <h2 className="sr-font-display text-[4.2cqw] leading-none font-normal tracking-[0.1em] text-[#0A1F44] uppercase">
          {site.content.partnerB}
        </h2>

        <DecoDivider className="mt-[3cqw] mb-[1.7cqw] h-auto w-[27cqw]" />

        <p className="sr-font-display text-[2.5cqw] leading-[1.5] tracking-[0.24em] text-[#0A1F44] uppercase">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="sr-font-display mt-[0.56cqw] text-[2.4cqw] leading-[1.5] tracking-[0.12em] text-[#12294D] uppercase">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred sapphire photograph under a deep-navy wash,   */
/* silver monogram-seal medallion with the couple monogram, tap     */
/* hint. Same footprint as the front (absolute inset-0 of the       */
/* reveal box), so the reveal never changes the layout.              */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0A1F44] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(6,18,43,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred sapphire photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-navy wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(10,31,68,0.25) 0%, rgba(10,31,68,0.62) 100%)",
        }}
      />

      {/* Fine double silver art-deco border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C0C0C8]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#F2F4F8]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="sr-font-display text-[9px] tracking-[0.34em] text-[#F2F4F8] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Silver monogram-seal medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(6,18,43,0.45), 0 10px 22px -6px rgba(6,18,43,0.55)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MONOGRAM_SEAL_URL}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="sr-font-display relative z-10 text-[1.05rem] font-medium tracking-[0.06em] text-[#F2F4F8]" style={{ textShadow: "0 1px 4px rgba(6,18,43,0.7)" }}>
            {initials(site)}
          </span>
        </div>

        <DecoDivider className="mt-4 h-auto w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:w-28" />

        <p className="sr-font-display mt-3 text-[9px] tracking-[0.3em] text-[#F2F4F8] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SapphireAmbience — sparkling starlight + soft silver light       */
/* behind the card. Transform + opacity only (GPU-friendly).         */
/* Skipped under reduced motion.                                      */
/* ------------------------------------------------------------------ */

function SapphireAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(192,192,200,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(18,41,77,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <SparkleField className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SilverVeil — a shimmering silver veil over the card at rest. On  */
/* reveal it lifts upward and fades, uncovering the invitation.      */
/* Renders nothing under reduced motion (the back simply swaps).     */
/* ------------------------------------------------------------------ */

function SilverVeil({ isRevealed }: { isRevealed: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      initial={false}
      animate={isRevealed ? { y: "-105%", opacity: 0 } : { y: "0%", opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          "linear-gradient(160deg, rgba(242,244,248,0.92) 0%, rgba(192,192,200,0.85) 45%, rgba(217,217,222,0.9) 100%)",
      }}
    >
      {/* Fine deco lines on the veil */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
        <div className="mx-auto h-px w-3/4 bg-[#12294D]/30" />
        <div className="mx-auto mt-2 h-px w-1/2 bg-[#12294D]/20" />
      </div>
      <div className="absolute inset-2 border border-[#12294D]/25" />
      <div className="absolute inset-[13px] border border-[#C0C0C8]/50" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* SparkleBurst — on reveal, silver sparkles rise from the card and */
/* fade, like starlight. Renders nothing under reduced motion.       */
/* ------------------------------------------------------------------ */

const BURST_SPARKLES = [
  { x: -70, y: -120, size: 7, delay: 0.05, dur: 1.1 },
  { x: -40, y: -150, size: 9, delay: 0.12, dur: 1.25 },
  { x: -12, y: -110, size: 6, delay: 0.08, dur: 1.0 },
  { x: 14, y: -160, size: 10, delay: 0.05, dur: 1.3 },
  { x: 42, y: -125, size: 7, delay: 0.15, dur: 1.1 },
  { x: 68, y: -145, size: 8, delay: 0.1, dur: 1.2 },
  { x: 92, y: -105, size: 6, delay: 0.18, dur: 1.0 },
  { x: -95, y: -135, size: 7, delay: 0.2, dur: 1.1 },
];

function SparkleBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {BURST_SPARKLES.map((s, i) => (
        <motion.span
          key={`${burstKey}-${i}`}
          className="absolute rotate-45 rounded-[2px]"
          style={{
            width: s.size,
            height: s.size,
            background: "#D9D9DE",
            boxShadow: "0 0 10px 3px rgba(217,217,222,0.75)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: s.dur, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Veil lift". At rest the BACK shows under a silver   */
/* shimmer veil. Tap lifts the veil away and the card rises from     */
/* below, the back fades away and the FRONT rises into place with a  */
/* silver light sweep and a sparkle burst. Tap again settles it     */
/* back and the veil returns.                                         */
/* ------------------------------------------------------------------ */

export default function SapphireRoyaleEnvelope({ site }: { site: WeddingSite }) {
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
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8]"
          >
            {/* Ambient sparkling starlight + soft silver light behind the card */}
            {!instant && <SapphireAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft silver glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(192,192,200,0.4) 0%, rgba(242,244,248,0.28) 55%, transparent 75%)",
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

                {/* BACK — blurred sapphire photo + silver seal medallion */}
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

              {/* Silver shimmer veil — lifts away on reveal */}
              {!instant && <SilverVeil isRevealed={isRevealed} />}

              {/* Silver light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(217,217,222,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Sparkle burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && <SparkleBurst burstKey={burstKey} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="sr-font-display relative z-10 mt-4 inline-block rounded-full bg-[#F2F4F8]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#12294D]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#0A1F44]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
