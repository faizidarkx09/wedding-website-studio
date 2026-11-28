// Eternal Moment story — the four chapters as numbered editorial
// chapters (01–04). Each chapter gets a composition used nowhere
// else on the page (split / overlap / arch / editorial) — a
// deliberate break from golden-hour's warm photo cards, per the
// 26 Nov rule that no two templates share a story layout.
// Chapters come from site.content.storyMilestones (the seed writes
// four); without them, the story paragraphs become numbered
// chapters with the template's story photos.
"use client";

import type { WeddingSite } from "@/lib/types";
import Reveal from "../Reveal";
import { ChapterNumeral, Hairline } from "./Decor";
import { SectionHeading } from "./EternalMomentSections";
import {
  ETERNAL,
  FONT_BODY,
  FONT_DISPLAY,
  storyChapters,
  type StoryChapter,
} from "./tokens";

function ChapterMeta({ chapter }: { chapter: StoryChapter }) {
  return (
    <>
      <p className="font-mono text-[0.65rem] font-medium tracking-[0.35em] uppercase" style={{ color: ETERNAL.goldDeep }}>
        Chapter {chapter.number}
        {chapter.date ? ` · ${chapter.date}` : ""}
      </p>
      {chapter.title ? (
        <h3 className={`${FONT_DISPLAY} mt-3 text-3xl leading-tight font-medium sm:text-4xl`} style={{ color: ETERNAL.espresso }}>
          {chapter.title}
        </h3>
      ) : null}
    </>
  );
}

function ChapterText({ chapter }: { chapter: StoryChapter }) {
  return (
    <p className={`${FONT_BODY} mt-4 text-[1.05rem] leading-[1.85]`} style={{ color: `${ETERNAL.espresso}D9` }}>
      {chapter.text}
    </p>
  );
}

function ChapterImage({
  chapter,
  className,
}: {
  chapter: StoryChapter;
  className: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={chapter.image}
      alt={chapter.imageAlt}
      loading="lazy"
      decoding="async"
      className={`w-full object-cover ${className}`}
    />
  );
}

/** 01 — split: text left, portrait right. */
function ChapterSplit({ chapter }: { chapter: StoryChapter }) {
  return (
    <article id={`chapter-${chapter.id}`} tabIndex={-1} className="grid items-center gap-8 sm:grid-cols-2 sm:gap-12">
      <div>
        <ChapterMeta chapter={chapter} />
        <Hairline className="mt-5" />
        <ChapterText chapter={chapter} />
      </div>
      <ChapterImage chapter={chapter} className="aspect-[4/5]" />
    </article>
  );
}

/** 02 — overlap: wide image with the text card overlapping its
 * lower edge, offset to the right. */
function ChapterOverlap({ chapter }: { chapter: StoryChapter }) {
  return (
    <article id={`chapter-${chapter.id}`} tabIndex={-1} className="relative">
      <ChapterImage chapter={chapter} className="aspect-[16/10]" />
      <div
        className="relative z-10 mx-4 -mt-16 max-w-xl px-6 py-8 shadow-[0_18px_36px_-14px_rgba(36,34,31,0.35)] sm:ml-auto sm:mr-8 sm:-mt-20 sm:px-10"
        style={{ backgroundColor: ETERNAL.paper }}
      >
        <ChapterMeta chapter={chapter} />
        <ChapterText chapter={chapter} />
      </div>
    </article>
  );
}

/** 03 — arch: the photo in a tall arch frame, text centred below. */
function ChapterArch({ chapter }: { chapter: StoryChapter }) {
  return (
    <article id={`chapter-${chapter.id}`} tabIndex={-1} className="mx-auto max-w-2xl text-center">
      <div
        className="mx-auto w-full max-w-md overflow-hidden rounded-t-full border p-2"
        style={{ borderColor: `${ETERNAL.gold}80` }}
      >
        <ChapterImage chapter={chapter} className="aspect-[3/4] rounded-t-full" />
      </div>
      <div className="mt-8">
        <ChapterMeta chapter={chapter} />
        <Hairline diamond className="mx-auto mt-5 justify-center" />
        <ChapterText chapter={chapter} />
      </div>
    </article>
  );
}

/** 04 — editorial: a ghost numeral behind wide centred text, the
 * photo as a full-width band below. */
function ChapterEditorial({ chapter }: { chapter: StoryChapter }) {
  return (
    <article id={`chapter-${chapter.id}`} tabIndex={-1} className="relative">
      <div className="relative mx-auto max-w-3xl text-center">
        <ChapterNumeral
          number={chapter.number}
          className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[9rem] sm:text-[12rem]"
        />
        <div className="relative">
          <ChapterMeta chapter={chapter} />
          <ChapterText chapter={chapter} />
        </div>
      </div>
      <div className="mt-10">
        <ChapterImage chapter={chapter} className="aspect-[16/9]" />
      </div>
    </article>
  );
}

const CHAPTER_RENDERERS = [ChapterSplit, ChapterOverlap, ChapterArch, ChapterEditorial];

export default function EternalMomentStory({ site }: { site: WeddingSite }) {
  const chapters = storyChapters(site);
  if (chapters.length === 0) return null;

  const jumpToChapter = (id: string) => {
    document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="story"
      aria-label="Our love story"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: ETERNAL.ivory }}
    >
      <Reveal>
        <SectionHeading
          eyebrow="Chapter by chapter"
          title="Our Love Story"
          intro="Four chapters, one story — how two lives became one."
        />
      </Reveal>

      {/* Chapter jump nav — buttons scroll to a chapter. */}
      <nav aria-label="Story chapters" className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => jumpToChapter(chapter.id)}
            className="rounded-full border px-3.5 py-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase transition-colors duration-300 sm:px-4"
            style={{
              borderColor: `${ETERNAL.espresso}33`,
              backgroundColor: `${ETERNAL.paper}99`,
              color: ETERNAL.stone,
            }}
          >
            <span aria-hidden="true">{chapter.number} · </span>
            {chapter.title || `Chapter ${chapter.number}`}
          </button>
        ))}
      </nav>

      <div className="mt-16 flex flex-col gap-20 sm:mt-24 sm:gap-28">
        {chapters.map((chapter, i) => {
          const Chapter = CHAPTER_RENDERERS[i % CHAPTER_RENDERERS.length];
          return (
            <Reveal key={chapter.id}>
              <Chapter chapter={chapter} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
