// Rose Garden cinematic opening — "Bloom".
// Phase 1: falling rose petals + a soft glow pulse on the garden
// arch. Phase 2 (tap, ~1.5s): a burst of rose petals from the
// medallion, a rose chime (A major), one gentle arch pulse, a light
// sweep across the arch photo. Phase 3: GARDEN GATES — two
// rose-trellis panels swing open like double doors, hinged at the
// OUTER edges (opposite hinge from Blush's centre-seam panels), to
// reveal the invitation mounted underneath. Phase 4: petals drift,
// a blooming rose scales + fades, a rose shimmer sweeps across,
// invitation zooms 1.04 → 1.
// SFX-only via Web Audio (created lazily on tap, never autoplay);
// the toggle controls SFX only — no music. Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Paper = filtered-noise burst sweeping */
/* down; rose chime = gentle A-major arpeggio A4–C#5–E5–A5.         */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setRoseGardenSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isRoseGardenSoundEnabled() {
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

/** Short paper-rustle: white noise through a bandpass sweeping 900→280 Hz. */
export function playRoseGardenPaperSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.7;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(900, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Rose chime: A4–C#5–E5–A5, sine + soft triangle octave, ~1.8s decay. */
export function playRoseChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [440.0, 554.37, 659.25, 880.0];
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
      g.gain.exponentialRampToValueAtTime(0.11, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.035, t + 0.03);
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
/* PetalBurstCanvas — renders nothing until burstKey increments,    */
/* then ~26 rose petals (soft ellipses) burst from burstOrigin and  */
/* drift down + fade over ~1.6s. Renders nothing at all under       */
/* prefers-reduced-motion.                                           */
/* ------------------------------------------------------------------ */

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
  color: number;
}

const ROSES = ["244, 167, 185", "179, 18, 79", "248, 205, 210", "126, 12, 55"];

export function PetalBurstCanvas({
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.55 },
  className = "",
}: {
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
    let burst: BurstPetal[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.6;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          size: 4 + Math.random() * 6,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          life: 0,
          maxLife: 1000 + Math.random() * 700,
          color: Math.floor(Math.random() * ROSES.length),
        };
      });
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (burstKeyPropRef.current !== burstSeenRef.current) {
        burstSeenRef.current = burstKeyPropRef.current;
        if (burstKeyPropRef.current > 0) spawnBurst();
      }
      ctx.clearRect(0, 0, w, h);
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.001 * dt;
        b.angle += b.rotSpeed * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size, b.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ROSES[b.color]}, ${(0.9 * k).toFixed(3)})`;
        ctx.fill();
        ctx.restore();
      }
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
/* SoundToggle — small discreet top-corner toggle, visible through   */
/* the whole sequence. Never autoplays; SFX start only after a tap.  */
/* ------------------------------------------------------------------ */

export function RoseGardenSoundToggle({
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#B3124F]/40 bg-[#FFF7F2]/85 text-[#3D1420] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3124F]"
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

export function RoseGardenSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="rg-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#3D1420]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B3124F]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* GardenGatesOverlay — Phase 3 + 4. Two rose-trellis panels cover  */
/* the screen, then swing open like double garden gates, hinged at  */
/* the OUTER edges (opposite hinge from Blush's centre seam), to    */
/* reveal the invitation mounted underneath; on "fading" the gates  */
/* dissolve, a blooming rose scales + fades, and a rose shimmer     */
/* sweeps across. Fixed positioning, pointer-events-none except for  */
/* the Skip / sound controls.                                        */
/* ------------------------------------------------------------------ */

export type GardenGatesPhase = "closed" | "opening" | "fading";

const ROSE_PATH =
  "M50 20 C60 12 74 14 78 26 C82 38 74 48 66 52 C78 54 86 64 82 76 C78 88 64 92 54 84 C50 90 44 90 40 84 C30 92 16 88 12 76 C8 64 16 54 28 52 C20 48 12 38 16 26 C20 14 34 12 44 20 C46 16 48 16 50 20 Z";

export function GardenGatesOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: GardenGatesPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-rg-gates={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left gate — hinged at the outer left edge, swings open */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, #B3124F 0%, #7E0C37 55%, #3D1420 100%)",
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: opening ? 102 : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "repeating-linear-gradient(45deg, rgba(255,247,242,0.5) 0px 2px, transparent 2px 26px), repeating-linear-gradient(-45deg, rgba(255,247,242,0.5) 0px 2px, transparent 2px 26px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(61,20,32,0.3))" }}
          />
        </motion.div>

        {/* Right gate — hinged at the outer right edge, swings open */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            transformOrigin: "right center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(225deg, #F4A7B9 0%, #B3124F 55%, #3D1420 100%)",
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: opening ? -102 : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "repeating-linear-gradient(45deg, rgba(255,247,242,0.5) 0px 2px, transparent 2px 26px), repeating-linear-gradient(-45deg, rgba(255,247,242,0.5) 0px 2px, transparent 2px 26px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-16"
            style={{ background: "linear-gradient(270deg, transparent, rgba(61,20,32,0.3))" }}
          />
        </motion.div>

        {/* Petals drifting around the opening gates */}
        <PetalBurstCanvas burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — blooming rose + rose shimmer sweep */}
      {phase === "fading" && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.45], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d={ROSE_PATH} fill="#B3124F" />
            <path d={ROSE_PATH} fill="none" stroke="#F4A7B9" strokeWidth="1.5" opacity="0.7" />
          </motion.svg>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(244,167,185,0.4) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <RoseGardenSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <RoseGardenSkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
