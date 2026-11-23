// The Sacred Garden gallery — responsive masonry (CSS columns,
// natural image ratios), blur-to-sharp loading, hover zoom capped at
// 1.04, and a fullscreen lightbox with next/previous, Escape,
// keyboard arrows and mobile swipe navigation (ÉTERNEL gallery
// pattern, restyled in Sacred Garden gold/burgundy). The source site
// has NO gallery at all (audit bug #3) — this small data-driven
// gallery exists so the template preview shows photos; Phase B
// expands it with the full photo set.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SACRED } from "./tokens";
import { Divider } from "./Decor";

function GalleryImage({
  src,
  alt,
  onOpen,
  index,
}: {
  src: string;
  alt: string;
  onOpen: (index: number) => void;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1}: ${alt}`}
      className="group block w-full cursor-pointer overflow-hidden rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: SACRED.gold }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="w-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
        style={{
          filter: loaded ? "blur(0)" : "blur(12px)",
          opacity: loaded ? 1 : 0.55,
        }}
      />
    </button>
  );
}

export default function SacredGardenGallery({ site }: { site: WeddingSite }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => (cur === null ? cur : (cur + dir + site.gallery.length) % site.gallery.length));
    },
    [site.gallery.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    setLoaded(false);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, step]);

  if (!site.settings.showGallery || site.gallery.length === 0) return null;

  const current = lightbox !== null ? site.gallery[lightbox] : null;

  return (
    <section id="gallery" aria-label="Photo gallery" className="mx-auto w-full max-w-6xl" style={{ backgroundColor: SACRED.cream }}>
      <div className="px-5 py-20 sm:py-24">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: SACRED.gold }}>
            Moments
          </p>
          <h2 className="sacred-script mt-3 text-[41px] leading-[1.55]" style={{ color: SACRED.gold }}>
            Our gallery
          </h2>
          <Divider className="mx-auto mt-2 h-4 w-44" style={{ color: SACRED.gold }} />
          <p className="mx-auto mt-4 max-w-xl leading-relaxed" style={{ color: `${SACRED.brown}CC` }}>
            A few favourite memories, so far — tap any photo to view it fullscreen.
          </p>
        </div>

        <div className="mt-12 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="break-inside-avoid">
              <GalleryImage
                src={image.url}
                alt={image.caption || `Gallery photo ${i + 1}`}
                index={i}
                onOpen={setLightbox}
              />
              {image.caption ? (
                <figcaption className="mt-2 text-center text-sm italic" style={{ color: `${SACRED.brown}B3` }}>
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && current ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${lightbox + 1} of ${site.gallery.length}`}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
            style={{ backgroundColor: "rgba(20, 16, 12, 0.94)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={close}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
              touchX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e: React.TouchEvent<HTMLDivElement>) => {
              const start = touchX.current;
              touchX.current = null;
              if (start === null) return;
              const dx = (e.changedTouches[0]?.clientX ?? start) - start;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex w-full max-w-4xl items-center justify-between text-white">
              <span className="text-sm opacity-80">
                {lightbox + 1} / {site.gallery.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="mt-4 flex max-h-[72vh] w-full max-w-4xl items-center justify-center"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={current.caption || `Gallery photo ${lightbox + 1}`}
                decoding="async"
                onLoad={() => setLoaded(true)}
                className="max-h-[72vh] w-auto max-w-full object-contain transition-all duration-500"
                style={{ filter: loaded ? "blur(0)" : "blur(10px)", opacity: loaded ? 1 : 0.6 }}
              />
            </motion.div>
            {current.caption ? (
              <p className="mt-3 text-center text-sm text-white/85 italic">{current.caption}</p>
            ) : null}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
                className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
                className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
