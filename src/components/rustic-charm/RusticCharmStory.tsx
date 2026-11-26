// Rustic Charm story page — the full story with two clotheslines
// (four photos, then three) and the paragraphs in between. When
// the buyer has gallery photos they win, otherwise the template's
// own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BarnSurface } from "./Decor";
import { Clothesline } from "./RusticCharmHero";
import {
  PHOTO_MEADOW_URL,
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function RusticCharmStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const lineOne = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);
  const lineTwo =
    gallery.length >= 3
      ? [gallery[1], gallery[3] ?? gallery[0], gallery[2]]
      : [PHOTO_TOAST_URL, PHOTO_SUNSET_URL, PHOTO_MEADOW_URL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FEF3C7] text-[#451A03]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#78350F]/30 bg-[#FEF3C7]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rc-font-display text-[11px] tracking-[0.24em] text-[#451A03] uppercase transition-colors hover:text-[#92400E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="rc-font-script hidden text-2xl text-[#92400E] sm:block">
            {coupleNames(site)}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display text-[10px] tracking-[0.34em] text-[#92400E] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#451A03]"
        >
          Our Story on the Line
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#78350F]/80" />
          <Heart className="h-4 w-4 fill-[#92400E]/30 text-[#92400E]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#78350F]/80" />
        </motion.div>
      </div>

      {/* First clothesline — four photos */}
      <BarnSurface variant="wood" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <Clothesline photos={lineOne} captions={STORY_CAPTIONS} />
        </div>
      </BarnSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rc-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#451A03]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Second clothesline — three photos, offset pegs */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <Clothesline photos={lineTwo} captions={["The Toast", "Golden Hour", "The Meadow"]} />
        <p className="rc-font-editorial mt-10 text-center text-[0.95rem] leading-relaxed text-[#451A03]/70 italic">
          Pinned to the line, one memory at a time — every photograph
          a small piece of the life we are building together.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#451A03]/70 px-6 py-3 rc-font-display text-[11px] tracking-[0.26em] text-[#451A03] uppercase transition-colors duration-300 hover:bg-[#451A03] hover:text-[#FEF3C7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
