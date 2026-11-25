// Sapphire Royale story page — the full story with THREE
// HORIZONTAL PHOTO CARDS (the same stepped trio as the preview,
// never a film strip) plus the 3 paragraphs. When the buyer has
// gallery photos they win, otherwise the template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DecoDivider, NightSurface } from "./Decor";
import {
  CARD_CAPTIONS,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_TOAST_URL,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function SapphireRoyaleStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const cards =
    gallery.length >= 3
      ? [gallery[0], gallery[1], gallery[2]]
      : [PHOTO_HANDS_URL, PHOTO_SUNSET_URL, PHOTO_TOAST_URL];
  const previewCards = gallery.length >= 3 ? gallery.slice(0, 3) : TEMPLATE_PHOTOS.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#F2F4F8] text-[#12294D]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#C0C0C8]/50 bg-[#F2F4F8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 sr-font-display text-[11px] tracking-[0.24em] text-[#0A1F44] uppercase transition-colors hover:text-[#12294D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A1F44]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="sr-font-script hidden text-2xl text-[#12294D] sm:block">
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
          className="sr-font-display text-[10px] tracking-[0.34em] text-[#12294D] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#0A1F44] sm:text-[2.8rem]"
        >
          Written in Silver
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C0C0C8] sm:w-24" />
          <Heart className="h-4 w-4 fill-[#12294D]/20 text-[#12294D]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C0C0C8] sm:w-24" />
        </motion.div>
      </div>

      {/* Three horizontal photo cards on navy */}
      <NightSurface variant="navy" className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="relative mx-auto max-w-[980px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-5">
            {previewCards.map((src, i) => (
              <motion.figure
                key={`${src}-${i}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative ${i === 1 ? "sm:translate-y-6" : ""}`}
              >
                <div className="relative overflow-hidden border border-[#C0C0C8]/50 bg-[#12294D] p-2 shadow-[0_16px_32px_-12px_rgba(6,18,43,0.7)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Our Story — ${CARD_CAPTIONS[i % CARD_CAPTIONS.length]}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06122B]/50 via-transparent to-transparent"
                    />
                  </div>
                  <figcaption className="flex items-center justify-center gap-2 px-2 pt-3 pb-1.5 sr-font-display text-[10px] tracking-[0.24em] text-[#D9D9DE] uppercase">
                    <Camera className="h-3 w-3 text-[#C0C0C8]" />
                    {CARD_CAPTIONS[i % CARD_CAPTIONS.length]}
                  </figcaption>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </NightSurface>

      {/* Story Paragraphs */}
      <div className="mx-auto max-w-[680px] px-5 pt-12 pb-8 sm:pt-16 sm:pb-10">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="sr-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#12294D]/88 first:mt-0 sm:text-[1.12rem]"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Second trio — the same three moments, larger, on ice */}
      <div className="mx-auto max-w-[980px] px-4 pb-16 sm:px-6 sm:pb-20">
        <DecoDivider className="mb-8 h-5 w-44" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {cards.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden border border-[#C0C0C8]/50 bg-[#FFFFFF] p-2 shadow-[0_16px_32px_-12px_rgba(6,18,43,0.4)] ${
                i === 1 ? "sm:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "Joined hands with wedding rings" : i === 1 ? "Golden-hour sunset" : "A celebratory toast"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06122B]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#0A1F44]/70 px-6 py-3 sr-font-display text-[11px] tracking-[0.26em] text-[#0A1F44] uppercase transition-colors duration-300 hover:bg-[#0A1F44] hover:text-[#F2F4F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A1F44] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
