// Mint Serenity story page — the full story with floating bubble
// photos and the paragraphs. When the buyer has gallery photos
// they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BubbleDivider } from "./Decor";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  PHOTO_MEADOW_URL,
  STORY_CAPTIONS,
  STORY_GARDEN_URL,
  STORY_HANDS_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

const BUBBLE_SIZES = [
  "h-40 w-40 sm:h-48 sm:w-48",
  "h-32 w-32 sm:h-40 sm:w-40 mt-8",
  "h-36 w-36 sm:h-44 sm:w-44",
  "h-28 w-28 sm:h-36 sm:w-36 mt-6",
] as const;

export default function MintSerenityStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const bubbles =
    gallery.length >= 4
      ? gallery.slice(0, 4)
      : TEMPLATE_PHOTOS.slice(0, 4);
  const triptych =
    gallery.length >= 3
      ? [gallery[0], gallery[3] ?? gallery[1], gallery[2]]
      : [STORY_GARDEN_URL, STORY_HANDS_URL, PHOTO_MEADOW_URL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#ECFDF5] text-[#052E22]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#A7F3D0] bg-[#ECFDF5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            style={FONT_DISPLAY}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#052E22] uppercase transition-colors hover:text-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span style={FONT_SCRIPT} className="hidden text-2xl text-[#047857] sm:block">
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
          style={FONT_DISPLAY}
          className="text-[10px] tracking-[0.34em] text-[#047857] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#052E22] sm:text-[2.8rem]"
        >
          Our Story, Floating on Air
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5"
        >
          <BubbleDivider className="h-8 w-32" />
        </motion.div>
      </div>

      {/* Floating bubble photos */}
      <div className="mx-auto flex max-w-[820px] flex-wrap items-start justify-center gap-4 px-4 sm:gap-6">
        {bubbles.map((src, i) => (
          <motion.figure
            key={`${src}-${i}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col items-center"
          >
            <div
              className={`relative overflow-hidden rounded-full bg-white shadow-[0_18px_32px_-12px_rgba(6,95,70,0.45)] ring-4 ring-white ${BUBBLE_SIZES[i % BUBBLE_SIZES.length]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[12%] left-[16%] h-[14%] w-[14%] rounded-full bg-white/80"
              />
            </div>
            <figcaption
              style={FONT_BODY}
              className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#052E22] uppercase shadow-[0_6px_14px_-6px_rgba(6,95,70,0.4)]"
            >
              <Camera className="h-3 w-3 text-[#047857]" />
              {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* Story paragraphs in a white bubble card */}
      <div className="mx-auto max-w-[720px] px-4 pt-12 pb-16 sm:pb-20">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] bg-white px-6 py-9 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] sm:px-10 sm:py-11"
        >
          <span aria-hidden="true" className="pointer-events-none absolute top-5 right-6 h-8 w-8 rounded-full border border-[#065F46]/25 bg-[#ECFDF5]/70" />
          <div className="relative z-10">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                style={FONT_EDITORIAL}
                className="mt-4 text-center text-[1.05rem] leading-[1.8] text-[#052E22]/90 first:mt-0 sm:text-[1.1rem]"
              >
                {p}
              </p>
            ))}
            <div className="mt-7 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#065F46]/70" />
              <Heart className="h-4 w-4 fill-[#047857]/30 text-[#047857]" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#065F46]/70" />
            </div>
            <p style={FONT_SCRIPT} className="mt-5 text-center text-[2rem] leading-none text-[#047857]">
              {coupleNames(site)}
            </p>
          </div>
        </motion.div>

        {/* Triptych — three small bubbles */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-start justify-center gap-4 sm:gap-6"
        >
          {triptych.map((src, i) => (
            <div
              key={`${src}-tri-${i}`}
              className={`relative overflow-hidden rounded-full bg-white shadow-[0_14px_28px_-10px_rgba(6,95,70,0.45)] ring-4 ring-white ${
                i === 1 ? "h-36 w-36 sm:h-44 sm:w-44" : "mt-6 h-28 w-28 sm:h-36 sm:w-36"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Our Story moment ${i + 1}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            style={FONT_DISPLAY}
            className="group inline-flex items-center gap-2 rounded-full bg-[#065F46] px-7 py-3.5 text-[11px] tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46] sm:text-xs"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
