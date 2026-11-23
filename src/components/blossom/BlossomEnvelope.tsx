// BLOSSOM & OUD opening envelope — the first screen of every BLOSSOM & OUD site.
//
// A full-viewport ivory overlay: the envelope scales in 0.92 → 1, the
// wax seal fades in, "YOU ARE CORDIALLY INVITED" appears, and an
// explicit OPEN INVITATION click (keyboard, touch, or Skip) rotates the
// flap open in 3D, slides the invitation card upward, and transitions
// into the hero. Mirrors the Studio's EnvelopeIntro accessibility
// contract (focus trap, inert siblings, Escape, scroll lock, reduced
// motion → instant reveal), rebuilt with Framer Motion for the 3D flap.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BLOSSOM, formatShortDate, initials } from "./tokens";
import { WaxSeal } from "./Decor";

type Phase = "closed" | "opening" | "gone";

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
  const dateLine = formatShortDate(site.weddingDate, site.timezone);

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
          aria-label={`Open the invitation of ${names} — click to open`}
          className="group flex cursor-pointer flex-col items-center gap-6 rounded-lg bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
          style={{ outlineColor: BLOSSOM.gold } as React.CSSProperties}
        >
          {/* Envelope scene — 3D flap + sliding letter, all CSS shapes. */}
          <span
            className="relative block w-[min(420px,86vw)]"
            style={{ aspectRatio: "8 / 5", transformStyle: "preserve-3d" }}
          >
            {/* Letter: slides up out of the envelope on open. */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-[5%] top-[4%] bottom-[10%] z-[1] flex flex-col items-center justify-center gap-1 rounded-[3px] px-3 text-center"
              style={{
                backgroundColor: BLOSSOM.white,
                color: BLOSSOM.oud,
                boxShadow: "0 2px 12px rgba(48, 40, 33, 0.14)",
              }}
              initial={false}
              animate={opening ? { y: "-62%", opacity: 1 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
                Vous êtes invités
              </span>
              <span className="font-blossom text-[clamp(1.3rem,5.5vw,1.85rem)] leading-tight font-semibold">
                {names}
              </span>
              {dateLine ? <span className="text-sm opacity-70">{dateLine}</span> : null}
            </motion.span>

            {/* Front pocket: V-cut panel the letter slides out from behind. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[2] rounded-md"
              style={{
                backgroundColor: BLOSSOM.blush,
                clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
                boxShadow: "0 18px 40px rgba(48, 40, 33, 0.16)",
              }}
            />

            {/* Flap: triangle rotating open around its top edge (3D). */}
            <motion.span
              aria-hidden="true"
              className="absolute top-0 right-0 left-0 z-[3] h-[56%]"
              style={{
                backgroundColor: BLOSSOM.rose,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                backfaceVisibility: "hidden",
              }}
              initial={false}
              animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Wax seal at the flap tip — fades/scales in, breaks on open. */}
            <motion.span
              aria-hidden="true"
              className="absolute top-[52%] left-1/2 z-[4] block h-[54px] w-[54px]"
              style={{ x: "-50%", y: "-50%", color: BLOSSOM.burgundy }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                opening
                  ? { opacity: 0, scale: 0.55 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ duration: opening ? 0.25 : 0.6, delay: opening ? 0 : 0.35 }}
            >
              <WaxSeal className="h-full w-full">{initials(site)}</WaxSeal>
            </motion.span>
          </span>

          <motion.span
            className="text-xs font-bold uppercase tracking-[0.3em]"
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
