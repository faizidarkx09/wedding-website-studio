// ÉTERNEL opening card — NO envelope. The invitation card itself is
// the reveal: at rest you see its BACK (ivory, blurred gold wash, gold
// medallion with the couple monogram, "Tap to reveal"); tap dissolves
// the back in a gold shimmer unveiling — a shimmer band sweeps across,
// the back blurs + fades + lifts, gold sparkles rise — and the FRONT
// (the invitation, unchanged content) is revealed beneath. The overlay
// then fades and the site opens. Mirrors the Studio's opening
// accessibility contract (focus trap, inert siblings, Escape, scroll
// lock, reduced motion → instant reveal). No music engine in this
// template (the renderer has none); tap never autoplays anything.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { ETERNEL, coupleNames, formatShortDate, initials } from "./tokens";
import { Divider } from "./Decor";

type Phase = "closed" | "revealing" | "gone";

/** Gold shimmer unveiling — dissolve the back in gold light. */
const REVEAL_MS = 1500;

/** Rising gold sparkles for the unveiling. */
const SPARKLES = [
  { left: "12%", top: "68%", size: 5, delay: 0.1 },
  { left: "24%", top: "52%", size: 4, delay: 0.28 },
  { left: "38%", top: "74%", size: 6, delay: 0.05 },
  { left: "52%", top: "60%", size: 4, delay: 0.35 },
  { left: "64%", top: "70%", size: 5, delay: 0.18 },
  { left: "78%", top: "54%", size: 4, delay: 0.42 },
  { left: "88%", top: "66%", size: 6, delay: 0.24 },
] as const;

/** The invitation FRONT — existing content, unchanged: names, date,
 * venue, in ÉTERNEL typography and palette. */
function InvitationFront({ site }: { site: WeddingSite }) {
  const dateLine = formatShortDate(site.weddingDate, site.timezone);
  const venue = site.content.venueName?.trim() || site.content.venueAddress?.trim();
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#FFFDFB] px-5 py-6 text-center shadow-[0_18px_40px_-12px_rgba(48,40,33,0.35)]">
      {/* Fine double gold letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-[1rem] border"
        style={{ borderColor: `${ETERNEL.gold}99` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] rounded-[0.85rem] border"
        style={{ borderColor: `${ETERNEL.gold}66` }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <p
          className="text-[2.6cqw] font-semibold tracking-[0.32em] uppercase"
          style={{ color: ETERNEL.gold }}
        >
          You&apos;re invited
        </p>

        <h2 className="font-eternel mt-[3cqw] text-[9.5cqw] leading-[1.05] font-medium" style={{ color: ETERNEL.espresso }}>
          {site.content.partnerA}
        </h2>
        <span className="font-eternel my-[0.5cqw] text-[5cqw] italic" style={{ color: ETERNEL.gold }}>
          &amp;
        </span>
        <h2 className="font-eternel text-[9.5cqw] leading-[1.05] font-medium" style={{ color: ETERNEL.espresso }}>
          {site.content.partnerB}
        </h2>

        <Divider variant={3} className="mt-[3cqw] h-4 w-24" style={{ color: ETERNEL.gold }} />

        {dateLine ? (
          <p className="mt-[3cqw] text-[3.4cqw] font-semibold tracking-[0.22em] uppercase" style={{ color: ETERNEL.espresso }}>
            {dateLine}
          </p>
        ) : null}
        {venue ? (
          <p className="mt-[1.5cqw] text-[3.2cqw] tracking-[0.14em] uppercase opacity-70" style={{ color: ETERNEL.espresso }}>
            {venue}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The card BACK — ivory with a blurred gold wash, gold medallion
 * carrying the couple monogram, tap hint. Fully opaque: it hides the
 * front until the unveiling dissolves it. */
function CardBack({ site, revealing }: { site: WeddingSite; revealing: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 z-10 overflow-hidden rounded-[1.25rem]"
      style={{ backgroundColor: ETERNEL.ivory }}
      initial={false}
      animate={
        revealing
          ? { opacity: 0, scale: 1.06, filter: "blur(14px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Blurred gold wash — soft light, never sharp */}
      <div
        className="absolute -top-10 -left-10 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(180,154,112,0.5) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-8 -bottom-12 h-52 w-52 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,221,202,0.9) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-6 h-32 w-32 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(146,153,135,0.35) 0%, transparent 70%)" }}
      />

      {/* Fine double gold border, matching the front */}
      <div
        className="pointer-events-none absolute inset-2.5 rounded-[1rem] border"
        style={{ borderColor: `${ETERNEL.gold}99` }}
      />
      <div
        className="pointer-events-none absolute inset-[13px] rounded-[0.85rem] border"
        style={{ borderColor: `${ETERNEL.gold}66` }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-6 text-center">
        <p
          className="text-[2.6cqw] font-semibold tracking-[0.34em] uppercase"
          style={{ color: ETERNEL.gold }}
        >
          With love
        </p>

        {/* Gold medallion — thin double ring + monogram */}
        <div
          className="mt-[4cqw] flex items-center justify-center rounded-full"
          style={{
            width: "26cqw",
            height: "26cqw",
            background:
              "radial-gradient(circle at 35% 30%, #EFE7D6 0%, #D9C6A3 45%, #B49A70 78%, #96794F 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.6), inset 0 -4px 10px rgba(90,70,40,0.35), 0 10px 22px -6px rgba(48,40,33,0.4)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border"
            style={{ width: "21cqw", height: "21cqw", borderColor: "rgba(255,253,251,0.55)" }}
          >
            <span className="font-eternel text-[7.5cqw] leading-none font-medium text-[#FFFDFB]">
              {initials(site)}
            </span>
          </div>
        </div>

        <Divider variant={3} className="mt-[4cqw] h-4 w-24" style={{ color: ETERNEL.gold }} />

        <p
          className="mt-[3.5cqw] text-[2.6cqw] font-semibold tracking-[0.3em] uppercase"
          style={{ color: ETERNEL.espresso }}
        >
          Tap to reveal
        </p>
      </div>

      {/* Gold shimmer sweep + rising sparkles on the unveiling */}
      {revealing && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,244,214,0.85) 50%, transparent 100%)",
            }}
            initial={{ x: "-130%" }}
            animate={{ x: "340%" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          />
          {SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute z-20 rounded-full"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                background: "radial-gradient(circle, #FFE9A8 0%, #B49A70 100%)",
                boxShadow: "0 0 8px rgba(255,220,140,0.9)",
              }}
              initial={{ y: 0, opacity: 0, scale: 0.6 }}
              animate={{ y: -44, opacity: [0, 1, 0], scale: 1 }}
              transition={{ duration: 0.9, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

/** Slow-drifting gold light behind the card (ambient, skipped under
 * reduced motion). Transform + opacity only. */
function GoldAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-10 top-10 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(180,154,112,0.4) 0%, transparent 70%)" }}
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.4, 0, 0.6, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-12 h-52 w-52 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,221,202,0.7) 0%, transparent 70%)" }}
        animate={{ x: [0, -20, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.4, 0, 0.6, 1] }}
      />
    </div>
  );
}

export default function EternelEnvelope({
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

  const names = coupleNames(site);
  const instant = Boolean(reduceMotion);

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
    if (instant) {
      setPhase("gone");
      return;
    }
    setPhase("revealing");
    timerRef.current = window.setTimeout(() => setPhase("gone"), REVEAL_MS);
  }

  if (phase === "gone") return null;

  const revealing = phase === "revealing";

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitation for ${names}`}
      onKeyDown={trapTab}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto px-5 py-6"
      style={{ backgroundColor: ETERNEL.ivory, color: ETERNEL.espresso }}
      initial={false}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: 0.5, delay: revealing ? 1.0 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {!instant && <GoldAmbience />}

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center text-[11px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: ETERNEL.gold }}
      >
        You are cordially invited
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          disabled={phase !== "closed"}
          aria-label={`Reveal the wedding invitation of ${names} — tap to reveal`}
          className="group relative block w-full cursor-pointer bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
          style={{ outlineColor: ETERNEL.gold } as React.CSSProperties}
        >
          {/* The card — front underneath, back on top until revealed.
              Sized in cqw so the card scales cleanly at 390px/320px. */}
          <span
            className="relative mx-auto block w-[min(400px,86vw)]"
            style={{ aspectRatio: "3 / 4", containerType: "inline-size" } as React.CSSProperties}
          >
            {/* Soft gold glow behind the card */}
            <span
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(180,154,112,0.45) 0%, rgba(232,221,202,0.3) 55%, transparent 75%)",
              }}
            />
            <motion.span
              className="relative block h-full w-full"
              initial={false}
              animate={revealing ? { scale: 1.015 } : { scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute inset-0">
                <InvitationFront site={site} />
              </span>
              <CardBack site={site} revealing={revealing} />
            </motion.span>
          </span>

          <motion.span
            className="mt-5 block text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: ETERNEL.gold }}
            animate={revealing ? { opacity: 0 } : { opacity: [0.6, 1, 0.6] }}
            transition={
              revealing
                ? { duration: 0.3 }
                : { duration: 1.8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
            }
          >
            Tap to reveal
          </motion.span>
        </button>
      </motion.div>

      <button
        type="button"
        onClick={dismiss}
        className="relative z-10 cursor-pointer bg-transparent px-3 py-2 text-sm font-semibold underline underline-offset-4 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: ETERNEL.gold } as React.CSSProperties}
      >
        Skip intro
      </button>
    </motion.div>
  );
}
