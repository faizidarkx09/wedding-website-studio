"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteEvent, WeddingSite } from "@/lib/types";
import { getTemplate } from "@/lib/templates";

/**
 * InvitationCard — a portrait invitation card rendered from the site's
 * own data (couple names, main event, venue) in the template's palette,
 * laid over an AI-generated floral frame.
 *
 * Styling is INLINE ONLY (no Tailwind classes anywhere inside this
 * component): the card is exported to PNG with html-to-image, and
 * Tailwind v4 emits oklch() colours that html-to-image cannot parse.
 * Every colour here is a plain hex / rgba value.
 *
 * Fonts come from the app layout's next/font variables:
 *  - couple names: Great Vibes (--font-great-vibes), "Snell Roundhand", cursive
 *  - everything else: Cormorant Garamond (--font-cormorant), Georgia, serif
 * The card renders in the browser inside the editor, so document-loaded
 * fonts apply both on screen and in the html-to-image export.
 *
 * Decorative frame: one of three AI-generated floral JPGs in
 * public/images/invitation-frames/, shown full-bleed as a plain <img>
 * (same-origin, so html-to-image can embed it in the PNG export).
 * The frame is picked deterministically from the template palette's
 * accent hue — see pickFrameSrc below. The palette bg sits behind the
 * image as a fallback if it fails to load. No SVG florals are layered
 * on top of the AI frame: the frame already carries its own flowers
 * and gold border.
 *
 * Text colours come from the template palette, but the contrast guard
 * is evaluated against the frame's LIGHT centre (ivory, #FDFBF7) —
 * never against palette.bg: dark themes pair a dark bg with a dark
 * ink, and guarding against that dark bg would pick white text that
 * vanishes on the ivory frame.
 *
 * WIDTH-RESPONSIVE SIZING (D1 fix): the card is 5/7 portrait, so its
 * height is proportional to its width — but fixed px fonts made the
 * content stack taller than the card at narrow widths (318px card in
 * the 390px modal: header clipped, footer cut off). Every px size in
 * the stack is therefore multiplied by a scale factor s measured from
 * the card's own rendered width (ResizeObserver): s = min(1, w / 449),
 * where 449px is the desktop-modal card width the design was built
 * for. Ring diameter and paddings are %-based, so they already track
 * the width; the px sizes track it via s. Because the whole stack
 * scales linearly with w, a stack that fits at 449px fits at every
 * narrower width too. Sizes are baked into INLINE px styles (never
 * container-query units), so html-to-image's PNG export — which clones
 * the node with its inline styles — renders exactly what is on screen.
 *
 * Per-frame safe area + scrim (D4 fix): the blue/purple frames' dark
 * blooms intrude further into the centre than the white-gold frame's,
 * so blue/purple get wider side padding (22% vs 20%) and a stronger
 * soft ivory radial scrim behind the text (0.88 centre opacity vs
 * 0.55). The scrim is two layers: a wide radial ellipse over the
 * text column, plus a vertical band over the wide header/footer
 * lines (whose ends a radial alone cannot cover), both fading to
 * transparent at the card edges so the frame stays visible.
 *
 * Date row (D2 fix): weekday + time side spans are white-space:nowrap
 * with flexShrink: 0 (they previously shrank and wrapped), at a
 * smaller size (10px, 0.08em tracking) flanking a smaller day number
 * (54px), so "Wednesday" + "AT 10:30 AM" fit on one line at 318px.
 *
 * Names (D3 fix): the script-name font is auto-fit to the gold ring's
 * inner width: min(44 * s, innerWidth / (longestName * 0.60)). The
 * 0.60 em/char factor is sized for the WORST case — the fallback serif
 * (Great Vibes is narrower in production) — so an 11-char name fits
 * inside the ring even when the webfont fails to load.
 *
 * Image failure (D5 fix): onError hides the <img> SYNCHRONOUSLY via
 * style.display = "none" (a state-only hide can flash a broken-image
 * icon) and sets state, which removes the img from the tree and
 * switches the card background to the light ivory centre (#FDFBF7)
 * instead of palette.bg — so dark-bg templates stay readable.
 *
 * Graceful omission: empty / whitespace-only strings count as missing.
 * Missing partner names omit the names line entirely (never a
 * placeholder), missing venue address omits the address line, missing
 * time omits the time, and a missing event/date omits the date block.
 */

interface InvitationCardProps {
  site: WeddingSite;
}

const SCRIPT_FONT =
  'var(--font-great-vibes), "Great Vibes", "Snell Roundhand", cursive';
const SERIF_FONT =
  'var(--font-cormorant), "Cormorant Garamond", Georgia, "Times New Roman", serif';

/** The ivory centre all three AI frames share — text sits on this. */
const LIGHT_CENTRE = "#FDFBF7";

/** Gold used for the names ring and the date-row rules (matches the
 * gold borders baked into all three AI frames). */
const GOLD = "#B08D57";

const FRAME_BLUE = "/images/invitation-frames/frame-blue-hydrangea.jpg";
const FRAME_PURPLE = "/images/invitation-frames/frame-purple-lavender.jpg";
const FRAME_WHITE_GOLD = "/images/invitation-frames/frame-white-gold.jpg";

/** Card width the design is built for (desktop-modal width). The
 * scale factor is 1 at/above this width and shrinks linearly below. */
const DESIGN_WIDTH = 449;

/** Gold ring diameter as a fraction of the text-column width. */
const RING_FRACTION = 0.86;

/**
 * Worst-case script-name advance per character, in ems. Sized for the
 * fallback serif (e.g. DejaVu Serif: "Alexandrina" ≈ 6.05em for 11
 * chars ≈ 0.55 em/char); 0.60 leaves margin. Great Vibes is narrower,
 * so names sized by this bound always fit inside the ring.
 */
const NAME_CHAR_EM = 0.6;

function isBlank(value: string | null | undefined): value is null | undefined {
  return value === null || value === undefined || value.trim() === "";
}

function clean(value: string | null | undefined): string | null {
  if (isBlank(value)) return null;
  return (value as string).trim();
}

/** Parse a YYYY-MM-DD date as a local date (no timezone shift). */
function parseEventDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Event-name priority for the tie-break among same-day events. */
function eventPriority(name: string): number {
  const n = name.toLowerCase();
  if (n.includes("ceremony")) return 0;
  if (n.includes("reception")) return 1;
  if (n.includes("wedding")) return 2;
  return 3;
}

/**
 * Main event: the earliest event by date. Ties on the same earliest
 * date prefer a name containing "Ceremony", then "Reception", then
 * "Wedding", then alphabetical order. Events without a parseable date
 * are ignored. Returns null when there is no dated event.
 */
function pickMainEvent(events: SiteEvent[]): SiteEvent | null {
  const dated = events
    .map((e) => ({ event: e, date: parseEventDate(e.date ?? "") }))
    .filter((x): x is { event: SiteEvent; date: Date } => x.date !== null);
  if (dated.length === 0) return null;
  dated.sort(
    (a, b) =>
      a.date.getTime() - b.date.getTime() ||
      eventPriority(a.event.name ?? "") - eventPriority(b.event.name ?? "") ||
      (a.event.name ?? "").localeCompare(b.event.name ?? ""),
  );
  return dated[0].event;
}

/* --- contrast helpers --- */

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}

function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** First candidate with >= 4.5:1 contrast on bg, else the best of them. */
function readableInk(bg: string, candidates: string[]): string {
  let best = candidates[0];
  let bestRatio = -1;
  for (const c of candidates) {
    const r = contrastRatio(bg, c);
    if (r !== null && r >= 4.5) return c;
    if (r !== null && r > bestRatio) {
      bestRatio = r;
      best = c;
    }
  }
  return best;
}

/* --- frame selection ---
 * Deterministic, from the template palette's accent hue (0-360):
 *   blue hues   180 <= hue < 260  -> blue hydrangea frame
 *   purple/pink hues >= 260       -> purple lavender frame
 *     (260-360 wraps through violet, magenta and pink)
 *   everything else (gold/warm/green/neutral/achromatic), and any
 *   missing or unparseable accent -> white-gold frame.
 */

function accentHue(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return null; // achromatic (grey/white/black): no hue
  const d = max - min;
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return h;
}

function pickFrameSrc(accent: string | null | undefined): string {
  const hue = accent ? accentHue(accent) : null;
  if (hue === null) return FRAME_WHITE_GOLD;
  if (hue >= 180 && hue < 260) return FRAME_BLUE;
  if (hue >= 260) return FRAME_PURPLE;
  return FRAME_WHITE_GOLD;
}

export default function InvitationCard({ site }: InvitationCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardW, setCardW] = useState<number | null>(null);

  // Measure the card's rendered width so px sizes can track it (D1).
  // Re-measures on resize (modal width changes, orientation changes).
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setCardW(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const snapshotPalette = site.templateSnapshot?.palette;
  const template = getTemplate(site.templateId);
  const palette = snapshotPalette ?? template?.palette ?? {
    bg: "#FFFFFF",
    ink: "#1C1917",
    accent: "#292524",
    accentSoft: "#F5F5F4",
  };

  const bg = palette.bg || "#FFFFFF";
  // Ink that actually reads on the AI frame's light ivory centre —
  // NOT on palette.bg (dark-theme bgs would make the guard pick
  // white text that vanishes on the frame). Fall back to near-black
  // when the palette ink/accent are too light for the ivory centre.
  const ink = readableInk(LIGHT_CENTRE, [
    palette.ink,
    palette.accent,
    palette.accentSoft,
    "#1C1917",
  ]);
  const accent = palette.accent || ink;
  // Accent for large display text (day number, venue label): the
  // palette accent when it reads on the light centre, else the ink.
  const accentReadable = readableInk(LIGHT_CENTRE, [accent, ink]);
  // Muted text: ink at reduced opacity (reads on the light centre).
  const muted = { color: ink, opacity: 0.72 };

  const frameSrc = pickFrameSrc(palette.accent);
  const frameKind =
    frameSrc === FRAME_BLUE
      ? "blue"
      : frameSrc === FRAME_PURPLE
        ? "purple"
        : "white-gold";

  // --- width-responsive scale (D1) ---
  // Before the first measurement, assume the design width so the
  // first paint matches the desktop layout; the observer corrects it
  // immediately after mount (and html-to-image exports only run on
  // user action, long after layout has settled).
  const w = cardW !== null && cardW > 0 ? cardW : DESIGN_WIDTH;
  const s = Math.min(1, w / DESIGN_WIDTH);

  // Per-frame safe area (D4): blue/purple florals intrude further, so
  // they get wider side padding. Top/bottom padding is %-of-width, so
  // it already tracks the card width.
  const sidePadFrac = frameKind === "white-gold" ? 0.2 : 0.22;
  const contentW = w * (1 - 2 * sidePadFrac);
  // Soft ivory scrim behind the text (D4): strongest over the text
  // column, fading to transparent at the card edges so the frame
  // stays visible. Blue/purple need a stronger lift than white-gold.
  // Two layers: (1) a 55%/62% radial ellipse centred slightly low
  // (52%) covering the centre column — the ring, date row and venue
  // sit on near-ivory; (2) a vertical linear band for the WIDE
  // header/footer lines — a radial alone cannot cover them, because
  // their ENDS sit at ~0.89 of the ellipse radius (faded) while
  // their centres sit at ~0.67 (full strength), so the ends stayed
  // on dark blooms. The band holds ivory across the full width over
  // the header band (top 12%) and footer band (bottom 12%), fading
  // to transparent by 20%/80%, so the frame's middle sides and
  // corners stay visible. (A closest-side ellipse, then a 62%/62%
  // ellipse, both failed the header/footer ends on purple/blue.)
  const scrimOpacity = frameKind === "white-gold" ? 0.55 : 0.88;
  const scrimBand = frameKind === "white-gold" ? 0.35 : 0.7;
  const scrimMid = (scrimOpacity * 0.35).toFixed(2);
  const iv = (a: number | string) => `rgba(253,251,247,${a})`;
  const scrim =
    `linear-gradient(to bottom, ${iv(scrimBand)} 0%, ${iv(scrimBand)} 12%, ${iv(0)} 20%, ${iv(0)} 80%, ${iv(scrimBand)} 88%, ${iv(scrimBand)} 100%), ` +
    `radial-gradient(ellipse 55% 62% at 50% 52%, ${iv(scrimOpacity)} 0%, ${iv(scrimOpacity)} 68%, ${iv(scrimMid)} 82%, ${iv(0)} 95%)`;

  const partnerA = clean(site.content?.partnerA);
  const partnerB = clean(site.content?.partnerB);
  const hasNames = partnerA !== null || partnerB !== null;

  // --- name auto-fit (D3) ---
  // Gold-ring inner width: ring diameter minus its own padding,
  // both borders (1.5px outer + 1px inner) and the inner padding.
  const ringOuterW = contentW * RING_FRACTION;
  const ringInnerW =
    ringOuterW - 2 * (6 * s) - 5 - 2 * (8 * s);
  const longestName = Math.max(
    partnerA?.length ?? 0,
    partnerB?.length ?? 0,
    1,
  );
  const nameSize = Math.min(
    44 * s,
    ringInnerW / (longestName * NAME_CHAR_EM),
  );

  const mainEvent = pickMainEvent(site.events ?? []);
  const eventName = mainEvent ? clean(mainEvent.name) : null;

  // Date: main event's date, else the site weddingDate (ISO datetime).
  let dateObj: Date | null = null;
  let dateTimeZone: string | undefined;
  if (mainEvent) dateObj = parseEventDate(mainEvent.date ?? "");
  if (!dateObj && !isBlank(site.weddingDate)) {
    const d = new Date(site.weddingDate);
    if (!Number.isNaN(d.getTime())) {
      dateObj = d;
      // An ISO datetime is an instant: format it in the site's timezone
      // so the day never shifts to the viewer's local day.
      if (!isBlank(site.timezone)) dateTimeZone = site.timezone.trim();
    }
  }

  const time = mainEvent ? clean(mainEvent.time) : null;

  // Venue: chosen event's venue/address first, else the site content's.
  const venueName =
    (mainEvent ? clean(mainEvent.venue) : null) ??
    clean(site.content?.venueName);
  const venueAddress =
    (mainEvent ? clean(mainEvent.address) : null) ??
    clean(site.content?.venueAddress);

  const weekday = dateObj
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: dateTimeZone,
      }).format(dateObj)
    : null;
  const month = dateObj
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        timeZone: dateTimeZone,
      }).format(dateObj)
    : null;
  const year = dateObj
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        timeZone: dateTimeZone,
      }).format(dateObj)
    : null;
  const dayNum = dateObj
    ? String(
        Number(
          new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            timeZone: dateTimeZone,
          }).format(dateObj),
        ),
      )
    : null;

  // Gold rules flanking the weekday / time in the date row.
  const dateSideRule = {
    borderTop: `1.5px solid ${GOLD}`,
    borderBottom: `1.5px solid ${GOLD}`,
  };

  return (
    <div
      ref={cardRef}
      data-invitation-card
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "5 / 7",
        // D5: on image failure the card falls back to the light ivory
        // centre (NOT palette.bg) so dark-bg templates stay readable.
        backgroundColor: imgFailed ? LIGHT_CENTRE : bg,
        color: ink,
        fontFamily: SERIF_FONT,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* AI floral frame, full-bleed. If it fails to load, hide it
          SYNCHRONOUSLY (style.display) so no broken-image icon ever
          shows, then remove it from the tree via state (D5). */}
      {imgFailed ? null : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frameSrc}
          alt=""
          aria-hidden="true"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            setImgFailed(true);
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {/* Soft ivory scrim behind the text (D4): lifts text contrast
          off the darkest blooms while the frame stays visible at the
          edges. Ivory-on-ivory when the frame failed — invisible. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: scrim,
          pointerEvents: "none",
        }}
      />

      {/* Card body — centred in the frame's empty middle. The side
          padding keeps text inside the clear centre column (the
          purple frame's side garlands reach furthest in), and the
          top/bottom padding clears the top and bottom florals. */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: `13.5% ${sidePadFrac * 100}% 8.5%`,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11 * s,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            ...muted,
          }}
        >
          Together with their families
        </p>

        {hasNames ? (
          <div
            style={{
              marginTop: 11 * s,
              width: `${RING_FRACTION * 100}%`,
              maxWidth: 300,
              aspectRatio: "1 / 1",
              flexShrink: 0,
              border: `1.5px solid ${GOLD}`,
              borderRadius: "50%",
              boxSizing: "border-box",
              padding: 6 * s,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                border: `1px solid ${GOLD}`,
                borderRadius: "50%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: `0 ${8 * s}px`,
              }}
            >
              {partnerA !== null ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: SCRIPT_FONT,
                    fontSize: nameSize,
                    lineHeight: 1.1,
                    color: ink,
                  }}
                >
                  {partnerA}
                </p>
              ) : null}
              {partnerA !== null && partnerB !== null ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: SCRIPT_FONT,
                    fontSize: nameSize * 0.68,
                    lineHeight: 1.1,
                    color: accentReadable,
                  }}
                >
                  &amp;
                </p>
              ) : null}
              {partnerB !== null ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: SCRIPT_FONT,
                    fontSize: nameSize,
                    lineHeight: 1.1,
                    color: ink,
                  }}
                >
                  {partnerB}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <p
          style={{
            margin: `${11 * s}px 0 0`,
            fontSize: 13 * s,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            ...muted,
          }}
        >
          {eventName ?? "Request the honour of your presence"}
        </p>

        {dateObj && weekday && month && year && dayNum ? (
          <div style={{ marginTop: 11 * s }}>
            <p
              style={{
                margin: 0,
                fontSize: 15 * s,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: ink,
              }}
            >
              {month}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "nowrap",
                gap: 10 * s,
                marginTop: 6 * s,
              }}
            >
              <span
                style={{
                  ...dateSideRule,
                  padding: `${7 * s}px ${2 * s}px`,
                  fontSize: 10 * s,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: ink,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {weekday}
              </span>
              <span
                style={{
                  fontSize: 54 * s,
                  lineHeight: 1,
                  fontWeight: 600,
                  color: accentReadable,
                  flexShrink: 0,
                }}
              >
                {dayNum}
              </span>
              {time ? (
                <span
                  style={{
                    ...dateSideRule,
                    padding: `${7 * s}px ${2 * s}px`,
                    fontSize: 10 * s,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: ink,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  at {time}
                </span>
              ) : null}
            </div>
            <p
              style={{
                margin: `${6 * s}px 0 0`,
                fontSize: 17 * s,
                letterSpacing: "0.26em",
                color: ink,
              }}
            >
              {year}
            </p>
          </div>
        ) : null}

        {venueName ? (
          <div style={{ marginTop: 11 * s }}>
            <p
              style={{
                margin: 0,
                fontSize: 11 * s,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: accentReadable,
              }}
            >
              Venue
            </p>
            <p
              style={{
                margin: `${4 * s}px 0 0`,
                fontSize: 19 * s,
                fontWeight: 600,
                lineHeight: 1.3,
                color: ink,
              }}
            >
              {venueName}
            </p>
            {venueAddress ? (
              <p
                style={{
                  margin: `${4 * s}px 0 0`,
                  fontSize: 13 * s,
                  lineHeight: 1.45,
                  ...muted,
                }}
              >
                {venueAddress}
              </p>
            ) : null}
          </div>
        ) : null}

        <p
          style={{
            margin: `${11 * s}px 0 0`,
            fontSize: 13 * s,
            fontStyle: "italic",
            ...muted,
          }}
        >
          We can&rsquo;t wait to celebrate with you
        </p>
      </div>
    </div>
  );
}
