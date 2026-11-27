// Tropical Palm invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a blurred palm-frond wash
// in deep green/cream with the couple monogram and a "TAP TO
// REVEAL" hint, plus slow-drifting blurred palm-leaf shapes); on
// tap it BLOOMS — scaling up from a small bud with a springy
// overshoot while palm-leaf petals unfurl outward from behind its
// edges — to the FRONT (the existing invitation content,
// unchanged). Tap again blooms it back to the back side.
// Ambient falling leaves drift behind the card; a small
// leaf-particle burst lands the bloom. prefers-reduced-motion:
// instant swap, no ambient animation, no particles. No music on
// this template by design.
//
// After the cinematic opening, the cover sets the
// "tp-bloom-on-mount" session flag, so the card blooms in on its
// own as the palm panels part (see CinematicOpening PalmOverlay).
// In the editor preview there is no cover and no flag, so the card
// simply rests as a bud until tapped.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PalmCrest, PalmDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { LeafCanvas } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the cream letterpress card (FRONT, unchanged)    */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-3 text-center text-[#14301C] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(10,46,25,0.52),0_4px_12px_rgba(10,46,25,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(10,46,25,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(254, 249, 195, 0.55) 100%)",
        }}
      />

      {/* Fine double palm-green & turquoise letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#15803D]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#0E7490]/30 @min-[29.375rem]:inset-[15px]"
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
        <p className="tp-font-display text-[9px] tracking-[0.26em] text-[#166534] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="tp-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14301C] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="tp-font-editorial my-0.5 text-base italic text-[#166534] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="tp-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14301C] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <PalmDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="tp-font-display text-[9px] tracking-[0.24em] text-[#14301C] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="tp-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#166534] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred palm-frond wash in deep green/cream, monogram  */
/* in a palm-frond crest, tap hint. Same footprint as the front      */
/* (absolute inset-0 of the bloom box), so the bloom never moves     */
/* layout — the scale is a transform only.                           */
/* ------------------------------------------------------------------ */

function CardBack({ site, instant }: { site: WeddingSite; instant: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0A2E19] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(10,46,25,0.45)]">
      {/* Blurred palm-frond wash — the template's palm photo, heavily
          blurred, under a deep-green wash so the monogram stays
          readable. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ENVELOPE_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-[14px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,46,25,0.82) 0%, rgba(20,83,45,0.62) 55%, rgba(10,46,25,0.85) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(255,251,235,0.16) 0%, rgba(10,46,25,0.1) 100%)",
        }}
      />

      {/* Slow-drifting blurred palm-leaf shapes behind the monogram */}
      {!instant && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-[12%] -left-8 h-24 w-24 rounded-[100%_4px_100%_4px] blur-md"
            style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.5), rgba(20,83,45,0.4))" }}
            animate={{ x: [0, 18, 0], y: [0, -12, 0], rotate: [0, 14, 0] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[6%] bottom-[10%] h-28 w-28 rounded-[4px_100%_4px_100%] blur-md"
            style={{ background: "linear-gradient(135deg, rgba(253,230,138,0.42), rgba(21,128,61,0.35))" }}
            animate={{ x: [0, -16, 0], y: [0, 12, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-[58%] left-[8%] h-16 w-16 rounded-[100%_4px_100%_4px] blur-md"
            style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.4), rgba(20,83,45,0.35))" }}
            animate={{ x: [0, 12, 0], y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
          />
        </>
      )}

      {/* Fine double palm-green & turquoise border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#FDE68A]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#06B6D4]/40"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="tp-font-display text-[9px] tracking-[0.34em] text-[#FEF3C7] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Palm-frond crest with the live monogram */}
        <div className="relative mt-4 h-24 w-24 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28">
          <PalmCrest className="absolute inset-0 h-full w-full drop-shadow-[0_6px_16px_rgba(10,46,25,0.6)]" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="tp-font-display text-[1.35rem] font-medium tracking-[0.06em] text-[#FFFBEB]">
              {initials(site)}
            </span>
          </div>
        </div>

        <PalmDivider className="mt-4 h-6 w-24 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="tp-font-display mt-3 text-[9px] tracking-[0.3em] text-[#FEF3C7] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PalmAmbience — slow-drifting blurred palm/gold/turquoise light    */
/* behind the card. Transform + opacity only. Skipped entirely      */
/* under reduced motion.                                             */
/* ------------------------------------------------------------------ */

function PalmAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-8 overflow-hidden">
      <motion.div
        className="absolute top-6 -left-8 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(21,128,61,0.4) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute right-0 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(253,230,138,0.35) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute top-1/3 left-1/3 h-36 w-36 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.28) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 14, 0], y: [0, 18, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bloom petals — six palm-leaf shapes that unfurl outward from      */
/* behind the card edges as it blooms, and fold back in when it     */
/* blooms shut. Leaf shape = rounded leaf (border-radius), green    */
/* with two gold accents. Offsets are small on purpose: the card    */
/* sits ~27px from the viewport edge at 320px, so no petal may     */
/* reach further than ~22px past a card edge.                       */
/* ------------------------------------------------------------------ */

interface PetalSpec {
  style: React.CSSProperties;
  restRotate: number;
  openRotate: number;
  openX: number;
  openY: number;
  gold?: boolean;
}

const PETALS: PetalSpec[] = [
  { style: { top: -14, left: -8 }, restRotate: -72, openRotate: -38, openX: -26, openY: -20 },
  { style: { top: -14, right: -8 }, restRotate: 72, openRotate: 38, openX: 26, openY: -20, gold: true },
  { style: { top: "36%", left: -20 }, restRotate: -108, openRotate: -78, openX: -30, openY: 0 },
  { style: { top: "36%", right: -20 }, restRotate: 108, openRotate: 78, openX: 30, openY: 0, gold: true },
  { style: { bottom: -12, left: "8%" }, restRotate: -135, openRotate: -108, openX: -18, openY: 22 },
  { style: { bottom: -12, right: "8%" }, restRotate: 135, openRotate: 108, openX: 18, openY: 22 },
];

function BloomPetals({ isOpen, instant }: { isOpen: boolean; instant: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {PETALS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-6 w-16 @min-[29.375rem]:h-7 @min-[29.375rem]:w-20"
          style={{
            ...p.style,
            borderRadius: "100% 4px 100% 4px",
            background: p.gold
              ? "linear-gradient(135deg, #FDE68A 0%, #D9A441 55%, #B45309 100%)"
              : "linear-gradient(135deg, #4ADE80 0%, #15803D 55%, #0A2E19 100%)",
            boxShadow: "0 6px 14px -4px rgba(10,46,25,0.5)",
          }}
          initial={false}
          animate={
            isOpen
              ? { opacity: 1, scale: 1, rotate: p.openRotate, x: p.openX, y: p.openY }
              : { opacity: 0, scale: 0.2, rotate: p.restRotate, x: 0, y: 0 }
          }
          transition={
            instant
              ? { duration: 0 }
              : { duration: 0.85, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {/* Centre vein */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-[10%] h-px w-[80%] -translate-y-1/2 bg-white/35"
          />
        </motion.div>
      ))}
    </div>
  );
}

const AUTO_BLOOM_FLAG = "tp-bloom-on-mount";

export default function TropicalPalmEnvelope({ site }: { site: WeddingSite }) {
  const [isBloomed, setIsBloomed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);
  const bloomedRef = useRef(false);

  // Bloom on mount when the cinematic opening asked for it: the
  // cover sets the flag as the palm panels start parting, and the
  // card blooms in ~1.5s later, mid-parting. One-shot — the flag is
  // cleared on read.
  useEffect(() => {
    let t: number | null = null;
    try {
      if (sessionStorage.getItem(AUTO_BLOOM_FLAG) === "1") {
        sessionStorage.removeItem(AUTO_BLOOM_FLAG);
        if (instant) {
          bloomedRef.current = true;
          setIsBloomed(true);
        } else {
          t = window.setTimeout(() => {
            if (bloomedRef.current) return;
            bloomedRef.current = true;
            setIsBloomed(true);
            setBurstKey((k) => k + 1);
          }, 1500);
        }
      }
    } catch {
      /* session storage unavailable — card rests as a bud until tapped */
    }
    return () => {
      if (t !== null) window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCard = () => {
    const next = !isBloomed;
    bloomedRef.current = next;
    setIsBloomed(next);
    if (next) setBurstKey((k) => k + 1);
  };

  // Springy overshoot for the bloom: the card grows from a small
  // bud (scale ~0.58) to full size. Transform-only, so the layout
  // footprint never moves.
  const bloomTransition: Transition = instant
    ? { duration: 0 }
    : { type: "spring", stiffness: 260, damping: 19 };

  const fadeTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] };

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
            aria-expanded={isBloomed}
            aria-label={
              isBloomed
                ? "Bloom the wedding invitation card back to its back side"
                : "Tap the invitation card to bloom it open and reveal the invitation"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14301C]"
          >
            {/* Ambient light + falling leaves behind the card */}
            {!instant && <PalmAmbience />}

            {/* Bloom scene — the FRONT is in flow (it defines the
                box height); the BACK is absolute inset-0, so the
                bloom never moves layout. Rest = bud at scale ~0.58
                showing the back; bloomed = full size, front. */}
            <div className="relative z-10 mx-auto w-[92%]">
              {/* Soft island glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(253,230,138,0.45) 0%, rgba(21,128,61,0.3) 55%, transparent 75%)",
                }}
              />

              {/* Unfurling palm-leaf petals, behind the card */}
              <BloomPetals isOpen={isBloomed} instant={instant} />

              <motion.div
                initial={false}
                animate={
                  isBloomed
                    ? { scale: 1, rotate: 0 }
                    : { scale: 0.58, rotate: -2 }
                }
                transition={bloomTransition}
                className="relative z-10 w-full"
              >
                {/* FRONT — the invitation (unchanged content) */}
                <motion.div
                  aria-hidden={!isBloomed}
                  initial={false}
                  animate={{ opacity: isBloomed ? 1 : 0 }}
                  transition={fadeTransition}
                  className="relative w-full"
                >
                  <InvitationCard site={site} isOpen={isBloomed} />
                </motion.div>

                {/* BACK — blurred palm wash + monogram */}
                <motion.div
                  aria-hidden={isBloomed}
                  initial={false}
                  animate={{ opacity: isBloomed ? 0 : 1 }}
                  transition={fadeTransition}
                  className="absolute inset-0"
                >
                  <CardBack site={site} instant={instant} />
                </motion.div>
              </motion.div>

              {/* Leaf-particle burst on the bloom landing. The
                  canvas renders nothing under reduced motion. */}
              {!instant && (
                <LeafCanvas
                  leafCount={8}
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.45 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue */}
            <motion.p
              key={isBloomed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="tp-font-display relative z-10 mt-4 text-center text-[10px] tracking-[0.26em] text-[#166534]/80 uppercase transition-colors group-hover:text-[#14301C]"
            >
              {isBloomed ? "Tap to Bloom Back" : "Tap Card to Bloom"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
