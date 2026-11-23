// Dolce Vita hero — a 1:1 port of the standalone's hero
// (index.html §2 + styles.css §2 + script.js §2/§4): a 440×782
// vertical photo column with the slow Ken Burns zoom (26s,
// scale 1.02 → 1.12), 26 falling white petals on a canvas (only
// while the hero is on screen), three drifting birds, cream fades
// top/bottom, and the copy at 27% — "are getting married!" + the
// couple names in 45px Imperial Script. The standalone's hero video
// is a still here (video generation is region-blocked), exactly as
// in the standalone. The hero image falls back to the template
// artwork, then to a palette panel with the monogram — never a
// broken image. The preload <link> is rendered by the renderer
// (Blossom/ÉTERNEL fast-load fix).
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DOLCE, coupleNames, initials, resolveHeroSrc } from "./tokens";

export default function DolceVitaHero({ site }: { site: WeddingSite }) {
  const reduceMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const heroSrc = resolveHeroSrc(site);
  const names = coupleNames(site);

  // Falling petals — ported verbatim from standalone script.js §2:
  // 26 petals, canvas sized to the hero, runs only while the hero
  // is on screen (IntersectionObserver), skipped entirely under
  // prefers-reduced-motion.
  useEffect(() => {
    const canvasRaw = canvasRef.current;
    const heroRaw = heroRef.current;
    if (!canvasRaw || !heroRaw || reduceMotion) return;
    // Non-nullable aliases: TS does not carry the null-check narrowing
    // into the nested size()/tick() closures below.
    const canvas: HTMLCanvasElement = canvasRaw;
    const hero: HTMLElement = heroRaw;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;
    let W = 0;
    let H = 0;
    let running = false;
    let raf = 0;
    const COUNT = 26;
    type Petal = {
      x: number; y: number; w: number; h: number; vy: number;
      sway: number; phase: number; rot: number; vr: number; alpha: number;
    };
    let petals: Petal[] = [];

    function size() {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makePetal(seed: boolean): Petal {
      return {
        x: Math.random() * W,
        y: seed ? Math.random() * H : -12 - Math.random() * 30,
        w: 5 + Math.random() * 7,
        h: 4 + Math.random() * 5,
        vy: 0.35 + Math.random() * 0.75,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.012,
        alpha: 0.35 + Math.random() * 0.45,
      };
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.phase += 0.012;
        p.x += Math.sin(p.phase) * p.sway * 0.4;
        p.rot += p.vr;
        if (p.y > H + 14) petals[i] = makePetal(false);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      size();
      petals = [];
      for (let i = 0; i < COUNT; i++) petals.push(makePetal(true));
      tick();
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, W, H);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.02 },
    );
    io.observe(hero);
    const onResize = () => {
      if (running) size();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <section ref={heroRef} id="top" aria-label={`${names} — wedding`} className="dolce-hero">
      <div className="dolce-hero-media">
        {!heroSrc || imgFailed ? (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center"
            style={{ background: `linear-gradient(150deg, #E9E2D6, ${DOLCE.bg})` }}
          >
            <span className="text-7xl font-bold opacity-40" style={{ color: DOLCE.blue }}>
              {initials(site)}
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSrc}
            alt="Arched stone terrace over a lake and mountains at sunrise"
            className="dolce-hero-img"
            fetchPriority="high"
            onError={() => setImgFailed(true)}
          />
        )}
        <canvas ref={canvasRef} aria-hidden="true" className="dolce-petals" />
        <div aria-hidden="true" className="dolce-hero-birds">
          <span className="dolce-bird dolce-b1">⌄</span>
          <span className="dolce-bird dolce-b2">⌄</span>
          <span className="dolce-bird dolce-b3">⌄</span>
        </div>
        <div aria-hidden="true" className="dolce-hero-fade dolce-hero-fade-top" />
        <div aria-hidden="true" className="dolce-hero-fade dolce-hero-fade-bottom" />
      </div>
      <motion.div
        className="dolce-hero-copy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="dolce-script dolce-hero-names">{names}</h1>
        <p className="dolce-rufina dolce-hero-sub">are getting married!</p>
      </motion.div>
    </section>
  );
}
