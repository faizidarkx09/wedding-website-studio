// Blush Royale decorations — watercolor wash surfaces, floral
// corners, the rose-sprig divider and the floral-ring circular
// photo frame. Font classes are the scoped .blush-royale variants
// from globals.css (see HANDOFF.md — never the bare class names,
// which would collide with other templates).
import type { ReactNode } from "react";
import {
  CREAM_IMAGE_URL,
  FLORAL_CLUSTER_URL,
  FLORAL_CORNER_URL,
  FLORAL_RING_URL,
  WASH_IMAGE_URL,
} from "./tokens";

interface WashSurfaceProps {
  variant: "wash" | "cream";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function WashSurface({ variant, className = "", children, id }: WashSurfaceProps) {
  const isWash = variant === "wash";
  const bgUrl = isWash ? WASH_IMAGE_URL : CREAM_IMAGE_URL;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isWash ? "bg-[#F6DDE0] text-[#5C323B]" : "bg-[#FBF6F3] text-[#5C323B]"
      } ${className}`}
    >
      {/* Soft watercolor-wash texture layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgUrl})`,
          opacity: isWash ? 0.9 : 0.85,
        }}
      />

      {/* Gentle light vignette — keeps the centre bright for text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isWash
            ? "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(255, 253, 251, 0.35) 0%, rgba(239, 201, 206, 0.28) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 251, 0.4) 0%, rgba(246, 221, 224, 0.25) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

interface FloralCornerProps {
  position: "top-left" | "bottom-right" | "top-right";
  className?: string;
}

export function FloralCorner({ position, className = "" }: FloralCornerProps) {
  const positionStyles: Record<FloralCornerProps["position"], string> = {
    "top-left": "-top-6 -left-8 w-44 sm:w-56 md:w-64 rotate-0",
    "bottom-right": "-bottom-8 -right-8 w-44 sm:w-56 md:w-64 rotate-180",
    "top-right": "-top-6 -right-8 w-40 sm:w-52 rotate-90",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 select-none ${positionStyles[position]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FLORAL_CORNER_URL}
        alt=""
        referrerPolicy="no-referrer"
        className="br-mask-floral-corner h-auto w-full object-contain opacity-95"
      />
    </div>
  );
}

export function FloralCluster({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FLORAL_CLUSTER_URL}
        alt=""
        referrerPolicy="no-referrer"
        className={`br-mask-radial-soft h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(92,50,59,0.25)] ${
          side === "right" ? "-scale-x-100" : ""
        }`}
      />
    </div>
  );
}

/** Rose-sprig divider — thin rose-gold stem with blush leaves. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 58" fill="none" className={`mx-auto ${className}`}>
      <path d="M36 45C56 36 86 24 142 12" stroke="#B76E79" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M66 35C56 26 52 17 57 12C64 15 70 23 68 34"
        fill="#E8B4B8"
        fillOpacity="0.5"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M84 29C76 19 75 10 82 6C88 11 91 20 86 28"
        fill="#E8B4B8"
        fillOpacity="0.55"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M104 23C98 14 99 6 107 4C112 9 112 17 106 23"
        fill="#E8B4B8"
        fillOpacity="0.5"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M123 18C119 10 122 4 129 4C133 8 131 15 125 18"
        fill="#E8B4B8"
        fillOpacity="0.45"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M78 33C86 38 96 42 103 38C98 31 89 29 79 32"
        fill="#E8B4B8"
        fillOpacity="0.5"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M101 25C109 30 119 32 125 27C120 21 111 20 102 24"
        fill="#E8B4B8"
        fillOpacity="0.55"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <path
        d="M52 40C58 46 66 50 74 47C69 40 61 37 53 39"
        fill="#E8B4B8"
        fillOpacity="0.45"
        stroke="#B76E79"
        strokeWidth="1"
      />
      <circle cx="48" cy="31" r="2" fill="#B76E79" />
      <circle cx="94" cy="36" r="1.8" fill="#B76E79" />
      <circle cx="137" cy="21" r="1.8" fill="#B76E79" />
      <circle cx="145" cy="11" r="2.2" fill="#B76E79" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* FloralRingPhoto — a circular photo ringed by the watercolor       */
/* floral wreath. The ring artwork is a square JPEG with a plain     */
/* cream centre, so the photo sits in the middle (inset ~13%) and   */
/* the wreath shows around it. The ring's own cream centre is the    */
/* same cream as the page, so the join is invisible.                 */
/* ------------------------------------------------------------------ */

export function FloralRingPhoto({
  src,
  alt,
  className = "",
  photoClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  photoClassName?: string;
}) {
  return (
    <div className={`group relative aspect-square w-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FLORAL_RING_URL}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full rounded-full object-cover"
      />
      <div className="absolute inset-[13%] overflow-hidden rounded-full shadow-[0_12px_28px_-10px_rgba(92,50,59,0.45)] ring-1 ring-white/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${photoClassName}`}
        />
      </div>
    </div>
  );
}
