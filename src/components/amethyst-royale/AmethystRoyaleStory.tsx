// Amethyst Royale story page — the full story with faceted
// hexagon photo cards and a diamond triptych (lavender laughter,
// toast, sunset) plus the paragraphs. When the buyer has gallery
// photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Gem } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  STORY_CAPTIONS,
  STORY_LAVENDER_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function AmethystRoyaleStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const triptych =
    gallery.length >= 3
      ? [gallery[0], gallery[3] ?? gallery[1], gallery[2]]
      : [STORY_LAVENDER_URL, PHOTO_TOAST_URL, PHOTO_SUNSET_URL];
  const cards = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#F5F0FA] text-[#2E1065]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#7C3AED]/30 bg-[#F5F0FA]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 ar-font-display text-[11px] tracking-[0.24em] text-[#2E1065] uppercase transition-colors hover:text-[#5B21B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1065]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="ar-font-script hidden text-2xl text-[#5B21B6] sm:block">
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
          className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#2E1065]"
        >
          Our Story in Amethyst Light
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#7C3AED]/80" />
          <Gem className="h-4 w-4 fill-[#5B21B6]/30 text-[#5B21B6]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#7C3AED]/80" />
        </motion.div>
      </div>

      {/* Faceted Hexagon Photo Cards */}
      <PaperSurface variant="amethyst" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {cards.map((src, i) => (
              <figure
                key={`${src}-${i}`}
                className={`group relative flex flex-col items-center ${i % 2 === 1 ? "translate-y-5" : ""}`}
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_14px_28px_-10px_rgba(46,16,101,0.5)] ring-1 ring-[#C4B5FD]/40"
                  style={{
                    clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                  }}
                >
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1065]/35 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="mt-3 flex items-center gap-1.5 border border-[#C4B5FD]/50 bg-[#FFFDFF] px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#2E1065] uppercase shadow-[0_6px_14px_-6px_rgba(46,16,101,0.5)]">
                  <Camera className="h-3 w-3 text-[#5B21B6]" />
                  {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
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
            className="ar-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#2E1065]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Diamond Triptych — lavender laughter, toast, sunset */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
          {triptych.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative mx-auto w-full max-w-[300px] ${i === 1 ? "sm:translate-y-6" : ""}`}
            >
              <div
                className="relative aspect-square overflow-hidden shadow-[0_16px_32px_-12px_rgba(46,16,101,0.45)]"
                style={{
                  clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "The couple laughing in a lavender field" : i === 1 ? "A celebratory toast" : "Lavender sunset"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1065]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#2E1065]/70 px-6 py-3 ar-font-display text-[11px] tracking-[0.26em] text-[#2E1065] uppercase transition-colors duration-300 hover:bg-[#2E1065] hover:text-[#F5F0FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1065]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
