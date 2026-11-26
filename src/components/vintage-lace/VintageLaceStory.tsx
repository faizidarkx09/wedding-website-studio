// Vintage Lace story page — the full story as a family photo
// album: two open spreads (two cream pages each, centre spine,
// handwritten-style captions) with the story paragraphs on lined
// paper between them. When the buyer has gallery photos they win,
// otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, BookOpen, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { LaceDivider, PaperSurface } from "./Decor";
import { PHOTO_MEADOW_URL, PHOTO_TOAST_URL, STORY_CAPTIONS, TEMPLATE_PHOTOS, coupleNames, storyParagraphs } from "./tokens";

function AlbumSpread({ photos, captions, index }: { photos: string[]; captions: readonly string[]; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      <div className="relative flex overflow-hidden rounded-[4px] bg-[#FFFDF8] shadow-[0_24px_44px_-16px_rgba(74,58,46,0.45)] ring-1 ring-[#8B7355]/40 @container">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(74,58,46,0.22)] to-transparent"
        />
        {photos.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className={`group relative w-1/2 bg-[#FFFDF8] p-3 pb-4 @min-[40rem]:p-5 @min-[40rem]:pb-6 ${
              i === 0 ? "border-r border-[#8B7355]/25 pr-4 @min-[40rem]:pr-6" : "pl-4 @min-[40rem]:pl-6"
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-white shadow-[0_10px_20px_-8px_rgba(74,58,46,0.4)] ring-1 ring-[#8B7355]/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Our Story — ${captions[i % captions.length]}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <figcaption className="vl-font-script mt-3 text-center text-[1.35rem] leading-none text-[#A66A6E] @min-[40rem]:text-[1.6rem]">
              {captions[i % captions.length]}
            </figcaption>
          </figure>
        ))}
      </div>
    </motion.div>
  );
}

export default function VintageLaceStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const spreadOne =
    gallery.length >= 2 ? [gallery[0], gallery[1]] : [TEMPLATE_PHOTOS[0], TEMPLATE_PHOTOS[1]];
  const spreadTwo =
    gallery.length >= 4
      ? [gallery[2], gallery[3]]
      : [PHOTO_TOAST_URL, PHOTO_MEADOW_URL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FDF8F0] text-[#4A3A2E]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#8B7355]/30 bg-[#FDF8F0]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 @container">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 vl-font-display text-[11px] font-semibold tracking-[0.24em] text-[#4A3A2E] uppercase transition-colors hover:text-[#A66A6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="vl-font-script hidden text-2xl text-[#A66A6E] @min-[40rem]:block">
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
          className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase"
        >
          Our story
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[0.02em] text-[#4A3A2E]"
        >
          From Our Family Album
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 w-full"
        >
          <LaceDivider className="h-7 w-36" />
        </motion.div>
      </div>

      {/* First album spread */}
      <PaperSurface variant="rose" className="px-4 py-10">
        <div className="relative mx-auto max-w-[820px]">
          <AlbumSpread photos={spreadOne} captions={STORY_CAPTIONS} index={0} />
        </div>
      </PaperSurface>

      {/* Story paragraphs on lined paper */}
      <div
        className="mx-auto max-w-[680px] px-5 pt-12 pb-8"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 31px, rgba(139, 115, 85, 0.18) 31px, rgba(139, 115, 85, 0.18) 32px)",
        }}
      >
        <p className="vl-font-display mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-[#6B563E] uppercase">
          <BookOpen className="h-4 w-4 text-[#A66A6E]" />
          How it all began
        </p>
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="vl-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#4A3A2E] first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Second album spread */}
      <PaperSurface variant="ivory" className="px-4 py-10">
        <div className="relative mx-auto max-w-[820px]">
          <AlbumSpread photos={spreadTwo} captions={STORY_CAPTIONS} index={1} />
          <div className="mt-12 flex flex-col items-center">
            <Heart className="h-5 w-5 fill-[#A66A6E]/40 text-[#A66A6E]" />
            <p className="vl-font-script mt-3 text-center text-[1.8rem] leading-tight text-[#A66A6E]">
              …and the best pages are still to be written.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="group mt-8 inline-flex items-center gap-2 border border-[#4A3A2E]/70 bg-[#FFFDF8] px-6 py-3 vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#4A3A2E] uppercase transition-colors duration-300 hover:bg-[#4A3A2E] hover:text-[#FDF8F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Invitation
            </button>
          </div>
        </div>
      </PaperSurface>
    </motion.div>
  );
}
