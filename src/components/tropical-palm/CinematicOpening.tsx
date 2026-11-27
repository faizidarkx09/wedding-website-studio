// Cinematic opening helpers for Tropical Palm — Phase 1 dappled
// island light + falling palm leaves, Phase 2 crest glow on tap,
// Phase 3 panels parting diagonally like palm leaves, Phase 4
// sun rays + falling leaves. The panels part onto the invitation
// CARD blooming in (there is no envelope — the card blooms as the
// panels part; see TropicalPalmEnvelope's "tp-bloom-on-mount" flag).
// Web Audio SFX only (gentle wave + island chime, synthesised — no
// audio files, no music). Transform/opacity only and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Wave = filtered-noise wash sweeping  */
/* 800→200 Hz; chime = island arpeggio C5–G4–E5.                   */
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

/** Gentle wave wash: white noise through a lowpass sweeping 800→200 Hz. */
export function playWaveSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 1.0;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(800, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Island chime: C5–G4–E5, sine + soft triangle octave, ~1.7s decay. */
export function playIslandChime() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [523.25, 392.0, 659.25];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.17;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
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
/* LeafCanvas — one canvas, one rAF loop. Palm leaves (small green   */
/* ellipses) fall slowly with sway, dappled light spots drift; when  */
/* burstKey increments, ~22 leaves + light spots burst from         */
/* burstOrigin and fade over ~1.5s. Renders nothing under           */
/* prefers-reduced-motion.                                          */
/* ------------------------------------------------------------------ */

interface Leaf {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  sway: number;
  phase: number;
  rot: number;
  alpha: number;
  light: boolean;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  leaf: boolean;
  rot: number;
}

export function LeafCanvas({
  leafCount = 12,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  className = "",
}: {
  leafCount?: number;
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
    let leaves: Leaf[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      leaves = Array.from({ length: leafCount }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        w: 5 + Math.random() * 7,
        h: 2 + Math.random() * 2.5,
        vy: 0.12 + Math.random() * 0.22,
        sway: 0.5 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI,
        alpha: 0.35 + Math.random() * 0.35,
        light: i % 3 === 0,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 22 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.5;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          r: 2 + Math.random() * 4,
          life: 0,
          maxLife: 1000 + Math.random() * 600,
          leaf: Math.random() > 0.4,
          rot: Math.random() * Math.PI,
        };
      });
    };

    const drawLeaf = (x: number, y: number, rw: number, rh: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(27, 77, 62, ${alpha.toFixed(3)})`;
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const l of leaves) {
        l.y += l.vy * dt * 0.06;
        if (l.y > h + 16) {
          l.y = -16;
          l.x = Math.random() * w;
        }
        const x = l.x + Math.sin(t / 2200 + l.phase) * l.sway * 14;
        if (l.light) {
          ctx.beginPath();
          ctx.arc(x, l.y, l.w * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 236, 180, ${(l.alpha * 0.35).toFixed(3)})`;
          ctx.fill();
        } else {
          drawLeaf(x, l.y, l.w, l.h, l.rot + Math.sin(t / 1800 + l.phase) * 0.4, l.alpha);
        }
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.001 * dt;
        const k = 1 - b.life / b.maxLife;
        if (b.leaf) {
          drawLeaf(b.x, b.y, b.r, b.r * 0.45, b.rot + b.life / 300, 0.85 * k);
        } else {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 236, 180, ${(0.9 * k).toFixed(3)})`;
          ctx.fill();
        }
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
  }, [leafCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#FDE68A]/50 bg-[#0A2E19]/60 text-[#FEF9C3] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDE68A]"
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
      className="tp-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FEF9C3]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDE68A]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* PalmOverlay — Phase 3 + 4. Two deep-green panels part DIAGONALLY  */
/* (top-left slides up-left, bottom-right slides down-right) like   */
/* parting palm leaves, revealing the invitation card blooming in   */
/* underneath; on "fading" sun rays rotate out while leaves fall.   */
/* The panels are palm leaves parting — NOT an envelope. Fixed       */
/* positioning, pointer-events-none except for the Skip / sound     */
/* controls.                                                         */
/* ------------------------------------------------------------------ */

export type PalmPhase = "closed" | "parting" | "fading";

export function PalmOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: PalmPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-tp-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Top-left panel — deep palm, slides up-left diagonally */}
        <motion.div
          className="absolute top-0 left-0 h-[72%] w-[78%]"
          style={{
            background: "linear-gradient(135deg, #0A2E19 0%, #1B4D3E 55%, #2E7D5B 100%)",
            clipPath: "polygon(0 0, 100% 0, 62% 100%, 0 100%)",
          }}
          initial={{ x: 0, y: 0 }}
          animate={parting ? { x: "-105%", y: "-55%" } : { x: 0, y: 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,46,25,0.3) 0%, rgba(46,125,91,0.05) 60%, rgba(253,230,138,0.2) 100%)",
            }}
          />
        </motion.div>

        {/* Bottom-right panel — sea green, slides down-right diagonally */}
        <motion.div
          className="absolute right-0 bottom-0 h-[72%] w-[78%]"
          style={{
            background: "linear-gradient(315deg, #0A2E19 0%, #1B4D3E 55%, #2E7D5B 100%)",
            clipPath: "polygon(38% 0, 100% 0, 100% 100%, 0 100%)",
          }}
          initial={{ x: 0, y: 0 }}
          animate={parting ? { x: "105%", y: "55%" } : { x: 0, y: 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(315deg, rgba(10,46,25,0.3) 0%, rgba(46,125,91,0.05) 60%, rgba(253,230,138,0.2) 100%)",
            }}
          />
        </motion.div>

        {/* Leaves + dappled light drifting around the parting fronds */}
        <LeafCanvas leafCount={10} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — rotating sun rays + falling leaves */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 sm:h-96 sm:w-96"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,236,180,0.4) 0deg 8deg, transparent 8deg 24deg)",
              maskImage: "radial-gradient(circle, black 0%, transparent 68%)",
              WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 68%)",
            }}
            initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
            animate={{ scale: [0.4, 1, 1.3], opacity: [0, 0.9, 0], rotate: [0, 30, 60] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,236,180,0.4) 50%, transparent 100%)",
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
