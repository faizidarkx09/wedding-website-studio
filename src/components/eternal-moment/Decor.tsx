// Eternal Moment decorations — original fine-line SVG/CSS
// ornaments: thin gold rules, diamond markers, a double-ring
// monogram. No copied assets, no photographs here.
import { ETERNAL } from "./tokens";

/* ------------------------------------------------------------------ */
/* MonogramRing — the hero crest: a double gold ring with the live   */
/* initials in Cormorant, over the hero photo. `dark` = over-photo  */
/* (ivory/gold on transparent); light = on ivory paper.              */
/* ------------------------------------------------------------------ */

export function MonogramRing({
  initials,
  dark = false,
  className = "",
}: {
  initials: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24 ${className}`}
    >
      <span
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: dark ? "rgba(255,254,252,0.65)" : ETERNAL.gold }}
      />
      <span
        className="absolute inset-[7px] rounded-full border"
        style={{ borderColor: dark ? "rgba(182,154,112,0.9)" : `${ETERNAL.gold}99` }}
      />
      <span
        className="font-(--font-cormorant) text-xl font-medium tracking-[0.08em] sm:text-2xl"
        style={{ color: dark ? ETERNAL.paper : ETERNAL.espresso }}
      >
        {initials}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DiamondDivider — a thin gold hairline broken by a centre diamond, */
/* the section ornament (mirrors the source's rule-ornament).        */
/* ------------------------------------------------------------------ */

export function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 12"
      fill="none"
      className={`mx-auto h-3 w-56 sm:w-80 ${className}`}
    >
      <path d="M4 6 H 140 M 180 6 H 316" stroke={ETERNAL.gold} strokeWidth="1.2" />
      <path d="M160 2 L 166 6 L 160 10 L 154 6 Z" fill={ETERNAL.gold} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hairline — a single thin rule, optionally with a diamond at its   */
/* centre. For chapter separators and card footers.                   */
/* ------------------------------------------------------------------ */

export function Hairline({
  diamond = false,
  className = "",
}: {
  diamond?: boolean;
  className?: string;
}) {
  if (!diamond) {
    return (
      <span
        aria-hidden="true"
        className={`block h-px w-16 ${className}`}
        style={{ backgroundColor: ETERNAL.gold }}
      />
    );
  }
  return (
    <span aria-hidden="true" className={`flex items-center gap-2 ${className}`}>
      <span className="h-px w-10" style={{ backgroundColor: ETERNAL.gold }} />
      <span
        className="block h-2 w-2 rotate-45"
        style={{ backgroundColor: ETERNAL.gold }}
      />
      <span className="h-px w-10" style={{ backgroundColor: ETERNAL.gold }} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* EditorialFrame — the thin double border that floats inside the   */
/* hero photo (source's "thin editorial frame").                     */
/* ------------------------------------------------------------------ */

export function EditorialFrame({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-3 border sm:inset-4 ${className}`}
      style={{ borderColor: "rgba(255,254,252,0.25)" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[5px] border"
        style={{ borderColor: "rgba(255,254,252,0.12)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ChapterNumeral — a large ghost numeral for the story chapters    */
/* ("01" in Cormorant at low opacity, editorial style).              */
/* ------------------------------------------------------------------ */

export function ChapterNumeral({
  number,
  className = "",
}: {
  number: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`font-(--font-cormorant) leading-none font-medium select-none ${className}`}
      style={{ color: `${ETERNAL.gold}33` }}
    >
      {number}
    </span>
  );
}
