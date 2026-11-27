// Sakura Dream story page — the full story winding down a petal
// path: round photos alternating left / right of a winding dashed
// blossom path, with the story paragraphs flowing between them.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { Blossom, PaperSurface, PetalDivider } from "./Decor";
import {
  COUPLE_1_URL,
  COUPLE_2_URL,
  COUPLE_3_URL,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function SakuraDreamStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const pathPhotos =
    gallery.length >= 4
      ? gallery.slice(0, 4)
      : TEMPLATE_PHOTOS.slice(0, 4);
  const closingPhotos =
    gallery.length >= 3
      ? [gallery[0], gallery[2], gallery[1]]
      : [COUPLE_1_URL, COUPLE_2_URL, COUPLE_3_URL];

  // Interleave: each petal-path stop pairs one photo with one
  // paragraph (extra paragraphs append after the last stop).
  const stops = pathPhotos.map((src, i) => ({
    src,
    caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
    text: paragraphs[i] ?? "",
  }));
  const extraParagraphs = paragraphs.slice(pathPhotos.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFF7FB] text-[#2E0A3D]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EC4899]/30 bg-[#FFF7FB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 sd-font-display text-[11px] tracking-[0.24em] text-[#2E0A3D] uppercase transition-colors hover:text-[#6B21A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="sd-font-script hidden text-2xl text-[#6B21A8] sm:block">
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
          className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#2E0A3D]"
        >
          Our Story Along the Petal Path
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5"
        >
          <PetalDivider className="h-7 w-36" />
        </motion.div>
      </div>

      {/* Petal Path — winding dashed curve with alternating stops */}
      <PaperSurface variant="blush" className="px-4 py-12">
        <div className="@container relative mx-auto max-w-[860px]">
          {/* Winding path (wide containers) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 860 1200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full @min-[40rem]:block"
          >
            <path
              d="M 430 0 C 300 150, 560 260, 430 400 C 300 540, 560 650, 430 800 C 320 920, 540 1040, 430 1200"
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
          {/* Straight path (narrow containers) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l-2 border-dashed border-[#EC4899]/50 @min-[40rem]:hidden"
          />

          <div className="relative flex flex-col gap-14">
            {stops.map((stop, i) => {
              const photoLeft = i % 2 === 0;
              return (
                <motion.div
                  key={`${stop.src}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col items-center gap-6 @min-[40rem]:flex-row @min-[40rem]:items-center @min-[40rem]:gap-10 ${
                    photoLeft ? "" : "@min-[40rem]:flex-row-reverse"
                  }`}
                >
                  {/* Round photo on the path */}
                  <figure className="group relative w-full max-w-[280px] shrink-0 @min-[40rem]:w-[38%]">
                    <span
                      aria-hidden="true"
                      className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
                    >
                      <Blossom className="h-8 w-8 drop-shadow-[0_4px_10px_rgba(107,33,168,0.3)]" />
                    </span>
                    <div className="relative overflow-hidden rounded-full bg-[#FFFDFB] shadow-[0_16px_32px_-12px_rgba(46,10,61,0.45)] ring-4 ring-white">
                      <div className="relative aspect-square overflow-hidden rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stop.src}
                          alt={`Our Story — ${stop.caption}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E0A3D]/30 via-transparent to-transparent"
                        />
                      </div>
                    </div>
                    <figcaption className="mt-3 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-[#2E0A3D] uppercase">
                      <Camera className="h-3 w-3 text-[#EC4899]" />
                      {stop.caption}
                    </figcaption>
                  </figure>

                  {/* Paragraph beside the photo */}
                  {stop.text && (
                    <p className="sd-font-editorial text-center text-[1.05rem] leading-[1.85] text-[#2E0A3D]/88 @min-[40rem]:flex-1 @min-[40rem]:text-left">
                      {stop.text}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Extra paragraphs (beyond the four stops) */}
          {extraParagraphs.length > 0 && (
            <div className="relative mx-auto mt-14 max-w-[680px]">
              {extraParagraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="sd-font-editorial mt-6 text-center text-[1.05rem] leading-[1.85] text-[#2E0A3D]/88 first:mt-0"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          )}
        </div>
      </PaperSurface>

      {/* Closing blossom row — three small round photos */}
      <div className="mx-auto max-w-[980px] px-4 pt-12 pb-16">
        <div className="flex flex-wrap items-start justify-center gap-6">
          {closingPhotos.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative w-36 overflow-hidden rounded-full shadow-[0_16px_32px_-12px_rgba(46,10,61,0.45)] ring-4 ring-white sm:w-44 ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "Cherry blossom in spring light" : i === 1 ? "A celebratory toast" : "Blossom sunset"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Heart className="h-5 w-5 fill-[#EC4899]/30 text-[#EC4899]" />
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#2E0A3D]/70 px-6 py-3 sd-font-display text-[11px] tracking-[0.26em] text-[#2E0A3D] uppercase transition-colors duration-300 hover:bg-[#2E0A3D] hover:text-[#FFF7FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
