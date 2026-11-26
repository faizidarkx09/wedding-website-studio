// Sunflower Fields details page — the 5-event schedule, dress
// code, venue + travel, the 2 accommodations, and the registry /
// wishing-well note, plus the RSVP jump button. Only the data comes
// from the site. Layout: sunflower-yellow schedule blocks in a
// single column with a green timeline stem (not the Royale panel
// layout).
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock,
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SunflowerDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";

export default function SunflowerFieldsDetails({
  site,
  onBack,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onBack: () => void;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const hotelList = accommodations(site);
  const travelNotes = site.content.details.filter(
    (d) => d.kind === "travel" && !d.hidden && d.body.trim(),
  );
  const registryNotes = site.content.details.filter(
    (d) => d.kind === "registry" && !d.hidden && d.body.trim(),
  );
  const dressCode = site.content.dressCode.trim();
  const venueQuery = [site.content.venueName, site.content.venueAddress]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FFFBEB] text-[#14532D]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EAB308]/40 bg-[#FFFBEB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#14532D] uppercase transition-colors hover:text-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span
            style={{ fontFamily: FONT_SCRIPT }}
            className="max-w-[45%] truncate text-xl text-[#166534]"
          >
            {site.content.partnerA} &amp; {site.content.partnerB}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#14532D]"
        >
          The Day in Full Bloom
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 text-xs tracking-[0.3em] text-[#166534] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5"
        >
          <SunflowerDivider className="h-7 w-36" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 pb-20">
        {/* Schedule — yellow blocks on a green stem */}
        {site.events.length > 0 && (
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-[#166534]/40"
            />
            <div className="space-y-4">
              {site.events.map((event, i) => (
                <motion.div
                  key={`${event.name}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-start gap-4 pl-1"
                >
                  <span className="relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#14532D] bg-[#FACC15] text-[#14532D] shadow-[0_4px_10px_rgba(20,83,45,0.3)]">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 bg-[#FACC15] px-5 py-4 text-left shadow-[0_12px_24px_-12px_rgba(20,83,45,0.4)]">
                    <p
                      style={{ fontFamily: FONT_DISPLAY }}
                      className="text-[11px] font-semibold tracking-[0.18em] text-[#14532D] uppercase"
                    >
                      {event.time} · {event.name}
                    </p>
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm font-semibold text-[#14532D]/80"
                    >
                      {formatLongDate(event.date, site.timezone)}
                    </p>
                    {event.description && (
                      <p
                        style={{ fontFamily: FONT_EDITORIAL }}
                        className="mt-1 text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
                      >
                        {event.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Venue + map */}
        <div className="mt-12 bg-[#FFFEF5] p-6 text-center shadow-[0_16px_32px_-14px_rgba(20,83,45,0.4)] ring-1 ring-[#EAB308]/50">
          <p
            style={{ fontFamily: FONT_DISPLAY }}
            className="flex items-center justify-center gap-2 text-[10px] tracking-[0.34em] text-[#166534] uppercase"
          >
            <MapPin className="h-3.5 w-3.5" />
            THE VENUE
          </p>
          <h2
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-2 text-[1.5rem] leading-[1.2] font-semibold text-[#14532D]"
          >
            {site.content.venueName || "Our Wedding Venue"}
          </h2>
          {site.content.venueAddress && (
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-2 text-[1rem] font-semibold text-[#14532D]/80 italic"
            >
              {site.content.venueAddress}
            </p>
          )}
          {venueQuery && (
            <div className="mt-5 overflow-hidden ring-1 ring-[#EAB308]/50">
              <iframe
                title={`Map of ${site.content.venueName || "the wedding venue"}`}
                src={mapsEmbedUrl(venueQuery)}
                className="h-[280px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          {venueQuery && (
            <a
              href={mapsLink(venueQuery)}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-[#166534] uppercase underline underline-offset-4 hover:text-[#14532D]"
            >
              <MapPin className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          )}
        </div>

        {/* Dress code */}
        {dressCode && (
          <div className="mt-6 flex items-center justify-center gap-2.5 bg-[#14532D] px-4 py-3.5 text-[#FFFBEB]">
            <Shirt className="h-4 w-4 shrink-0 text-[#FACC15]" />
            <span
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[11px] tracking-[0.2em] uppercase"
            >
              Dress Code: {dressCode}
            </span>
          </div>
        )}

        {/* Accommodations */}
        {hotelList.length > 0 && (
          <div className="mt-10">
            <h3
              style={{ fontFamily: FONT_DISPLAY }}
              className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#166534] uppercase"
            >
              <BedDouble className="h-4 w-4" />
              WHERE TO STAY
            </h3>
            <div className="mt-4 space-y-4">
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className="border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 text-left shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
                >
                  <p
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="text-[12px] font-semibold tracking-[0.18em] text-[#14532D] uppercase"
                  >
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm font-semibold text-[#14532D]/75 italic"
                    >
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="mt-1 text-sm leading-relaxed text-[#14532D]/85"
                    >
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p
                      style={{ fontFamily: FONT_DISPLAY }}
                      className="mt-2 text-[10px] tracking-[0.18em] text-[#166534] uppercase"
                    >
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel / registry notes */}
        {travelNotes.map((d, i) => (
          <div
            key={`travel-${i}`}
            className="mt-6 flex items-start gap-3 border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 text-left shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
          >
            <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
            >
              {d.body}
            </p>
          </div>
        ))}
        {registryNotes.map((d, i) => (
          <div
            key={`registry-${i}`}
            className="mt-6 flex items-start gap-3 border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 text-left shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
          >
            <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
            >
              {d.body}
            </p>
          </div>
        ))}

        {/* RSVP jump */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onJumpToRsvp}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group inline-flex items-center gap-2 bg-[#14532D] px-7 py-3.5 text-[11px] tracking-[0.26em] text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <CalendarDays className="h-4 w-4" />
            Kindly Respond
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p
            style={{ fontFamily: FONT_EDITORIAL }}
            className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#14532D]/70 italic"
          >
            <Heart className="h-3.5 w-3.5 fill-[#166534]/30 text-[#166534]" />
            We cannot wait to celebrate with you.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
