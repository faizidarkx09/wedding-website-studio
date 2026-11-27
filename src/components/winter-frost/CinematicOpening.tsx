// Cinematic opening helpers for Winter Frost — Phase 1 snowfall,
// Phase 2 frost burst, Phase 3–4 the full-screen frost-mist veil:
// the mist thins, drifts upward and fades away (the same "mist
// dissolve" as the card reveal) to reveal the invitation card
// mounted underneath; a snowflake burst + aurora shimmer land the
// reveal. Web Audio SFX (frost wind + ice-bell chime, synthesised
// — no audio files). Music is deliberately NOT included: no
// verified CC0 track is bundled, so the toggle controls SFX only.
// Everything here is transform / opacity (canvas excepted) and
// respects prefers-reduced-motion. There is NO envelope anywhere
// in this opening: the cinematic leads into the CARD, and the
// mist veil IS the reveal.
//
// Deliberately DIFFERENT from Blush Royale's opening: snowflakes
// (six-arm asterisks) instead of petals, a frost-mist veil that
// DISSOLVES upward instead of paper panels rotating open, a
// snowflake burst instead of a heart, and an aurora shimmer
// instead of rose-gold.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Frost wind = filtered noise sweeping  */
/* UP (cold air over ice); ice chime = crystalline bell arpeggio    */
/* A5–D6–E6–A6, sine + soft triangle octave.                        */
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

/** Frost wind: white noise through a bandpass sweeping 600→2400 Hz. */
export function playFrostSound() {
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
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(600, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Ice-bell chime: A5–D6–E6–A6, sine + soft triangle octave, ~2s decay. */
export function playIceChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [880, 1174.66, 1318.51, 1760];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.18;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      osc.connect(g);
      g.connect(ctx.destination);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);
      osc2.start(t);
      osc2.stop(t + 2.0);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* SnowflakeCanvas — one canvas, one rAF loop. Six-arm snowflake    */
/* asterisks drift slowly down with sway + slow spin; when burstKey  */
/* increments, ~28 ice-blue/white sparkles burst from burstOrigin   */
/* and fade over ~1.4s. Renders nothing at all under                */
/* prefers-reduced-motion.                                          */
/* ------------------------------------------------------------------ */

interface Flake {
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
  blue: number;
}

export function SnowflakeCanvas({
  flakeCount = 16,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.58 },
  className = "",
}: {
  flakeCount?: number;
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
    let flakes: Flake[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: flakeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 5,
        angle: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.0004,
        vy: 0.1 + Math.random() * 0.22,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.4,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 28 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.8;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 900 + Math.random() * 600,
          blue: Math.random() < 0.5 ? 0 : 1,
        };
      });
    };

    const drawFlake = (x: number, y: number, size: number, angle: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(-size * Math.cos(a), -size * Math.sin(a));
        ctx.lineTo(size * Math.cos(a), size * Math.sin(a));
        ctx.stroke();
      }
      ctx.restore();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of flakes) {
        p.y += p.vy * dt * 0.06;
        p.angle += p.rotSpeed * dt;
        if (p.y > h + 16) {
          p.y = -16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 14;
        drawFlake(x, p.y, p.size, p.angle, p.alpha);
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
        ctx.fillStyle =
          b.blue === 1
            ? `rgba(189, 224, 245, ${(0.9 * k).toFixed(3)})`
            : `rgba(255, 255, 255, ${(0.9 * k).toFixed(3)})`;
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
  }, [flakeCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#BDE0F5]/40 bg-[#0B2540]/60 text-[#D6EBF9] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BDE0F5]"
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
      className="wf-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#D6EBF9]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BDE0F5]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* FrostSnowflake — a large six-arm snowflake SVG for the Phase 4   */
/* burst, drawn with the same arm geometry as the crest.             */
/* ------------------------------------------------------------------ */

function FrostSnowflake({ className = "" }: { className?: string }) {
  const arms = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tipX = 100 + 92 * cos;
    const tipY = 100 + 92 * sin;
    const midX = 100 + 62 * cos;
    const midY = 100 + 62 * sin;
    const perpX = -sin;
    const perpY = cos;
    return {
      tipX,
      tipY,
      midX,
      midY,
      b1x: midX + 16 * perpX,
      b1y: midY + 16 * perpY,
      b2x: midX - 16 * perpX,
      b2y: midY - 16 * perpY,
    };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {arms.map((a, i) => (
        <g key={i} stroke="#D6EBF9" strokeLinecap="round">
          <line x1="100" y1="100" x2={a.tipX} y2={a.tipY} strokeWidth="3" />
          <line x1={a.midX} y1={a.midY} x2={a.b1x} y2={a.b1y} strokeWidth="2" />
          <line x1={a.midX} y1={a.midY} x2={a.b2x} y2={a.b2y} strokeWidth="2" />
        </g>
      ))}
      <circle cx="100" cy="100" r="10" fill="#D6EBF9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* PanelsOverlay — Phase 3 + 4 (kept export name: the renderer     */
/* imports it). A full-screen frost-mist veil covers the screen,    */
/* then THINS, drifts upward and fades away — the same mist         */
/* dissolve as the card reveal — to reveal the invitation card      */
/* mounted underneath; snowflakes drift around it; on "fading"     */
/* the veil is gone, a snowflake bursts + fades, and a soft aurora  */
/* shimmer sweeps across. The cinematic IS the reveal: there is no  */
/* panel, flap or shape that reads as an envelope. Fixed            */
/* positioning, pointer-events-none except for the Skip / sound    */
/* controls. Under prefers-reduced-motion the veil never mounts —  */
/* the card is already underneath, so the reveal is instant.       */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

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
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return null;

  const thinning = phase !== "closed";
  return (
    <div data-wf-panels={phase} className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* The mist veil — one full-screen layer, not two panels. */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(165deg, rgba(234, 244, 251, 0.94) 0%, rgba(189, 224, 245, 0.9) 52%, rgba(127, 179, 217, 0.92) 100%)",
        }}
        initial={false}
        animate={
          phase === "fading"
            ? { opacity: 0, y: "-10%", filter: "blur(12px)" }
            : thinning
              ? { opacity: 0.55, y: "-4%", filter: "blur(6px)" }
              : { opacity: 1, y: "0%", filter: "blur(0px)" }
        }
        transition={
          phase === "fading"
            ? { duration: 1.2, ease: [0.65, 0, 0.35, 1] }
            : { duration: 2.2, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* Soft white glow at the centre, like light through mist */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255, 255, 255, 0.65) 0%, transparent 70%)",
          }}
        />

        {/* Slow-drifting mist blobs inside the veil */}
        <motion.div
          aria-hidden="true"
          className="absolute -left-16 top-1/4 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 32, 0], y: [0, -24, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-16 bottom-1/4 h-72 w-72 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(214, 235, 249, 0.7) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0, 0.55, 1] }}
        />

        {/* Frost crystals — large faint snowflakes in the mist */}
        <FrostSnowflake className="absolute -top-8 -left-8 h-40 w-40 opacity-25" />
        <FrostSnowflake className="absolute -right-10 -bottom-10 h-52 w-52 opacity-20" />

        {/* Snowflakes drifting through the thinning mist */}
        <SnowflakeCanvas flakeCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — snowflake burst + soft aurora shimmer */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-44 w-44 -translate-x-1/2 -translate-y-1/2 sm:h-60 sm:w-60"
            initial={{ scale: 0.6, opacity: 0, rotate: -18 }}
            animate={{ scale: [0.6, 1, 1.5], opacity: [0, 0.85, 0], rotate: [-18, 0, 24] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <FrostSnowflake className="h-full w-full drop-shadow-[0_0_18px_rgba(189,224,245,0.8)]" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(127, 179, 217, 0.4) 35%, rgba(150, 220, 205, 0.35) 50%, rgba(189, 224, 245, 0.4) 65%, transparent 100%)",
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
