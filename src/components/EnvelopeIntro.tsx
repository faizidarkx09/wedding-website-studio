"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { WeddingSite } from "@/lib/types";

type Phase = "closed" | "revealing" | "gone";
type RevealKind = "sweep" | "rise" | "scale" | "veil" | "tilt" | "dissolve";

/**
 * Card reveal — the first screen of every original-template wedding
 * website. There is NO envelope here: at rest you see the invitation
 * card's BACK (a blurred, gently animated panel in the template's
 * palette, with the couple monogram and a "Tap to reveal" hint).
 * Tapping the card plays the template's own reveal concept, then the
 * overlay unmounts and the site is revealed. Each of the six original
 * compositions has a different, simple reveal:
 *  champagne — golden light sweep · blue — tide rise (slides up) ·
 *  midnight — ember scale-in · sage — veil lifts off the card ·
 *  mediterranean — sun settle (slight rotate into place) ·
 *  lavender — mist dissolve.
 * It shows once per page load (no localStorage); a fresh load shows
 * it again. Reduced motion: instant reveal, no ambient animation.
 *
 * Accessibility contract (kept from the old intro): the overlay is a
 * modal dialog, focus is trapped inside it, Escape / Skip dismisses
 * it instantly, body scroll is locked while it covers the page, and
 * the site behind it is inert until it is gone.
 *
 * It lives inside SiteRenderer, which the /w/[slug] page only renders
 * AFTER the guest-password gate has been passed, so a protected site
 * asks for its password first and shows the card after unlock. The
 * editor live preview never renders it (envelope=false there).
 */

/** One distinct reveal concept per original composition. */
const REVEAL_BY_COMPOSITION: Record<string, RevealKind> = {
  champagne: "sweep",
  blue: "rise",
  midnight: "scale",
  sage: "veil",
  mediterranean: "tilt",
  lavender: "dissolve",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Front face motion per concept. "closed" is the resting state
 * (hidden under the back, except the veil front which sits visible
 * beneath the lifting veil). */
const FRONT_VARIANTS: Record<RevealKind, Variants> = {
  sweep: {
    closed: { opacity: 0 },
    revealing: { opacity: 1, transition: { duration: 0.55, delay: 0.15, ease: EASE } },
  },
  rise: {
    closed: { opacity: 0, y: 22 },
    revealing: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  },
  scale: {
    closed: { opacity: 0, scale: 0.94 },
    revealing: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  },
  veil: {
    closed: { opacity: 1 },
    revealing: { opacity: 1 },
  },
  tilt: {
    closed: { opacity: 0, rotate: -3, y: 10 },
    revealing: { opacity: 1, rotate: 0, y: 0, transition: { duration: 0.75, ease: EASE } },
  },
  dissolve: {
    closed: { opacity: 0, filter: "blur(8px)" },
    revealing: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  },
};

/** Back face motion per concept. */
const BACK_VARIANTS: Record<RevealKind, Variants> = {
  sweep: {
    closed: { opacity: 1 },
    revealing: { opacity: 0, transition: { duration: 0.45, delay: 0.25, ease: EASE } },
  },
  rise: {
    closed: { opacity: 1, y: 0 },
    revealing: { opacity: 0, y: -14, transition: { duration: 0.5, ease: EASE } },
  },
  scale: {
    closed: { opacity: 1, scale: 1 },
    revealing: { opacity: 0, scale: 1.05, transition: { duration: 0.5, ease: EASE } },
  },
  veil: {
    closed: { y: "0%" },
    revealing: { y: "-102%", transition: { duration: 0.8, ease: EASE } },
  },
  tilt: {
    closed: { opacity: 1, rotate: 0 },
    revealing: { opacity: 0, rotate: 2, transition: { duration: 0.5, ease: EASE } },
  },
  dissolve: {
    closed: { opacity: 1, filter: "blur(0px)" },
    revealing: { opacity: 0, filter: "blur(6px)", transition: { duration: 0.7, ease: EASE } },
  },
};

/** "#RRGGBB" + alpha -> "rgba(r, g, b, alpha)". Falls back to the
 * raw hex when it cannot be parsed. */
function hexA(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  if (m.length !== 6) return hex;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatShortDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return "";
  }
}

export default function EnvelopeIntro({
  site,
  /** Land keyboard focus on the card on mount — only when the card
   * is the page's primary content. Template-preview pages pass
   * false: the preview page has its own chrome above the card and
   * stealing focus there strands keyboard users. */
  autoFocus = true,
}: {
  site: WeddingSite;
  autoFocus?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const buttonRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const tpl = site.templateSnapshot;
  const comp = tpl.composition || "classic";
  const kind: RevealKind = REVEAL_BY_COMPOSITION[comp] ?? "dissolve";
  const revealing = phase === "revealing";
  const names = `${site.content.partnerA} & ${site.content.partnerB}`;
  const dateLine = formatShortDate(site.weddingDate, site.timezone);
  const venueName = (site.content.venueName ?? "").trim();
  const initials =
    `${site.content.partnerA.trim().charAt(0)}${site.content.partnerB.trim().charAt(0)}`.toUpperCase() ||
    "W";

  // Land keyboard focus on the card so it can be revealed with
  // Enter/Space without hunting for it — unless the caller opted out
  // (template previews), where focus stays with the page.
  useEffect(() => {
    if (autoFocus) buttonRef.current?.focus();
  }, [autoFocus]);

  // While the intro covers the page, the site behind it is inert:
  // keyboard / screen-reader users cannot tab into content they cannot
  // see. Restored when the intro is dismissed or unmounts.
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

  /** Keep Tab inside the overlay while it is open (it holds two focusable elements). */
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

  function reveal() {
    if (phase !== "closed") return;
    if (instant) {
      setPhase("gone");
      return;
    }
    setPhase("revealing");
    timerRef.current = window.setTimeout(() => setPhase("gone"), 900);
  }

  if (phase === "gone") return null;

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitation for ${names}`}
      onKeyDown={trapTab}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 p-5"
      style={{ backgroundColor: tpl.palette.bg, color: tpl.palette.ink }}
      initial={{ opacity: 1 }}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: 0.3, delay: revealing ? 0.6 : 0 }}
    >
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        aria-label={`Reveal the invitation of ${names} — tap to reveal`}
        onClick={reveal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            reveal();
          }
        }}
        className="relative w-[min(88vw,26rem)] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ outlineColor: tpl.palette.accent }}
      >
        {/* The card — front in flow of the box, back absolute on top.
            The box is portrait 4/5; at 390px it is ~343px wide (~429px
            tall) and at 320px ~282px wide (~352px tall), so it fits
            with room to spare. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[0.75rem] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          {/* FRONT — the invitation (existing content, unchanged):
              eyebrow, couple names in the theme font, date, venue. */}
          <motion.div
            variants={FRONT_VARIANTS[kind]}
            initial="closed"
            animate={revealing ? "revealing" : "closed"}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFFDF8] px-6 py-8 text-center text-[#302820]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 rounded-[0.5rem] border"
              style={{ borderColor: hexA(tpl.palette.accent, 0.6) }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[13px] rounded-[0.4rem] border"
              style={{ borderColor: hexA(tpl.palette.accent, 0.35) }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <p
                className="text-[9px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: tpl.palette.accent }}
              >
                You&apos;re invited
              </p>
              <h2 className={`${tpl.fontClass} mt-4 text-[2rem] leading-tight sm:text-[2.4rem]`}>
                {site.content.partnerA}
              </h2>
              <span
                className="my-1 text-lg italic"
                style={{ color: tpl.palette.accent }}
              >
                &amp;
              </span>
              <h2 className={`${tpl.fontClass} text-[2rem] leading-tight sm:text-[2.4rem]`}>
                {site.content.partnerB}
              </h2>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-16"
                style={{ backgroundColor: tpl.palette.accent }}
              />
              {dateLine ? (
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em]">
                  {dateLine}
                </p>
              ) : null}
              {venueName ? (
                <p className="mt-1 text-[9px] uppercase tracking-[0.22em] opacity-75">
                  {venueName}
                </p>
              ) : null}
            </div>
          </motion.div>

          {/* BACK — blurred / animated panel in the template palette:
              drifting blurred glow, soft wash, monogram medallion,
              tap hint. Same footprint as the front. */}
          <motion.div
            variants={BACK_VARIANTS[kind]}
            initial="closed"
            animate={revealing ? "revealing" : "closed"}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden px-6 py-8 text-center"
            style={{
              backgroundColor: tpl.palette.accentSoft,
              backgroundImage: `repeating-linear-gradient(45deg, ${hexA(tpl.palette.accent, 0.1)} 0 1px, transparent 1px 14px)`,
              color: tpl.palette.ink,
            }}
          >
            {/* Slow-drifting blurred glow — the back's ambient life.
                Skipped under reduced motion. */}
            {!instant && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-8 top-6 h-36 w-36 rounded-full blur-3xl"
                  style={{ backgroundColor: tpl.palette.accent, opacity: 0.45 }}
                  animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 bottom-8 h-40 w-40 rounded-full blur-3xl"
                  style={{ backgroundColor: "#FFFFFF", opacity: 0.35 }}
                  animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
                  transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                />
              </>
            )}

            {/* Soft blurred wash behind the medallion */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: hexA(tpl.palette.accent, 0.35) }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 rounded-[0.5rem] border"
              style={{ borderColor: hexA(tpl.palette.accent, 0.6) }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[13px] rounded-[0.4rem] border"
              style={{ borderColor: hexA(tpl.palette.accent, 0.35) }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] opacity-80">
                With love
              </p>
              {/* Monogram medallion — a flat ring, not a wax seal */}
              <div
                aria-hidden="true"
                className="mt-5 flex h-20 w-20 items-center justify-center rounded-full border-2 bg-[#FFFDF8]/70"
                style={{ borderColor: tpl.palette.accent }}
              >
                <span
                  className={`${tpl.fontClass} text-[1.6rem] leading-none`}
                  style={{ color: tpl.palette.accent }}
                >
                  {initials}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="mt-5 block h-px w-16"
                style={{ backgroundColor: tpl.palette.accent }}
              />
              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.3em] opacity-80">
                Tap to reveal
              </p>
            </div>
          </motion.div>

          {/* Champagne only: a golden light band sweeps across the
              card as the back fades. */}
          {kind === "sweep" && revealing && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
              initial={{ x: "-130%" }}
              animate={{ x: "330%" }}
              transition={{ duration: 0.75, ease: "linear" }}
            >
              <div
                className="h-full w-full"
                style={{
                  transform: "skewX(-12deg)",
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,236,190,0.7) 50%, transparent 100%)",
                }}
              />
            </motion.div>
          )}
        </div>

        <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.26em] opacity-80">
          Tap card to reveal
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="text-xs font-medium underline underline-offset-4 opacity-70 transition hover:opacity-100"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
