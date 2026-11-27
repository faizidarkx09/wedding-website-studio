// Rose Garden story page — the full story as a VERTICAL TIMELINE
// with rose markers: alternating sides on wide containers, a single
// column with a left rail on narrow containers. Chapters pair each
// story paragraph with a photo (buyer gallery wins, otherwise the
// template's own photos). Container queries only — no viewport `sm:`.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { RoseMark } from "./Decor";
import {
  STORY_CHAPTERS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function RoseGardenStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const photos =
    gallery.length >= 3 ? gallery.slice(0, 3) : [...TEMPLATE_PHOTOS];
  const entries = paragraphs.map((text, i) => ({
    title: STORY_CHAPTERS[i % STORY_CHAPTERS.length],
    text,
    photo: photos[i % photos.length],
    side: i % 2 === 0 ? ("left" as const) : ("right" as const),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="@container relative min-h-[100dvh] w-full bg-[#FFF7F2] text-[#3D1420]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#B3124F]/30 bg-[#FFF7F2]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rg-font-display text-[11px] tracking-[0.24em] text-[#3D1420] uppercase transition-colors hover:text-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="rg-font-script hidden text-2xl text-[#B3124F] @min-[40rem]:block">
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
          className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#3D1420]"
        >
          Our Story, Petal by Petal
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B3124F]/80" />
          <Heart className="h-4 w-4 fill-[#7E0C37]/30 text-[#7E0C37]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B3124F]/80" />
        </motion.div>
      </div>

      {/* Vertical timeline — single column on narrow containers,
          alternating sides on wide containers (centre stem). */}
      <div className="relative mx-auto max-w-[980px] px-4 pb-16">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-16 left-[35px] w-px bg-gradient-to-b from-[#B3124F]/60 via-[#3E6B3A]/50 to-[#B3124F]/60 @min-[40rem]:left-1/2"
        />
        <ol className="space-y-12 @min-[40rem]:space-y-16">
          {entries.map((entry, i) => (
            <motion.li
              key={`${entry.title}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-4 pl-0 @min-[40rem]:grid @min-[40rem]:grid-cols-2 @min-[40rem]:gap-12"
            >
              {/* Rose marker — left rail narrow, centre stem wide */}
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/50 bg-[#FFF7F2] text-[#B3124F] shadow-[0_8px_16px_-6px_rgba(61,20,32,0.4)] @min-[40rem]:absolute @min-[40rem]:left-1/2 @min-[40rem]:-translate-x-1/2">
                <RoseMark className="h-7 w-7" />
              </span>

              {/* Chapter card — left column on even entries, right on
                  odd entries (wide); full width beside the rail
                  (narrow). */}
              <div
                className={`min-w-0 flex-1 pt-1 @min-[40rem]:pt-0 ${
                  entry.side === "left"
                    ? "@min-[40rem]:col-start-1 @min-[40rem]:pr-4 @min-[40rem]:text-right"
                    : "@min-[40rem]:col-start-2 @min-[40rem]:pl-4"
                }`}
              >
                <p className="rg-font-display text-[12px] tracking-[0.24em] text-[#7E0C37] uppercase">
                  Chapter {i + 1} · {entry.title}
                </p>
                <p className="rg-font-editorial mt-2 text-[1.05rem] leading-[1.85] text-[#3D1420]/88">
                  {entry.text}
                </p>
                <div
                  className={`relative mt-4 aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-[4px] shadow-[0_16px_32px_-12px_rgba(61,20,32,0.45)] ring-1 ring-[#B3124F]/25 ${
                    entry.side === "left" ? "@min-[40rem]:ml-auto" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.photo}
                    alt={`Our Story — ${entry.title}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3D1420]/25 via-transparent to-transparent"
                  />
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#3D1420]/70 px-6 py-3 rg-font-display text-[11px] tracking-[0.26em] text-[#3D1420] uppercase transition-colors duration-300 hover:bg-[#3D1420] hover:text-[#FFF7F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
