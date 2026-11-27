// Desert Dusk story page — the full story along the caravan
// ROUTE: a dotted path with four photo stops (couple on the ridge,
// dunes, close embrace, facing the sun), the story paragraphs, and
// a dune-ridge triptych of the three desert-sunset couple photos.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DuneDivider, PaperSurface } from "./Decor";
import {
  COUPLE_1_URL,
  COUPLE_2_URL,
  COUPLE_3_URL,
  ROUTE_CAPTIONS,
  ROUTE_LINES,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function DesertDuskStory({
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
      : [COUPLE_1_URL, COUPLE_2_URL, COUPLE_3_URL];
  const stops = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFF8EC] text-[#3A2A20]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#C2703D]/30 bg-[#FFF8EC]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 dd-font-display text-[11px] tracking-[0.24em] text-[#3A2A20] uppercase transition-colors hover:text-[#8A4A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2703D]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="dd-font-script hidden text-2xl text-[#8A4A22] sm:block">
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
          className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#3A2A20]"
        >
          Our Caravan Route
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C2703D]/80" />
          <Heart className="h-4 w-4 fill-[#8A4A22]/30 text-[#8A4A22]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C2703D]/80" />
        </motion.div>
      </div>

      {/* Caravan route — vertical dotted path with photo stops */}
      <PaperSurface variant="sand" className="px-4 py-10">
        <div className="relative mx-auto max-w-[680px]">
          <div
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[2.75rem] border-l-2 border-dotted border-[#C2703D]/70 sm:hidden"
          />
          <div className="space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 sm:space-y-0">
            {stops.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-start gap-4 sm:flex-col sm:items-center sm:gap-0 sm:text-center ${
                  i % 2 === 1 ? "sm:translate-y-10" : ""
                }`}
              >
                <div className="relative z-10 h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-full bg-[#FFFDF6] shadow-[0_12px_24px_-8px_rgba(58,42,32,0.5)] ring-2 ring-[#C2703D]/60 sm:h-32 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Our Story — ${ROUTE_CAPTIONS[i % ROUTE_CAPTIONS.length]}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 pt-1 sm:pt-4">
                  <p className="dd-font-display flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-[#3A2A20] uppercase sm:justify-center">
                    <Camera className="h-3 w-3 text-[#8A4A22]" />
                    Stop {i + 1} · {ROUTE_CAPTIONS[i % ROUTE_CAPTIONS.length]}
                  </p>
                  <p className="dd-font-editorial mt-1.5 text-[0.95rem] leading-relaxed text-[#3A2A20]/80 italic">
                    {ROUTE_LINES[i % ROUTE_LINES.length]}
                  </p>
                </div>
              </motion.div>
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
            className="dd-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#3A2A20]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Triptych — the couple at desert sunset: dune ridge, close
          embrace, facing the setting sun */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <DuneDivider className="mb-8 h-8 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {triptych.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[4px] shadow-[0_16px_32px_-12px_rgba(58,42,32,0.45)] ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "The couple walking a desert dune ridge at dusk" : i === 1 ? "The couple embracing at desert sunset" : "The couple facing the setting sun over the dunes"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3A2A20]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#3A2A20]/70 px-6 py-3 dd-font-display text-[11px] tracking-[0.26em] text-[#3A2A20] uppercase transition-colors duration-300 hover:bg-[#3A2A20] hover:text-[#FFF8EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2703D]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
