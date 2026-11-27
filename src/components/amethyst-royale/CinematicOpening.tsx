// Cinematic opening helpers for Amethyst Royale — NO envelope.
// The cinematic IS the card reveal: Phase 1 twinkling crystal
// sparkles, Phase 2 crest flare on tap, Phase 3 the full-screen
// crystal face cleaving along the same diagonal as the invitation
// card (top-left half down-left, bottom-right half up-right) to
// reveal the card at rest beneath, Phase 4 a spinning faceted gem
// dissolving into sparkles. Web Audio SFX only (crystal chime +
// shimmer, synthesised — no audio files, no music).
// Transform/opacity only and respects prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Chime = high crystal arpeggio        */
/* A5–C6–E6; shimmer = a soft highpass noise wash.                  */
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

/** Crystal chime: A5–C6–E6, triangle bells, ~1.6s decay. */
export function playCrystalChime() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [880.0, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.18;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.02);
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

/** Shimmer wash: white noise through a highpass sweeping 2k→6k Hz. */
export function playShimmerSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.8;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(2000, ctx.currentTime);
    hp.frequency.exponentialRampToValueAtTime(6000, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(hp);
    hp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* CrystalCanvas — one canvas, one rAF loop. Four-point star         */
/* sparkles twinkle (alpha oscillates) across violet tones; when    */
/* burstKey increments, ~26 violet/white sparkles burst from        */
/* burstOrigin and fade over ~1.4s. Renders nothing under           */
/* prefers-reduced-motion.                                          */
/* ------------------------------------------------------------------ */

interface Sparkle {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  alpha: number;
  color: string;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  color: string;
}

const SPARKLES = ["221, 214, 254", "196, 181, 253", "255, 255, 255", "167, 139, 250"];

export function CrystalCanvas({
  sparkleCount = 14,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  className = "",
}: {
  sparkleCount?: number;
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
    let sparkles: Sparkle[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparkles = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.9,
        alpha: 0.3 + Math.random() * 0.5,
        color: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.7;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          r: 1 + Math.random() * 2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
          color: SPARKLES[Math.floor(Math.random() * SPARKLES.length)],
        };
      });
    };

    const drawStar = (x: number, y: number, r: number, alpha: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y);
      ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fillStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
      ctx.fill();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of sparkles) {
        const a = s.alpha * (0.35 + 0.65 * Math.abs(Math.sin((t / 1000) * s.speed + s.phase)));
        drawStar(s.x, s.y, s.size, a, s.color);
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.001 * dt;
        const k = 1 - b.life / b.maxLife;
        drawStar(b.x, b.y, b.r * 2.2, 0.9 * k, b.color);
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
  }, [sparkleCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD6FE]/50 bg-[#2E1065]/60 text-[#EDE9FE] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DDD6FE]"
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
      className="ar-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#EDE9FE]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#DDD6FE]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CrystalOverlay — Phase 3 + 4. The cinematic IS the card reveal,  */
/* at full-screen scale: the whole screen is one deep-violet        */
/* crystal face that CLEAVES along the same top-right → bottom-left */
/* diagonal as the invitation card — the top-left half slides       */
/* down-left, the bottom-right half slides up-right — to reveal the */
/* invitation (card back at rest) mounted underneath. A bright      */
/* facet edge marks the cleave line and fades as the halves part;   */
/* on "fading" a faceted gem spins and dissolves into sparkles     */
/* while a violet shimmer sweeps across. Fixed positioning,         */
/* pointer-events-none except for the Skip / sound controls.        */
/* ------------------------------------------------------------------ */

export type CrystalPhase = "closed" | "parting" | "fading";

export function CrystalOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: CrystalPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-ar-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Half A — top-left triangle of the full-screen crystal
            face (same clip + gradient as the card back), slides
            down-left along the diagonal on parting. */}
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            background:
              "linear-gradient(140deg, #2E1065 0%, #5B21B6 45%, #7C3AED 78%, #4C1D95 100%)",
          }}
          initial={false}
          animate={parting ? { x: "-102%", y: "102%" } : { x: "0%", y: "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(140deg, rgba(46,16,101,0.3) 0%, rgba(124,58,237,0.05) 70%, rgba(221,214,254,0.22) 100%)",
            }}
          />
        </motion.div>

        {/* Half B — bottom-right triangle, slides up-right along the
            diagonal on parting. */}
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            background:
              "linear-gradient(140deg, #2E1065 0%, #5B21B6 45%, #7C3AED 78%, #4C1D95 100%)",
          }}
          initial={false}
          animate={parting ? { x: "102%", y: "-102%" } : { x: "0%", y: "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(320deg, rgba(46,16,101,0.3) 0%, rgba(124,58,237,0.05) 70%, rgba(221,214,254,0.22) 100%)",
            }}
          />
        </motion.div>

        {/* Bright facet edge along the cleave line (top-right →
            bottom-left) — the card's own cleave line, at
            full-screen scale. Fades as the halves part. */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 z-10 h-full w-full"
          initial={false}
          animate={{ opacity: parting ? 0 : 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="#C4B5FD"
            strokeWidth="8"
            vectorEffect="non-scaling-stroke"
            opacity="0.3"
          />
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="#F5F0FA"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
          />
        </motion.svg>

        {/* Sparkles drifting around the cleaving crystal face */}
        <CrystalCanvas sparkleCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — spinning faceted gem dissolving into sparkles */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-52 sm:w-52"
            initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
            animate={{ scale: [0.6, 1, 1.25], opacity: [0, 0.95, 0], rotate: [0, 60, 120] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              <polygon
                points="50,4 86,26 86,74 50,96 14,74 14,26"
                fill="url(#arGem)"
                stroke="#DDD6FE"
                strokeWidth="1.5"
              />
              <line x1="50" y1="4" x2="50" y2="96" stroke="#DDD6FE" strokeWidth="1" opacity="0.7" />
              <line x1="14" y1="26" x2="86" y2="74" stroke="#DDD6FE" strokeWidth="1" opacity="0.7" />
              <line x1="86" y1="26" x2="14" y2="74" stroke="#DDD6FE" strokeWidth="1" opacity="0.7" />
              <defs>
                <linearGradient id="arGem" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#4C1D95" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(221,214,254,0.45) 50%, transparent 100%)",
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
