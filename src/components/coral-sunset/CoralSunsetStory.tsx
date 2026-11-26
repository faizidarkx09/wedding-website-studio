// Coral Sunset story page — the full story: the sunset STRIP
// (horizontal scroll-snap row) in a gradient band, the paragraphs,
// and a trio of arch-top sunset frames. When the buyer has gallery
// photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SunsetSurface } from "./Decor";
import {
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  STORY_CAPTIONS,
  STORY_SUNSET_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function CoralSunsetStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const trio =
    gallery.length >= 3
      ? [gallery[0], gallery[3] ?? gallery[1], gallery[2]]
      : [STORY_SUNSET_URL, PHOTO_TOAST_URL, PHOTO_SUNSET_URL];
  const cards = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFF6EE] text-[#3D1F2B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#E85D3D]/30 bg-[#FFF6EE]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 cs-font-display text-[11px] tracking-[0.24em] text-[#3D1F2B] uppercase transition-colors hover:text-[#C94A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D1F2B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="cs-font-script hidden text-2xl text-[#C94A2E] sm:block">
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
          className="cs-font-display text-[10px] tracking-[0.34em] text-[#C94A2E] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#3D1F2B]"
        >
          Our Story in Coral Light
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#E85D3D]/80" />
          <Heart className="h-4 w-4 fill-[#C94A2E]/30 text-[#C94A2E]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#E85D3D]/80" />
        </motion.div>
      </div>

      {/* Sunset strip */}
      <SunsetSurface variant="sunset" className="px-0 py-10">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:justify-center">
          {cards.map((src, i) => (
            <figure
              key={`${src}-${i}`}
              className="group relative w-56 shrink-0 snap-center overflow-hidden rounded-[18px] bg-[#FFFBF5] shadow-[0_16px_30px_-10px_rgba(46,20,32,0.5)] ring-1 ring-[#FFF6EE]/60 sm:w-60"
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
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1420]/45 via-transparent to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-2 py-3 text-[10px] tracking-[0.2em] text-[#FFF6EE] uppercase drop-shadow-[0_2px_4px_rgba(46,20,32,0.8)]">
                  <Camera className="h-3 w-3 text-[#FFDAB9]" />
                  {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </SunsetSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="cs-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#3D1F2B]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Arch-top trio — sunset, toast, sunset */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {trio.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-t-[999px] rounded-b-[18px] shadow-[0_16px_32px_-12px_rgba(46,20,32,0.45)] ring-1 ring-[#E85D3D]/30 ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "The couple laughing on a beach at coral sunset" : i === 1 ? "A celebratory toast" : "Coral sunset"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1420]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-full border border-[#3D1F2B]/70 px-6 py-3 cs-font-display text-[11px] tracking-[0.26em] text-[#3D1F2B] uppercase transition-colors duration-300 hover:bg-[#2E1420] hover:text-[#FFF6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D1F2B]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
