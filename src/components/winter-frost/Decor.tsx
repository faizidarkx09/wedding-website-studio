// Winter Frost decorations — FrostSurface (pale-ice / deep-blue
// bands), Snowfall (lightweight canvas particle layer, ~60 falling
// snowflakes), SnowflakeCrest (six-arm snowflake medallion), the
// SnowflakeDivider, and the SnowGlobeCarousel (one large photo in a
// round snow-globe frame + dots, swipeable).
// Font classes are the scoped .wf-* variants from globals.css
// (added by the coordinator — see FONTS-ENTRY.txt in this folder).
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface FrostSurfaceProps {
  variant: "ice" | "pale" | "deep";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function FrostSurface({ variant, className = "", children, id }: FrostSurfaceProps) {
  const isDeep = variant === "deep";
  const isIce = variant === "ice";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isDeep
          ? "bg-[#12395B] text-[#FDFEFF]"
          : isIce
            ? "bg-[#BDE0F5] text-[#12395B]"
            : "bg-[#EAF4FB] text-[#12395B]"
      } ${className}`}
    >
      {/* Cool directional light — a soft icy glow for ice, a pale
          frost vignette for pale, a deep-blue aurora glow for deep
          (kept dark so white type stays high-contrast). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDeep
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(127, 179, 217, 0.35) 0%, rgba(18, 57, 91, 0.5) 100%)"
            : isIce
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.55) 0%, rgba(189, 224, 245, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.6) 0%, rgba(214, 235, 249, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Snowfall — ~60 snowflakes drifting slowly DOWNWARD with a gentle */
/* sideways sway, drawn on one canvas with a single rAF loop.       */
/* Pointer-events-none and low opacity, so it never hurts           */
/* readability or performance. Respects prefers-reduced-motion      */
/* (renders one static frame instead of animating). Used on the     */
/* cover and inside the snow-globe carousel.                         */
/* ------------------------------------------------------------------ */

interface SnowParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
}

export function Snowfall({ className = "", count = 60 }: { className?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: SnowParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.9 + Math.random() * 2.4,
        speed: 0.12 + Math.random() * 0.35,
        sway: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.55,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 16;
        // Fall downward, wrapping back to the top.
        const y = (p.y + ((t / 1000) * p.speed * 12)) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      draw(t);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    seed();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SnowflakeCrest — a six-arm snowflake medallion: a double ring    */
/* with 6 radiating arms, each tipped with a small branch. The live */
/* monogram sits in the centre as HTML text (see Cover).             */
/* ------------------------------------------------------------------ */

export function SnowflakeCrest({ className = "" }: { className?: string }) {
  const arms = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // Main arm from r=34 to r=92, plus two small side branches.
    const tipX = 100 + 92 * cos;
    const tipY = 100 + 92 * sin;
    const midX = 100 + 62 * cos;
    const midY = 100 + 62 * sin;
    const perpX = -sin;
    const perpY = cos;
    return {
      tipX,
      tipY,
      midX,
      midY,
      b1x: midX + 16 * perpX,
      b1y: midY + 16 * perpY,
      b2x: midX - 16 * perpX,
      b2y: midY - 16 * perpY,
      dotX: 100 + 78 * cos,
      dotY: 100 + 78 * sin,
    };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {arms.map((a, i) => (
        <g key={i} stroke="#BDE0F5" strokeLinecap="round">
          <line x1="100" y1="100" x2={a.tipX} y2={a.tipY} strokeWidth="2.2" />
          <line x1={a.midX} y1={a.midY} x2={a.b1x} y2={a.b1y} strokeWidth="1.4" />
          <line x1={a.midX} y1={a.midY} x2={a.b2x} y2={a.b2y} strokeWidth="1.4" />
          <circle cx={a.dotX} cy={a.dotY} r="2.2" fill="#BDE0F5" stroke="none" />
        </g>
      ))}
      <circle cx="100" cy="100" r="82" stroke="#7FB3D9" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="76" stroke="#BDE0F5" strokeWidth="0.8" opacity="0.7" />
      <circle cx="100" cy="100" r="34" stroke="#BDE0F5" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SnowflakeDivider — a small six-arm snowflake between two ice     */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function SnowflakeDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#7FB3D9" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#7FB3D9" strokeWidth="1.2" />
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (
          <line
            key={i}
            x1={90 + 7 * cos}
            y1={17 + 7 * sin}
            x2={90 + 13 * cos}
            y2={17 + 13 * sin}
            stroke="#1B4A6B"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="90" cy="17" r="4.5" fill="#BDE0F5" stroke="#1B4A6B" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SnowGlobeCarousel — one large photo inside a round snow-globe    */
/* frame (ring + base stand), with falling snow inside the globe,   */
/* a caption bar, dots and prev/next arrows. Swipeable (drag) and   */
/* keyboard/button accessible. The story's signature layout — not   */
/* photo cards, not a film strip.                                   */
/* ------------------------------------------------------------------ */

export interface GlobeSlide {
  src: string;
  caption: string;
  alt: string;
}

export function SnowGlobeCarousel({
  slides,
  className = "",
}: {
  slides: GlobeSlide[];
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  if (slides.length === 0) return null;
  const safeIndex = ((index % slides.length) + slides.length) % slides.length;
  const slide = slides[safeIndex];

  const paginate = (dir: number) => {
    setIndex(([prev]) => [prev + dir, dir]);
  };
  const goTo = (i: number) => {
    setIndex(([prev]) => [i, i > prev ? 1 : -1]);
  };

  return (
    <div className={`@container relative mx-auto w-full max-w-[560px] ${className}`}>
      {/* The globe: a round frame with an ice ring, the photo inside,
          and snowfall clipped to the circle. */}
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="absolute inset-0 overflow-hidden rounded-full bg-[#0B2540] shadow-[0_24px_48px_-16px_rgba(11,37,64,0.55)] ring-4 ring-[#BDE0F5] ring-offset-4 ring-offset-[#EAF4FB]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={safeIndex}
              custom={direction}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction >= 0 ? 120 : -120, scale: 0.96 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction >= 0 ? -120 : 120, scale: 0.96 }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              drag={prefersReducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                if (info.offset.x < -60) paginate(1);
                else if (info.offset.x > 60) paginate(-1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                draggable={false}
                className="pointer-events-none h-full w-full object-cover select-none"
              />
              {/* Soft deep-blue shade at the globe's base so the
                  caption bar below reads as part of the globe. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2540]/35 via-transparent to-transparent"
              />
            </motion.div>
          </AnimatePresence>
          {/* Snowfall inside the globe */}
          {!prefersReducedMotion && <Snowfall count={36} />}
        </div>

        {/* Prev / next arrows, overlapping the globe's equator */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous photo"
          className="absolute top-1/2 -left-1 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-white/90 text-[#12395B] shadow-[0_8px_20px_-6px_rgba(11,37,64,0.45)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12395B] @min-[40rem]:-left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next photo"
          className="absolute top-1/2 -right-1 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-white/90 text-[#12395B] shadow-[0_8px_20px_-6px_rgba(11,37,64,0.45)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12395B] @min-[40rem]:-right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Globe base stand */}
      <div aria-hidden="true" className="relative z-10 mx-auto -mt-1 h-4 w-[62%] max-w-[280px] rounded-[4px] bg-gradient-to-b from-[#1B4A6B] to-[#0B2540] shadow-[0_10px_20px_-8px_rgba(11,37,64,0.6)]" />
      <div aria-hidden="true" className="relative z-10 mx-auto h-2 w-[72%] max-w-[330px] rounded-full bg-[#12395B]/15 blur-[2px]" />

      {/* Caption + dots */}
      <div className="mt-5 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={safeIndex}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="wf-font-display text-[11px] tracking-[0.28em] text-[#12395B] uppercase"
          >
            {slide.caption}
          </motion.p>
        </AnimatePresence>
        <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Story photos">
          {slides.map((s, i) => (
            <button
              key={`${s.src}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Photo ${i + 1}: ${s.caption}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12395B] ${
                i === safeIndex ? "w-7 bg-[#12395B]" : "w-2.5 bg-[#7FB3D9]/70 hover:bg-[#1B4A6B]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
