// Dolce Vita photo gallery — a 1:1 port of the standalone's
// slider (index.html §8 + styles.css §8 + script.js §6): a 4/3
// track with prev/next arrows, dots and drag/swipe via Pointer
// Events. NOTE: the Studio brief asked for a masonry gallery with
// lightbox; the user's 1:1 correction overrules that — the approved
// standalone design IS a slider, so the slider is what ships.
"use client";

import { useRef, useState } from "react";
import type { WeddingSite } from "@/lib/types";
import { DOLCE } from "./tokens";

export default function DolceVitaGallery({ site }: { site: WeddingSite }) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; curX: number; dragX: number } | null>(null);

  if (!site.settings.showGallery || site.gallery.length === 0) return null;

  const slides = site.gallery.length;

  function goTo(n: number) {
    const next = ((n % slides) + slides) % slides;
    setIndex(next);
    const track = trackRef.current;
    if (track) track.style.transform = `translateX(-${next * 100}%)`;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = { startX: e.clientX, curX: e.clientX, dragX: 0 };
    setDragging(true);
    trackRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    drag.curX = e.clientX;
    drag.dragX = drag.curX - drag.startX;
    const track = trackRef.current;
    if (track) {
      track.style.transform = `translateX(calc(-${index * 100}% + ${drag.dragX}px))`;
    }
  }

  function endDrag() {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragging(false);
    if (drag.dragX > 50) goTo(index - 1);
    else if (drag.dragX < -50) goTo(index + 1);
    else goTo(index);
  }

  return (
    <section id="gallery" aria-label="Photo gallery" className="dolce-section">
      <div
        className="dolce-slider"
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo gallery"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goTo(index - 1);
          if (e.key === "ArrowRight") goTo(index + 1);
        }}
      >
        <div
          ref={trackRef}
          className={`dolce-slides${dragging ? " dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="dolce-slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.caption || `Gallery photo ${i + 1}`}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </figure>
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
          className="dolce-slider-arrow dolce-slider-prev"
          style={{ color: DOLCE.blueDeep }}
        >
          &#8249;
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
          className="dolce-slider-arrow dolce-slider-next"
          style={{ color: DOLCE.blueDeep }}
        >
          &#8250;
        </button>
        <div className="dolce-slider-dots" role="tablist" aria-label="Gallery slides">
          {site.gallery.map((image, i) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              onClick={() => goTo(i)}
              className={`dolce-slider-dot${i === index ? " active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
