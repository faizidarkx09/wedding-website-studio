// Marble Luxe story page — the full story as a GALLERY WALL:
// large single photos stacked with generous white space, the
// paragraphs between them. When the buyer has gallery photos they
// win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import {
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function MarbleLuxeStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const photos = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-white text-[#1F2937]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#E5E0D8] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 ml-font-display text-[11px] font-medium tracking-[0.24em] text-[#1F2937] uppercase transition-colors hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="ml-font-script hidden text-2xl text-[#8C7355] sm:block">
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
          className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-3 text-[2.2rem] leading-[1.1] font-medium tracking-[0.02em] text-[#1F2937]"
        >
          Our Story in White &amp; Gold
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B49A70]" />
          <Heart className="h-4 w-4 fill-[#B49A70]/40 text-[#8C7355]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B49A70]" />
        </motion.div>
      </div>

      {/* Gallery wall — one large photo at a time, generous gaps */}
      <div className="mx-auto max-w-[860px] px-4 pb-8 sm:px-6">
        {photos.map((src, i) => (
          <motion.figure
            key={`${src}-${i}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group mb-14 sm:mb-20"
          >
            <div className="relative overflow-hidden bg-white shadow-[0_20px_40px_-18px_rgba(31,41,55,0.35)]">
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <figcaption className="mt-5 flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.28em] text-[#4B5563] uppercase">
              <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
              {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
              <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
            </figcaption>

            {/* A paragraph after every second photo, so the words
                breathe between the images */}
            {i % 2 === 1 && paragraphs[Math.floor(i / 2)] && (
              <p className="ml-font-editorial mx-auto mt-10 max-w-[620px] text-center text-[1.05rem] leading-[1.85] text-[#374151]">
                {paragraphs[Math.floor(i / 2)]}
              </p>
            )}
          </motion.figure>
        ))}

        {/* Remaining paragraphs */}
        {paragraphs.slice(Math.ceil(photos.length / 2)).map((p, i) => (
          <motion.p
            key={`extra-${i}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="ml-font-editorial mx-auto mt-6 max-w-[620px] text-center text-[1.05rem] leading-[1.85] text-[#374151]"
          >
            {p}
          </motion.p>
        ))}

        <div className="mt-14 flex justify-center pb-16">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#1F2937]/70 px-6 py-3 ml-font-display text-[11px] font-medium tracking-[0.26em] text-[#1F2937] uppercase transition-colors duration-300 hover:bg-[#1F2937] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
