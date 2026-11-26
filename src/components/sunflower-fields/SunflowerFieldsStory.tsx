// Sunflower Fields story page — the full story with the field
// row (photos on stems) plus the paragraphs and a wide field
// photograph. When the buyer has gallery photos they win,
// otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, SunflowerDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  STORY_CAPTIONS,
  STORY_FIELD_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function SunflowerFieldsStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const widePhoto = gallery.length >= 1 ? gallery[0] : STORY_FIELD_URL;
  const row = gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFFBEB] text-[#14532D]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EAB308]/40 bg-[#FFFBEB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#14532D] uppercase transition-colors hover:text-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span
            style={{ fontFamily: FONT_SCRIPT }}
            className="max-w-[45%] truncate text-xl text-[#166534]"
          >
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
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#14532D]"
        >
          Our Story, Grown in the Field
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5"
        >
          <SunflowerDivider className="h-7 w-36" />
        </motion.div>
      </div>

      {/* Wide field photograph */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[900px] px-4"
      >
        <div className="relative overflow-hidden shadow-[0_20px_40px_-16px_rgba(20,83,45,0.45)] ring-1 ring-[#EAB308]/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={widePhoto}
            alt="Walking hand in hand down a path through the sunflower field"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="aspect-[16/9] w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/25 via-transparent to-transparent"
          />
        </div>
      </motion.div>

      {/* Story paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-10 pb-6">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: FONT_EDITORIAL }}
            className="mt-5 text-center text-[1.08rem] leading-[1.85] text-[#14532D]/90 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
        {paragraphs.length === 0 && (
          <p
            style={{ fontFamily: FONT_EDITORIAL }}
            className="text-center text-[1.08rem] leading-[1.85] text-[#14532D]/70 italic"
          >
            Our story begins here — replace this with your own words in the editor.
          </p>
        )}
      </div>

      {/* Field row — the story in photos, on stems */}
      <PaperSurface variant="cream" className="px-4 py-12">
        <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
          <p
            style={{ fontFamily: FONT_DISPLAY }}
            className="flex items-center gap-2 text-[10px] tracking-[0.34em] text-[#166534] uppercase"
          >
            <Camera className="h-3.5 w-3.5" />
            MOMENTS FROM THE FIELD
          </p>
          <div className="@container mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] @min-[40rem]:grid @min-[40rem]:grid-cols-4 @min-[40rem]:overflow-visible @min-[40rem]:pb-0">
            {row.map((src, i) => (
              <figure
                key={`${src}-${i}`}
                className="group w-[68vw] max-w-[260px] shrink-0 snap-center @min-[40rem]:w-auto @min-[40rem]:max-w-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#FFFEF5] shadow-[0_14px_28px_-10px_rgba(20,83,45,0.4)] ring-1 ring-[#EAB308]/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div aria-hidden="true" className="mx-auto h-8 w-0.5 bg-[#166534]/70" />
                <figcaption
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="px-2 text-[10px] tracking-[0.2em] text-[#14532D] uppercase"
                >
                  {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="mx-auto mt-1 h-0.5 w-full max-w-[860px] rounded-full bg-gradient-to-r from-transparent via-[#166534]/50 to-transparent"
          />

          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group mt-10 inline-flex items-center gap-2 border border-[#EAB308]/70 px-6 py-3 text-[11px] tracking-[0.28em] text-[#14532D] uppercase transition-colors duration-300 hover:border-[#14532D] hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EAB308]"
          >
            <Heart className="h-3.5 w-3.5 text-[#166534] transition-colors group-hover:text-[#FACC15]" />
            Back to Invitation
          </button>
        </div>
      </PaperSurface>
    </motion.div>
  );
}
