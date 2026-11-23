// The Sacred Garden hero — the couple photograph with a slow Ken
// Burns settle (scale 1.12 → 1.0, ÉTERNEL pattern), a warm radial-glow
// overlay (the still stand-in for the source's swan-video hero —
// video generation is region-blocked, and the source's HEVC .mov did
// not decode in Chromium anyway), "Wedding Day" in Imperial Script,
// the date in dotted Ovo format, the couple names in Beau Rivage with
// a gold "&", a burgundy RSVP button and a "Scroll down" cue.
// NO top nav — the original has none; the hero carries the RSVP
// button + scroll cue instead. The hero image falls back to the
// template artwork, then to a palette panel with the monogram —
// never a broken image.
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SACRED, coupleNames, formatDottedDate, initials, rsvpHref } from "./tokens";
import { TornPaperDivider } from "./Decor";

export default function SacredGardenHero({ site }: { site: WeddingSite }) {
  const reduceMotion = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);

  const heroSrc =
    !site.content.heroImage || site.content.heroImage.includes("picsum.photos")
      ? (site.templateSnapshot.heroImage ?? site.content.heroImage)
      : site.content.heroImage;

  const names = coupleNames(site);
  const dottedDate = formatDottedDate(site.weddingDate, site.timezone);
  const tagline = (site.content.tagline ?? "").trim();

  return (
    <section
      id="top"
      aria-label={`${names} — wedding`}
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden text-center"
      style={{ backgroundColor: SACRED.cream }}
    >
      {/* Photograph — slow settle zoom. */}
      <div aria-hidden="true" className="absolute inset-0">
        {!heroSrc || imgFailed ? (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(150deg, ${SACRED.beige}, ${SACRED.cream})`,
            }}
          >
            <span className="text-7xl font-bold opacity-40" style={{ color: SACRED.gold }}>
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
      </div>

      {/* Warm radial glow over the photograph (audit §0.5) + a soft
          cream wash at the bottom so the gold text stays readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(255,249,235,0.5) 0%, rgba(255,231,192,0) 85%), linear-gradient(to bottom, rgba(249,240,224,0.15) 0%, rgba(249,240,224,0.05) 40%, rgba(249,240,224,0.55) 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-5 pt-24 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 2, delay: reduceMotion ? 0 : 0.3 }}
          className="sacred-script text-[40px] leading-[0.5]"
          style={{ color: SACRED.gold }}
        >
          Wedding Day
        </motion.p>

        {dottedDate ? (
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 2, delay: reduceMotion ? 0 : 0.5 }}
            className="sacred-ovo mt-8 text-[25px] leading-[0.5]"
            style={{ color: SACRED.gold }}
          >
            {dottedDate}
          </motion.p>
        ) : null}

        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 2, delay: reduceMotion ? 0 : 0.7 }}
          className="sacred-beaurivage mt-8 text-[clamp(3.2rem,11vw,5rem)] leading-[0.7]"
          style={{ color: SACRED.gold }}
        >
          {site.content.partnerA}
          <span aria-hidden="true" className="sacred-script mx-2 inline-block align-baseline text-[40px]" style={{ color: SACRED.goldAlt }}>
            &
          </span>
          {site.content.partnerB}
        </motion.h1>

        {/* Tagline — under the couple names, above the torn-paper
            divider (the original shows it in the hero only). */}
        {tagline ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="sacred-script mt-8 max-w-2xl text-[41px] leading-[1.05]"
            style={{ color: SACRED.gold }}
          >
            {tagline}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10"
          style={{ color: SACRED.gold }}
        >
          <TornPaperDivider className="h-6 w-64 sm:w-80" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-8"
        >
          <Link
            href={rsvpHref(site)}
            className="inline-flex min-h-12 items-center rounded-full px-8 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:opacity-85"
            style={{ backgroundColor: SACRED.burgundy }}
          >
            RSVP
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue — "Scroll down" + chevron, drifting gently. */}
      <motion.a
        href="#welcome"
        aria-label="Scroll to the welcome message"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
        style={{ color: SACRED.gold }}
        animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="sacred-script text-[32px] leading-[1.1]">Scroll down</span>
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
