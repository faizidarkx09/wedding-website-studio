// Aurora story page — the full story flowing along a vertical
// aurora ribbon (photos alternating left/right on wide containers,
// single column on narrow ones) plus the paragraphs. When the buyer
// has gallery photos they win, otherwise the template's own photos
// show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { NightSurface } from "./Decor";
import {
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function AuroraStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const moments =
    gallery.length >= 3 ? [gallery[0], gallery[1], gallery[2]] : TEMPLATE_PHOTOS.slice(0, 3);
  const cards = moments;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#0F172A] text-[#F4F7FB]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#5EEAD4]/25 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 au-font-display text-[11px] font-semibold tracking-[0.24em] text-[#F4F7FB] uppercase transition-colors hover:text-[#5EEAD4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="au-font-script hidden text-2xl text-[#5EEAD4] sm:block">
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
          className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[0.02em] text-[#F4F7FB]"
        >
          Our Story Beneath the Lights
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#5EEAD4]/80" />
          <Heart className="h-4 w-4 fill-[#5EEAD4]/30 text-[#5EEAD4]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B5CF6]/80" />
        </motion.div>
      </div>

      {/* Ribbon-flow moments */}
      <NightSurface variant="deep" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <div className="@container relative">
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-5 w-[3px] bg-gradient-to-b from-[#14B8A6] via-[#8B5CF6] to-[#5EEAD4] opacity-70 @min-[40rem]:left-1/2 @min-[40rem]:-translate-x-1/2"
            />
            <div className="relative flex flex-col gap-10 @min-[40rem]:gap-16">
              {moments.map((src, i) => {
                const leftSide = i % 2 === 0;
                return (
                  <motion.figure
                    key={`${src}-${i}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative flex items-start gap-4 pl-12 text-left @min-[40rem]:w-[calc(50%-2rem)] @min-[40rem]:pl-0 ${
                      leftSide
                        ? "@min-[40rem]:self-start @min-[40rem]:flex-row"
                        : "@min-[40rem]:self-end @min-[40rem]:flex-row-reverse @min-[40rem]:text-right"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-6 left-5 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#5EEAD4] bg-[#0F172A] shadow-[0_0_14px_rgba(20,184,166,0.7)] @min-[40rem]:hidden"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-6 z-10 hidden h-4 w-4 items-center justify-center rounded-full border-2 border-[#5EEAD4] bg-[#0F172A] shadow-[0_0_14px_rgba(20,184,166,0.7)] @min-[40rem]:flex"
                      style={leftSide ? { right: "-2.5rem" } : { left: "-2.5rem" }}
                    />
                    <div className="group relative w-40 shrink-0 overflow-hidden rounded-xl shadow-[0_18px_36px_-12px_rgba(2,6,23,0.9)] ring-1 ring-[#5EEAD4]/40 @min-[40rem]:w-52">
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
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/50 via-transparent to-transparent"
                        />
                      </div>
                    </div>
                    <figcaption className="min-w-0 pt-4">
                      <span className="au-font-display block text-[11px] font-semibold tracking-[0.24em] text-[#5EEAD4] uppercase @min-[40rem]:text-xs">
                        {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                      </span>
                      {paragraphs[i] && (
                        <span className="au-font-editorial mt-2 block text-[0.95rem] leading-relaxed text-[#E2E8F0]/85 italic">
                          {paragraphs[i]}
                        </span>
                      )}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          </div>
        </div>
      </NightSurface>

      {/* Remaining story paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8">
        {paragraphs.slice(moments.length).map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="au-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#E2E8F0]/90 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Bottom photo strip — the three template photos side by side */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {cards.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-xl shadow-[0_16px_32px_-12px_rgba(2,6,23,0.9)] ring-1 ring-[#5EEAD4]/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
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
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/45 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#5EEAD4]/70 px-6 py-3 au-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F4F7FB] uppercase transition-colors duration-300 hover:bg-[#14B8A6]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
