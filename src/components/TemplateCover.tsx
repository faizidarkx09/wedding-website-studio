"use client";

import { useState } from "react";
import type { TemplateMeta } from "@/lib/types";

/**
 * Template card cover — the theme's AI-generated hero image over its
 * palette colour block. If the image file is missing, the image hides
 * and the colour block (tagline + name) remains — never a broken image.
 */
export default function TemplateCover({ template }: { template: TemplateMeta }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(template.heroImage) && !failed;

  return (
    <div
      className="relative h-44 w-full overflow-hidden"
      style={{ backgroundColor: template.palette.bg }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={template.heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : null}
      <div
        className="absolute inset-0 flex flex-col items-start justify-between p-5"
        style={
          showImage
            ? { background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)" }
            : undefined
        }
      >
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: template.palette.accentSoft, color: template.palette.ink }}
        >
          {template.tagline}
        </span>
        <p
          className={`text-2xl font-bold ${template.fontClass}`}
          style={{
            color: showImage ? "#FFFFFF" : template.palette.ink,
            textShadow: showImage ? "0 1px 8px rgba(0,0,0,0.45)" : undefined,
          }}
        >
          {template.name}
        </p>
      </div>
    </div>
  );
}
