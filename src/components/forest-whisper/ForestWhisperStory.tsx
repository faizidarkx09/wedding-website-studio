// Forest Whisper story page — the full story as ZIGZAG alternating
// rows (photo left / text right, then flipped) plus the paragraphs.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Camera, Heart, TreePine } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  COUPLE_PHOTO_3_URL,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  storyParagraphs,
} from "./tokens";

export default function ForestWhisperStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const rows =
    gallery.length >= 2
      ? [
          {
            src: gallery[0],
            caption: STORY_CAPTIONS[0],
            title: "Where It All Began",
            text: "Every love story has a first chapter — ours began on a quiet trail, with a first hello neither of us expected.",
          },
          {
            src: gallery[1],
            caption: STORY_CAPTIONS[1],
            title: "The Light We Carry",
            text: "Through quiet mornings and loud celebrations, we kept choosing each other — and the light only grew warmer.",
          },
        ]
      : [
          {
            src: TEMPLATE_PHOTOS[0],
            caption: STORY_CAPTIONS[0],
            title: "Where It All Began",
            text: "Every love story has a first chapter — ours began on a quiet trail, with a first hello neither of us expected.",
          },
          {
            src: COUPLE_PHOTO_3_URL,
            caption: STORY_CAPTIONS[2],
            title: "The Trail Ahead",
            text: "And now the trail leads here — to a clearing in the forest, to family and friends, to a day we will never forget.",
          },
        ];
  const cards = gallery.length >= 2 ? gallery.slice(0, 2) : TEMPLATE_PHOTOS.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="@container relative min-h-[100dvh] w-full bg-[#F4F1E6] text-[#1B4332]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#6A994E]/30 bg-[#F4F1E6]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 fw-font-display text-[11px] tracking-[0.24em] text-[#1B4332] uppercase transition-colors hover:text-[#2D6A4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="fw-font-script hidden text-2xl text-[#2D6A4F] @min-[40rem]:block">
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
          className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#1B4332]"
        >
          Our Story Along the Trail
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#6A994E]/80" />
          <Heart className="h-4 w-4 fill-[#2D6A4F]/30 text-[#2D6A4F]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#6A994E]/80" />
        </motion.div>
      </div>

      {/* Zigzag rows — photo and text swap sides on each row in wide
          containers; stacked (photo above text) in narrow ones. */}
      <PaperSurface variant="forest" className="px-4 py-10">
        <div className="relative mx-auto max-w-[980px]">
          <div className="flex flex-col gap-12">
            {rows.map((row, i) => (
              <motion.div
                key={`${row.src}-${i}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="grid w-full grid-cols-1 items-center gap-5 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-10"
              >
                <figure
                  className={`group relative overflow-hidden rounded-[4px] bg-[#FBF9F1] shadow-[0_14px_28px_-10px_rgba(20,48,31,0.5)] ring-1 ring-[#A7C957]/30 ${
                    i % 2 === 1 ? "@min-[40rem]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.src}
                      alt={`Our Story — ${row.caption}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1B4332]/30 via-transparent to-transparent"
                    />
                  </div>
                  <figcaption className="flex items-center justify-center gap-1.5 bg-[#FBF9F1] px-2 py-3 text-[10px] tracking-[0.2em] text-[#1B4332] uppercase">
                    <Camera className="h-3 w-3 text-[#2D6A4F]" />
                    {row.caption}
                  </figcaption>
                </figure>
                <div className={`text-left text-[#F4F1E6] ${i % 2 === 1 ? "@min-[40rem]:order-1 @min-[40rem]:text-right" : ""}`}>
                  <p className="fw-font-display flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#A7C957] uppercase">
                    <TreePine className="h-3.5 w-3.5 shrink-0" />
                    {row.caption}
                  </p>
                  <h4 className="fw-font-display mt-2 text-[1.6rem] leading-[1.2] font-normal text-[#FBF9F1]">
                    {row.title}
                  </h4>
                  <p className="fw-font-editorial mt-3 text-[1rem] leading-[1.75] text-[#E7EAD9]/85">
                    {row.text}
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
            className="fw-font-editorial mt-6 text-[1.05rem] leading-[1.85] text-[#1B4332]/88 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Closing photos — the three template couple photos side by side */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <div className="grid grid-cols-3 gap-3 @min-[40rem]:gap-5">
          {cards.map((src, i) => (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-[4px] shadow-[0_16px_32px_-12px_rgba(27,67,50,0.45)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={
                    i === 0
                      ? "The couple walking a misty forest trail"
                      : i === 1
                        ? "The couple under a leafy forest canopy"
                        : "The couple dancing in a forest clearing at golden hour"
                  }
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1B4332]/35 via-transparent to-transparent"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#1B4332]/70 px-6 py-3 fw-font-display text-[11px] tracking-[0.26em] text-[#1B4332] uppercase transition-colors duration-300 hover:bg-[#1B4332] hover:text-[#F4F1E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
