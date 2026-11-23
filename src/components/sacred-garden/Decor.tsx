// The Sacred Garden decorative graphics — hand-crafted inline SVG
// linework (ÉTERNEL Decor.tsx pattern). The source site's torn-paper
// divider has Bismillah calligraphy baked into the image — that is
// NEVER reproduced here: the divider is rebuilt as plain SVG/CSS
// (torn edge + floral sprigs, no text, no calligraphy). All components
// are aria-hidden by default and use currentColor, so the caller
// controls the tone with a text colour class.
"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SvgProps = {
  className?: string;
  style?: CSSProperties;
};

/** Subtle floral drift — a slow, gentle sway for decorative florals.
 * Barely-there by design; disabled entirely under
 * prefers-reduced-motion. */
export function FloralDrift({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;
  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: [0, -4, 0], rotate: [0, 0.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** Single rose — closed bud on a stem (the timeline marker icon,
 * audit §4: a 55×50 rose sits on the schedule timeline). */
export function Rose({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <path d="M32 58 C 32 46, 32 38, 32 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M32 30 C 26 22, 26 14, 32 10 C 38 14, 38 22, 32 30 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M32 24 C 28 20, 28 15, 32 12" stroke="currentColor" strokeWidth="0.75" />
      <path d="M32 44 C 26 40, 24 34, 26 30 C 31 33, 33 38, 32 44 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M32 44 C 38 40, 40 34, 38 30 C 33 33, 31 38, 32 44 Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Open five-petal blossom with a dotted centre. */
export function Flower({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <g stroke="currentColor" strokeWidth="1">
        <path d="M32 14 C 36 22, 36 26, 32 30 C 28 26, 28 22, 32 14 Z" />
        <path d="M32 50 C 36 42, 36 38, 32 34 C 28 38, 28 42, 32 50 Z" />
        <path d="M14 32 C 22 28, 26 28, 30 32 C 26 36, 22 36, 14 32 Z" />
        <path d="M50 32 C 42 28, 38 28, 34 32 C 38 36, 42 36, 50 32 Z" />
        <path d="M19 19 C 26 22, 28 25, 29 29 C 24 29, 21 26, 19 19 Z" />
        <path d="M45 45 C 38 42, 36 39, 35 35 C 40 35, 43 38, 45 45 Z" />
      </g>
      <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Floral corner — climbing-rose sprig, top-left; flip it for
 * bottom-right. Mirrors the embossed sprigs on the envelope artwork. */
export function FloralCorner({ flip = false, className, style }: SvgProps & { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ transform: flip ? "rotate(180deg)" : undefined, ...style }}
    >
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M8 190 C 8 110, 40 40, 120 14 C 150 6, 178 6, 192 10" />
        <path d="M8 190 C 60 170, 120 140, 170 80" />
        <path d="M30 168 C 22 158, 22 146, 30 138 C 38 146, 38 158, 30 168 Z" />
        <path d="M58 142 C 48 134, 48 122, 56 114 C 64 122, 64 134, 58 142 Z" />
        <path d="M92 112 C 84 102, 86 90, 94 84 C 100 92, 100 104, 92 112 Z" />
        <path d="M126 78 C 120 68, 122 58, 130 52 C 136 60, 134 70, 126 78 Z" />
        <path d="M52 96 C 60 90, 66 82, 68 72" />
        <path d="M88 62 C 96 56, 100 48, 100 40" />
      </g>
      <circle cx="150" cy="34" r="3" fill="currentColor" />
      <circle cx="168" cy="52" r="2" fill="currentColor" />
    </svg>
  );
}

/** Burgundy wax seal — irregular scalloped edge, thin gold inner ring,
 * "RSVP" in gold serif capitals (the source's RSVP seal image, rebuilt
 * as vector). Used on the RSVP call-to-action, never as an overlay on
 * the envelope image (the seal there is baked into the artwork). */
export function WaxSeal({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={className} style={style}>
      <path
        d="M40 4 C 46 2, 52 6, 55 4 C 60 2, 66 6, 68 11 C 73 12, 77 18, 75 23 C 79 28, 76 34, 78 39 C 80 45, 74 50, 74 55 C 74 61, 68 65, 64 68 C 61 73, 54 75, 49 73 C 44 78, 37 75, 33 76 C 27 77, 22 71, 17 69 C 11 68, 8 62, 9 56 C 4 52, 4 45, 8 41 C 3 36, 6 29, 9 25 C 6 19, 12 14, 17 13 C 20 7, 28 6, 33 8 C 36 3, 40 4, 40 4 Z"
        fill="currentColor"
      />
      <circle cx="40" cy="40" r="26" fill="none" stroke="#D8BA72" strokeOpacity="0.7" strokeWidth="1" />
      <text
        x="40"
        y="45"
        textAnchor="middle"
        fill="#D8BA72"
        fontSize="12"
        fontWeight="600"
        letterSpacing="1"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        RSVP
      </text>
    </svg>
  );
}

/** Torn-paper divider — a jagged torn edge with a small floral sprig
 * at each end, rebuilt as SVG/CSS. Deliberately NO calligraphy and NO
 * baked-in image: the source's divider carries Bismillah calligraphy
 * in the artwork, which the Studio does not reproduce. */
export function TornPaperDivider({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 28" fill="none" className={className} style={style}>
      <path
        d="M0 14 L 14 10 L 26 16 L 40 9 L 54 15 L 68 11 L 82 16 L 96 10 L 110 15 L 124 11 L 138 16 L 152 10 L 166 15 L 180 11 L 194 16 L 208 10 L 222 15 L 236 11 L 250 16 L 264 10 L 278 15 L 292 11 L 306 16 L 320 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M20 20 C 16 16, 16 11, 20 8 C 24 11, 24 16, 20 20 Z M300 20 C 296 16, 296 11, 300 8 C 304 11, 304 16, 300 20 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="160" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Ornamental divider — thin rules with a centre diamond (section
 * headings). */
export function Divider({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 16" className={className} style={style}>
      <path d="M8 8 H88 M132 8 H212" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="104" y="2" width="12" height="12" transform="rotate(45 110 8)" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
