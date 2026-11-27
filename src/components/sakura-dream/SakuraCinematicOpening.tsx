// Cinematic opening helpers for Sakura Dream — Phase 1 falling
// petals + swaying branch, Phase 2 petal burst + pink glow + branch
// bloom, Phase 3 petal-curtain lift, Phase 4 petal swirl + shimmer +
// chime. Web Audio SFX (petal rustle + bloom chime, synthesised —
// no audio files, no autoplay, no music). Everything here is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
//
// Deliberately DIFFERENT from Blush Royale: Blush has a golden
// burst + two paper panels rotating open around a centre seam +
// heart transition; Sakura has a pink petal burst + a branch that
// blooms + five petal-pink curtain strips that lift upward with a
// stagger + a blossom swirl. No paper, no heart, no gold.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Blossom } from "./Decor";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Rustle = soft filtered-noise burst    */
/* sweeping down (petals, not paper — higher + airier than Blush);  */
/* chime = D5–F#5–A5–D6 bloom arpeggio, sine + soft triangle.       */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setCinematicSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isCinematicSoundEnabled() {
  return soundEnabled;
}

function ac(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

/** Soft petal rustle: white noise through a bandpass sweeping 1500→500 Hz. */
export function playPetalRustleSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.9;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(1500, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Bloom chime: D5–F#5–A5–D6, sine + soft triangle octave, ~1.8s decay. */
export function playBloomChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [587.33, 739.99, 880, 1174.66];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.16;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.7);
      osc2.start(t);
      osc2.stop(t + 1.7);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* SakuraPetalCanvas — one canvas, one rAF loop. Notched sakura     */
/* petals drift down with sway + rotation; when burstKey increments, */
/* ~26 tiny pink petals burst outward from burstOrigin and flutter  */
/* down. Renders nothing at all under prefers-reduced-motion.       */
/* ------------------------------------------------------------------ */

interface FallingPetal {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotSpeed: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  pink: number;
}

interface BurstPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  rotSpeed: number;
  life: number;
  maxLife: number;
  pink: number;
}

const PINKS = ["249, 168, 212", "251, 207, 232", "236, 72, 153", "244, 183, 205"];

function drawSakuraPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  angle: number,
  rgb: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.9, -r * 0.4, r * 0.9, r * 0.7, 0, r);
  ctx.bezierCurveTo(-r * 0.9, r * 0.7, -r * 0.9, -r * 0.4, 0, -r);
  ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
  ctx.fill();
  ctx.restore();
}

export function SakuraPetalCanvas({
  petalCount = 16,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.55 },
  className = "",
}: {
  petalCount?: number;
  burstKey?: number;
  burstOrigin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // burstKey arrives via a ref so the rAF loop (created once) sees
  // every increment; burstSeenRef tracks what it already fired.
  const burstKeyPropRef = useRef(burstKey);
  const burstSeenRef = useRef(0);
  const originRef = useRef(burstOrigin);
  burstKeyPropRef.current = burstKey;
  originRef.current = burstOrigin;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let petals: FallingPetal[] = [];
    let burst: BurstPetal[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: petalCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 7,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0008,
        vy: 0.14 + Math.random() * 0.28,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.4,
        pink: Math.floor(Math.random() * PINKS.length),
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 1.8;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.9,
          size: 4 + Math.random() * 5,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          life: 0,
          maxLife: 1100 + Math.random() * 700,
          pink: Math.floor(Math.random() * PINKS.length),
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.y += p.vy * dt * 0.06;
        p.angle += p.rotSpeed * dt;
        if (p.y > h + 16) {
          p.y = -16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 14;
        drawSakuraPetal(ctx, x, p.y, p.size, p.angle, PINKS[p.pink], p.alpha);
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06 + Math.sin(t / 900 + b.life / 300) * 0.3;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0009 * dt;
        b.angle += b.rotSpeed * dt;
        const k = 1 - b.life / b.maxLife;
        drawSakuraPetal(ctx, b.x, b.y, b.size, b.angle, PINKS[b.pink], 0.9 * k);
      }
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (burstKeyPropRef.current !== burstSeenRef.current) {
        burstSeenRef.current = burstKeyPropRef.current;
        if (burstKeyPropRef.current > 0) spawnBurst();
      }
      draw(t, dt);
      raf = requestAnimationFrame(tick);
    };

    seed();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petalCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SoundToggle — small discreet top-corner toggle, visible through   */
/* the whole sequence. Never autoplays; SFX start only after a tap.  */
/* ------------------------------------------------------------------ */

export function SoundToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={enabled ? "Sound on — tap to mute" : "Sound off — tap to unmute"}
      aria-pressed={enabled}
      title={enabled ? "Sound on (SFX)" : "Sound off"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#EC4899]/30 bg-[#FFF7FB]/80 text-[#6B21A8] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EC4899]"
      style={{ opacity: enabled ? 0.85 : 0.55 }}
    >
      {enabled ? (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* SkipButton — discreet bottom-corner jump straight to the          */
/* invitation, shown only while the cinematic is running.            */
/* ------------------------------------------------------------------ */

export function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="sd-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#6B21A8]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EC4899]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* FanOverlay — Phase 3 + 4. Five petal-pink curtain strips cover   */
/* the screen, then lift upward one after another (staggered, each  */
/* with a slight sway) to reveal the invitation mounted underneath; */
/* petals drift around them. On "fading" the strips dissolve, a     */
/* blossom swirls (scales + rotates + fades) at the centre and a    */
/* soft pink shimmer sweeps across. Fixed positioning,              */
/* pointer-events-none except for the Skip / sound controls.        */
/* ------------------------------------------------------------------ */

export type FanPhase = "closed" | "lifting" | "fading";

const CURTAIN_SHADES = ["#F9A8D4", "#FBCFE8", "#FDE7F1", "#F9A8D4", "#FBCFE8"];

export function FanOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: FanPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const lifting = phase !== "closed";
  return (
    <div
      data-sd-fan={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 flex"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Five petal-curtain strips — lift up with a stagger + sway */}
        {CURTAIN_SHADES.map((shade, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="relative h-full flex-1"
            style={{
              background: `linear-gradient(180deg, ${shade} 0%, #FDF2F8 100%)`,
              borderBottomLeftRadius: "50% 3.5rem",
              borderBottomRightRadius: "50% 3.5rem",
            }}
            initial={{ y: "0%", rotate: 0 }}
            animate={
              lifting
                ? { y: "-102%", rotate: i % 2 === 0 ? -2.5 : 2.5 }
                : { y: "0%", rotate: 0 }
            }
            transition={{
              duration: 1.9,
              delay: lifting ? 0.12 * i : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Blossom bud at the foot of each strip */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <Blossom className="h-7 w-7 drop-shadow-[0_2px_8px_rgba(107,33,168,0.35)]" />
            </span>
            {/* Thin plum branch line along the top edge */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 left-0 h-[3px] bg-[#6B21A8]/25"
            />
          </motion.div>
        ))}

        {/* Petals drifting around the lifting curtain */}
        <SakuraPetalCanvas petalCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — blossom swirl + pink shimmer */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.5, rotate: -40, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.6], rotate: [-40, 0, 55], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Blossom className="h-40 w-40 sm:h-56 sm:w-56" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(249,168,212,0.45) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <SkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
