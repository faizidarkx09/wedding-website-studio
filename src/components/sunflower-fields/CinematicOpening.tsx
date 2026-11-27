// Cinematic opening helpers for Sunflower Fields — sunflower bloom.
// Phase 1: golden pollen drifting over the field, sunflowers swaying
// in the breeze, warm sunlight breathing across the sky.
// Phase 2 (on tap, ~1.5s): the sunflower crest blooms (scale +
// petal flare), a burst of golden pollen, a sun-ray sweep across
// the crest, button fades.
// Phase 3–4 (renderer): the sky panel lifts and the field panel
// drops — the field opens to the sky — a sunflower bloom scales up
// in the centre and dissolves with a pollen burst and sunlight
// sweep. Web Audio SFX only (soft rustle + bright bloom chime,
// synthesised — no audio files, no autoplay). Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FONT_DISPLAY } from "./tokens";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Rustle = filtered-noise burst; chime  */
/* = bright E5–G#5–B5–E6 arpeggio.                                  */
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

/** Soft rustle: white noise through a bandpass sweeping 1200→500 Hz. */
export function playRustleSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.6;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(1200, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Bright bloom chime: E5–G#5–B5–E6, sine + soft triangle octave. */
export function playChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [659.25, 830.61, 987.77, 1318.51];
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
/* PollenCanvas — one canvas, one rAF loop. Golden pollen drifting   */
/* on the breeze and small yellow petals falling slowly with a sway; */
/* when burstKey increments, ~24 golden pollen particles burst from */
/* burstOrigin and fade over ~1.4s. Renders nothing at all under    */
/* prefers-reduced-motion.                                           */
/* ------------------------------------------------------------------ */

interface Pollen {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  alpha: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotSpeed: number;
  vy: number;
  sway: number;
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

export function PollenCanvas({
  particleCount = 16,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.55 },
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
    let pollen: Pollen[] = [];
    let petals: Petal[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pollen = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.6,
        vx: 0.1 + Math.random() * 0.3,
        vy: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.45,
      }));
      petals = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 4 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0008,
        vy: 0.12 + Math.random() * 0.2,
        sway: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.4 + Math.random() * 0.35,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 24 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.6;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pollen) {
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06 + Math.sin(t / 2600 + p.phase) * 0.08;
        if (p.x > w + 8) {
          p.x = -8;
          p.y = Math.random() * h;
        }
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha.toFixed(3)})`;
        ctx.fill();
      }
      for (const p of petals) {
        p.y += p.vy * dt * 0.06;
        p.angle += p.rotSpeed * dt;
        if (p.y > h + 16) {
          p.y = -16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 12;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 224, 71, ${p.alpha.toFixed(3)})`;
        ctx.fill();
        ctx.restore();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0009 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${(0.9 * k).toFixed(3)})`;
        ctx.fill();
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#FACC15]/50 bg-[#14532D]/70 text-[#FFFBEB] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FACC15]"
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
      style={{ fontFamily: FONT_DISPLAY }}
      className="pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FFFBEB]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FACC15]"
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* FieldSplitOverlay — Phase 3 + 4. The sky panel lifts and the      */
/* field panel drops — the field opens to the sky — revealing the    */
/* invitation mounted underneath; pollen drifts around them; on      */
/* "fading" a sunflower bloom scales up in the centre and dissolves  */
/* with a sunlight sweep. Fixed positioning, pointer-events-none     */
/* except for the Skip / sound controls.                             */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

export function FieldSplitOverlay({
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
      data-sf-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Sky panel — lifts up */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, #BFDBFE 0%, #DBEAFE 55%, #FEF9C3 100%)",
          }}
          initial={{ y: "0%" }}
          animate={{ y: opening ? "-102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute top-[18%] left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-[#FDE68A]"
            style={{ boxShadow: "0 0 60px 24px rgba(253, 230, 138, 0.75)" }}
          />
          <div
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-8"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(250,204,21,0.5))",
            }}
          />
        </motion.div>

        {/* Field panel — drops down */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, #166534 0%, #14532D 60%, #052E16 100%)",
          }}
          initial={{ y: "0%" }}
          animate={{ y: opening ? "102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-10"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent 0px, transparent 46px, rgba(250,204,21,0.35) 46px, rgba(250,204,21,0.35) 50px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 left-0 h-8"
            style={{
              background: "linear-gradient(0deg, transparent, rgba(250,204,21,0.4))",
            }}
          />
        </motion.div>

        {/* Pollen drifting around the opening field */}
        <PollenCanvas particleCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — sunflower bloom + sunlight sweep */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-52 w-52 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72"
            initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{ scale: [0.5, 1, 1.45], opacity: [0, 0.9, 0], rotate: 25 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg, #FACC15 0deg 12deg, #EAB308 12deg 24deg)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-[24%] rounded-full bg-[#451A03]"
              style={{ boxShadow: "inset 0 0 0 4px #78350F" }}
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(253,230,138,0.45) 50%, transparent 100%)",
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
