// BLOSSOM & OUD decorative graphics — hand-crafted inline SVG linework.
// The image tool cannot output transparency, so every decoration here is
// vector: ivory / blush / rose / oud / antique-gold tones, thin strokes,
// no heavy shadows, low contrast so photography and text stay dominant.
// All components are aria-hidden by default and use currentColor, so the
// caller controls the tone with a text colour class.
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

/** Orange blossom sprig — the template's signature decoration: a curved
 * stem with five-petal blossoms and small round oranges. */
export function BlossomSprig({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 130" fill="none" className={className} style={style}>
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 122 C 34 92, 50 60, 78 28" />
        <path d="M38 98 C 30 92, 28 82, 34 74 C 42 80, 44 90, 38 98 Z" />
        <path d="M56 72 C 48 66, 48 56, 54 50 C 60 56, 62 64, 56 72 Z" />
        <path d="M70 46 C 64 40, 64 32, 70 26 C 76 32, 76 40, 70 46 Z" />
        {/* Five-petal blossom, top right */}
        <path d="M88 22 C 90 15, 92 12, 95 10 C 97 13, 97 17, 95 20 C 99 19, 103 20, 105 23 C 102 26, 98 26, 95 24 C 95 28, 93 31, 90 31 C 88 28, 88 25, 90 22 C 87 24, 84 23, 83 20 C 85 17, 88 16, 90 19" />
        <circle cx="94" cy="20" r="1.6" fill="currentColor" stroke="none" />
        {/* Small blossom, mid stem */}
        <path d="M48 88 C 50 83, 52 81, 54 80 C 56 83, 56 86, 54 88 C 57 87, 60 88, 61 90 C 59 92, 56 92, 54 91 C 54 94, 52 96, 50 96 C 49 93, 49 91, 51 89" />
        <circle cx="54" cy="88" r="1.2" fill="currentColor" stroke="none" />
      </g>
      {/* Little oranges */}
      <circle cx="66" cy="58" r="4.5" fill="currentColor" opacity="0.55" stroke="none" />
      <circle cx="82" cy="40" r="3.5" fill="currentColor" opacity="0.55" stroke="none" />
    </svg>
  );
}

/** Delicate botanical branch — 4 variants (different silhouettes). */
export function BotanicalBranch({ variant = 0, className, style }: SvgProps & { variant?: number }) {
  const paths = [
    // Variant 0 — eucalyptus-like, leaves alternating along a stem.
    "M20 118 C 30 84, 44 52, 70 18 M34 96 C 26 88, 24 76, 30 68 C 38 74, 40 86, 34 96 Z M48 74 C 40 66, 40 54, 46 46 C 54 52, 56 64, 48 74 Z M62 50 C 54 42, 56 30, 62 24 C 68 30, 70 42, 62 50 Z M70 18 C 76 24, 78 32, 74 38",
    // Variant 1 — olive branch, long narrow leaves.
    "M14 116 C 40 90, 62 60, 78 20 M30 100 C 22 96, 16 86, 18 78 C 28 82, 34 90, 30 100 Z M46 82 C 38 76, 34 66, 38 58 C 46 64, 50 72, 46 82 Z M60 62 C 54 54, 52 44, 58 38 C 64 44, 66 54, 60 62 Z M74 40 C 68 32, 68 24, 74 18 C 80 24, 80 34, 74 40 Z",
    // Variant 2 — fern, fine paired leaflets.
    "M60 120 C 58 84, 60 48, 66 12 M58 100 L 40 88 M58 100 L 76 90 M59 78 L 42 66 M59 78 L 76 68 M60 56 L 46 44 M60 56 L 74 46 M62 36 L 50 26 M62 36 L 74 28",
    // Variant 3 — flowering stem, three small blossoms.
    "M24 118 C 34 88, 48 58, 74 26 M40 92 C 34 86, 34 76, 40 70 C 46 76, 46 86, 40 92 Z M56 66 C 50 60, 52 50, 58 46 C 62 52, 62 60, 56 66 Z M74 26 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M74 26 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 120 130" fill="none" className={className} style={style}>
      <path d={paths[variant % paths.length]} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Single small flower illustration — 2 variants. */
export function Flower({ variant = 0, className, style }: SvgProps & { variant?: number }) {
  if (variant === 1) {
    // Open five-petal blossom with a dotted centre.
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
  // Closed rosebud on a stem.
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <path d="M32 58 C 32 46, 32 38, 32 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M32 30 C 26 22, 26 14, 32 10 C 38 14, 38 22, 32 30 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M32 24 C 28 20, 28 15, 32 12" stroke="currentColor" strokeWidth="0.75" />
      <path d="M32 44 C 26 40, 24 34, 26 30 C 31 33, 33 38, 32 44 Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Floral corner decoration — top-left; flip it for bottom-right. */
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

/** Wax seal — irregular scalloped edge, initials or a heart in the middle.
 * Solid fill in currentColor (the caller passes the burgundy-oud tone);
 * no shiny gradient, per the design rules. */
export function WaxSeal({ children, className, style }: SvgProps & { children?: React.ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 80" className={className} style={style}>
      <path
        d="M40 4 C 46 2, 52 6, 55 4 C 60 2, 66 6, 68 11 C 73 12, 77 18, 75 23 C 79 28, 76 34, 78 39 C 80 45, 74 50, 74 55 C 74 61, 68 65, 64 68 C 61 73, 54 75, 49 73 C 44 78, 37 75, 33 76 C 27 77, 22 71, 17 69 C 11 68, 8 62, 9 56 C 4 52, 4 45, 8 41 C 3 36, 6 29, 9 25 C 6 19, 12 14, 17 13 C 20 7, 28 6, 33 8 C 36 3, 40 4, 40 4 Z"
        fill="currentColor"
      />
      <circle cx="40" cy="40" r="26" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
      <text
        x="40"
        y="47"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="17"
        fontWeight="600"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {children}
      </text>
    </svg>
  );
}

/** Ornamental divider — 4 variants: diamond, leaf, dots, blossom. */
export function Divider({ variant = 0, className, style }: SvgProps & { variant?: number }) {
  const common = { stroke: "currentColor", strokeWidth: 1, fill: "none" as const };
  return (
    <svg aria-hidden="true" viewBox="0 0 220 16" className={className} style={style}>
      <path d="M8 8 H88 M132 8 H212" {...common} />
      {variant === 0 && (
        <rect x="104" y="2" width="12" height="12" transform="rotate(45 110 8)" {...common} />
      )}
      {variant === 1 && (
        <path
          d="M110 8 C 104 2, 98 3, 99 8 C 103 10, 107 10, 110 8 Z M110 8 C 116 2, 122 3, 121 8 C 117 10, 113 10, 110 8 Z"
          {...common}
        />
      )}
      {variant === 2 && (
        <g fill="currentColor" stroke="none">
          <circle cx="102" cy="8" r="2" />
          <circle cx="110" cy="8" r="2.6" />
          <circle cx="118" cy="8" r="2" />
        </g>
      )}
      {variant === 3 && (
        <g {...common}>
          <path d="M110 2 C 112 5, 112 7, 110 8 C 108 7, 108 5, 110 2 Z" />
          <path d="M110 14 C 112 11, 112 9, 110 8 C 108 9, 108 11, 110 14 Z" />
          <path d="M104 8 C 107 6, 109 6, 110 8 C 109 10, 107 10, 104 8 Z" />
          <path d="M116 8 C 113 6, 111 6, 110 8 C 111 10, 113 10, 116 8 Z" />
        </g>
      )}
    </svg>
  );
}

/** Tiny decorative star cluster (four-point sparkles). */
export function StarCluster({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 72 24" fill="currentColor" className={className} style={style}>
      <path d="M12 2 L14 8 L20 10 L14 12 L12 18 L10 12 L4 10 L10 8 Z" />
      <path d="M36 6 L37.5 10.5 L42 12 L37.5 13.5 L36 18 L34.5 13.5 L30 12 L34.5 10.5 Z" />
      <path d="M60 2 L61.5 7 L66 8.5 L61.5 10 L60 15 L58.5 10 L54 8.5 L58.5 7 Z" />
    </svg>
  );
}

/** Simple envelope line illustration (footer / invitation card accent). */
export function EnvelopeArt({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 84" fill="none" className={className} style={style}>
      <rect x="6" y="14" width="108" height="62" rx="3" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 16 L60 52 L112 16" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M8 74 L48 40 M112 74 L72 40" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Vintage postage stamp — perforated edge (dashed), tiny flower centre. */
export function PostageStamp({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 72 88" fill="none" className={className} style={style}>
      <rect x="8" y="6" width="56" height="76" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="14" y="12" width="44" height="64" stroke="currentColor" strokeWidth="0.75" />
      <g stroke="currentColor" strokeWidth="1">
        <path d="M36 30 C 39 35, 39 38, 36 41 C 33 38, 33 35, 36 30 Z" />
        <path d="M36 54 C 39 49, 39 46, 36 43 C 33 46, 33 49, 36 54 Z" />
        <path d="M24 42 C 29 39, 32 39, 34 42 C 32 45, 29 45, 24 42 Z" />
        <path d="M48 42 C 43 39, 40 39, 38 42 C 40 45, 43 45, 48 42 Z" />
      </g>
      <circle cx="36" cy="42" r="2" fill="currentColor" />
    </svg>
  );
}
