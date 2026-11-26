// Aurora decorations — NightSurface (deep-night band with a soft
// aurora glow), AuroraLights (lightweight canvas particle layer:
// drifting teal/violet light streaks + twinkling stars), AuroraRibbon
// (flowing SVG aurora bands for the cover), AuroraDivider (a small
// glowing orb between two gradient hairlines) and AuroraSeal (the
// teal-violet aurora seal orb — a CSS radial gradient, not a photo,
// so it never fights the sliding card).
//
// Font classes are the scoped .au-* variants defined by the <style>
// block in AuroraRenderer (never the bare source class names, which
// would collide with other templates).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface NightSurfaceProps {
  variant: "night" | "deep" | "soft";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function NightSurface({ variant, className = "", children, id }: NightSurfaceProps) {
  const isDeep = variant === "deep";
  const isSoft = variant === "soft";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isDeep
          ? "bg-[#020617] text-[#F4F7FB]"
          : isSoft
            ? "bg-[#1E293B] text-[#F4F7FB]"
            : "bg-[#0F172A] text-[#F4F7FB]"
      } ${className}`}
    >
      {/* Soft aurora glow — teal from the top-left, violet from the
          bottom-right, kept dim so ice-white type stays
          high-contrast. No photo texture here: the night band reads
          as sky, the glow as distant aurora. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDeep
            ? "radial-gradient(ellipse 70% 55% at 18% 0%, rgba(20, 184, 166, 0.16) 0%, transparent 60%), radial-gradient(ellipse 70% 55% at 85% 100%, rgba(139, 92, 246, 0.18) 0%, transparent 60%)"
            : isSoft
              ? "radial-gradient(ellipse 80% 70% at 50% 30%, rgba(139, 92, 246, 0.16) 0%, rgba(30, 41, 59, 0.4) 100%)"
              : "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(20, 184, 166, 0.12) 0%, rgba(15, 23, 42, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraLights — ~46 tiny light streaks + stars drifting slowly     */
/* across the sky, drawn on one canvas with a single rAF loop.       */
/* Pointer-events-none and low opacity, so it never hurts            */
/* readability or performance. Respects prefers-reduced-motion       */
/* (renders one static frame instead of animating). Used on the     */
/* cover and the countdown band.                                     */
/* ------------------------------------------------------------------ */

interface LightParticle {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  teal: boolean;
  star: boolean;
  r: number;
}

export function AuroraLights({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: LightParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 46 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 6 + Math.random() * 18,
        angle: -0.5 + Math.random() * 1.0,
        speed: 0.05 + Math.random() * 0.2,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.14 + Math.random() * 0.42,
        teal: i % 3 !== 2,
        star: i % 4 === 3,
        r: 0.7 + Math.random() * 1.4,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 16;
        const y = p.y - ((t / 1000) * p.speed * 8) % (h + 24);
        const wrappedY = y < -12 ? y + h + 24 : y;
        const twinkle = 0.7 + 0.3 * Math.sin(t / 900 + p.phase * 3);
        const a = (p.alpha * twinkle).toFixed(3);
        const color = p.teal ? "94, 234, 212" : "196, 181, 253";
        if (p.star) {
          ctx.beginPath();
          ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(248, 250, 252, ${a})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(x, wrappedY);
          ctx.lineTo(x + Math.cos(p.angle) * p.len, wrappedY + Math.sin(p.angle) * p.len);
          ctx.strokeStyle = `rgba(${color}, ${a})`;
          ctx.lineWidth = 1.1;
          ctx.lineCap = "round";
          ctx.stroke();
        }
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* AuroraRibbon — three flowing aurora bands (teal → violet) drawn   */
/* as soft SVG paths with a blur, for the cover sky. The bands are   */
/* animated by the parent (framer-motion drift); this is the static  */
/* shape.                                                            */
/* ------------------------------------------------------------------ */

export function AuroraRibbon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 420"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id="au-ribbon-teal" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" stopOpacity="0" />
          <stop offset="0.25" stopColor="#14B8A6" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#5EEAD4" stopOpacity="0.7" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="au-ribbon-violet" x1="1200" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="0.3" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="0.65" stopColor="#C4B5FD" stopOpacity="0.65" />
          <stop offset="1" stopColor="#14B8A6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="au-ribbon-mist" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5EEAD4" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5EEAD4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0" />
        </linearGradient>
        <filter id="au-ribbon-blur" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g filter="url(#au-ribbon-blur)">
        <path
          d="M-40 120 C 220 40, 420 190, 640 110 S 1020 30, 1240 130"
          stroke="url(#au-ribbon-teal)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M-40 210 C 260 130, 480 280, 720 190 S 1040 120, 1240 220"
          stroke="url(#au-ribbon-violet)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M-40 300 C 300 230, 560 350, 800 270 S 1060 220, 1240 300"
          stroke="url(#au-ribbon-mist)"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraDivider — a small glowing orb between two teal→violet      */
/* gradient hairlines, for card dividers.                            */
/* ------------------------------------------------------------------ */

export function AuroraDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <defs>
        <linearGradient id="au-divider-line" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14B8A6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5EEAD4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="17" x2="66" y2="17" stroke="url(#au-divider-line)" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="url(#au-divider-line)" strokeWidth="1.2" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 360) / 12;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={90 + 9 * Math.cos(rad)}
            y1={17 + 9 * Math.sin(rad)}
            x2={90 + 13.5 * Math.cos(rad)}
            y2={17 + 13.5 * Math.sin(rad)}
            stroke="#5EEAD4"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="90" cy="17" r="6.5" fill="#8B5CF6" stroke="#5EEAD4" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraSeal — the teal-violet aurora seal orb. A CSS radial       */
/* gradient with a glowing ring and the live monogram as HTML text   */
/* in the centre (see Envelope). Tapping it "breaks" the seal (it   */
/* dims and shows a crack) and the card slides up; tapping again    */
/* reseals it.                                                       */
/* ------------------------------------------------------------------ */

export function AuroraSeal({
  monogram,
  isOpen,
  onToggle,
}: {
  monogram: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen ? "Reseal the aurora envelope" : "Break the aurora seal and open the envelope"
        }
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(2,6,23,0.8),0_0_32px_rgba(20,184,166,0.35)] ring-2 ring-[#5EEAD4]/60 transition-transform duration-300 hover:scale-[1.04] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #5EEAD4 0%, #14B8A6 38%, #6D28D9 72%, #8B5CF6 100%)",
        }}
      >
        {/* Inner glow ring */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-full border border-white/40"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[13px] rounded-full border border-white/20"
        />
        {/* Live monogram */}
        <span className="au-font-display relative z-10 text-[1.35rem] font-semibold tracking-[0.06em] text-white drop-shadow-[0_2px_6px_rgba(2,6,23,0.7)]">
          {monogram}
        </span>
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#020617]/60"
          />
        )}
      </button>

      <span className="au-font-editorial mt-3 text-xs tracking-[0.18em] text-[#5EEAD4]/90 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}
