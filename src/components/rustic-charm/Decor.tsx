// Rustic Charm decorations — BarnSurface (plank-wood / cream /
// bark panels), Fireflies (lightweight canvas particle layer,
// ~36 warm fireflies), WoodSign (plank-textured sign panel),
// TwineDivider and ChalkDivider. Font classes are the scoped .rc-*
// variants from globals.css (never the bare source class names,
// which would collide with other templates). The .rc-* classes are
// added by the coordinator — see
// ~/workspace/rustic-charm-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface BarnSurfaceProps {
  variant: "wood" | "cream" | "bark" | "leaf";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function BarnSurface({ variant, className = "", children, id }: BarnSurfaceProps) {
  const bg =
    variant === "wood"
      ? "bg-[#78350F] text-[#FEF3C7]"
      : variant === "bark"
        ? "bg-[#2D1F14] text-[#FEF3C7]"
        : variant === "leaf"
          ? "bg-[#365314] text-[#FEF3C7]"
          : "bg-[#FEF3C7] text-[#451A03]";
  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {/* Warm directional light — a low amber glow for wood/bark,
          a soft cream vignette for cream, a dusk-green glow for
          leaf. Kept dark on the dark variants so cream type stays
          high-contrast. No photo texture here: the wood band reads
          as barn light, the cream as linen paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            variant === "wood"
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(146, 64, 14, 0.5) 0%, rgba(69, 26, 3, 0.55) 55%, rgba(45, 31, 20, 0.72) 100%)"
              : variant === "bark"
                ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(120, 53, 15, 0.35) 0%, rgba(45, 31, 20, 0.5) 100%)"
                : variant === "leaf"
                  ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(77, 124, 15, 0.45) 0%, rgba(54, 83, 20, 0.5) 55%, rgba(28, 25, 23, 0.6) 100%)"
                  : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 251, 235, 0.6) 0%, rgba(254, 243, 199, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fireflies — ~36 tiny warm fireflies drifting slowly with a        */
/* gentle glow pulse, drawn on one canvas with a single rAF loop.    */
/* Pointer-events-none and low opacity, so it never hurts            */
/* readability or performance. Respects prefers-reduced-motion       */
/* (renders one static frame instead of animating). Used on the      */
/* cover only — the one place the brief asks for it.                 */
/* ------------------------------------------------------------------ */

interface FireflyParticle {
  x: number;
  y: number;
  r: number;
  speedX: number;
  speedY: number;
  phase: number;
  alpha: number;
  hue: number;
}

export function Fireflies({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: FireflyParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 36 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.0 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 0.22,
        speedY: -0.05 - Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.55,
        hue: Math.random() < 0.6 ? 48 : 84,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const drift = Math.sin(t / 2600 + p.phase) * 12;
        const x = ((p.x + drift + (t / 1000) * p.speedX * 10) % (w + 20) + w + 20) % (w + 20) - 10;
        const y = p.y + ((t / 1000) * p.speedY * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const glow = 0.35 + 0.65 * Math.abs(Math.sin(t / 1400 + p.phase * 2));
        const a = (p.alpha * glow).toFixed(3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 48 ? `rgba(253, 230, 138, ${(Number(a) * 0.18).toFixed(3)})` : `rgba(217, 249, 157, ${(Number(a) * 0.18).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 48 ? `rgba(253, 230, 138, ${a})` : `rgba(217, 249, 157, ${a})`;
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
/* WoodSign — a plank-textured wooden sign panel (CSS only: warm     */
/* brown gradient + repeating plank seams + nail dots). The couple   */
/* names sit on it as HTML text on the cover (never baked in).       */
/* ------------------------------------------------------------------ */

export function WoodSign({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[6px] border-2 border-[#451A03] bg-[#78350F] shadow-[0_24px_48px_-16px_rgba(45,26,3,0.65),inset_0_2px_0_rgba(254,243,199,0.18)] ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(45,26,3,0.35) 0px, rgba(45,26,3,0.35) 2px, transparent 2px, transparent 56px), linear-gradient(180deg, #92400E 0%, #78350F 45%, #5C2A08 100%)",
      }}
    >
      {/* Nail dots */}
      <span aria-hidden="true" className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full bg-[#2D1F14] ring-1 ring-[#FEF3C7]/30" />
      <span aria-hidden="true" className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#2D1F14] ring-1 ring-[#FEF3C7]/30" />
      <span aria-hidden="true" className="absolute bottom-2.5 left-2.5 h-2 w-2 rounded-full bg-[#2D1F14] ring-1 ring-[#FEF3C7]/30" />
      <span aria-hidden="true" className="absolute right-2.5 bottom-2.5 h-2 w-2 rounded-full bg-[#2D1F14] ring-1 ring-[#FEF3C7]/30" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TwineDivider — a small twine bow between two jute hairlines, for */
/* card dividers.                                                     */
/* ------------------------------------------------------------------ */

export function TwineDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#A16207" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#A16207" strokeWidth="1.2" />
      <circle cx="90" cy="17" r="6.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.4" />
      <circle cx="90" cy="17" r="2.5" fill="#78350F" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ChalkDivider — a chalk heart between two chalk hairlines, for     */
/* chalkboard panels.                                                 */
/* ------------------------------------------------------------------ */

export function ChalkDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="70" y2="17" stroke="#FEF3C7" strokeWidth="1.2" opacity="0.7" />
      <line x1="110" y1="17" x2="180" y2="17" stroke="#FEF3C7" strokeWidth="1.2" opacity="0.7" />
      <path
        d="M90 24 C 82 18, 78 13, 82 9 C 85 6.5, 89 7.5, 90 10 C 91 7.5, 95 6.5, 98 9 C 102 13, 98 18, 90 24 Z"
        fill="#FEF3C7"
        opacity="0.9"
      />
    </svg>
  );
}
