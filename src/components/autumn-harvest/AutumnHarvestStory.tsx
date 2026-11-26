// Autumn Harvest story page — the full story as a MASONRY grid of
// varied-height photos plus the paragraphs. When the buyer has
// gallery photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart, Leaf } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  STORY_ASPECTS,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function AutumnHarvestStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const tiles =
    gallery.length >= 6
      ? gallery.slice(0, 6).map((src, i) => ({
          src,
          caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
          aspect: STORY_ASPECTS[i % STORY_ASPECTS.length],
        }))
      : TEMPLATE_PHOTOS.slice(0, 6).map((src, i) => ({
          src,
          caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
          aspect: STORY_ASPECTS[i % STORY_ASPECTS.length],
        }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFF7E8] text-[#5C3A21]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#C05621]/30 bg-[#FFF7E8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 ah-font-display text-[11px] font-semibold tracking-[0.24em] text-[#5C3A21] uppercase transition-colors hover:text-[#9C3D12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C3A21]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="ah-font-script hidden text-2xl text-[#C05621] sm:block">
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
          className="ah-font-display text-[10px] font-semibold tracking-[0.34em] text-[#9C3D12] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[0.01em] text-[#5C3A21]"
        >
          Gathered Like Autumn Leaves
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C05621]/80" />
          <Heart className="h-4 w-4 fill-[#9C3D12]/30 text-[#9C3D12]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C05621]/80" />
        </motion.div>
      </div>

      {/* Masonry Photo Grid */}
      <PaperSurface variant="orange" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
            {tiles.map((tile, i) => (
              <figure
                key={`${tile.src}-${i}`}
                className="group relative break-inside-avoid overflow-hidden rounded-[4px] bg-[#FFFDF6] shadow-[0_14px_28px_-10px_rgba(58,36,18,0.5)] ring-1 ring-[#C05621]/30"
              >
                <div className={`relative ${tile.aspect} overflow-hidden`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.src}
                    alt={`Our Story — ${tile.caption}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3A2412]/30 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="flex items-center justify-center gap-1.5 bg-[#FFFDF6] px-2 py-3 text-[10px] font-medium tracking-[0.2em] text-[#5C3A21] uppercase">
                  <Leaf className="h-3 w-3 text-[#C05621]" />
                  {tile.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </PaperSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="ah-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#5C3A21]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#5C3A21]/70 px-6 py-3 ah-font-display text-[11px] font-semibold tracking-[0.26em] text-[#5C3A21] uppercase transition-colors duration-300 hover:bg-[#5C3A21] hover:text-[#FFF7E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C3A21]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
