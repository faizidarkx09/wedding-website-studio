// Cinematic opening helpers for Autumn Harvest — Phase 1 amber
// leaves, Phase 2 leaf-seal glow, Phase 3 barn-door panels,
// Phase 4 leaf transition + Web Audio SFX (paper rustle + warm
// harvest chime, synthesised — no audio files). Music is
// deliberately NOT included: no verified CC0 track could be bundled
// without bloating the template, so the toggle controls SFX only.
// Everything here is transform/opacity (canvas excepted) and
// respects prefers-reduced-motion. Modelled on the Blush Royale
// cinematic, but every visual is harvest-original: amber maple
// leaves instead of rose petals, kraft barn-door panels that SLIDE
// apart instead of rotating paper panels, and a maple-leaf
// transition instead of a heart.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Paper = filtered-noise burst sweeping */
/* down; chime = warm A-major arpeggio A4–C#5–E5–A5, sine + soft    */
/* triangle octave.                                                  */
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

/** Short paper-rustle: white noise through a bandpass sweeping 900→280 Hz. */
export function playPaperSound() {
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

/** Harvest chime: A4–C#5–E5–A5, sine + soft triangle octave, ~1.8s decay. */
export function playHarvestChime() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [440, 554.37, 659.25, 880];
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
/* LeafCanvas — one canvas, one rAF loop. Amber maple leaves drift  */
/* slowly down with sway + rotation; when burstKey increments, ~26  */
/* tiny golden particles burst from burstOrigin and fade over       */
/* ~1.4s. Renders nothing at all under prefers-reduced-motion.      */
/* leafCount 0 = burst-only (the cover already has FallingLeaves).   */
/* ------------------------------------------------------------------ */

interface Leaf {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotSpeed: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  color: number;
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

const AMBERS = ["192, 86, 33", "217, 142, 50", "232, 160, 92", "156, 61, 18", "185, 106, 46"];

function drawMapleLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rot: number,
  color: string,
  alpha: number,
) {
  // A simple 5-lobed maple leaf: five ellipses fanning from a stem.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = -2; i <= 2; i++) {
    const angle = (i * Math.PI) / 5;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.55, size * 0.22, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.24, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function LeafCanvas({
  leafCount = 14,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.42 },
  className = "",
}: {
  leafCount?: number;
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
    let leaves: Leaf[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      leaves = Array.from({ length: leafCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 7,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0006,
        vy: 0.12 + Math.random() * 0.25,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.35,
        color: Math.floor(Math.random() * AMBERS.length),
      }));
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
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of leaves) {
        p.y += p.vy * dt * 0.06;
        p.angle += p.rotSpeed * dt;
        if (p.y > h + 16) {
          p.y = -16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 14;
        drawMapleLeaf(ctx, x, p.y, p.size, p.angle, `rgb(${AMBERS[p.color]})`, p.alpha);
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0012 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 142, 50, ${(0.9 * k).toFixed(3)})`;
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#9C3D12]/30 bg-[#FFF7E8]/80 text-[#5C3A21] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C3D12]"
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
      className="ah-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#5C3A21]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C3D12]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* PanelsOverlay — Phase 3 + 4. Two kraft barn-door panels cover    */
/* the screen, then SLIDE apart horizontally (barn doors parting,   */
/* not rotating paper) to reveal the invitation mounted             */
/* underneath; amber leaves drift around them; on "fading" the      */
/* panels dissolve, a maple leaf scales + fades, and a warm golden   */
/* light sweep crosses. Fixed positioning, pointer-events-none      */
/* except for the Skip / sound controls.                            */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

const LEAF_PATH =
  "M50 6 C 58 20, 78 18, 88 30 C 76 34, 70 44, 74 58 C 60 54, 56 62, 50 88 C 44 62, 40 54, 26 58 C 30 44, 24 34, 12 30 C 22 18, 42 20, 50 6 Z";

export function PanelsOverlay({
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
      data-ah-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left barn door — slides left. Kraft planks: vertical
            repeating stripes + a horizontal brace bar near the top. */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            backgroundColor: "#D9B98A",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(92,58,33,0.14) 0px, rgba(92,58,33,0.14) 2px, transparent 2px, transparent 56px)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "-102%" : "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[18%] h-10 bg-[#C89B62]/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[62%] h-10 bg-[#C89B62]/70"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(58,36,18,0.28))" }}
          />
        </motion.div>

        {/* Right barn door — slides right. */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundColor: "#D9B98A",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(92,58,33,0.14) 0px, rgba(92,58,33,0.14) 2px, transparent 2px, transparent 56px)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "102%" : "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[18%] h-10 bg-[#C89B62]/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[62%] h-10 bg-[#C89B62]/70"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-16"
            style={{ background: "linear-gradient(270deg, transparent, rgba(58,36,18,0.28))" }}
          />
        </motion.div>

        {/* Amber leaves drifting around the parting doors */}
        <LeafCanvas leafCount={10} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — maple-leaf transition + golden light sweep */}
      {phase === "fading" && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.45], opacity: [0, 0.75, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d={LEAF_PATH} fill="#C05621" />
            <path d={LEAF_PATH} fill="none" stroke="#D98E32" strokeWidth="1.5" opacity="0.7" />
            <line x1="50" y1="12" x2="50" y2="92" stroke="#FFF7E8" strokeWidth="1.2" opacity="0.6" />
          </motion.svg>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(217,142,50,0.4) 50%, transparent 100%)",
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
