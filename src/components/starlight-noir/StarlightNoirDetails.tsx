// Starlight Noir details page — the full ledger: schedule as
// ruled rows, venue with a map, dress code, accommodations,
// travel + registry notes, and the RSVP jump. Gold on black
// throughout. Only the data comes from the site.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Clock,
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider, NightSurface, Starfield } from "./Decor";
import {
  DETAIL_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";

export default function StarlightNoirDetails({
  site,
  onBack,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onBack: () => void;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const dressCode = site.content.dressCode.trim();
  const hotelList = accommodations(site);
  const travelNotes = site.content.details.filter(
    (d) => d.kind === "travel" && !d.hidden && d.body.trim(),
  );
  const registryNotes = site.content.details.filter(
    (d) => d.kind === "registry" && !d.hidden && d.body.trim(),
  );
  const mapQuery = [site.content.venueName, site.content.venueAddress]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-dvh bg-[#0A0A0A] text-[#F5EFE0]"
    >
      <NightSurface variant="black" className="px-4 pt-10 pb-20">
        {!prefersReducedMotion && <Starfield density={40} className="opacity-40" />}
        <div className="relative z-10 mx-auto max-w-[860px]">
          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: FONT_DISPLAY }}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.26em] text-[#F2D98C] uppercase transition-colors hover:text-[#F5EFE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invitation
          </button>

          <div className="mt-10 flex flex-col items-center text-center">
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
            >
              Wedding Details
            </p>
            <h2
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-3 text-[2rem] leading-[1.12] font-normal text-[#F5EFE0]"
            >
              The Night, In Detail
            </h2>
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-3 text-xs tracking-[0.3em] text-[#F2D98C] uppercase"
            >
              {formatDateDisplay(site.weddingDate, site.timezone)}
            </p>
            <ConstellationDivider className="mt-5 h-7 w-36" />
          </div>

          {/* Schedule ledger */}
          <div className="mx-auto mt-10 max-w-[720px] border-y border-[#D4AF37]/50 text-left">
            <h3
              style={{ fontFamily: FONT_DISPLAY }}
              className="flex items-center gap-2 border-b border-[#D4AF37]/25 px-2 py-4 text-[11px] tracking-[0.28em] text-[#F2D98C] uppercase"
            >
              <Clock className="h-4 w-4 text-[#D4AF37]" />
              Order of the Night
            </h3>
            {site.events.map((event, i) => (
              <div
                key={`${event.name}-${i}`}
                className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6 sm:px-4"
              >
                <p
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="w-32 shrink-0 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase"
                >
                  {event.time}
                </p>
                <div className="min-w-0">
                  <p
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="text-[11px] tracking-[0.18em] text-[#F5EFE0] uppercase"
                  >
                    {event.name}
                  </p>
                  {event.description && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-0.5 text-sm leading-relaxed text-[#F5EFE0]/70 italic"
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Venue + map */}
          <div className="mx-auto mt-10 max-w-[720px] text-center">
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
            >
              The Venue
            </p>
            <h3
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-2 text-[1.6rem] leading-[1.2] font-normal text-[#F5EFE0]"
            >
              {site.content.venueName || "Our Wedding Venue"}
            </h3>
            {site.content.venueAddress && (
              <p
                style={{ fontFamily: FONT_EDITORIAL }}
                className="mt-2 flex items-center justify-center gap-1.5 text-sm text-[#F5EFE0]/75 italic"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                {site.content.venueAddress}
              </p>
            )}
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-2 text-sm text-[#F5EFE0]/60 italic"
            >
              {formatLongDate(site.weddingDate, site.timezone)}
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DETAIL_IMAGE_URL}
              alt="Black envelope with gold constellation lines"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="mx-auto mt-6 aspect-[4/3] w-full max-w-[480px] rounded-[4px] border border-[#D4AF37]/50 object-cover shadow-[0_18px_36px_-12px_rgba(0,0,0,0.8)]"
            />

            {mapQuery && (
              <div className="mx-auto mt-6 overflow-hidden rounded-[4px] border border-[#D4AF37]/50">
                <iframe
                  title={`Map — ${mapQuery}`}
                  src={mapsEmbedUrl(mapQuery)}
                  className="h-[300px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            {mapQuery && (
              <a
                href={mapsLink(mapQuery)}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-4 inline-flex items-center gap-2 border border-[#D4AF37]/70 px-5 py-2.5 text-[11px] tracking-[0.24em] text-[#F5EFE0] uppercase transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
              >
                <MapPin className="h-3.5 w-3.5" />
                Get Directions
              </a>
            )}
          </div>

          {/* Dress code */}
          {dressCode && (
            <div className="mx-auto mt-10 flex max-w-[720px] items-center justify-center gap-2.5 rounded-full border border-[#D4AF37]/60 bg-[#111111]/80 px-5 py-3">
              <Shirt className="h-4 w-4 shrink-0 text-[#D4AF37]" />
              <span
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[10px] tracking-[0.2em] text-[#F5EFE0] uppercase sm:text-[11px]"
              >
                Dress Code: {dressCode}
              </span>
            </div>
          )}

          {/* Accommodations ledger */}
          {hotelList.length > 0 && (
            <div className="mx-auto mt-10 max-w-[720px] border-y border-[#D4AF37]/50 text-left">
              <h3
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex items-center gap-2 border-b border-[#D4AF37]/25 px-2 py-4 text-[11px] tracking-[0.28em] text-[#F2D98C] uppercase"
              >
                <BedDouble className="h-4 w-4 text-[#D4AF37]" />
                Where to Stay
              </h3>
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className="border-b border-[#D4AF37]/25 px-2 py-4 last:border-b-0 sm:px-4"
                >
                  <p
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="text-[11px] tracking-[0.18em] text-[#F5EFE0] uppercase"
                  >
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-0.5 text-sm text-[#F5EFE0]/70 italic"
                    >
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm leading-relaxed text-[#F5EFE0]/75 italic"
                    >
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p
                      style={{ fontFamily: FONT_DISPLAY }}
                      className="mt-1.5 text-[10px] tracking-[0.2em] text-[#F2D98C] uppercase"
                    >
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Travel / Registry notes */}
          {(travelNotes.length > 0 || registryNotes.length > 0) && (
            <div className="mx-auto mt-10 max-w-[720px] space-y-6 text-left">
              {travelNotes.map((d, i) => (
                <div key={`travel-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#111111] text-[#D4AF37]">
                    <Plane className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p
                      style={{ fontFamily: FONT_DISPLAY }}
                      className="text-[11px] tracking-[0.2em] text-[#F2D98C] uppercase"
                    >
                      {d.title || "Getting there"}
                    </p>
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm leading-relaxed text-[#F5EFE0]/80 italic"
                    >
                      {d.body}
                    </p>
                  </div>
                </div>
              ))}
              {registryNotes.map((d, i) => (
                <div key={`registry-${i}`} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#111111] text-[#D4AF37]">
                    <Gift className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p
                      style={{ fontFamily: FONT_DISPLAY }}
                      className="text-[11px] tracking-[0.2em] text-[#F2D98C] uppercase"
                    >
                      {d.title || "Gifts & Registry"}
                    </p>
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm leading-relaxed text-[#F5EFE0]/80 italic"
                    >
                      {d.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RSVP jump */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onJumpToRsvp}
              style={{ fontFamily: FONT_DISPLAY }}
              className="group inline-flex items-center gap-2 bg-[#D4AF37] px-7 py-3.5 text-xs tracking-[0.26em] text-[#0A0A0A] uppercase shadow-[0_10px_22px_-8px_rgba(212,175,55,0.5)] transition-colors duration-300 hover:bg-[#F2D98C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <Heart className="h-4 w-4 fill-[#0A0A0A]/20" />
              Kindly Respond
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{ fontFamily: FONT_DISPLAY }}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.26em] text-[#F2D98C] uppercase transition-colors hover:text-[#F5EFE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Invitation
            </button>
          </div>
        </div>
      </NightSurface>
    </motion.div>
  );
}
