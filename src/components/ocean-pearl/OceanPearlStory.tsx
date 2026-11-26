// Ocean Pearl story page — the full story with the horizontal-scroll
// strip (beach walk, wave, message in a bottle) plus the paragraphs.
// When the buyer has gallery photos they win, otherwise the
// template's own photos show.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, WaveDivider } from "./Decor";
import { coupleNames, storyParagraphs } from "./tokens";
import { StoryStrip, useStoryStrip } from "./OceanPearlHero";

export default function OceanPearlStory({
  site,
  onBack,
}: {
  site: WeddingSite;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const items = useStoryStrip(site);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#F7FBFC] text-[#0E3A45]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#2E8B9A]/30 bg-[#F7FBFC]/95 backdrop-blur-sm">
        <div className="@container mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 op-font-display text-[11px] font-semibold tracking-[0.24em] text-[#0E3A45] uppercase transition-colors hover:text-[#1F6B78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="op-font-display hidden text-xl font-bold tracking-[0.04em] text-[#1F6B78] uppercase @min-[40rem]:block">
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
          className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase"
        >
          OUR STORY
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display mt-3 text-[2.2rem] leading-[1.1] font-bold tracking-[0.02em] text-[#0E3A45]"
        >
          Our Story, Riding the Waves
        </motion.h1>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#2E8B9A]/80" />
          <Heart className="h-4 w-4 fill-[#2E8B9A]/30 text-[#2E8B9A]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#2E8B9A]/80" />
        </motion.div>
      </div>

      {/* Horizontal-scroll strip on an aqua band */}
      <PaperSurface variant="aqua" className="px-4 py-10">
        <div className="@container relative mx-auto max-w-[980px]">
          <StoryStrip items={items} />
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
            className="op-font-body mt-6 text-[1.05rem] leading-[1.85] text-[#0E3A45]/85 first:mt-0"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* Closing wave divider + back button */}
      <div className="mx-auto max-w-[980px] px-4 pb-16">
        <WaveDivider className="h-8 w-32" />
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-full border border-[#0E3A45]/70 px-6 py-3 op-font-display text-[11px] font-semibold tracking-[0.26em] text-[#0E3A45] uppercase transition-colors duration-300 hover:bg-[#0E3A45] hover:text-[#F7FBFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
