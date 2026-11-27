// Peacock Royale story page — the full story with a fan-shaped
// photo arc and a fanned triptych plus the paragraphs. When the
// buyer has gallery photos they win, otherwise the template's own
// peacock photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FeatherDivider, PeacockSurface, ShimmeringSparkles } from "./Decor";
import {
  FAN_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

const ARC = [
  { rotate: "-7deg", translateY: "14px" },
  { rotate: "0deg", translateY: "0px" },
  { rotate: "7deg", translateY: "14px" },
];

export default function PeacockRoyaleStory({
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
      ? [gallery[0], gallery[1], gallery[2]]
      : TEMPLATE_PHOTOS.slice(0, 3);
  const cards = gallery.length >= 3 ? gallery.slice(0, 3) : TEMPLATE_PHOTOS.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FDFBF5] text-[#062E2B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#D4AF37]/60 bg-[#FDFBF5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 er-font-display text-[11px] tracking-[0.24em] text-[#062E2B] uppercase transition-colors hover:text-[#0B4F4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="er-font-script hidden text-2xl text-[#0B4F4A] sm:block">
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
          className="er-font-display text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#062E2B] sm:text-[2.8rem]"
        >
          Written in Feather &amp; Gold
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37] sm:w-24" />
          <Heart className="h-4 w-4 fill-[#0B4F4A]/30 text-[#0B4F4A]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37] sm:w-24" />
        </motion.div>
      </div>

      {/* Fan Arc on deep teal */}
      <PeacockSurface variant="teal" className="px-4 py-10 sm:px-6 sm:py-12">
        <ShimmeringSparkles count={36} />
        <div className="relative mx-auto max-w-[980px]">
          <div className="grid grid-cols-3 gap-2 sm:gap-5">
            {cards.map((src, i) => (
              <figure
                key={`${src}-${i}`}
                className="group relative"
                style={{
                  transform: `rotate(${ARC[i].rotate}) translateY(${ARC[i].translateY})`,
                  transformOrigin: "bottom center",
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] shadow-[0_10px_22px_-6px_rgba(4,33,31,0.7)] ring-2 ring-[#D4AF37]/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Our Story — ${FAN_CAPTIONS[i % FAN_CAPTIONS.length]}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04211F]/45 via-transparent to-transparent"
                  />
                  <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-white/95 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] sm:text-[10px]">
                    <Camera className="h-3 w-3" />
                    {FAN_CAPTIONS[i % FAN_CAPTIONS.length]}
                  </span>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </PeacockSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8 sm:pt-16 sm:pb-10">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="er-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#062E2B]/88 first:mt-0 sm:text-[1.12rem]"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Fanned Triptych */}
      <div className="mx-auto max-w-[980px] px-4 pb-16 sm:px-6 sm:pb-20">
        <FeatherDivider className="mx-auto mb-10 w-44" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {triptych.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-t-[999px] shadow-[0_16px_32px_-12px_rgba(4,33,31,0.45)] ring-2 ring-[#D4AF37]/60"
              style={{
                transform: `rotate(${ARC[i].rotate})`,
                transformOrigin: "bottom center",
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={
                    i === 0
                      ? "The couple smiling in a jewel-toned teal and gold ballroom"
                      : i === 1
                        ? "Close portrait of the couple with peacock feathers"
                        : "The couple dancing at a royal jewel-toned celebration"
                  }
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04211F]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#062E2B]/70 px-6 py-3 er-font-display text-[11px] tracking-[0.26em] text-[#062E2B] uppercase transition-colors duration-300 hover:bg-[#062E2B] hover:text-[#FDFBF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
