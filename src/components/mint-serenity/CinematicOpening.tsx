// Cinematic opening helpers for Mint Serenity — mint mist + bubbles.
// Phase 1: soft bubbles rising through a mint mist, the medallion
// bobbing gently, the leaf wreath breathing with a sage glow.
// Phase 2 (on tap, ~1.5s): the leaf wreath flares mint, a burst of
// tiny bubbles rises from it, a soft mist sweep crosses, button fades.
// Phase 3–4 (renderer): a mint mist curtain thins and dissolves to
// reveal the invitation, bubbles rising through it, a bubble-pop
// ring expanding and fading. Web Audio SFX only (bubble pops + soft
// chime, synthesised — no audio files, no autoplay). Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FONT_DISPLAY } from "./tokens";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Pops = three ascending sine blips;    */
/* chime = soft D5–F#5–A5 arpeggio.                                  */
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

/** Bubble pops: three short ascending sine blips. */
export function playPopSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    [600, 820, 1050].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.12;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.8, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.09);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Soft chime: D5–F#5–A5, sine + soft triangle octave, ~1.6s decay. */
export function playChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [587.33, 739.99, 880];
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
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.connect(g);
      g.connect(ctx.destination);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.6);
      osc2.start(t);
      osc2.stop(t + 1.6);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* BubbleCanvas — one canvas, one rAF loop. Glass bubbles rising     */
/* slowly with a wobble, and mist specks drifting; when burstKey    */
/* increments, ~20 small bubbles burst upward from burstOrigin and  */
/* fade over ~1.4s. Renders nothing at all under                   */
/* prefers-reduced-motion.                                           */
/* ------------------------------------------------------------------ */

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
}

interface Speck {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  alpha: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

export function BubbleCanvas({
  particleCount = 14,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.5 },
  className = "",
}: {
  particleCount?: number;
  burstKey?: number;
  burstOrigin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    let bubbles: Bubble[] = [];
    let specks: Speck[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bubbles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 3 + Math.random() * 7,
        vy: 0.12 + Math.random() * 0.28,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
      }));
      specks = Array.from({ length: 10 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.2,
        vy: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.3,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 20 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.3 + Math.random() * 1.1;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.9,
          r: 1.5 + Math.random() * 3,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    const drawBubble = (x: number, y: number, r: number, alpha: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.9).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.7).toFixed(3)})`;
      ctx.fill();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of specks) {
        s.y -= s.vy * dt * 0.06;
        if (s.y < -8) {
          s.y = h + 8;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(209, 250, 229, ${s.alpha.toFixed(3)})`;
        ctx.fill();
      }
      for (const b of bubbles) {
        b.y -= b.vy * dt * 0.06;
        if (b.y < -14) {
          b.y = h + 14;
          b.x = Math.random() * w;
        }
        const x = b.x + Math.sin(t / 2600 + b.phase) * b.sway * 10;
        drawBubble(x, b.y, b.r, b.alpha);
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy -= 0.0009 * dt;
        const k = 1 - b.life / b.maxLife;
        drawBubble(b.x, b.y, b.r, 0.85 * k);
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
  }, [particleCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#065F46]/40 bg-[#ECFDF5]/80 text-[#065F46] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#065F46]"
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
      style={FONT_DISPLAY}
      className="pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#065F46]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#065F46]"
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MistOverlay — Phase 3 + 4. A mint mist curtain covers the screen, */
/* then thins and dissolves to reveal the invitation mounted        */
/* underneath; bubbles rise through the mist; on "fading" a         */
/* bubble-pop ring expands and fades with a soft mint sweep. Fixed   */
/* positioning, pointer-events-none except for the Skip / sound      */
/* controls.                                                         */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

export function MistOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: PanelsPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-ms-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: phase === "fading" ? 0 : 1,
          scale: phase === "fading" ? 1.06 : opening ? 1.02 : 1,
        }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Mint mist curtain — soft radial mists + pale circles */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(167, 243, 208, 0.9) 0%, rgba(236, 253, 245, 0.65) 55%, rgba(236, 253, 245, 0.35) 100%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(209, 250, 229, 0.9) 0%, rgba(236, 253, 245, 0.4) 70%), linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 55%, #A7F3D0 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#6EE7B7]/50 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-[#A7F3D0]/60 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-12 h-72 w-72 rounded-full bg-white/60 blur-2xl"
        />

        {/* Bubbles rising through the mist */}
        <BubbleCanvas particleCount={14} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — bubble-pop ring + soft mint sweep */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 sm:h-64 sm:w-64"
            style={{ boxShadow: "0 0 40px rgba(255,255,255,0.6), inset 0 0 30px rgba(167,243,208,0.5)" }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1, 1.6], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#065F46]/50 sm:h-32 sm:w-32"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.5], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
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
