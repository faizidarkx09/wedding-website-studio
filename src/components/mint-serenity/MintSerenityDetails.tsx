// Mint Serenity details page — the full details with schedule,
// dress code, venue + travel, accommodations, registry, and the
// RSVP jump. Sections sit in soft white pill cards on the mint
// wash (not panels). Only the data comes from the site.
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
import { BubbleDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

export default function MintSerenityDetails({
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
      className="relative min-h-[100dvh] w-full bg-[#ECFDF5] text-[#052E22]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#A7F3D0] bg-[#ECFDF5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            style={FONT_DISPLAY}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#052E22] uppercase transition-colors hover:text-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span style={FONT_SCRIPT} className="hidden text-2xl text-[#047857] sm:block">
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
          style={FONT_DISPLAY}
          className="text-[10px] tracking-[0.34em] text-[#047857] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#052E22] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_EDITORIAL}
          className="mx-auto mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#052E22]/85 italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#065F46]/80 sm:w-24" />
          <Heart className="h-4 w-4 fill-[#047857]/30 text-[#047857]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#065F46]/80 sm:w-24" />
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
            className="relative overflow-hidden rounded-[2rem] bg-white px-5 py-8 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.35)] ring-1 ring-[#A7F3D0] sm:px-8 sm:py-10"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <h2 style={FONT_DISPLAY} className="text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#052E22] sm:text-[1.55rem]">
                    Schedule of Events
                  </h2>
                  <p style={FONT_EDITORIAL} className="mt-1 text-sm text-[#052E22]/75 italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {site.events.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                    <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                      <span style={FONT_DISPLAY} className="text-sm tracking-[0.08em] text-[#052E22] tabular-nums">
                        {event.time}
                      </span>
                      <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#A7F3D0]" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-[#A7F3D0]/60 pb-5 last:border-b-0 last:pb-0">
                      <p style={FONT_DISPLAY} className="text-[13px] tracking-[0.14em] text-[#052E22] uppercase sm:text-sm">
                        {event.name}
                      </p>
                      {event.description && (
                        <p style={FONT_EDITORIAL} className="mt-1 text-sm leading-relaxed text-[#052E22]/80 italic sm:text-[0.95rem]">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <p style={FONT_EDITORIAL} className="mt-1 flex items-center gap-1.5 text-sm text-[#052E22]/70 italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#047857]" />
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
            className="mt-6 flex items-start gap-4 rounded-[2rem] bg-[#065F46] px-5 py-6 text-white shadow-[0_18px_36px_-14px_rgba(6,95,70,0.5)] sm:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0]/70 bg-[#052E22] text-white">
              <Shirt className="h-4 w-4" />
            </span>
            <div>
              <h2 style={FONT_DISPLAY} className="text-[1.2rem] leading-none font-normal tracking-[0.04em] sm:text-[1.35rem]">
                Dress Code
              </h2>
              <p style={FONT_DISPLAY} className="mt-2 text-[12px] tracking-[0.22em] uppercase sm:text-sm">
                {dressCode}
              </p>
              <p style={FONT_EDITORIAL} className="mt-2 text-sm leading-relaxed text-[#D1FAE5]/90 italic sm:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in
                soft, fresh tones is warmly welcomed.
              </p>
            </div>
          </motion.section>
        )}

        {/* Venue + Travel */}
        {(site.content.venueName || site.content.venueAddress || travelNotes.length > 0) && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Venue and travel"
            className="mt-6 rounded-[2rem] bg-white px-5 py-8 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.35)] ring-1 ring-[#A7F3D0] sm:px-8 sm:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                <MapPin className="h-4 w-4" />
              </span>
              <h2 style={FONT_DISPLAY} className="text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#052E22] sm:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p style={FONT_DISPLAY} className="mt-5 text-[1.1rem] tracking-[0.06em] text-[#052E22] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p style={FONT_EDITORIAL} className="mt-1 text-[0.95rem] leading-relaxed text-[#052E22]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                style={FONT_DISPLAY}
                className="group mt-4 inline-flex items-center gap-2 rounded-full border border-[#065F46]/70 px-5 py-2.5 text-[11px] tracking-[0.24em] text-[#065F46] uppercase transition-colors duration-300 hover:bg-[#065F46] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#A7F3D0]/60 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                <p style={FONT_EDITORIAL} className="text-sm leading-relaxed text-[#052E22]/85 italic sm:text-[0.95rem]">
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
            className="mt-6 rounded-[2rem] bg-white px-5 py-8 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.35)] ring-1 ring-[#A7F3D0] sm:px-8 sm:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                <BedDouble className="h-4 w-4" />
              </span>
              <h2 style={FONT_DISPLAY} className="text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#052E22] sm:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="rounded-[1.5rem] border border-[#A7F3D0]/70 bg-[#ECFDF5]/60 px-5 py-5">
                  <p style={FONT_DISPLAY} className="text-[13px] tracking-[0.12em] text-[#052E22] uppercase sm:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p style={FONT_EDITORIAL} className="mt-1.5 flex items-center gap-1.5 text-sm text-[#052E22]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#047857]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p style={FONT_EDITORIAL} className="mt-2 text-sm leading-relaxed text-[#052E22]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p style={FONT_DISPLAY} className="mt-3 text-[11px] tracking-[0.2em] text-[#047857] uppercase">
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
            className="mt-6 rounded-[2rem] bg-[#065F46] px-5 py-8 text-center text-white shadow-[0_18px_36px_-14px_rgba(6,95,70,0.5)] sm:px-8 sm:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#A7F3D0]" />
            <h2 style={FONT_DISPLAY} className="mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] sm:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <BubbleDivider className="mt-4 h-8 w-24 opacity-90 [&_circle]:fill-[#A7F3D0] [&_line]:stroke-[#A7F3D0]" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} style={FONT_EDITORIAL} className="mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#D1FAE5]/90 italic">
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
            style={FONT_DISPLAY}
            className="group inline-flex items-center gap-2 rounded-full bg-[#065F46] px-7 py-3.5 text-[11px] tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46] sm:text-xs"
          >
            <Heart className="h-4 w-4 fill-white/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            style={FONT_DISPLAY}
            className="group inline-flex items-center gap-2 rounded-full border border-[#065F46]/70 px-6 py-3 text-[11px] tracking-[0.26em] text-[#065F46] uppercase transition-colors duration-300 hover:bg-[#065F46] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46] sm:text-xs"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
