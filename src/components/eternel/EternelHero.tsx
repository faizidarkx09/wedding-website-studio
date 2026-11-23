// ÉTERNEL hero — full-screen cinematic photograph with a slow zoom
// (scale 1.12 → 1.0), staggered letter-by-letter names, a drawing
// decorative line, the date fading in, and a gentle scroll indicator.
// Subtle parallax on desktop only; reduced motion and mobile get the
// static frame. The hero image falls back to the template artwork, then
// to a palette panel with the monogram — never a broken image.
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ETERNEL, coupleNames, formatLongDate, initials, rsvpHref } from "./tokens";
import { Divider } from "./Decor";

function useDesktopParallax(): boolean {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);
  return enabled;
}

/** Letter-by-letter staggered text (names). */
function StaggeredText({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const letters = Array.from(text);
  return (
    <span aria-label={text} role="text">
      {letters.map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            delay: reduceMotion ? 0 : delay + i * 0.035,
            ease: [0.2, 0.7, 0.2, 1],
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function EternelHero({ site }: { site: WeddingSite }) {
  const reduceMotion = useReducedMotion();
  const parallax = useDesktopParallax();
  const sectionRef = useRef<HTMLElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroSrc =
    !site.content.heroImage || site.content.heroImage.includes("picsum.photos")
      ? (site.templateSnapshot.heroImage ?? site.content.heroImage)
      : site.content.heroImage;

  const names = coupleNames(site);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${names} — wedding`}
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden text-center text-white"
    >
      {/* Photograph — slow settle zoom + desktop parallax. */}
      <motion.div
        className="absolute inset-0"
        style={parallax ? { y: imageY } : undefined}
      >
        {!heroSrc || imgFailed ? (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(150deg, ${ETERNEL.champagne}, ${ETERNEL.ivory})`,
            }}
          >
            <span className="text-7xl font-bold opacity-40" style={{ color: ETERNEL.gold }}>
              {initials(site)}
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            src={heroSrc}
            alt={`${names} — wedding photograph`}
            className="h-full w-full object-cover"
            fetchPriority="high"
            onError={() => setImgFailed(true)}
            initial={{ scale: reduceMotion ? 1 : 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 2.4, ease: [0.2, 0.7, 0.2, 1] }}
          />
        )}
      </motion.div>

      {/* Restrained legibility gradient — darker at the bottom only. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,16,12,0.28) 0%, rgba(20,16,12,0.08) 32%, rgba(20,16,12,0.12) 68%, rgba(20,16,12,0.52) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-5 pt-24 pb-20"
        style={parallax ? { y: textY, opacity: textOpacity } : undefined}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/90 sm:text-xs"
        >
          {site.content.subtitle || "Together with their families"}
        </motion.p>

        <h1 className="font-eternel mt-5 text-[clamp(3rem,10vw,6.5rem)] leading-[1.02] font-medium text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
          <StaggeredText text={site.content.partnerA} delay={0.35} />
          <span aria-hidden="true" className="mx-2 inline-block align-baseline" style={{ color: ETERNEL.champagne }}>
            &
          </span>
          <StaggeredText text={site.content.partnerB} delay={0.35 + site.content.partnerA.length * 0.035 + 0.15} />
        </h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-6"
          style={{ color: ETERNEL.champagne }}
        >
          <Divider variant={0} className="h-4 w-44 sm:w-56" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-5 text-base font-medium tracking-wide text-white/95 sm:text-lg"
        >
          {dateLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={rsvpHref(site)}
            className="inline-flex min-h-12 items-center rounded-full px-8 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:opacity-85"
            style={{ backgroundColor: ETERNEL.espresso }}
          >
            RSVP
          </Link>
          <a
            href="#story"
            className="inline-flex min-h-12 items-center rounded-full border border-white/70 px-8 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:bg-white/10"
          >
            Our story
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — gentle vertical drift. */}
      <motion.a
        href="#welcome"
        aria-label="Scroll to the welcome message"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/85"
        animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
