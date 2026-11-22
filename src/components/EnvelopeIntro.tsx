"use client";

import { useEffect, useRef, useState } from "react";
import type { WeddingSite } from "@/lib/types";

type Phase = "closed" | "opening" | "gone";

/**
 * Envelope intro — the first screen of every wedding website.
 *
 * A full-screen overlay styled with the site's own theme (palette +
 * composition): a CSS/SVG envelope with the couple's names on the letter
 * inside. "Click to open" (or Enter/Space, or Escape / Skip) plays a
 * lightweight CSS animation — flap opens, letter slides out, overlay
 * fades — in ~900ms, then the overlay unmounts and the site is revealed.
 * It shows once per page load (no localStorage); a fresh load shows it
 * again. Reduced motion: instant reveal, no animation.
 *
 * It lives inside SiteRenderer, which the /w/[slug] page only renders
 * AFTER the guest-password gate has been passed, so a protected site
 * asks for its password first and shows the envelope after unlock.
 */

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

export default function EnvelopeIntro({ site }: { site: WeddingSite }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const tpl = site.templateSnapshot;
  const comp = tpl.composition || "classic";
  const names = `${site.content.partnerA} & ${site.content.partnerB}`;
  const dateLine = formatShortDate(site.weddingDate, site.timezone);
  const initials =
    `${site.content.partnerA.trim().charAt(0)}${site.content.partnerB.trim().charAt(0)}`.toUpperCase() ||
    "W";

  // Land keyboard focus on the envelope so it can be opened with
  // Enter/Space without hunting for it.
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

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

  function open() {
    if (phase !== "closed") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      return;
    }
    setPhase("opening");
    timerRef.current = window.setTimeout(() => setPhase("gone"), 950);
  }

  if (phase === "gone") return null;

  // Wax seal: burgundy + brass on Midnight, theme accent elsewhere.
  const sealBg = comp === "midnight" ? "#6E263B" : tpl.palette.accent;
  const sealBorder = comp === "midnight" ? "#B08B56" : "#FFFFFF";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Invitation for ${names}`}
      className={`envelope-overlay ${phase === "opening" ? "envelope-leaving" : ""}`}
      style={{ backgroundColor: tpl.palette.bg, color: tpl.palette.ink }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={open}
        disabled={phase !== "closed"}
        aria-label={`Open the invitation of ${names} — click to open`}
        className="envelope-button"
      >
        <span className={`envelope-scene ${phase === "opening" ? "envelope-open" : ""}`}>
          <span
            className="envelope"
            style={{ backgroundColor: tpl.palette.bg, borderColor: tpl.palette.accent }}
          >
            <span
              className="envelope-letter"
              aria-hidden="true"
              style={{ backgroundColor: "#FFFDF8", color: "#302820" }}
            >
              <span className="envelope-letter-eyebrow">You&apos;re invited</span>
              <span className={`envelope-letter-names ${tpl.fontClass}`}>{names}</span>
              {dateLine ? <span className="envelope-letter-date">{dateLine}</span> : null}
            </span>
            <span
              className="envelope-pocket"
              aria-hidden="true"
              style={{ backgroundColor: tpl.palette.accentSoft }}
            />
            <span
              className="envelope-flap"
              aria-hidden="true"
              style={{ backgroundColor: tpl.palette.accent }}
            />
            <span
              className="envelope-seal"
              aria-hidden="true"
              style={{ backgroundColor: sealBg, borderColor: sealBorder }}
            >
              {initials}
            </span>
          </span>
        </span>
        <span className="envelope-cta">Click to open</span>
      </button>
      <button type="button" onClick={dismiss} className="envelope-skip">
        Skip intro
      </button>
    </div>
  );
}
