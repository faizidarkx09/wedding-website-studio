// Dolce Vita opening card — NO envelope. The first screen of every
// Dolce Vita site is a full-viewport cream overlay: the invitation
// card itself is the reveal. At rest you see the card's BACK (a
// cream panel with soft dusty-blue radial washes, blurred floral
// spray, a gold heart-seal medallion with the couple monogram,
// "Click to reveal"); tap sweeps a soft coastal breeze across the
// card, the back fades and lifts, and the FRONT (the invitation —
// the couple names, the date) is revealed beneath, then the overlay
// fades and the site opens (and the music starts, via the renderer's
// shared audio element). Mirrors the Studio's opening accessibility
// contract (focus trap, inert siblings, Escape, scroll lock,
// reduced motion → instant reveal). No envelope shape, no flaps, no
// pocket — only the card.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DOLCE, coupleNames, formatLongDate, initials } from "./tokens";
import { Divider, FloralSpray, GoldHeartSeal, IvyCorner } from "./Decor";

type Phase = "closed" | "opening" | "gone";

/* ------------------------------------------------------------------ */
/* CardBack — cream panel, soft dusty-blue washes, blurred floral    */
/* spray, gold heart-seal medallion with the couple monogram, tap   */
/* hint.                                                              */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 text-center"
      style={{ backgroundColor: DOLCE.cream, color: DOLCE.ink }}
    >
      {/* Soft dusty-blue radial washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(155,201,225,0.35) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 80%, rgba(100,160,189,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Blurred floral spray — softened into a backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 opacity-50"
        style={{ filter: "blur(4px)" }}
      >
        <FloralSpray className="h-auto w-full text-[#8A9B7E]" />
      </div>

      {/* Ivy corners */}
      <IvyCorner className="pointer-events-none absolute top-2 left-2 h-20 w-20 text-[#8A9B7E]/70" />
      <IvyCorner className="pointer-events-none absolute right-2 bottom-2 h-20 w-20 rotate-180 text-[#8A9B7E]/70" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em]" style={{ color: DOLCE.blueDeep }}>
          With love
        </p>

        {/* Gold heart-seal medallion with the couple monogram */}
        <span className="relative mt-4 flex h-[68px] w-[68px] items-center justify-center">
          <GoldHeartSeal className="absolute inset-0 h-full w-full" />
          <span className="relative text-[15px] font-semibold tracking-[0.06em] text-white" style={{ textShadow: "0 1px 3px rgba(58,58,58,0.4)" }}>
            {initials(site)}
          </span>
        </span>

        <Divider className="mt-4 h-4 w-24 text-[#B89050]" />

        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: DOLCE.blueDeep }}>
          Click to reveal
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardFront — the invitation (unchanged content): the couple names, */
/* the date.                                                          */
/* ------------------------------------------------------------------ */

function CardFront({ site }: { site: WeddingSite }) {
  const names = coupleNames(site);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-6 text-center"
      style={{ backgroundColor: DOLCE.bg, color: DOLCE.ink }}
    >
      <IvyCorner className="pointer-events-none absolute top-2 left-2 h-20 w-20 text-[#8A9B7E]/60" />
      <IvyCorner className="pointer-events-none absolute right-2 bottom-2 h-20 w-20 rotate-180 text-[#8A9B7E]/60" />

      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-60">
          You are invited
        </span>
        <span className="text-[clamp(1.3rem,5.5vw,1.85rem)] leading-tight font-semibold">
          {names}
        </span>
        {dateLine ? <span className="text-sm opacity-70">{dateLine}</span> : null}
        <Divider className="mt-3 h-4 w-24 text-[#B89050]" />
      </div>
    </div>
  );
}

export default function DolceVitaEnvelope({
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
  /** Click: the renderer starts the shared music (withMusic) and
   * marks the site opened (music toggle appears). */
  onOpen: (withMusic: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const openedRef = useRef(false);

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
      if (e.key === "Escape") dismiss(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  function dismiss(withMusic: boolean) {
    if (openedRef.current) return;
    openedRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    onOpen(withMusic);
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

  function open(withMusic: boolean) {
    if (phase !== "closed") return;
    openedRef.current = true;
    onOpen(withMusic);
    if (reduceMotion) {
      setPhase("gone");
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(() => setPhase("gone"), 2300);
  }

  if (phase === "gone") return null;

  const opening = phase === "opening";

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitation for ${names}`}
      onKeyDown={trapTab}
      onClick={() => open(true)}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 px-5"
      style={{ backgroundColor: DOLCE.bg, color: DOLCE.ink }}
    >
      <p
        className="text-center text-[11px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: DOLCE.goldDeep }}
      >
        You are cordially invited
      </p>

      <button
        ref={buttonRef}
        type="button"
        onTouchStart={onPrimeAudio}
        onClick={(e) => {
          e.stopPropagation();
          open(true);
        }}
        disabled={phase !== "closed"}
        aria-label={`Open the invitation of ${names} — click to reveal`}
        className="group block cursor-pointer rounded-lg bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
        style={{ outlineColor: DOLCE.goldDeep } as React.CSSProperties}
      >
        {/* Invitation card — back at rest, front on open. A soft
            coastal breeze sweeps across as the back dissolves. */}
        <span
          className="relative block w-[min(380px,86vw)] overflow-hidden rounded-[4px]"
          style={{
            aspectRatio: "4 / 5",
            boxShadow: "0 18px 40px rgba(58, 58, 58, 0.14)",
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

          {/* BACK — blurred florals + gold heart-seal medallion */}
          <motion.span
            aria-hidden={opening}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: opening ? 0 : 1, y: opening ? -12 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardBack site={site} />
          </motion.span>

          {/* Coastal breeze sweep on open */}
          {opening && !reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-20 w-1/2"
              style={{
                background:
                  "linear-gradient(100deg, transparent 0%, rgba(155,201,225,0.45) 50%, transparent 100%)",
              }}
              initial={{ x: "-120%" }}
              animate={{ x: "320%" }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </span>

        <span
          className="mt-6 block text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: DOLCE.blueDeep }}
        >
          Click to open
        </span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss(false);
        }}
        className="cursor-pointer bg-transparent px-3 py-2 text-sm font-semibold underline underline-offset-4 opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: DOLCE.goldDeep } as React.CSSProperties}
      >
        Skip intro
      </button>
    </div>
  );
}
