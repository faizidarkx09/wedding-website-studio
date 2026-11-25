// Emerald Royale story page — the full story with a gold-tape film
// strip and a triptych (hands, toast, sunset) plus the paragraphs.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  FILM_CAPTIONS,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function EmeraldRoyaleStory({
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
      : [PHOTO_HANDS_URL, PHOTO_TOAST_URL, PHOTO_SUNSET_URL];
  const strip = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#F7F3E8] text-[#06231B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#C9A227]/30 bg-[#F7F3E8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 er-font-display text-[11px] tracking-[0.24em] text-[#0B3D2E] uppercase transition-colors hover:text-[#14543D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="er-font-script hidden text-2xl text-[#14543D] sm:block">
            {coupleNames(site)}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 text-center sm:pt-16 sm:pb-14">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#14543D] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#0B3D2E] sm:text-[2.8rem]"
        >
          A Love Written in Gold
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A227]/80 sm:w-24" />
          <Heart className="h-4 w-4 fill-[#14543D]/30 text-[#14543D]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A227]/80 sm:w-24" />
        </motion.div>
      </div>

      {/* Gold-Tape Film Strip */}
      <PaperSurface variant="emerald" className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="relative mx-auto max-w-[980px]">
          <div className="relative overflow-hidden bg-[#06231B]/60 px-2 py-4 sm:px-4 sm:py-5">
            <div aria-hidden="true" className="absolute top-0 right-0 left-0 flex justify-between px-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="h-2.5 w-3.5 rounded-[2px] bg-gradient-to-b from-[#E8D5A0] to-[#C9A227] sm:w-4.5" />
              ))}
            </div>
            <div aria-hidden="true" className="absolute right-0 bottom-0 left-0 flex justify-between px-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="h-2.5 w-3.5 rounded-[2px] bg-gradient-to-b from-[#E8D5A0] to-[#C9A227] sm:w-4.5" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 px-1 pt-2 pb-2 sm:grid-cols-4 sm:gap-4 sm:px-2">
              {strip.map((src, i) => (
                <figure key={`${src}-${i}`} className="group relative">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] shadow-[0_10px_22px_-6px_rgba(4,26,19,0.6)] ring-1 ring-[#C9A227]/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Our Story — ${FILM_CAPTIONS[i % FILM_CAPTIONS.length]}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06231B]/35 via-transparent to-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-1/2 h-3 w-12 -translate-x-1/2 bg-[#C9A227]/85 shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                    />
                    <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-white/95 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                      <Camera className="h-3 w-3" />
                      {FILM_CAPTIONS[i % FILM_CAPTIONS.length]}
                    </span>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </PaperSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8 sm:pt-16 sm:pb-10">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="er-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#06231B]/88 first:mt-0 sm:text-[1.12rem]"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Triptych — hands, toast, sunset */}
      <div className="mx-auto max-w-[980px] px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {triptych.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[2px] shadow-[0_16px_32px_-12px_rgba(4,26,19,0.45)] ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "Joined hands with wedding rings" : i === 1 ? "A celebratory toast" : "Golden-hour sunset"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06231B]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#0B3D2E]/70 px-6 py-3 er-font-display text-[11px] tracking-[0.26em] text-[#0B3D2E] uppercase transition-colors duration-300 hover:bg-[#0B3D2E] hover:text-[#F7F3E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
