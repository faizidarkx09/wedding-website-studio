// Dolce Vita opening envelope — a 1:1 port of the standalone's
// envelope intro (styles.css .envelope + script.js §1): cream
// background with soft radial washes, four CSS flaps (top/right/
// bottom/left clip-path polygons), the gold heart wax seal and
// "Click to open" in dusty blue. Tap the seal (or the envelope)
// flies the flaps out, scales + fades the seal, and starts the music
// via the renderer's shared audio element; "Skip intro" reveals the
// page without autoplay.
//
// DEVIATION from the standalone (kept from the Studio brief): the
// standalone shows the envelope + music on mobile only (<981px);
// the Studio version is a fixed overlay on ALL viewports, like
// ÉTERNEL / Sacred Garden / Blossom & Oud — a template preview on
// desktop would otherwise skip its own opening. The look, copy and
// animation are otherwise unchanged. Mirrors the Studio envelope
// accessibility contract (focus trap, inert siblings, Escape, scroll
// lock, reduced motion → instant reveal).
"use client";

import { useEffect, useRef, useState } from "react";
import type { WeddingSite } from "@/lib/types";
import { DOLCE, coupleNames } from "./tokens";
import { GoldHeartSeal } from "./Decor";

type Phase = "closed" | "opening" | "gone";

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
    // Standalone script.js hides the envelope 2300ms after opening.
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
      className={`dolce-envelope${opening ? " open" : ""}`}
    >
      <div aria-hidden="true" className="dolce-env-flap dolce-env-flap-top" />
      <div aria-hidden="true" className="dolce-env-flap dolce-env-flap-right" />
      <div aria-hidden="true" className="dolce-env-flap dolce-env-flap-bottom" />
      <div aria-hidden="true" className="dolce-env-flap dolce-env-flap-left" />
      <button
        ref={buttonRef}
        type="button"
        onTouchStart={onPrimeAudio}
        onClick={(e) => {
          e.stopPropagation();
          open(true);
        }}
        disabled={phase !== "closed"}
        aria-label={`Open the invitation of ${names} — click to open`}
        className="dolce-env-seal"
      >
        <GoldHeartSeal />
      </button>
      <p className="dolce-env-text" style={{ color: DOLCE.blueDeep }}>
        Click to open
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss(false);
        }}
        className="dolce-env-skip"
        style={{ color: DOLCE.blueMist }}
      >
        Skip intro
      </button>
    </div>
  );
}
