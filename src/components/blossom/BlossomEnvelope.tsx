// BLOSSOM & OUD opening card — NO envelope. The first screen of every
// BLOSSOM & OUD site is a full-viewport ivory overlay: the invitation
// card itself is the reveal. At rest you see the card's BACK (a soft
// blush panel with blurred orange-blossom florals, a burgundy wax-seal
// medallion with the couple monogram, "Touchez pour révéler"); tap
// drifts the petals away, the back fades and lifts, and the FRONT
// (the invitation — "Vous êtes invités", the couple names, the date)
// is revealed beneath, then the overlay fades and the site opens.
// Mirrors the Studio's opening accessibility contract (focus trap,
// inert siblings, Escape, scroll lock, reduced motion → instant
// reveal). No envelope shape, no flap, no pocket — only the card.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BLOSSOM, formatShortDate, initials } from "./tokens";
import { BlossomSprig, Divider, FloralCorner, FloralDrift, Flower, WaxSeal } from "./Decor";

type Phase = "closed" | "opening" | "gone";

/* ------------------------------------------------------------------ */
/* PetalDrift — on open, six blossoms drift outward from the card   */
/* and fade, like petals carried off by a warm breeze. Renders      */
/* nothing under reduced motion.                                      */
/* ------------------------------------------------------------------ */

const DRIFT_PETALS = [
  { angle: -90, dist: 120, size: 30, delay: 0.02 },
  { angle: -45, dist: 100, size: 24, delay: 0.08 },
  { angle: 0, dist: 120, size: 30, delay: 0.02 },
  { angle: 45, dist: 100, size: 24, delay: 0.08 },
  { angle: 90, dist: 120, size: 30, delay: 0.02 },
  { angle: 135, dist: 100, size: 24, delay: 0.08 },
  { angle: 180, dist: 120, size: 30, delay: 0.02 },
  { angle: -135, dist: 100, size: 24, delay: 0.08 },
];

function PetalDrift() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {DRIFT_PETALS.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.dist;
        const y = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={i}
            className="absolute text-[#C08A7E]"
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.95, rotate: p.angle }}
            animate={{ x, y, scale: 1, opacity: 0, rotate: p.angle + 50 }}
            transition={{ duration: 1.05, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <Flower variant={1} className="h-full w-full" />
          </motion.span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — soft blush panel, blurred orange-blossom florals,     */
/* burgundy wax-seal medallion with the couple monogram, tap hint.  */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 text-center"
      style={{ backgroundColor: BLOSSOM.blush, color: BLOSSOM.oud }}
    >
      {/* Blurred orange-blossom florals — softened into a backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-2"
        style={{ filter: "blur(5px)", opacity: 0.5 }}
      >
        <BlossomSprig className="h-3/4 w-auto text-[#C08A7E]" />
        <BlossomSprig className="h-3/4 w-auto -scale-x-100 text-[#C08A7E]" />
      </div>

      {/* Soft blush wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(250,246,239,0.25) 0%, rgba(239,220,210,0.55) 100%)",
        }}
      />

      {/* Floral corners */}
      <FloralCorner className="pointer-events-none absolute top-2 left-2 h-20 w-20 text-[#C08A7E]/70" />
      <FloralCorner flip className="pointer-events-none absolute right-2 bottom-2 h-20 w-20 text-[#C08A7E]/70" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: BLOSSOM.gold }}>
          Avec amour
        </p>

        {/* Burgundy wax-seal medallion with the couple monogram */}
        <span className="mt-4 block h-[64px] w-[64px]" style={{ color: BLOSSOM.burgundy }}>
          <WaxSeal className="h-full w-full">{initials(site)}</WaxSeal>
        </span>

        <Divider variant={3} className="mt-4 h-4 w-24" />

        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BLOSSOM.gold }}>
          Touchez pour révéler
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardFront — the invitation (unchanged content): "Vous êtes       */
/* invités", the couple names, the date.                              */
/* ------------------------------------------------------------------ */

function CardFront({ site }: { site: WeddingSite }) {
  const names = `${site.content.partnerA} & ${site.content.partnerB}`;
  const dateLine = formatShortDate(site.weddingDate, site.timezone);
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 text-center"
      style={{ backgroundColor: BLOSSOM.white, color: BLOSSOM.oud }}
    >
      <FloralCorner className="pointer-events-none absolute top-2 left-2 h-20 w-20 text-[#C08A7E]/60" />
      <FloralCorner flip className="pointer-events-none absolute right-2 bottom-2 h-20 w-20 text-[#C08A7E]/60" />

      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
          Vous êtes invités
        </span>
        <span className="font-blossom text-[clamp(1.3rem,5.5vw,1.85rem)] leading-tight font-semibold">
          {names}
        </span>
        {dateLine ? <span className="text-sm opacity-70">{dateLine}</span> : null}
        <Divider variant={3} className="mt-3 h-4 w-24" />
      </div>
    </div>
  );
}

export default function BlossomEnvelope({
  site,
  autoFocus = true,
}: {
  site: WeddingSite;
  autoFocus?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const names = `${site.content.partnerA} & ${site.content.partnerB}`;

  useEffect(() => {
    if (autoFocus) buttonRef.current?.focus();
  }, [autoFocus]);

  // While the intro covers the page, the site behind it is inert.
  useEffect(() => {
    if (phase === "gone") return;
    const overlay = overlayRef.current;
    const parent = overlay?.parentElement;
    if (!parent) return;
    const siblings = Array.from(parent.children).filter((el) => el !== overlay);
    siblings.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      siblings.forEach((el) => el.removeAttribute("inert"));
    };
  }, [phase]);

  // Lock body scroll while the intro covers the page.
  useEffect(() => {
    if (phase === "gone") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // Escape dismisses the intro.
  useEffect(() => {
    if (phase === "gone") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("gone");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  function dismiss() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPhase("gone");
  }

  /** Keep Tab inside the overlay while it is open (two buttons). */
  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab") return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (phase !== "closed") return;
    if (reduceMotion) {
      setPhase("gone");
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(() => setPhase("gone"), 1100);
  }

  if (phase === "gone") return null;

  const opening = phase === "opening";

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitation for ${names}`}
      onKeyDown={trapTab}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 px-5"
      style={{ backgroundColor: BLOSSOM.ivory, color: BLOSSOM.oud }}
      initial={false}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.35, delay: opening ? 0.75 : 0 }}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="text-center text-[11px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: BLOSSOM.gold }}
      >
        Vous êtes cordialement invités
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        style={{ perspective: 1000 }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          disabled={phase !== "closed"}
          aria-label={`Open the invitation of ${names} — click to reveal`}
          className="group block cursor-pointer rounded-lg bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
          style={{ outlineColor: BLOSSOM.gold } as React.CSSProperties}
        >
          {/* Invitation card — back at rest, front on open. Petals
              drift away as the back dissolves. */}
          <span
            className="relative block w-[min(380px,86vw)] overflow-hidden rounded-[4px]"
            style={{
              aspectRatio: "4 / 5",
              boxShadow: "0 18px 40px rgba(48, 40, 33, 0.16)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRONT — the invitation (revealed on open) */}
            <motion.span
              aria-hidden={!opening}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: opening ? 1 : 0, y: opening ? 0 : 16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardFront site={site} />
            </motion.span>

            {/* BACK — blurred florals + wax-seal medallion */}
            <motion.span
              aria-hidden={opening}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: opening ? 0 : 1, y: opening ? -12 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <FloralDrift>
                <CardBack site={site} />
              </FloralDrift>
            </motion.span>

            {/* Petals drifting away on open */}
            {opening && !reduceMotion && <PetalDrift />}
          </span>

          <motion.span
            className="mt-6 block text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: BLOSSOM.gold }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Ouvrez l&rsquo;invitation
          </motion.span>
        </button>
      </motion.div>

      <button
        type="button"
        onClick={dismiss}
        className="cursor-pointer bg-transparent px-3 py-2 text-sm font-semibold underline underline-offset-4 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: BLOSSOM.gold } as React.CSSProperties}
      >
        Skip intro
      </button>
    </motion.div>
  );
}
