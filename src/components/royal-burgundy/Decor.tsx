// Royal Burgundy decorations — 1:1 port of the source's
// BotanicalDecorations.tsx (PaperSurface, CherryBlossomSprig,
// BurgundyFloralCluster, BotanicalCardDivider). Same values, same
// geometry; only the asset URLs point at the Studio's staged
// template images. Font classes are the scoped .royal-burgundy
// variants from globals.css (never the bare source class names,
// which would collide with other templates).
import type { ReactNode } from "react";
import {
  CHERRY_BLOSSOM_URL,
  FLORAL_CLUSTER_URL,
  PARCHMENT_IMAGE_URL,
  COVER_IMAGE_URL,
} from "./tokens";

interface PaperSurfaceProps {
  variant: "burgundy" | "parchment";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isBurgundy = variant === "burgundy";
  const bgUrl = isBurgundy ? COVER_IMAGE_URL : PARCHMENT_IMAGE_URL;

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isBurgundy ? "bg-[#460C1A] text-[#F5EBDD]" : "bg-[#F3E9D9] text-[#481C26]"
      } ${className}`}
    >
      {/* Photorealistic handmade paper texture layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-repeat"
        style={{
          backgroundImage: `url(${bgUrl})`,
          opacity: isBurgundy ? 0.92 : 0.86,
        }}
      />

      {/* Subtle directional studio lighting vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isBurgundy
            ? "radial-gradient(ellipse 85% 75% at 50% 42%, rgba(118, 38, 55, 0.22) 0%, rgba(36, 6, 14, 0.45) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 250, 242, 0.28) 0%, rgba(217, 198, 174, 0.22) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

interface CherryBlossomSprigProps {
  position: "top-left" | "bottom-right" | "top-right";
  className?: string;
}

export function CherryBlossomSprig({ position, className = "" }: CherryBlossomSprigProps) {
  const positionStyles: Record<CherryBlossomSprigProps["position"], string> = {
    "top-left": "-top-8 -left-10 w-44 sm:w-56 md:w-64 rotate-0",
    "bottom-right": "-bottom-10 -right-10 w-44 sm:w-56 md:w-64 rotate-180",
    "top-right": "-top-8 -right-10 w-40 sm:w-52 rotate-90",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 select-none ${positionStyles[position]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CHERRY_BLOSSOM_URL}
        alt=""
        referrerPolicy="no-referrer"
        className="rb-mask-floral-corner h-auto w-full object-contain mix-blend-multiply opacity-95"
      />
    </div>
  );
}

interface BurgundyFloralClusterProps {
  side: "left" | "right";
  className?: string;
}

export function BurgundyFloralCluster({ side, className = "" }: BurgundyFloralClusterProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FLORAL_CLUSTER_URL}
        alt=""
        referrerPolicy="no-referrer"
        className={`rb-mask-radial-soft h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(18,3,7,0.55)] ${
          side === "right" ? "-scale-x-100" : ""
        }`}
      />
    </div>
  );
}

export function BotanicalCardDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 58" fill="none" className={`mx-auto ${className}`}>
      <path d="M36 45C56 36 86 24 142 12" stroke="#925444" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M66 35C56 26 52 17 57 12C64 15 70 23 68 34"
        fill="#B58A72"
        fillOpacity="0.32"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M84 29C76 19 75 10 82 6C88 11 91 20 86 28"
        fill="#B58A72"
        fillOpacity="0.38"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M104 23C98 14 99 6 107 4C112 9 112 17 106 23"
        fill="#B58A72"
        fillOpacity="0.32"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M123 18C119 10 122 4 129 4C133 8 131 15 125 18"
        fill="#B58A72"
        fillOpacity="0.28"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M78 33C86 38 96 42 103 38C98 31 89 29 79 32"
        fill="#B58A72"
        fillOpacity="0.3"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M101 25C109 30 119 32 125 27C120 21 111 20 102 24"
        fill="#B58A72"
        fillOpacity="0.34"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <path
        d="M52 40C58 46 66 50 74 47C69 40 61 37 53 39"
        fill="#B58A72"
        fillOpacity="0.26"
        stroke="#8B4B3E"
        strokeWidth="1"
      />
      <circle cx="48" cy="31" r="2" fill="#9A6150" />
      <circle cx="94" cy="36" r="1.8" fill="#9A6150" />
      <circle cx="137" cy="21" r="1.8" fill="#9A6150" />
      <circle cx="145" cy="11" r="2.2" fill="#8B4B3E" />
    </svg>
  );
}
