// Cinematic opening helpers for Vintage Lace — Phase 1 lace veil
// unfurl + golden dust motes in soft light, Phase 2 lace-seal
// warming glow, Phase 3 lace-veil panels parting, Phase 4 warm
// light sweep + shimmer. Web Audio SFX are synthesised (lace
// rustle + soft chime) — no audio files, no autoplay, no music.
// Everything here is transform/opacity (canvas excepted) and
// respects prefers-reduced-motion. Follows the Blush Royale
// CinematicOpening pattern, with different phases, motion and
// particles: motes drift UP in a light beam (Blush petals fall),
// panels SLIDE apart like curtains (Blush panels rotate open),
// and the Phase 4 transition is a lace rosette, not a heart.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Lace rustle = filtered-noise burst   */
/* sweeping 1400→500 Hz, softer and longer than paper; chime = warm */
/* A-major arpeggio A4–C#5–E5–A5, sine + soft triangle octave.      */
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

/** Soft lace/fabric rustle: white noise through a bandpass sweeping 1400→500 Hz. */
export function playLaceSound() {
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
    bp.frequency.setValueAtTime(1400, ctx.currentTime);
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

/** Soft chime: A4–C#5–E5–A5, sine + soft triangle octave, ~2s decay. */
export function playSoftChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.2;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.04);
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
/* DustMoteCanvas — one canvas, one rAF loop. Golden dust motes     */
/* drift slowly UPWARD through a soft shaft of light (the reverse   */
/* of Blush's falling petals), twinkling gently; when glowKey       */
/* increments, a warm golden glow blooms from glowOrigin and ~18    */
/* tiny sparkles drift outward, fading over ~1.6s. Renders nothing */
/* at all under prefers-reduced-motion.                             */
/* ------------------------------------------------------------------ */

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  gold: boolean;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

const MOTE_COLORS = {
  gold: "212, 175, 105",
  sepia: "180, 155, 125",
};

export function DustMoteCanvas({
  moteCount = 22,
  glowKey = 0,
  glowOrigin = { x: 0.5, y: 0.72 },
  className = "",
}: {
  moteCount?: number;
  glowKey?: number;
  glowOrigin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // glowKey arrives via a ref so the rAF loop (created once) sees
  // every increment; glowSeenRef tracks what it already fired.
  const glowKeyPropRef = useRef(glowKey);
  const glowSeenRef = useRef(0);
  const originRef = useRef(glowOrigin);
  glowKeyPropRef.current = glowKey;
  originRef.current = glowOrigin;

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
    let motes: Mote[] = [];
    let sparkles: Sparkle[] = [];
    let glow: { x: number; y: number; life: number; maxLife: number } | null = null;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: moteCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.2,
        // Slow upward drift (motes rise in the light, unlike petals).
        vy: 0.08 + Math.random() * 0.2,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.5,
        gold: Math.random() < 0.55,
      }));
    };

    const spawnGlow = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      glow = { x: ox, y: oy, life: 0, maxLife: 1600 };
      sparkles = Array.from({ length: 18 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.2 + Math.random() * 0.9;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.35,
          r: 0.9 + Math.random() * 1.8,
          life: 0,
          maxLife: 1000 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      // Warm glow bloom, expanding and fading.
      if (glow) {
        glow.life += dt;
        const k = 1 - glow.life / glow.maxLife;
        if (k <= 0) {
          glow = null;
        } else {
          const radius = 40 + (1 - k) * 190;
          const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, radius);
          grad.addColorStop(0, `rgba(212, 175, 105, ${(0.5 * k).toFixed(3)})`);
          grad.addColorStop(0.55, `rgba(212, 175, 105, ${(0.18 * k).toFixed(3)})`);
          grad.addColorStop(1, "rgba(212, 175, 105, 0)");
          ctx.beginPath();
          ctx.arc(glow.x, glow.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
      for (const m of motes) {
        m.y -= m.vy * dt * 0.06;
        if (m.y < -12) {
          m.y = h + 12;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(t / 3000 + m.phase) * m.sway * 12;
        const twinkle = 0.7 + 0.3 * Math.sin(t / 1100 + m.phase * 3);
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.gold
          ? `rgba(${MOTE_COLORS.gold}, ${(m.alpha * twinkle).toFixed(3)})`
          : `rgba(${MOTE_COLORS.sepia}, ${(m.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      sparkles = sparkles.filter((s) => s.life < s.maxLife);
      for (const s of sparkles) {
        s.life += dt;
        s.x += s.vx * dt * 0.06;
        s.y += s.vy * dt * 0.06;
        s.vy += 0.0006 * dt;
        const k = 1 - s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 105, ${(0.9 * k).toFixed(3)})`;
        ctx.fill();
      }
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (glowKeyPropRef.current !== glowSeenRef.current) {
        glowSeenRef.current = glowKeyPropRef.current;
        if (glowKeyPropRef.current > 0) spawnGlow();
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
  }, [moteCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#8B7355]/40 bg-[#FFFDF8]/85 text-[#4A3A2E] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B7355]"
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
      className="vl-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#4A3A2E]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B7355]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lace-veil panel background: ivory linen with a faint scalloped   */
/* lace dot pattern (two offset radial tilings) + a soft vertical   */
/* linen gradient. Pure CSS, no image asset.                         */
/* ------------------------------------------------------------------ */

const VEIL_BACKGROUND = [
  "radial-gradient(circle 10px at 12px 12px, rgba(139, 115, 85, 0.13) 9px, transparent 10.5px)",
  "radial-gradient(circle 10px at 36px 36px, rgba(192, 138, 142, 0.11) 9px, transparent 10.5px)",
  "linear-gradient(180deg, rgba(253, 248, 240, 0.35) 0%, rgba(247, 235, 217, 0.6) 100%)",
].join(", ");

const VEIL_BACKGROUND_SIZE = "48px 48px, 48px 48px, cover";

/* ------------------------------------------------------------------ */
/* VeilPanelsOverlay — Phase 3 + 4. Two ivory lace-veil panels      */
/* cover the screen, then part sideways like curtains (translateX,  */
/* NOT Blush's rotateY) to reveal the invitation mounted            */
/* underneath; golden dust motes drift around them; on "fading"    */
/* the panels dissolve, a lace rosette scales + fades at centre,   */
/* and a warm light sweep crosses the screen. Fixed positioning,   */
/* pointer-events-none except for the Skip / sound controls.        */
/* ------------------------------------------------------------------ */

export type VeilPhase = "closed" | "parting" | "fading";

function LaceRosette({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8;
    const rad = (angle * Math.PI) / 180;
    return { cx: 50 + 15 * Math.cos(rad), cy: 50 + 15 * Math.sin(rad) };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className={className}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3.4" fill="#EAD3D3" stroke="#A66A6E" strokeWidth="1" />
      ))}
      <circle cx="50" cy="50" r="8.5" fill="#C08A8E" stroke="#8B7355" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="3" fill="#FDF8F0" />
      <circle cx="50" cy="50" r="24" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
    </svg>
  );
}

export function VeilPanelsOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: VeilPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-vl-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left lace-veil panel — parts leftward like a curtain */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            backgroundImage: VEIL_BACKGROUND,
            backgroundSize: VEIL_BACKGROUND_SIZE,
            backgroundColor: "#FDF8F0",
          }}
          initial={{ x: "0%" }}
          animate={{ x: parting ? "-102%" : "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Lace inner border + seam shading toward the centre */}
          <div aria-hidden="true" className="absolute inset-y-3 right-3 left-3 border border-dashed border-[#8B7355]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(253,248,240,0.2) 0%, rgba(247,235,217,0.05) 70%, rgba(74,58,46,0.20) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-14"
            style={{ background: "linear-gradient(90deg, transparent, rgba(74,58,46,0.16))" }}
          />
        </motion.div>

        {/* Right lace-veil panel — parts rightward like a curtain */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            backgroundImage: VEIL_BACKGROUND,
            backgroundSize: VEIL_BACKGROUND_SIZE,
            backgroundColor: "#FDF8F0",
          }}
          initial={{ x: "0%" }}
          animate={{ x: parting ? "102%" : "0%" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-y-3 right-3 left-3 border border-dashed border-[#8B7355]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(270deg, rgba(253,248,240,0.2) 0%, rgba(247,235,217,0.05) 70%, rgba(74,58,46,0.20) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-14"
            style={{ background: "linear-gradient(270deg, transparent, rgba(74,58,46,0.16))" }}
          />
        </motion.div>

        {/* Centre seam — a fine sepia thread line that splits as the panels part */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1/2 z-10 w-px bg-[#8B7355]/50"
          initial={{ opacity: 1 }}
          animate={{ opacity: parting ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* Golden dust motes drifting around the parting veil */}
        <DustMoteCanvas moteCount={10} glowKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — lace rosette transition + warm light sweep + shimmer */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.45], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <LaceRosette className="h-full w-full" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(212, 175, 105, 0.35) 50%, transparent 100%)",
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
