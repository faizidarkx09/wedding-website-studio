// Starlight Noir story page — the couple's story told as a star
// chart: paragraphs under a constellation divider, then the
// constellation cards in a staggered two-column chart with thin
// gold lines linking them, like stars joined on a map. Only the
// data comes from the site.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Star } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider, NightSurface, Starfield } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function StarlightNoirStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const photos = gallery.length >= 2 ? gallery : [...TEMPLATE_PHOTOS, ...TEMPLATE_PHOTOS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-dvh bg-[#0A0A0A] text-[#F5EFE0]"
    >
      <NightSurface variant="black" className="px-4 pt-10 pb-20">
        {!prefersReducedMotion && <Starfield density={50} className="opacity-50" />}
        <div className="relative z-10 mx-auto max-w-[860px]">
          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: FONT_DISPLAY }}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.26em] text-[#F2D98C] uppercase transition-colors hover:text-[#F5EFE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invitation
          </button>

          <div className="mt-10 flex flex-col items-center text-center">
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
            >
              Our Story
            </p>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-3 text-[2rem] leading-[1.12] font-normal text-[#F5EFE0] @min-[40rem]:text-[2.4rem]"
            >
              Written in the Stars
            </h2>
            <ConstellationDivider className="mt-5 h-7 w-36" />
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-4 text-[1.15rem] text-[#D4AF37] italic"
            >
              {coupleNames(site)}
            </p>
          </div>

          {/* Story paragraphs */}
          <div className="mx-auto mt-8 max-w-[620px] space-y-5 text-center">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: FONT_EDITORIAL }}
                className="text-[1.05rem] leading-[1.85] text-[#F5EFE0]/85"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Star chart — staggered constellation cards linked by gold lines */}
          <div className="relative mx-auto mt-14 max-w-[760px]">
            {/* Connecting constellation line behind the cards */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            >
              <line x1="25" y1="12" x2="75" y2="30" stroke="#D4AF37" strokeWidth="0.25" opacity="0.6" />
              <line x1="75" y1="30" x2="25" y2="58" stroke="#D4AF37" strokeWidth="0.25" opacity="0.6" />
              <line x1="25" y1="58" x2="75" y2="78" stroke="#D4AF37" strokeWidth="0.25" opacity="0.6" />
            </svg>
            <div className="relative grid grid-cols-2 gap-5 md:gap-8">
              {photos.slice(0, 4).map((src, i) => (
                <motion.figure
                  key={`${src}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative overflow-hidden rounded-[4px] border border-[#D4AF37]/50 bg-[#111111] shadow-[0_14px_28px_-10px_rgba(0,0,0,0.8)] ${
                    i % 2 === 1 ? "translate-y-6 md:translate-y-10" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-transparent to-transparent"
                    />
                    <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#0A0A0A]/70">
                      <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                    </span>
                  </div>
                  <figcaption
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="flex items-center justify-center gap-1.5 border-t border-[#D4AF37]/40 bg-[#0A0A0A] px-2 py-3 text-[10px] tracking-[0.2em] text-[#F2D98C] uppercase"
                  >
                    <Camera className="h-3 w-3 text-[#D4AF37]" />
                    {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={onBack}
              style={{ fontFamily: FONT_DISPLAY }}
              className="inline-flex items-center gap-2 border border-[#D4AF37]/70 px-6 py-3 text-[11px] tracking-[0.28em] text-[#F5EFE0] uppercase transition-colors duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Invitation
            </button>
          </div>
        </div>
      </NightSurface>
    </motion.div>
  );
}
