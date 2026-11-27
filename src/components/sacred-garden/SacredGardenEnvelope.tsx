// The Sacred Garden opening card — NO envelope. The invitation card
// itself is the reveal: at rest you see its BACK (cream, blurred
// garden wash, burgundy medallion with the couple monogram, "Tap to
// reveal"); tap opens the garden gates — a warm beam of light sweeps
// down the centre, then the back splits into two gate panels that
// slide apart, and the FRONT (the invitation, unchanged content) is
// revealed beneath. The overlay then fades and the site opens.
// Mirrors the Studio's opening accessibility contract (focus trap,
// inert siblings, Escape, scroll lock, reduced motion → instant
// reveal) and keeps the Studio's Skip intro control. Tap starts the
// shared music via the renderer's onOpen (the verified CC0 piano
// track); Skip/Escape never start music.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SACRED, coupleNames, formatDottedDate, initials } from "./tokens";
import { Divider } from "./Decor";

type Phase = "closed" | "revealing" | "gone";

/** Garden-gate reveal — light beam, then the gates part. */
const REVEAL_MS = 1600;

/** Drifting golden light motes (ambient). */
const MOTES = [
  { left: "8%", size: 5, duration: 9, delay: 0 },
  { left: "20%", size: 7, duration: 11, delay: 1.6 },
  { left: "34%", size: 4, duration: 8.5, delay: 2.8 },
  { left: "48%", size: 6, duration: 10, delay: 0.9 },
  { left: "62%", size: 5, duration: 12, delay: 3.4 },
  { left: "76%", size: 7, duration: 9.5, delay: 2.1 },
  { left: "88%", size: 4, duration: 10.5, delay: 4.0 },
] as const;

/** The invitation FRONT — existing content, unchanged: names, dotted
 * date, venue, in Sacred Garden typography and palette. */
function InvitationFront({ site }: { site: WeddingSite }) {
  const dottedDate = formatDottedDate(site.weddingDate, site.timezone);
  const venue = site.content.venueName?.trim() || site.content.venueAddress?.trim();
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[0.35rem] bg-[#FFFDF6] px-5 py-6 text-center shadow-[0_18px_40px_-12px_rgba(90,15,27,0.35)]">
      {/* Fine double gold border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-[0.25rem] border"
        style={{ borderColor: `${SACRED.gold}99` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] rounded-[0.2rem] border"
        style={{ borderColor: `${SACRED.gold}66` }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <p
          className="sacred-cinzel text-[2.6cqw] uppercase"
          style={{ color: SACRED.bronze, letterSpacing: "0.26em" }}
        >
          Together with their families
        </p>

        <h2 className="sacred-script mt-[3cqw] text-[11cqw] leading-[1.05]" style={{ color: SACRED.gold }}>
          {site.content.partnerA}
        </h2>
        <span className="sacred-script my-[0.5cqw] text-[6cqw] leading-none" style={{ color: SACRED.goldAlt }}>
          &amp;
        </span>
        <h2 className="sacred-script text-[11cqw] leading-[1.05]" style={{ color: SACRED.gold }}>
          {site.content.partnerB}
        </h2>

        <Divider className="mt-[3cqw] h-4 w-24" style={{ color: SACRED.gold }} />

        {dottedDate ? (
          <p
            className="sacred-cinzel mt-[3cqw] text-[3.6cqw] uppercase"
            style={{ color: SACRED.brown, letterSpacing: "0.28em" }}
          >
            {dottedDate}
          </p>
        ) : null}
        {venue ? (
          <p
            className="sacred-cinzel mt-[1.5cqw] text-[3cqw] uppercase"
            style={{ color: SACRED.taupe, letterSpacing: "0.18em" }}
          >
            {venue}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The card BACK — the garden gates. Two cream gate panels (with a
 * gold seam between them) cover the front; the medallion + tap hint
 * sit on top. On reveal: the content fades, a warm beam of light
 * sweeps down the centre, then the gates slide apart and the front
 * is revealed beneath. */
function CardBack({ site, revealing }: { site: WeddingSite; revealing: boolean }) {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden rounded-[0.35rem]" style={{ backgroundColor: SACRED.cream }}>
      {/* Blurred garden wash behind the gates */}
      <div
        aria-hidden="true"
        className="absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(146,153,135,0.4) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-6 -bottom-10 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(166,125,43,0.35) 0%, transparent 70%)" }}
      />

      {/* Gate panels — left and right halves. They carry the cream
          surface + a gold inner seam; on reveal they slide apart. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          backgroundColor: SACRED.lighterCream,
          borderRight: `1px solid ${SACRED.gold}66`,
          boxShadow: "inset -12px 0 24px -18px rgba(108,81,63,0.5)",
        }}
        initial={false}
        animate={revealing ? { x: "-104%", rotate: -1.5 } : { x: "0%", rotate: 0 }}
        transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          backgroundColor: SACRED.lighterCream,
          borderLeft: `1px solid ${SACRED.gold}66`,
          boxShadow: "inset 12px 0 24px -18px rgba(108,81,63,0.5)",
        }}
        initial={false}
        animate={revealing ? { x: "104%", rotate: 1.5 } : { x: "0%", rotate: 0 }}
        transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Warm beam of light sweeping down the centre seam */}
      {revealing && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 z-30 w-[18%]"
          style={{
            x: "-50%",
            transformOrigin: "top center",
            background:
              "linear-gradient(180deg, rgba(255,248,225,0) 0%, rgba(255,231,192,0.95) 35%, rgba(255,249,235,0.85) 65%, rgba(255,248,225,0) 100%)",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Back content — medallion + tap hint. Fades as the gates part. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 py-6 text-center"
        initial={false}
        animate={revealing ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="sacred-cinzel text-[2.6cqw] uppercase"
          style={{ color: SACRED.bronze, letterSpacing: "0.3em" }}
        >
          With love
        </p>

        {/* Burgundy garden medallion — gold ring + live initials */}
        <div
          className="mt-[4cqw] flex items-center justify-center"
          style={{
            width: "26cqw",
            height: "26cqw",
            borderRadius: "46% 54% 52% 48% / 52% 48% 54% 46%",
            background:
              "radial-gradient(circle at 50% 42%, #7A2836 0%, #6A1F2C 55%, #5A0F1B 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.3), inset 0 -4px 10px rgba(40,5,10,0.5), 0 10px 22px -6px rgba(90,15,27,0.45)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border"
            style={{ width: "21cqw", height: "21cqw", borderColor: "rgba(232,213,160,0.5)" }}
          >
            <span className="sacred-script text-[8cqw] leading-none" style={{ color: "#E8D5A0" }}>
              {initials(site)}
            </span>
          </div>
        </div>

        <Divider className="mt-[4cqw] h-4 w-24" style={{ color: SACRED.gold }} />

        <p
          className="sacred-cinzel mt-[3.5cqw] text-[2.6cqw] uppercase"
          style={{ color: SACRED.brown, letterSpacing: "0.28em" }}
        >
          Tap to reveal
        </p>
      </motion.div>
    </div>
  );
}

/** Drifting golden light motes behind the card (ambient, skipped
 * under reduced motion). Transform + opacity only. */
function GardenAmbience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-8 top-12 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(166,125,43,0.35) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: [0.4, 0, 0.6, 1] }}
      />
      <motion.div
        className="absolute -right-8 bottom-14 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(146,153,135,0.35) 0%, transparent 70%)" }}
        animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: [0.4, 0, 0.6, 1] }}
      />
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            background: "radial-gradient(circle, #FFE9A8 0%, #A67D2B 100%)",
            boxShadow: "0 0 8px rgba(255,220,140,0.8)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -420, opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.8, 1] }}
        />
      ))}
    </div>
  );
}

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
      style={{ backgroundColor: SACRED.cream, color: SACRED.brown }}
      initial={false}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: 0.5, delay: revealing ? 1.1 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {!instant && <GardenAmbience />}

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sacred-cinzel relative z-10 text-center text-[11px] uppercase"
        style={{ color: SACRED.gold, letterSpacing: "0.32em" }}
      >
        You are cordially invited
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <button
          ref={buttonRef}
          type="button"
          onTouchStart={onPrimeAudio}
          onClick={open}
          disabled={phase !== "closed"}
          aria-label={`Reveal the wedding invitation of ${names} — tap to reveal`}
          className="group relative block w-full cursor-pointer bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-8"
          style={{ outlineColor: SACRED.gold } as React.CSSProperties}
        >
          {/* The card — front underneath, gates on top until revealed.
              Sized in cqw so the card scales cleanly at 390px/320px. */}
          <span
            className="relative mx-auto block w-[min(400px,86vw)]"
            style={{ aspectRatio: "3 / 4", containerType: "inline-size" } as React.CSSProperties}
          >
            {/* Warm glow behind the card */}
            <span
              aria-hidden="true"
              className="absolute -inset-4 rounded-[1rem] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,231,192,0.55) 0%, rgba(166,125,43,0.25) 55%, transparent 75%)",
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
            className="sacred-cinzel mt-5 block text-[11px] uppercase"
            style={{ color: SACRED.bronze, letterSpacing: "0.28em" }}
            animate={revealing ? { opacity: 0 } : { opacity: [0.55, 1, 0.55] }}
            transition={
              revealing
                ? { duration: 0.3 }
                : { duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
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
        style={{ outlineColor: SACRED.gold } as React.CSSProperties}
      >
        Skip intro
      </button>
    </motion.div>
  );
}
