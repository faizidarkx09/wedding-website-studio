// Sakura Dream details page — the 5-event schedule in a
// folding-fan panel, dress code, venue + map, the 2 accommodations
// in fan panels, and the registry / wishing-well note, plus the
// RSVP jump button. Only the data comes from the site.
//
// CONTAINER QUERIES ONLY in this file: no viewport `sm:` anywhere.
// The editor's Mobile (390px) preview renders this inside a 390px
// div on a desktop viewport, so viewport queries would apply desktop
// geometry in a mobile-sized column.
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
import { FanPleats, PetalDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";

export default function SakuraDreamDetails({
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
      className="@container relative min-h-[100dvh] w-full bg-[#FFF7FB] text-[#2E0A3D]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EC4899]/30 bg-[#FFF7FB]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 @min-[40rem]:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 sd-font-display text-[11px] tracking-[0.24em] text-[#2E0A3D] uppercase transition-colors hover:text-[#6B21A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="sd-font-script hidden text-2xl text-[#6B21A8] @min-[40rem]:block">
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
          className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#2E0A3D] @min-[40rem]:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#2E0A3D]/85 italic @min-[40rem]:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5"
        >
          <PetalDivider className="h-7 w-36" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 @min-[40rem]:px-6 @min-[40rem]:pb-20">
        {/* Schedule of Events — folding-fan panel */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-[#FFFDFB] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(46,10,61,0.35)] ring-1 ring-[#EC4899]/40 @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-[#EC4899]/50"
            />
            <div className="relative z-10 flex flex-col items-center text-center">
              <FanPleats className="h-12 w-40 @min-[40rem]:h-14 @min-[40rem]:w-48" />
              <h2 className="sd-font-display mt-4 text-[1.4rem] leading-[1.2] font-normal tracking-[0.02em] text-[#2E0A3D] @min-[40rem]:text-[1.6rem]">
                Schedule of Events
              </h2>
              <p className="sd-font-display mt-2 text-[10px] tracking-[0.3em] text-[#6B21A8] uppercase">
                {formatDateDisplay(site.weddingDate, site.timezone)}
              </p>

              <div className="mt-7 w-full max-w-[560px] space-y-5 text-left">
                {site.events.map((event, i) => (
                  <motion.div
                    key={`${event.name}-${i}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 border-b border-[#EC4899]/25 pb-5">
                      <p className="sd-font-display text-[12px] tracking-[0.18em] text-[#2E0A3D] uppercase @min-[40rem]:text-[13px]">
                        {event.time} · {event.name}
                      </p>
                      {event.venue && (
                        <p className="sd-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#2E0A3D]/75 italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#EC4899]" />
                          {event.venue}
                          {event.address ? ` — ${event.address}` : ""}
                        </p>
                      )}
                      {event.description && (
                        <p className="sd-font-editorial mt-1 text-sm leading-relaxed text-[#2E0A3D]/75 italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
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
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center gap-3 bg-[#FDF2F8] px-6 py-7 text-center shadow-[0_14px_28px_-14px_rgba(46,10,61,0.3)] ring-1 ring-[#EC4899]/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EC4899]/70 bg-white text-[#6B21A8]">
              <Shirt className="h-5 w-5" />
            </span>
            <h2 className="sd-font-display text-[1.25rem] leading-[1.2] font-normal text-[#2E0A3D]">
              Dress Code
            </h2>
            <p className="sd-font-editorial max-w-[480px] text-[1rem] leading-[1.75] text-[#2E0A3D]/85 italic">
              {dressCode}
            </p>
          </motion.section>
        )}

        {/* Venue + Map */}
        {venueQuery && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 overflow-hidden bg-[#FFFDFB] shadow-[0_18px_36px_-14px_rgba(46,10,61,0.35)] ring-1 ring-[#EC4899]/40"
          >
            <div className="flex flex-col items-center px-5 pt-8 pb-6 text-center @min-[40rem]:px-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="sd-font-display mt-4 text-[1.25rem] leading-[1.2] font-normal text-[#2E0A3D]">
                {site.content.venueName || "Our Wedding Venue"}
              </h2>
              {site.content.venueAddress && (
                <p className="sd-font-editorial mt-2 text-[0.95rem] leading-relaxed text-[#2E0A3D]/80 italic">
                  {site.content.venueAddress}
                </p>
              )}
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="sd-font-display mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-[#6B21A8] uppercase underline underline-offset-4 transition-colors hover:text-[#2E0A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
              >
                Open in Google Maps
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="relative h-64 w-full @min-[40rem]:h-80">
              <iframe
                title={`Map — ${site.content.venueName || "wedding venue"}`}
                src={mapsEmbedUrl(venueQuery)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </motion.section>
        )}

        {/* Accommodations — folding-fan panels, fanned open */}
        {hotelList.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <h2 className="sd-font-display text-center text-[1.4rem] leading-[1.2] font-normal text-[#2E0A3D]">
              Where to Stay
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 @min-[40rem]:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className={`relative overflow-hidden bg-[#FFFDFB] px-6 py-7 text-center shadow-[0_16px_32px_-14px_rgba(46,10,61,0.35)] ring-1 ring-[#EC4899]/40 ${
                    i % 2 === 0 ? "@min-[40rem]:-rotate-1" : "@min-[40rem]:rotate-1"
                  }`}
                >
                  <FanPleats className="mx-auto h-10 w-32" />
                  <span className="mx-auto mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <h3 className="sd-font-display mt-3 text-[1.15rem] leading-[1.25] font-normal text-[#2E0A3D]">
                    {hotel.name}
                  </h3>
                  {hotel.distance && (
                    <p className="sd-font-editorial mt-1.5 text-sm text-[#2E0A3D]/75 italic">
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="sd-font-editorial mt-2 text-sm leading-relaxed text-[#2E0A3D]/80">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="sd-font-display mt-3 text-[10px] tracking-[0.24em] text-[#6B21A8] uppercase">
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Travel / Registry notes */}
        {(travelNotes.length > 0 || registryNotes.length > 0) && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 space-y-5"
          >
            {travelNotes.map((d, i) => (
              <div
                key={`travel-${i}`}
                className="flex items-start gap-4 bg-[#FDF2F8] px-6 py-6 shadow-[0_14px_28px_-14px_rgba(46,10,61,0.3)] ring-1 ring-[#EC4899]/40"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-white text-[#6B21A8]">
                  <Plane className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="sd-font-display text-[12px] tracking-[0.2em] text-[#2E0A3D] uppercase">
                    {d.title || "Getting There"}
                  </h3>
                  <p className="sd-font-editorial mt-1.5 text-sm leading-relaxed whitespace-pre-line text-[#2E0A3D]/80 italic">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
            {registryNotes.map((d, i) => (
              <div
                key={`registry-${i}`}
                className="flex items-start gap-4 bg-[#FDF2F8] px-6 py-6 shadow-[0_14px_28px_-14px_rgba(46,10,61,0.3)] ring-1 ring-[#EC4899]/40"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-white text-[#6B21A8]">
                  <Gift className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="sd-font-display text-[12px] tracking-[0.2em] text-[#2E0A3D] uppercase">
                    {d.title || "Gifts & Registry"}
                  </h3>
                  <p className="sd-font-editorial mt-1.5 text-sm leading-relaxed whitespace-pre-line text-[#2E0A3D]/80 italic">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
          </motion.section>
        )}

        {/* RSVP jump */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Heart className="h-5 w-5 fill-[#EC4899]/30 text-[#EC4899]" />
          <button
            type="button"
            onClick={onJumpToRsvp}
            className="group inline-flex items-center gap-2 bg-[#6B21A8] px-7 py-3.5 sd-font-display text-xs tracking-[0.26em] text-[#FFF7FB] uppercase shadow-[0_10px_22px_-8px_rgba(46,10,61,0.6)] transition-colors duration-300 hover:bg-[#4C1D95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            <CalendarDays className="h-4 w-4" />
            Kindly Respond
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 px-4 py-2 sd-font-display text-[11px] tracking-[0.26em] text-[#2E0A3D] uppercase transition-colors hover:text-[#6B21A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
