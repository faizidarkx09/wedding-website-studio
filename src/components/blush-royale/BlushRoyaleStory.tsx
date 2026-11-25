// Blush Royale story page — the full story told as a vertical
// garden of CIRCULAR photos with floral rings (never a film strip,
// never a triptych of rectangles): each paragraph is paired with a
// ringed circle, alternating sides on desktop. When the buyer has
// gallery photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FloralRingPhoto } from "./Decor";
import {
  CIRCLE_CAPTIONS,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function BlushRoyaleStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const circles =
    gallery.length >= 3
      ? [gallery[0], gallery[1], gallery[2]]
      : [PHOTO_HANDS_URL, PHOTO_TOAST_URL, PHOTO_SUNSET_URL];
  const previewCircles =
    gallery.length >= 4 ? gallery.slice(0, 4) : TEMPLATE_PHOTOS.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FBF6F3] text-[#5C323B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EFC9CE]/60 bg-[#FBF6F3]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 br-font-display text-[11px] tracking-[0.24em] text-[#B76E79] uppercase transition-colors hover:text-[#5C323B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="br-font-script hidden text-2xl text-[#B76E79] sm:block">
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
          className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#5C323B] sm:text-[2.8rem]"
        >
          A Love in Full Bloom
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B76E79]/80 sm:w-24" />
          <Heart className="h-4 w-4 fill-[#B76E79]/30 text-[#B76E79]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B76E79]/80 sm:w-24" />
        </motion.div>
      </div>

      {/* Circular preview row — the same four ringed circles as the
          invitation preview, so the page feels like one garden */}
      <div className="mx-auto max-w-[860px] px-4 pb-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
          {previewCircles.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <FloralRingPhoto
                src={src}
                alt={`Our Story — ${CIRCLE_CAPTIONS[i % CIRCLE_CAPTIONS.length]}`}
                className="w-full max-w-[170px]"
              />
              <figcaption className="br-font-script mt-2.5 text-[1.3rem] leading-none text-[#B76E79]">
                {CIRCLE_CAPTIONS[i % CIRCLE_CAPTIONS.length]}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Story paragraphs, each paired with a ringed circle */}
      <div className="mx-auto max-w-[820px] px-5 pt-10 pb-8 sm:pt-14 sm:pb-10">
        {paragraphs.map((p, i) => {
          const photo = circles[i % circles.length];
          const flip = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center gap-6 py-6 sm:py-8 ${
                flip ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              <div className="w-44 shrink-0 sm:w-52">
                <FloralRingPhoto
                  src={photo}
                  alt={i === 0 ? "Joined hands with wedding rings" : i === 1 ? "A celebratory toast" : "Golden-hour sunset"}
                />
              </div>
              <p className="br-font-editorial text-[1.05rem] leading-[1.85] text-[#5C323B]/88 sm:text-[1.12rem]">
                {p}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mx-auto max-w-[980px] px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-full border border-[#B76E79]/70 px-6 py-3 br-font-display text-[11px] tracking-[0.26em] text-[#B76E79] uppercase transition-colors duration-300 hover:bg-[#B76E79] hover:text-[#FFFDFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
