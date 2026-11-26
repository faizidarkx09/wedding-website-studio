// Winter Frost story page — the full story with the snow-globe
// carousel (one large photo + dots, swipeable) plus the paragraphs.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FrostSurface, SnowGlobeCarousel, type GlobeSlide } from "./Decor";
import { STORY_CAPTIONS, TEMPLATE_PHOTOS, coupleNames, storyParagraphs } from "./tokens";

export default function WinterFrostStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const slides: GlobeSlide[] = useMemo(() => {
    const gallery = (site.gallery ?? []).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#EAF4FB] text-[#12395B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#7FB3D9]/30 bg-[#EAF4FB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 wf-font-display text-[11px] tracking-[0.24em] text-[#12395B] uppercase transition-colors hover:text-[#1B4A6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="wf-font-script hidden text-2xl text-[#1B4A6B] sm:block">
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
          className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#12395B]"
        >
          Our Story in a Snow Globe
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#7FB3D9]/80" />
          <Heart className="h-4 w-4 fill-[#1B4A6B]/30 text-[#1B4A6B]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#7FB3D9]/80" />
        </motion.div>
      </div>

      {/* Snow-Globe Carousel */}
      <FrostSurface variant="deep" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <SnowGlobeCarousel slides={slides} />
        </div>
      </FrostSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="wf-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#12395B]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#12395B]/70 px-6 py-3 wf-font-display text-[11px] tracking-[0.26em] text-[#12395B] uppercase transition-colors duration-300 hover:bg-[#12395B] hover:text-[#FDFEFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
