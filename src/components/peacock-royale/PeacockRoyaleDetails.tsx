// Peacock Royale details page — the 5-event schedule, dress
// code, venue + travel, the 2 accommodations, and the registry /
// wishing-well note, plus the RSVP jump button. Each section is a
// JEWEL BOX — a card with a jewel-toned band (teal, emerald or
// gold) — arranged in a two-column jewel grid on wide screens.
// Only the data comes from the site.
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
import { FeatherDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

export default function PeacockRoyaleDetails({
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
      className="relative min-h-[100dvh] w-full bg-[#FDFBF5] text-[#062E2B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#D4AF37]/60 bg-[#FDFBF5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 er-font-display text-[11px] tracking-[0.24em] text-[#062E2B] uppercase transition-colors hover:text-[#0B4F4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="er-font-script hidden text-2xl text-[#0B4F4A] sm:block">
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
          className="er-font-display text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#062E2B] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#062E2B]/85 italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37] sm:w-24" />
          <Heart className="h-4 w-4 fill-[#0B4F4A]/30 text-[#0B4F4A]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37] sm:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 sm:px-6 sm:pb-20">
        {/* Schedule of Events — gold jewel box */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Schedule of events"
            className="relative overflow-hidden border-t-4 border-[#D4AF37] bg-[#FFFFFF] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(4,33,31,0.35)] ring-1 ring-[#D4AF37]/50 sm:px-8 sm:py-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#D4AF37]/50" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#0B4F4A]">
                  <CalendarDays className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="er-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#062E2B] sm:text-[1.55rem]">
                    Schedule of Events
                  </h2>
                  <p className="er-font-editorial mt-1 text-sm text-[#062E2B]/75 italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {site.events.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                    <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                      <span className="er-font-display text-sm tracking-[0.08em] text-[#062E2B] tabular-nums">
                        {event.time}
                      </span>
                      <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#D4AF37]" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-[#D4AF37]/50 pb-5 last:border-b-0 last:pb-0">
                      <p className="er-font-display text-[13px] tracking-[0.14em] text-[#062E2B] uppercase sm:text-sm">
                        {event.name}
                      </p>
                      {event.description && (
                        <p className="er-font-editorial mt-1 text-sm leading-relaxed text-[#062E2B]/80 italic sm:text-[0.95rem]">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <p className="er-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#062E2B]/70 italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0B4F4A]" />
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

        {/* Dress Code + Venue — two jewel boxes side by side */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {/* Dress Code — deep teal jewel box */}
          {dressCode && (
            <motion.section
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Dress code"
              className="border-t-4 border-[#D4AF37] bg-[#062E2B] px-5 py-7 text-[#FDFBF5] shadow-[0_18px_36px_-14px_rgba(4,33,31,0.5)] sm:px-7"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/80 bg-[#0B4F4A] text-[#FDFBF5]">
                <Shirt className="h-4.5 w-4.5" />
              </span>
              <h2 className="er-font-display mt-4 text-[1.2rem] leading-none font-normal tracking-[0.04em] sm:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="er-font-display mt-3 text-[12px] tracking-[0.22em] text-[#FDFBF5] uppercase sm:text-sm">
                {dressCode}
              </p>
              <p className="er-font-editorial mt-3 text-sm leading-relaxed text-[#FDFBF5]/90 italic sm:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in
                deep, jewel tones is warmly welcomed.
              </p>
            </motion.section>
          )}

          {/* Venue + Travel — emerald jewel box */}
          {(site.content.venueName || site.content.venueAddress || travelNotes.length > 0) && (
            <motion.section
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Venue and travel"
              className="border-t-4 border-[#D4AF37] bg-[#065F46] px-5 py-7 text-[#FDFBF5] shadow-[0_18px_36px_-14px_rgba(4,33,31,0.5)] sm:px-7"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/80 bg-[#0B4F4A] text-[#FDFBF5]">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className="er-font-display mt-4 text-[1.2rem] leading-none font-normal tracking-[0.04em] sm:text-[1.35rem]">
                Venue &amp; Travel
              </h2>
              {site.content.venueName && (
                <p className="er-font-display mt-3 text-[1.05rem] tracking-[0.06em] text-[#FDFBF5] uppercase">
                  {site.content.venueName}
                </p>
              )}
              {site.content.venueAddress && (
                <p className="er-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#FDFBF5]/90 italic">
                  {site.content.venueAddress}
                </p>
              )}
              {venueQuery && (
                <a
                  href={mapsLink(venueQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 border border-[#FDFBF5]/80 px-5 py-2.5 er-font-display text-[11px] tracking-[0.24em] text-[#FDFBF5] uppercase transition-colors duration-300 hover:bg-[#FDFBF5] hover:text-[#065F46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
                >
                  View on Google Maps
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              )}
              {travelNotes.map((d, i) => (
                <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#FDFBF5]/25 pt-5">
                  <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#E7C86A]" />
                  <p className="er-font-editorial text-sm leading-relaxed text-[#FDFBF5]/90 italic sm:text-[0.95rem]">
                    {d.body}
                  </p>
                </div>
              ))}
            </motion.section>
          )}
        </div>

        {/* Accommodations — jewel grid */}
        {hotelList.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Where to stay"
            className="mt-6 border-t-4 border-[#D4AF37] bg-[#FFFFFF] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(4,33,31,0.35)] ring-1 ring-[#D4AF37]/50 sm:px-8 sm:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#0B4F4A]">
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h2 className="er-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#062E2B] sm:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className={`px-5 py-5 ${
                    i % 2 === 0
                      ? "border border-[#0F766E]/40 bg-[#0F766E]/5"
                      : "border border-[#D4AF37]/60 bg-[#FAF6EC]"
                  }`}
                >
                  <p className="er-font-display text-[13px] tracking-[0.12em] text-[#062E2B] uppercase sm:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="er-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#062E2B]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#0B4F4A]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="er-font-editorial mt-2 text-sm leading-relaxed text-[#062E2B]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="er-font-display mt-3 text-[11px] tracking-[0.2em] text-[#0B4F4A] uppercase">
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Registry / Wishing Well — gold jewel box */}
        {registryNotes.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Gifts and registry"
            className="mt-6 border-t-4 border-[#0B4F4A] bg-[#D4AF37] px-5 py-8 text-center text-[#062E2B] shadow-[0_18px_36px_-14px_rgba(4,33,31,0.5)] sm:px-8 sm:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#062E2B]" />
            <h2 className="er-font-display mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] sm:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <FeatherDivider className="mt-4 h-8 w-24 opacity-90 [&_span]:from-[#062E2B] [&_span]:to-transparent" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="er-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#062E2B]/90 italic">
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
            className="group inline-flex items-center gap-2 bg-[#062E2B] px-7 py-3.5 er-font-display text-[11px] tracking-[0.26em] text-[#FDFBF5] uppercase shadow-[0_10px_22px_-8px_rgba(4,33,31,0.6)] transition-colors duration-300 hover:bg-[#0B4F4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] sm:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#FDFBF5]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#062E2B]/70 px-6 py-3 er-font-display text-[11px] tracking-[0.26em] text-[#062E2B] uppercase transition-colors duration-300 hover:bg-[#062E2B] hover:text-[#FDFBF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
