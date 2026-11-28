// Eternal Moment shared sections — section heading + divider,
// the editorial gallery (mosaic + lightbox) and the footer.
// The gallery uses the buyer's own photos only; the template's
// 12 photos seed the preview gallery, never a buyer's site.
"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { WeddingSite } from "@/lib/types";
import Reveal from "../Reveal";
import { DiamondDivider } from "./Decor";
import {
  ETERNAL,
  FONT_BODY,
  FONT_DISPLAY,
  coupleNames,
  footerLocation,
  formatDateDisplay,
  initials,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* SectionHeading — small-caps mono eyebrow, Cormorant title, gold  */
/* diamond divider, optional intro line.                             */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className="font-mono text-[0.65rem] font-medium tracking-[0.35em] uppercase sm:text-[0.7rem]"
        style={{ color: dark ? ETERNAL.champagne : ETERNAL.goldDeep }}
      >
        {eyebrow}
      </p>
      <h2
        className={`${FONT_DISPLAY} mt-4 text-4xl leading-[1.05] font-medium sm:text-6xl`}
        style={{ color: dark ? ETERNAL.paper : ETERNAL.espresso }}
      >
        {title}
      </h2>
      <DiamondDivider className="mt-6" />
      {intro ? (
        <p
          className={`${FONT_BODY} mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed`}
          style={{ color: dark ? "rgba(255,254,252,0.85)" : `${ETERNAL.espresso}CC` }}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EternalMomentGallery — editorial mosaic. The source's gallery    */
/* spans tall / wide / square; the mosaic below cycles the same    */
/* rhythm (tall, wide, square) so a buyer gallery keeps the        */
/* editorial feel at any length. Click opens a lightbox (Esc /     */
/* arrows / backdrop click to close).                               */
/* ------------------------------------------------------------------ */

const SPAN_CLASSES = [
  "aspect-[3/4] sm:row-span-2", // tall
  "aspect-[4/3] sm:col-span-2", // wide
  "aspect-square", // square
];

export function EternalMomentGallery({ site }: { site: WeddingSite }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + site.gallery.length) % site.gallery.length,
      );
    },
    [site.gallery.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, step]);

  const current = lightbox === null ? null : site.gallery[lightbox];

  return (
    <section id="gallery" aria-label="Gallery" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Moments"
          title="The Gallery"
          intro="A few favourite memories, so far."
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {site.gallery.map((image, i) => (
          <Reveal key={image.id}>
            <figure className={i % 3 === 0 ? "sm:row-span-2" : undefined}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open photo ${i + 1}: ${image.caption || "Gallery photo"}`}
                className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ outlineColor: ETERNAL.gold } as CSSProperties}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.caption || `Gallery photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover ${SPAN_CLASSES[i % 3]}`}
                />
              </button>
              {image.caption ? (
                <figcaption
                  className={`${FONT_BODY} mt-2 text-center text-sm italic`}
                  style={{ color: `${ETERNAL.espresso}B3` }}
                >
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || "Gallery photo"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-xl text-white transition hover:bg-white/10"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-xl text-white transition hover:bg-white/10 sm:left-6"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.caption || "Gallery photo"}
            className="max-h-[82vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-xl text-white transition hover:bg-white/10 sm:right-6"
          >
            ›
          </button>
          {current.caption ? (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-sm text-white/90 italic">
              {current.caption}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EternalMomentFooter — monogram, names, date + place, the        */
/* couple's footer message when set, and a back-to-top link.        */
/* ------------------------------------------------------------------ */

export function EternalMomentFooter({ site }: { site: WeddingSite }) {
  const names = coupleNames(site);
  const dateLine = formatDateDisplay(site.weddingDate, site.timezone);
  const placeLine = footerLocation(site);
  const message = (site.content.footerMessage ?? "").trim();

  return (
    <footer
      className="w-full px-4 py-16 text-center sm:py-20"
      style={{ backgroundColor: ETERNAL.espresso, color: ETERNAL.paper }}
    >
      <p
        className={`${FONT_DISPLAY} text-3xl font-medium italic sm:text-4xl`}
      >
        {message || names}
      </p>
      <p className="mt-5 font-mono text-[0.65rem] tracking-[0.35em] uppercase sm:text-[0.7rem]">
        {names.toUpperCase()} · {dateLine}
      </p>
      <p className="mt-2 font-mono text-[0.65rem] tracking-[0.3em] uppercase text-white/60">
        {placeLine}
      </p>
      <div aria-hidden="true" className="mx-auto mt-8 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-white/30" />
        <span className="block h-2 w-2 rotate-45" style={{ backgroundColor: ETERNAL.gold }} />
        <span className="h-px w-10 bg-white/30" />
      </div>
      <p className="mt-8 text-xs tracking-[0.25em] text-white/50 uppercase">
        {initials(site)} — An Eternal Moment
      </p>
      <a
        href="#home"
        className="mt-6 inline-block font-mono text-[0.65rem] tracking-[0.3em] text-white/70 uppercase underline underline-offset-4 transition hover:text-white"
      >
        Back to top ↑
      </a>
    </footer>
  );
}
