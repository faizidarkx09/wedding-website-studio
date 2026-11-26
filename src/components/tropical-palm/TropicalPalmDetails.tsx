// Tropical Palm details page — the 5-event schedule, dress code,
// venue + map embed + travel, the 2 accommodations, and the
// registry / wishing-well note, plus the RSVP jump button. Only the
// data comes from the site.
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
  Palmtree,
  Plane,
  Shirt,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PalmDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";

export default function TropicalPalmDetails({
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
      className="relative min-h-[100dvh] w-full bg-[#FFFBEB] text-[#14301C]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#15803D]/30 bg-[#FFFBEB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 tp-font-display text-[11px] tracking-[0.24em] text-[#14301C] uppercase transition-colors hover:text-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="tp-font-script hidden text-2xl text-[#166534] sm:block">
            {site.content.partnerA} &amp; {site.content.partnerB}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 text-center sm:pt-16 sm:pb-14">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#14301C] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#14301C]/85 italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#15803D]/80 sm:w-24" />
          <Palmtree className="h-4 w-4 text-[#166534]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#15803D]/80 sm:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 sm:px-6 sm:pb-20">
        {/* Schedule of Events */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Schedule of events"
            className="relative overflow-hidden bg-[#FFFDF6] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30 sm:px-8 sm:py-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#15803D]/60" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#15803D]/70 bg-[#FFFBEB] text-[#166534]">
                  <CalendarDays className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="tp-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#14301C] sm:text-[1.55rem]">
                    Schedule of Events
                  </h2>
                  <p className="tp-font-editorial mt-1 text-sm text-[#14301C]/75 italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {site.events.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                    <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                      <span className="tp-font-display text-sm tracking-[0.08em] text-[#14301C] tabular-nums">
                        {event.time}
                      </span>
                      <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#15803D]/60" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-[#15803D]/25 pb-5 last:border-b-0 last:pb-0">
                      <p className="tp-font-display text-[13px] tracking-[0.14em] text-[#14301C] uppercase sm:text-sm">
                        {event.name}
                      </p>
                      {event.description && (
                        <p className="tp-font-editorial mt-1 text-sm leading-relaxed text-[#14301C]/80 italic sm:text-[0.95rem]">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <p className="tp-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#14301C]/70 italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#166534]" />
                          {event.venue}
                          {event.address ? ` · ${event.address}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Dress Code */}
        {dressCode && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Dress code"
            className="mt-6 flex items-start gap-4 bg-[#14532D] px-5 py-6 text-[#FFFBEB] shadow-[0_18px_36px_-14px_rgba(20,83,45,0.5)] sm:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4ADE80]/70 bg-[#166534] text-[#FFFBEB]">
              <Shirt className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="tp-font-display text-[1.2rem] leading-none font-normal tracking-[0.04em] sm:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="tp-font-display mt-2 text-[12px] tracking-[0.22em] uppercase sm:text-sm">
                {dressCode}
              </p>
              <p className="tp-font-editorial mt-2 text-sm leading-relaxed text-[#FEF3C7]/85 italic sm:text-[0.95rem]">
                Light fabrics and island colours are warmly welcomed — and comfortable
                shoes for the sand.
              </p>
            </div>
          </motion.section>
        )}

        {/* Venue + Map + Travel */}
        {(site.content.venueName || site.content.venueAddress || travelNotes.length > 0) && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Venue and travel"
            className="mt-6 bg-[#FFFDF6] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30 sm:px-8 sm:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#15803D]/70 bg-[#FFFBEB] text-[#166534]">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className="tp-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#14301C] sm:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p className="tp-font-display mt-5 text-[1.1rem] tracking-[0.06em] text-[#14301C] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="tp-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#14301C]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <>
                <div className="mt-5 overflow-hidden ring-1 ring-[#15803D]/30">
                  <iframe
                    title={`Map — ${site.content.venueName || "wedding venue"}`}
                    src={mapsEmbedUrl(venueQuery)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[280px] w-full border-0"
                  />
                </div>
                <a
                  href={mapsLink(venueQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 border border-[#14532D]/70 px-5 py-2.5 tp-font-display text-[11px] tracking-[0.24em] text-[#14301C] uppercase transition-colors duration-300 hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
                >
                  View on Google Maps
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#15803D]/25 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
                <p className="tp-font-editorial text-sm leading-relaxed text-[#14301C]/85 italic sm:text-[0.95rem]">
                  {d.body}
                </p>
              </div>
            ))}
          </motion.section>
        )}

        {/* Accommodations */}
        {hotelList.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Where to stay"
            className="mt-6 bg-[#FFFDF6] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30 sm:px-8 sm:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#15803D]/70 bg-[#FFFBEB] text-[#166534]">
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h2 className="tp-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#14301C] sm:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="border border-[#15803D]/40 bg-[#FFFBEB]/70 px-5 py-5">
                  <p className="tp-font-display text-[13px] tracking-[0.12em] text-[#14301C] uppercase sm:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="tp-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#14301C]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#166534]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="tp-font-editorial mt-2 text-sm leading-relaxed text-[#14301C]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="tp-font-display mt-3 text-[11px] tracking-[0.2em] text-[#166534] uppercase">
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Registry / Wishing Well */}
        {registryNotes.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Gifts and registry"
            className="mt-6 bg-[#14532D] px-5 py-8 text-center text-[#FFFBEB] shadow-[0_18px_36px_-14px_rgba(20,83,45,0.5)] sm:px-8 sm:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#FDE68A]" />
            <h2 className="tp-font-display mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] sm:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <PalmDivider className="mt-4 h-8 w-24 opacity-90 [&_circle]:fill-[#FDE68A] [&_line]:stroke-[#FDE68A]" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="tp-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#FEF3C7]/90 italic">
                {d.body}
              </p>
            ))}
          </motion.section>
        )}

        {/* RSVP Jump */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onJumpToRsvp}
            className="group inline-flex items-center gap-2 bg-[#14532D] px-7 py-3.5 tp-font-display text-[11px] tracking-[0.26em] text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] sm:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#FFFBEB]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#14532D]/70 px-6 py-3 tp-font-display text-[11px] tracking-[0.26em] text-[#14301C] uppercase transition-colors duration-300 hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
