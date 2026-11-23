// The Sacred Garden opening envelope — the first screen of every
// Sacred Garden site.
//
// A full-viewport cream overlay: the AI-generated envelope artwork
// (ivory, embossed florals, burgundy wax seal), with the couple's
// LIVE initials rendered in HTML over the seal — the baked gold
// "A&B" monogram in the image is covered by a burgundy disc carrying
// initials(site), so the seal reads correctly for ANY couple — with
// the pulsing chevron + "TAP TO OPEN" (Cinzel 11px, bronze, 0.26em
// letter-spacing) overlaid on the lower third, exactly as the audit
// specifies (DESIGN_SYSTEM.md §0.2).
//
// Tap sequence (audit §0.3): touchstart primes the audio element
// (Android fix — play, pause, reset), click starts the music (via the
// renderer's shared audio element) and plays the opening animation:
// a subtle lift/scale with a warm golden glow spilling from the
// envelope, then the overlay fades out over 1.4s. DEVIATION from the
// audit: the source's 4.8s 3D envelope-opening video is NOT reproduced
// — video generation is region-blocked here, so the opening is a
// CSS/JS animation on the envelope image instead (audit §0.4 option
// (a)). Mirrors the Studio's EnvelopeIntro accessibility contract
// (focus trap, inert siblings, Escape, scroll lock, reduced motion →
// instant reveal) and keeps the Studio's Skip intro control (the
// original offers none — kept for accessibility).
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { ENVELOPE_IMAGE_URL, SACRED, coupleNames, initials } from "./tokens";

type Phase = "closed" | "opening" | "gone";

export default function SacredGardenEnvelope({
  site,
  autoFocus = true,
  onPrimeAudio,
  onOpen,
}: {
  site: WeddingSite;
  autoFocus?: boolean;
  /** Touchstart prime: silently unlock the shared audio element
   * (Android Chrome needs the gesture before a real play). */
  onPrimeAudio: () => void;
  /** Click: the renderer starts the shared music and marks the site
   * opened (music toggle appears). */
  onOpen: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const names = coupleNames(site);

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

  // Escape dismisses the intro (music stays off — it only starts on tap).
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
    onOpen();
    if (reduceMotion) {
      setPhase("gone");
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(() => setPhase("gone"), 1400);
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-5"
      style={{ backgroundColor: SACRED.cream, color: SACRED.brown }}
      initial={false}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative"
      >
        <button
          ref={buttonRef}
          type="button"
          onTouchStart={onPrimeAudio}
          onClick={open}
          disabled={phase !== "closed"}
          aria-label={`Open the invitation of ${names} — tap to open`}
          className="group relative block cursor-pointer bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
          style={{ outlineColor: SACRED.gold } as React.CSSProperties}
        >
          {/* Envelope artwork — one image, max 440px wide (audit §0.1).
              The wax seal is baked into the image, but its monogram is
              NOT trusted: the live initials overlay below covers the
              baked "A&B" with a burgundy disc carrying initials(site).
              containerType makes the disc + initials scale with the
              envelope via cqw units. */}
          <motion.span
            aria-hidden="true"
            className="relative block w-[min(440px,86vw)] overflow-hidden rounded-sm"
            style={{ aspectRatio: "9 / 16", containerType: "inline-size" } as React.CSSProperties}
            initial={false}
            animate={
              opening
                ? { scale: 1.04, y: -10 }
                : { scale: 1, y: 0 }
            }
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ENVELOPE_IMAGE_URL}
              alt="Open your invitation"
              draggable={false}
              fetchPriority="high"
              className="block h-full w-full object-cover"
            />
            {/* Warm golden glow spilling from the envelope on open
                (the CSS/JS stand-in for the source's opening video). */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 42%, rgba(255,231,192,0.95) 0%, rgba(255,249,235,0.55) 45%, rgba(255,249,235,0) 75%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: opening ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
            {/* Live seal monogram — burgundy disc (15% of the envelope
                width, centred on the baked seal at 50% / 43%) covering
                the baked "A&B", with the couple's live initials in
                Imperial Script, light gold. Sized in cqw so it scales
                with the envelope at any width. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[43%] flex items-center justify-center"
              style={{
                width: "15cqw",
                height: "15cqw",
                transform: "translate(-50%, -50%)",
                borderRadius: "46% 54% 52% 48% / 52% 48% 54% 46%",
                background:
                  "radial-gradient(circle at 50% 42%, #7A2836 0%, #6A1F2C 55%, #5A0F1B 100%)",
              }}
            >
              <span
                aria-hidden="true"
                className="sacred-script"
                style={{ color: "#E8D5A0", fontSize: "8.5cqw", lineHeight: 1 }}
              >
                {initials(site)}
              </span>
            </span>
          </motion.span>

          {/* Tap prompt — over the lower third of the envelope image,
              below the wax seal (audit §0.2). */}
          <motion.span
            aria-hidden="true"
            className="absolute bottom-[30%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[7px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: opening ? 0 : 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <motion.span
              aria-hidden="true"
              className="block h-[10px] w-[10px]"
              style={{
                borderRight: `1.5px solid ${SACRED.bronzeChevron}`,
                borderTop: `1.5px solid ${SACRED.bronzeChevron}`,
                transform: "rotate(-45deg)",
              }}
              animate={{ opacity: [0.6, 1, 0.6], y: [2, -2, 2] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.9 }}
            />
            <motion.span
              className="sacred-cinzel text-[11px] whitespace-nowrap uppercase"
              style={{ color: SACRED.bronze, letterSpacing: "0.26em" }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
            >
              Tap to open
            </motion.span>
          </motion.span>
        </button>
      </motion.div>

      <button
        type="button"
        onClick={dismiss}
        className="mt-7 cursor-pointer bg-transparent px-3 py-2 text-sm font-semibold underline underline-offset-4 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: SACRED.gold } as React.CSSProperties}
      >
        Skip intro
      </button>
    </motion.div>
  );
}
