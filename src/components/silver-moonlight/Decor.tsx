// Silver Moonlight decorations — NightSurface (deep night / ice
// white), TwinklingStars (lightweight canvas star layer, ~50 stars,
// respects reduced motion) and the MoonDivider (crescent + silver
// rule). Font classes are the scoped .er-* variants from
// globals.css (already loaded — never the bare source class names,
// which would collide with other templates).
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface NightSurfaceProps {
  variant: "night" | "ice";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function NightSurface({ variant, className = "", children, id }: NightSurfaceProps) {
  const isNight = variant === "night";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isNight ? "bg-[#16202E] text-[#F4F7FA]" : "bg-[#F4F7FA] text-[#16202E]"
      } ${className}`}
    >
      {/* Subtle moonlight vignette — lighter at the top centre, deeper
          at the edges, so ice-white text stays legible on night. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(61, 78, 99, 0.28) 0%, rgba(14, 22, 32, 0.55) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.5) 0%, rgba(201, 205, 214, 0.28) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/** Deterministic pseudo-random generator so the star field is
 * identical on server and client (no hydration mismatch). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

/** TwinklingStars — a lightweight canvas layer of ~50 stars that
 * gently twinkle (alpha oscillation only — no movement, no blur, no
 * layout work). One rAF loop, devicePixelRatio-capped, paused when
 * the tab is hidden (rAF stops on its own) and fully static when
 * the user prefers reduced motion. Pointer-events-none, aria-hidden,
 * and always layered UNDER the text so it can never hurt
 * readability. */
export function TwinklingStars({
  className = "",
  count = 50,
  seed = 20260712,
}: {
  className?: string;
  count?: number;
  seed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = mulberry32(seed);
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      r: 0.5 + rand() * 1.3,
      phase: rand() * Math.PI * 2,
      speed: 0.4 + rand() * 0.9,
    }));

    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (const s of stars) {
        // Static alpha when reduced motion is preferred; otherwise a
        // slow sine twinkle between ~0.35 and 1.
        const alpha = prefersReducedMotion
          ? 0.8
          : 0.35 + 0.65 * Math.abs(Math.sin(time * s.speed + s.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#E8EBF0";
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!prefersReducedMotion && running) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }
    const onResize = () => draw(performance.now());
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, seed, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/** CrescentMoon — a silver crescent drawn with an SVG mask (a
 * bright disc with an offset disc cut out). Used on the cover seal
 * and as a small ornament. */
export function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <mask id="sm-crescent-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="62" cy="42" r="34" fill="black" />
        </mask>
      </defs>
      <circle cx="46" cy="52" r="36" fill="#E8EBF0" mask="url(#sm-crescent-mask)" />
    </svg>
  );
}

/** MoonDivider — a small crescent flanked by silver hairlines, the
 * section divider for this template (replaces Emerald's botanical
 * branch). */
export function MoonDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9CDD6]" />
      <CrescentMoon className="h-4 w-4 shrink-0" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9CDD6]" />
    </div>
  );
}
