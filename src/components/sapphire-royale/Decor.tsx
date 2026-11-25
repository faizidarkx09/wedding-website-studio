// Sapphire Royale decorations — art-deco night chrome.
// NightSurface (navy velvet / ice), SparkleField (silver star
// sparkles), DecoDivider (silver geometric divider), DecoCorner
// (art-deco corner ornament). Font classes are the scoped
// .sapphire-royale variants from globals.css (never the bare
// source class names, which would collide with other templates).
import type { ReactNode } from "react";
import { COVER_IMAGE_URL, DECO_CORNER_URL, FAN_PATTERN_URL, ICE_TEXTURE_URL, SPARKLE_URL } from "./tokens";

interface NightSurfaceProps {
  variant: "navy" | "ice";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function NightSurface({ variant, className = "", children, id }: NightSurfaceProps) {
  const isNavy = variant === "navy";
  const bgUrl = isNavy ? COVER_IMAGE_URL : ICE_TEXTURE_URL;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isNavy ? "bg-[#0A1F44] text-[#F2F4F8]" : "bg-[#F2F4F8] text-[#12294D]"
      } ${className}`}
    >
      {/* Velvet / ice texture layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgUrl})`,
          opacity: isNavy ? 0.92 : 0.9,
        }}
      />

      {/* Subtle directional night lighting vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNavy
            ? "radial-gradient(ellipse 85% 75% at 50% 42%, rgba(18, 41, 77, 0.22) 0%, rgba(6, 18, 43, 0.5) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.35) 0%, rgba(192, 192, 200, 0.25) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/** Silver sparkle field — a scatter of four-pointed stars over navy.
 * Pure CSS/SVG (no image dependency for the twinkle itself). */
export function SparkleField({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SPARKLE_URL}
        alt=""
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover opacity-50"
      />
    </div>
  );
}

/** Silver geometric art-deco divider: stepped chevrons + diamond. */
export function DecoDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 24" fill="none" className={`mx-auto ${className}`}>
      <path d="M0 12 H88 M132 12 H220" stroke="#C0C0C8" strokeWidth="1" />
      <path d="M96 12 L110 2 L124 12 L110 22 Z" stroke="#C0C0C8" strokeWidth="1.25" fill="none" />
      <circle cx="110" cy="12" r="2.4" fill="#C0C0C8" />
      <path d="M84 6 L88 12 L84 18 M136 6 L132 12 L136 18" stroke="#D9D9DE" strokeWidth="1" />
    </svg>
  );
}

/** Art-deco corner ornament (silver fan + stepped lines). */
export function DecoCorner({
  position,
  className = "",
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const positionStyles: Record<typeof position, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 -scale-x-100",
    "bottom-left": "bottom-0 left-0 -scale-y-100",
    "bottom-right": "right-0 bottom-0 -scale-x-100 -scale-y-100",
  };
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 h-36 w-36 opacity-80 select-none sm:h-44 sm:w-44 ${positionStyles[position]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DECO_CORNER_URL}
        alt=""
        referrerPolicy="no-referrer"
        className="sr-mask-radial-soft h-full w-full object-cover"
      />
    </div>
  );
}

/** Fan-pattern band — subtle silver deco fans over navy, for panel
 * backgrounds. */
export function FanPatternBand({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 ${className}`}
      style={{ backgroundImage: `url(${FAN_PATTERN_URL})` }}
    />
  );
}
