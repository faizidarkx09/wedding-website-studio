// Dolce Vita decorative graphics — hand-crafted inline SVG linework
// (ÉTERNEL / Sacred Garden Decor.tsx pattern). The standalone's two
// watercolor ornaments (ornament-floral.png, 1.27 MB, and
// ornament-corner.png, 725 KB) are rebuilt here as lightweight vector
// approximations — a blush-rose spray with eucalyptus and olive
// branches, and an L-shaped ivy-and-blossom corner vine — so the
// template never ships the heavy PNGs. Same placement and sizes as
// the standalone (letter ornament 260px, small corner 120px, dress
// ornament 280px, closing ornament 120px). All components are
// aria-hidden and use currentColor, so the caller controls the tone.
"use client";

import type { CSSProperties } from "react";

type SvgProps = {
  className?: string;
  style?: CSSProperties;
};

/** Gold heart wax seal — the standalone's seal SVG, verbatim
 * (radial gold gradient + heart). Used on the envelope intro. */
export function GoldHeartSeal({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className} style={style}>
      <defs>
        <radialGradient id="dolceSealGold" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f5ede0" />
          <stop offset="35%" stopColor="#e8d8a8" />
          <stop offset="70%" stopColor="#d4c090" />
          <stop offset="100%" stopColor="#b89050" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#dolceSealGold)" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#a87f3d" strokeWidth="1.5" opacity="0.55" />
      <path
        d="M50 72 C38 60 30 51 30 42 C30 34 36 29 42 29 C46 29 49 31 50 34 C51 31 54 29 58 29 C64 29 70 34 70 42 C70 51 62 60 50 72 Z"
        fill="#8a6a2f"
        opacity="0.85"
      />
    </svg>
  );
}

/** Wide blush-rose floral spray — the standalone's ornament-floral
 * (roses centre, eucalyptus rounds, olive sprigs fanning out), drawn
 * as fine linework in blush / sage / dusty blue. */
export function FloralSpray({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 200" fill="none" className={className} style={style}>
      <g stroke="#8A9B7E" strokeWidth="1" strokeLinecap="round">
        {/* Main stem, left and right sweeps. */}
        <path d="M300 118 C 220 96, 140 84, 40 96" />
        <path d="M300 118 C 380 96, 460 84, 560 96" />
        <path d="M300 118 C 260 150, 220 168, 170 176" />
        <path d="M300 118 C 340 150, 380 168, 430 176" />
        {/* Olive sprigs. */}
        <path d="M120 92 C 108 78, 104 62, 108 48" />
        <path d="M480 92 C 492 78, 496 62, 492 48" />
        <path d="M180 104 C 168 118, 160 132, 158 148" />
        <path d="M420 104 C 432 118, 440 132, 442 148" />
      </g>
      {/* Olive leaves. */}
      <g fill="#A8B8A0" opacity="0.85">
        <path d="M108 48 C 100 58, 100 68, 108 76 C 116 68, 116 58, 108 48 Z" />
        <path d="M492 48 C 484 58, 484 68, 492 76 C 500 68, 500 58, 492 48 Z" />
        <path d="M158 148 C 150 156, 150 166, 158 172 C 166 164, 166 154, 158 148 Z" />
        <path d="M442 148 C 434 156, 434 166, 442 172 C 450 164, 450 154, 442 148 Z" />
      </g>
      {/* Eucalyptus rounds. */}
      <g fill="#9DB29A" opacity="0.7">
        <circle cx="210" cy="86" r="9" />
        <circle cx="238" cy="76" r="7" />
        <circle cx="390" cy="86" r="9" />
        <circle cx="362" cy="76" r="7" />
        <circle cx="180" cy="140" r="8" />
        <circle cx="420" cy="140" r="8" />
      </g>
      {/* Blush roses — layered petal arcs. */}
      <g stroke="#D9A5A0" strokeWidth="1.2" fill="#F6DAD6">
        <path d="M300 62 C 318 62, 330 76, 330 92 C 330 108, 316 118, 300 118 C 284 118, 270 108, 270 92 C 270 76, 282 62, 300 62 Z" />
        <path d="M300 76 C 310 76, 316 84, 316 92 C 316 100, 308 106, 300 106 C 292 106, 284 100, 284 92 C 284 84, 290 76, 300 76 Z" />
        <path d="M246 96 C 258 96, 266 104, 266 114 C 266 124, 258 130, 246 130 C 234 130, 226 124, 226 114 C 226 104, 234 96, 246 96 Z" />
        <path d="M354 96 C 366 96, 374 104, 374 114 C 374 124, 366 130, 354 130 C 342 130, 334 124, 334 114 C 334 104, 342 96, 354 96 Z" />
      </g>
      {/* Rose buds. */}
      <g fill="#F2CAC9" stroke="#D9A5A0" strokeWidth="1">
        <path d="M96 92 C 90 82, 92 72, 100 68 C 106 74, 106 84, 100 92 Z" />
        <path d="M504 92 C 498 82, 500 72, 508 68 C 514 74, 514 84, 508 92 Z" />
        <path d="M300 138 C 294 130, 296 122, 302 118 C 308 124, 308 132, 302 138 Z" />
      </g>
      {/* Berries / dots. */}
      <g fill="#7A9AAA">
        <circle cx="150" cy="120" r="1.8" />
        <circle cx="162" cy="128" r="1.8" />
        <circle cx="450" cy="120" r="1.8" />
        <circle cx="438" cy="128" r="1.8" />
      </g>
    </svg>
  );
}

/** Ivy-and-blossom corner vine — the standalone's ornament-corner
 * (L-shaped: ivy leaves and white blossoms climbing the left edge
 * and sweeping across the bottom), drawn as fine linework. */
export function IvyCorner({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className} style={style}>
      <g stroke="#8A9B7E" strokeWidth="1" strokeLinecap="round">
        <path d="M28 196 C 28 130, 34 70, 44 12" />
        <path d="M28 196 C 80 188, 140 178, 192 160" />
        <path d="M36 150 C 48 142, 56 132, 58 120" />
        <path d="M40 96 C 52 90, 60 80, 62 68" />
        <path d="M90 188 C 96 178, 104 170, 114 166" />
        <path d="M140 178 C 146 170, 154 164, 162 162" />
      </g>
      {/* Ivy leaves. */}
      <g fill="#8FA383" opacity="0.9">
        <path d="M44 60 C 36 52, 36 42, 44 36 C 52 42, 52 52, 44 60 Z" />
        <path d="M40 120 C 32 112, 32 102, 40 96 C 48 102, 48 112, 40 120 Z" />
        <path d="M34 176 C 26 168, 26 158, 34 152 C 42 158, 42 168, 34 176 Z" />
        <path d="M120 190 C 114 182, 114 174, 120 168 C 128 174, 128 182, 120 190 Z" />
        <path d="M168 168 C 162 160, 162 152, 168 146 C 176 152, 176 160, 168 168 Z" />
      </g>
      {/* White five-petal blossoms. */}
      <g fill="#FFFFFF" stroke="#B9C4B2" strokeWidth="0.8">
        <path d="M52 26 C 56 18, 64 18, 66 26 C 62 32, 56 32, 52 26 Z" />
        <path d="M52 84 C 56 76, 64 76, 66 84 C 62 90, 56 90, 52 84 Z" />
        <path d="M48 148 C 52 140, 60 140, 62 148 C 58 154, 52 154, 48 148 Z" />
        <path d="M100 172 C 104 164, 112 164, 114 172 C 110 178, 104 178, 100 172 Z" />
      </g>
      {/* Pale blue sprigs. */}
      <g stroke="#9BC9E1" strokeWidth="1" strokeLinecap="round">
        <path d="M30 100 L 18 92 M30 100 L 20 106" />
        <path d="M80 186 L 70 178 M80 186 L 72 192" />
      </g>
      <g fill="#9BC9E1">
        <circle cx="18" cy="92" r="2" />
        <circle cx="70" cy="178" r="2" />
      </g>
    </svg>
  );
}

/** Ornamental divider — thin rules with a centre diamond (section
 * headings), in the Dolce dusty-blue tone. */
export function Divider({ className, style }: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 16" className={className} style={style}>
      <path d="M8 8 H88 M132 8 H212" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="104" y="2" width="12" height="12" transform="rotate(45 110 8)" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
