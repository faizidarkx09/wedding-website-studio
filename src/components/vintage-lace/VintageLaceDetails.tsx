// Vintage Lace details page — the 5-event schedule as a letter,
// dress code on a deep-sepia card, venue + travel as a postcard,
// accommodations as postcards, and the registry note, plus the RSVP
// jump button. Only the data comes from the site. Container
// queries throughout (@container on the page root) — the editor's
// Mobile (390px) preview renders this inside a 390px div on a
// desktop viewport, so viewport `sm:` would misfire there.
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
  Stamp,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { LaceDivider } from "./Decor";
import { accommodations, formatDateDisplay, formatLongDate, mapsLink } from "./tokens";

export default function VintageLaceDetails({
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
      className="relative min-h-[100dvh] w-full bg-[#FDF8F0] text-[#4A3A2E] @container"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#8B7355]/30 bg-[#FDF8F0]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 @min-[40rem]:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 vl-font-display text-[11px] font-semibold tracking-[0.24em] text-[#4A3A2E] uppercase transition-colors hover:text-[#A66A6E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="vl-font-script hidden text-2xl text-[#A66A6E] @min-[40rem]:block">
            {site.content.partnerA} &amp; {site.content.partnerB}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-10 text-center @min-[40rem]:pt-16 @min-[40rem]:pb-14">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase @min-[40rem]:text-xs"
        >
          Wedding details
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[0.02em] text-[#4A3A2E] @min-[40rem]:text-[2.8rem]"
        >
          Postcards from Our Day
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-editorial mx-auto mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4A3A2E] italic @min-[40rem]:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 w-full"
        >
          <LaceDivider className="h-7 w-36" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 @min-[40rem]:px-6 @min-[40rem]:pb-20">
        {/* Schedule of Events — a letter */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Schedule of events"
            className="relative overflow-hidden bg-[#FFFDF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(74,58,46,0.35)] ring-1 ring-[#8B7355]/35 @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#8B7355]/60" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] border border-[#C08A8E]/40" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8B7355]/70 bg-[#FDF8F0] text-[#A66A6E]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="vl-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#4A3A2E] @min-[40rem]:text-[1.55rem]">
                    Schedule of Events
                  </h2>
                  <p className="vl-font-editorial mt-1 text-sm text-[#4A3A2E] italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {site.events.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                    <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                      <span className="vl-font-display text-sm font-semibold tracking-[0.08em] text-[#4A3A2E] tabular-nums">
                        {event.time}
                      </span>
                      <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#8B7355]/60" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-[#8B7355]/25 pb-5 last:border-b-0 last:pb-0">
                      <p className="vl-font-display text-[13px] font-semibold tracking-[0.14em] text-[#4A3A2E] uppercase @min-[40rem]:text-sm">
                        {event.name}
                      </p>
                      {event.description && (
                        <p className="vl-font-editorial mt-1 text-sm leading-relaxed text-[#4A3A2E] italic @min-[40rem]:text-[0.95rem]">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <p className="vl-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#4A3A2E] italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A66A6E]" />
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
            className="mt-6 flex items-start gap-4 bg-[#4A3A2E] px-5 py-6 text-[#FDF8F0] shadow-[0_18px_36px_-14px_rgba(74,58,46,0.5)] @min-[40rem]:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C08A8E]/70 bg-[#6B563E] text-[#FDF8F0]">
              <Shirt className="h-5 w-5" />
            </span>
            <div>
              <h2 className="vl-font-display text-[1.2rem] leading-none font-semibold tracking-[0.04em] @min-[40rem]:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="vl-font-display mt-2 text-[12px] font-semibold tracking-[0.22em] uppercase @min-[40rem]:text-sm">
                {dressCode}
              </p>
              <p className="vl-font-editorial mt-2 text-sm leading-relaxed text-[#F7EBD9] italic @min-[40rem]:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in soft,
                warm tones is warmly welcomed.
              </p>
            </div>
          </motion.section>
        )}

        {/* Venue + Travel — a postcard */}
        {(site.content.venueName || site.content.venueAddress || travelNotes.length > 0) && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Venue and travel"
            className="relative mt-6 overflow-hidden bg-[#FFFDF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(74,58,46,0.35)] ring-1 ring-[#8B7355]/35 @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="absolute top-3 right-3 flex h-14 w-12 flex-col items-center justify-center border border-dashed border-[#8B7355]/70 bg-[#EAD3D3] text-center">
              <Stamp className="h-4 w-4 text-[#A66A6E]" />
              <span className="vl-font-display mt-0.5 text-[7px] font-semibold tracking-[0.14em] text-[#6B563E] uppercase">
                Venue
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8B7355]/70 bg-[#FDF8F0] text-[#A66A6E]">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="vl-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#4A3A2E] @min-[40rem]:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p className="vl-font-display mt-5 text-[1.1rem] font-semibold tracking-[0.06em] text-[#4A3A2E] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="vl-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#4A3A2E] italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 border border-[#4A3A2E]/70 px-5 py-2.5 vl-font-display text-[11px] font-semibold tracking-[0.24em] text-[#4A3A2E] uppercase transition-colors duration-300 hover:bg-[#4A3A2E] hover:text-[#FDF8F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#8B7355]/25 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A6E]" />
                <p className="vl-font-editorial text-sm leading-relaxed text-[#4A3A2E] italic @min-[40rem]:text-[0.95rem]">
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
            className="mt-6 bg-[#FFFDF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(74,58,46,0.35)] ring-1 ring-[#8B7355]/35 @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8B7355]/70 bg-[#FDF8F0] text-[#A66A6E]">
                <BedDouble className="h-5 w-5" />
              </span>
              <h2 className="vl-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#4A3A2E] @min-[40rem]:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 @min-[40rem]:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="border border-[#8B7355]/40 bg-[#FDF8F0]/70 px-5 py-5">
                  <p className="vl-font-display text-[13px] font-semibold tracking-[0.12em] text-[#4A3A2E] uppercase @min-[40rem]:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="vl-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#4A3A2E] italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#A66A6E]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="vl-font-editorial mt-2 text-sm leading-relaxed text-[#4A3A2E] italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="vl-font-display mt-3 text-[11px] font-semibold tracking-[0.2em] text-[#A66A6E] uppercase">
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
            className="mt-6 bg-[#4A3A2E] px-5 py-8 text-center text-[#FDF8F0] shadow-[0_18px_36px_-14px_rgba(74,58,46,0.5)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#C08A8E]" />
            <h2 className="vl-font-display mt-3 text-[1.35rem] leading-none font-semibold tracking-[0.04em] @min-[40rem]:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <LaceDivider className="mt-4 h-7 w-28" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="vl-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#F7EBD9] italic">
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
            className="group inline-flex items-center gap-2 bg-[#4A3A2E] px-7 py-3.5 vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#FDF8F0] uppercase shadow-[0_10px_22px_-8px_rgba(74,58,46,0.6)] transition-colors duration-300 hover:bg-[#6B563E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E] @min-[40rem]:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#FDF8F0]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#4A3A2E]/70 px-6 py-3 vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#4A3A2E] uppercase transition-colors duration-300 hover:bg-[#4A3A2E] hover:text-[#FDF8F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E] @min-[40rem]:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
