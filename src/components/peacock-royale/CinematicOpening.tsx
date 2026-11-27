// Cinematic opening helpers for Peacock Royale — Phase 1 jewel
// drift, Phase 2 feather-eye seal activation, Phase 3 feather-fan
// panels, Phase 4 feather-eye transition + Web Audio SFX (a soft
// shimmer + jewel chime, synthesised — no audio files). Music is
// deliberately NOT included: no verified CC0 track could be bundled
// without bloating the template, so the toggle controls SFX only.
// Everything here is transform/opacity (canvas excepted) and
// respects prefers-reduced-motion. Nothing here is copied from
// Blush Royale: the particles are rising jewel diamonds, the seal
// is a peacock feather eye, and the panels open as a feather fan.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FeatherEye } from "./Decor";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Shimmer = filtered-noise burst        */
/* sweeping up 400→2400 Hz; chime = D-major jewel arpeggio          */
/* D5–F#5–A5–D6, sine + soft triangle octave, ~1.8s decay.          */
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

/** Soft shimmer: white noise through a bandpass sweeping 400→2400 Hz. */
export function playShimmerSound() {
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
    bp.frequency.setValueAtTime(400, ctx.currentTime);
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

/** Jewel chime: D5–F#5–A5–D6, sine + soft triangle octave, ~1.8s decay. */
export function playChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [587.33, 739.99, 880.0, 1174.66];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.15;
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
/* JewelCanvas — one canvas, one rAF loop. Gold + teal jewel        */
/* diamonds rise slowly with a gentle sway and glint; when          */
/* burstKey increments, ~26 tiny jewel particles burst from         */
/* burstOrigin and fade over ~1.4s. Renders nothing at all under    */
/* prefers-reduced-motion.                                          */
/* ------------------------------------------------------------------ */

interface Jewel {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotSpeed: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  gold: boolean;
  colorIdx: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  gold: boolean;
}

const GOLDS = ["231, 200, 106", "246, 226, 122", "212, 175, 55"];
const TEALS = ["18, 140, 126", "45, 212, 191", "94, 234, 212"];

export function JewelCanvas({
  jewelCount = 12,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.58 },
  className = "",
}: {
  jewelCount?: number;
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
    let jewels: Jewel[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      jewels = Array.from({ length: jewelCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 5,
        angle: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.0005,
        vy: 0.1 + Math.random() * 0.22,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.4,
        gold: Math.random() < 0.6,
        colorIdx: Math.floor(Math.random() * 3),
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
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 900 + Math.random() * 600,
          gold: Math.random() < 0.65,
        };
      });
    };

    const drawDiamond = (
      x: number,
      y: number,
      r: number,
      angle: number,
      fill: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const j of jewels) {
        // Jewels rise slowly (embers of gold light) and recycle at
        // the bottom once they drift off the top.
        j.y -= j.vy * dt * 0.06;
        j.angle += j.rotSpeed * dt;
        if (j.y < -16) {
          j.y = h + 16;
          j.x = Math.random() * w;
        }
        const x = j.x + Math.sin(t / 2800 + j.phase) * j.sway * 12;
        const palette = j.gold ? GOLDS : TEALS;
        drawDiamond(x, j.y, j.size, j.angle, `rgba(${palette[j.colorIdx]}, ${j.alpha.toFixed(3)})`);
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0012 * dt;
        const k = 1 - b.life / b.maxLife;
        const palette = b.gold ? GOLDS : TEALS;
        const idx = Math.floor(b.r * 10) % palette.length;
        drawDiamond(b.x, b.y, b.r, b.life * 0.002, `rgba(${palette[idx]}, ${(0.9 * k).toFixed(3)})`);
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
  }, [jewelCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#062E2B]/70 text-[#E7C86A] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E7C86A]"
      style={{ opacity: enabled ? 0.9 : 0.55 }}
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
      className="er-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#E7C86A]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E7C86A]"
      style={{ opacity: 0.8 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* FanPanelsOverlay — Phase 3 + 4. Two deep-teal jewel panels cover  */
/* the screen, then rotate open around the centre seam (3D           */
/* perspective, preserve-3d) to reveal the invitation mounted       */
/* underneath; as they open, a fan of seven feather eyes blooms     */
/* from the centre pivot like a peacock tail unfolding; on          */
/* "fading" the panels dissolve, a feather eye scales + fades, a    */
/* jewel burst fires, and a teal-gold shimmer sweeps across. Fixed  */
/* positioning, pointer-events-none except for the Skip / sound     */
/* controls.                                                        */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

const FAN_DEGREES = [-66, -44, -22, 0, 22, 44, 66];

export function FanPanelsOverlay({
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
      data-pr-panels={phase}
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
        {/* Left jewel panel — opens leftward around the centre seam */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            transformOrigin: "right center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            background:
              "radial-gradient(ellipse 90% 70% at 70% 40%, rgba(18, 140, 126, 0.5) 0%, #062E2B 62%, #04211F 100%)",
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: opening ? -102 : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <FeatherEye className="h-40 w-28 opacity-25 sm:h-56 sm:w-40" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(253,251,245,0.06) 0%, rgba(6,46,43,0.05) 70%, rgba(4,33,31,0.35) 100%)",
            }}
          />
        </motion.div>

        {/* Right jewel panel — opens rightward around the centre seam */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            background:
              "radial-gradient(ellipse 90% 70% at 30% 40%, rgba(18, 140, 126, 0.5) 0%, #062E2B 62%, #04211F 100%)",
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: opening ? 102 : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <FeatherEye className="h-40 w-28 opacity-25 sm:h-56 sm:w-40" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-y-4 left-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(270deg, rgba(253,251,245,0.06) 0%, rgba(6,46,43,0.05) 70%, rgba(4,33,31,0.35) 100%)",
            }}
          />
        </motion.div>

        {/* Feather fan blooming from the centre pivot as the panels open */}
        {opening && phase !== "fading" && (
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-10 h-0 w-0"
          >
            {FAN_DEGREES.map((deg, i) => (
              <motion.span
                key={deg}
                className="absolute bottom-0 left-1/2 origin-bottom"
                style={{ width: 30, height: 42 }}
                initial={{ transform: "translateX(-50%) rotate(0deg) translateY(0px)", opacity: 0 }}
                animate={{
                  transform: `translateX(-50%) rotate(${deg}deg) translateY(-${Math.abs(deg) < 18 ? 150 : 128}px)`,
                  opacity: 0.95,
                }}
                transition={{ duration: 1.4, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatherEye className="h-full w-full drop-shadow-[0_2px_8px_rgba(4,33,31,0.6)]" />
              </motion.span>
            ))}
          </div>
        )}

        {/* Jewels drifting around the opening panels */}
        <JewelCanvas jewelCount={10} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — feather-eye transition + jewel burst + shimmer */}
      {phase === "fading" && (
        <>
          <JewelCanvas
            jewelCount={0}
            burstKey={1}
            burstOrigin={{ x: 0.5, y: 0.5 }}
            className="z-20"
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-28 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-40"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.45], opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeatherEye className="h-full w-full drop-shadow-[0_0_24px_rgba(212,175,55,0.65)]" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(231,200,106,0.4) 50%, transparent 100%)",
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
