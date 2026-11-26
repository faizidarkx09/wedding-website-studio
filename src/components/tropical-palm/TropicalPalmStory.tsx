// Tropical Palm story page — the full story as an island hop: a
// vertical journey of numbered stops (photo + caption, alternating
// sides, joined by a palm-green route line), then the paragraphs,
// then a full-width beach photo band. When the buyer has gallery
// photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart, Palmtree } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  STORY_BEACH_URL,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function TropicalPalmStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const stops =
    gallery.length >= 4
      ? gallery.slice(0, 4)
      : TEMPLATE_PHOTOS.slice(0, 4);
  const band = gallery.length >= 3 ? gallery[2] : PHOTO_SUNSET_URL;
  const toast = gallery.length >= 2 ? gallery[1] : PHOTO_TOAST_URL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFFBEB] text-[#14301C]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#15803D]/30 bg-[#FFFBEB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 tp-font-display text-[11px] tracking-[0.24em] text-[#14301C] uppercase transition-colors hover:text-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="tp-font-script hidden text-2xl text-[#166534] sm:block">
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
          className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#14301C]"
        >
          Island-Hopping Through Our Story
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#15803D]/80" />
          <Palmtree className="h-4 w-4 text-[#166534]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#15803D]/80" />
        </motion.div>
      </div>

      {/* Island-hop journey — alternating stops on a route line */}
      <PaperSurface variant="sand" className="px-4 py-12">
        <div className="relative mx-auto max-w-[860px]">
          {/* Route line down the centre on wide screens, left on mobile */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-5 w-px bg-[#15803D]/40 sm:left-1/2"
          />
          <div className="space-y-10">
            {stops.map((src, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={`${src}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col gap-4 pl-14 sm:grid sm:grid-cols-2 sm:items-center sm:gap-10 sm:pl-0`}
                >
                  {/* Stop marker */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#15803D] bg-[#FFFBEB] text-[#166534] shadow-[0_6px_14px_-4px_rgba(20,83,45,0.5)] sm:top-1/2 sm:left-1/2 sm:-translate-y-1/2"
                  >
                    <Palmtree className="h-4 w-4" />
                  </span>

                  {/* Photo */}
                  <figure
                    className={`group relative overflow-hidden rounded-[4px] bg-[#FFFDF6] shadow-[0_14px_28px_-10px_rgba(20,83,45,0.5)] ring-1 ring-[#15803D]/30 ${
                      left ? "sm:order-1" : "sm:order-2"
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
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
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/30 via-transparent to-transparent"
                      />
                    </div>
                    <figcaption className="flex items-center justify-center gap-1.5 bg-[#FFFDF6] px-2 py-3 text-[10px] tracking-[0.2em] text-[#14301C] uppercase">
                      <Camera className="h-3 w-3 text-[#166534]" />
                      {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                    </figcaption>
                  </figure>

                  {/* Stop text */}
                  <div
                    className={`text-left ${left ? "sm:order-2" : "sm:order-1"} ${
                      left ? "sm:text-left" : "sm:text-right"
                    }`}
                  >
                    <p className="tp-font-display text-[10px] tracking-[0.34em] text-[#0E7490] uppercase">
                      Island {i + 1}
                    </p>
                    <h3 className="tp-font-display mt-2 text-[1.4rem] leading-[1.2] font-normal text-[#14301C]">
                      {STORY_CAPTIONS[i % STORY_CAPTIONS.length]}
                    </h3>
                    <p className="tp-font-editorial mt-2 text-[0.98rem] leading-[1.75] text-[#14301C]/80 italic">
                      {i === 0 &&
                        "Every journey begins with a single step — ours began with a hello neither of us expected."}
                      {i === 1 &&
                        "Side by side, we found our rhythm — slow walks, long talks, and the sea keeping time."}
                      {i === 2 &&
                        "Golden light, salt air, and the feeling that this — right here — is exactly where we belong."}
                      {i === 3 &&
                        "And now we raise a glass to the next island: the one we reach together, as husband and wife."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
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
            className="tp-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#14301C]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Full-width beach band + toast photo */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-5">
          <motion.figure
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-[4px] shadow-[0_16px_32px_-12px_rgba(20,83,45,0.45)] sm:col-span-3"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={band}
                alt="Golden-hour sunset over the sea"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/35 via-transparent to-transparent"
              />
            </div>
          </motion.figure>
          <motion.figure
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-[4px] shadow-[0_16px_32px_-12px_rgba(20,83,45,0.45)] sm:col-span-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toast}
                alt="A celebratory toast"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/35 via-transparent to-transparent"
              />
            </div>
          </motion.figure>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="tp-font-script text-[1.9rem] leading-none text-[#166534]">
            {coupleNames(site)}
          </p>
          <Heart className="h-4 w-4 fill-[#166534]/30 text-[#166534]" />
          <button
            type="button"
            onClick={onBack}
            className="group mt-2 inline-flex items-center gap-2 border border-[#14532D]/70 px-6 py-3 tp-font-display text-[11px] tracking-[0.26em] text-[#14301C] uppercase transition-colors duration-300 hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
