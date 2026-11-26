// Marble Luxe details page — the 5-event schedule, dress code,
// venue + travel, the 2 accommodations, and the registry /
// wishing-well note, all as a minimal line-divided LIST (no panels,
// no sleeves), plus the RSVP jump button. Only the data comes from
// the site.
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
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

export default function MarbleLuxeDetails({
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
      className="relative min-h-[100dvh] w-full bg-white text-[#1F2937]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#E5E0D8] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 ml-font-display text-[11px] font-medium tracking-[0.24em] text-[#1F2937] uppercase transition-colors hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="ml-font-script hidden text-2xl text-[#8C7355] sm:block">
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
          className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-3 text-[2.2rem] leading-[1.1] font-medium tracking-[0.02em] text-[#1F2937] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-editorial mx-auto mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4B5563] italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B49A70] sm:w-24" />
          <Heart className="h-4 w-4 fill-[#B49A70]/40 text-[#8C7355]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B49A70] sm:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[760px] px-4 pb-16 sm:px-6 sm:pb-20">
        {/* Schedule of Events — line-divided list */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Schedule of events"
          >
            <h2 className="ml-font-display text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
              Order of the Day
            </h2>
            <div className="mt-4">
              {site.events.map((event, i) => (
                <div
                  key={`${event.name}-${i}`}
                  className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 last:border-b sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                  </span>
                  <span className="sm:text-right">
                    <span className="ml-font-display block text-[1.05rem] font-medium text-[#1F2937]">
                      {event.name}
                    </span>
                    {event.description && (
                      <span className="ml-font-editorial mt-0.5 block text-sm text-[#4B5563] italic">
                        {event.description}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Venue */}
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Venue"
          className="mt-12"
        >
          <h2 className="ml-font-display text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
            The Venue
          </h2>
          <div className="mt-4 border-t border-b border-[#E5E0D8] py-5">
            <p className="ml-font-display text-[1.25rem] font-medium text-[#1F2937]">
              {site.content.venueName || "Our Wedding Venue"}
            </p>
            {site.content.venueAddress && (
              <p className="ml-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#4B5563] italic">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B49A70]" />
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="ml-font-display mt-3 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase underline underline-offset-4 transition-colors hover:text-[#1F2937] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
              >
                View on Map
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </motion.section>

        {/* Dress Code */}
        {dressCode && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Dress code"
            className="mt-12"
          >
            <h2 className="ml-font-display text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
              Dress Code
            </h2>
            <div className="mt-4 flex items-center gap-3 border-t border-b border-[#E5E0D8] py-5">
              <Shirt className="h-5 w-5 shrink-0 text-[#8C7355]" />
              <p className="ml-font-display text-[1.05rem] font-medium text-[#1F2937]">{dressCode}</p>
            </div>
          </motion.section>
        )}

        {/* Accommodations */}
        {hotelList.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Where to stay"
            className="mt-12"
          >
            <h2 className="ml-font-display text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
              Where to Stay
            </h2>
            <div className="mt-4">
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 last:border-b sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                    <BedDouble className="h-3.5 w-3.5" />
                    {hotel.name}
                  </span>
                  <span className="sm:text-right">
                    {hotel.distance && (
                      <span className="ml-font-editorial block text-sm text-[#4B5563] italic">
                        {hotel.distance}
                      </span>
                    )}
                    {hotel.note && (
                      <span className="ml-font-editorial mt-0.5 block text-sm leading-relaxed text-[#4B5563] italic">
                        {hotel.note}
                      </span>
                    )}
                    {hotel.code && (
                      <span className="ml-font-display mt-1 block text-[11px] font-medium tracking-[0.18em] text-[#8C7355] uppercase">
                        Booking Code: {hotel.code}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Travel + Registry */}
        {(travelNotes.length > 0 || registryNotes.length > 0) && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Travel and gifts"
            className="mt-12"
          >
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="border-t border-[#E5E0D8] py-5 last:border-b">
                <h2 className="ml-font-display flex items-center gap-2 text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
                  <Plane className="h-4 w-4" />
                  Getting There
                </h2>
                <p className="ml-font-editorial mt-3 text-[1rem] leading-[1.75] text-[#4B5563] italic">
                  {d.body}
                </p>
              </div>
            ))}
            {registryNotes.map((d, i) => (
              <div key={`registry-${i}`} className="border-t border-[#E5E0D8] py-5 last:border-b">
                <h2 className="ml-font-display flex items-center gap-2 text-xs font-medium tracking-[0.3em] text-[#8C7355] uppercase">
                  <Gift className="h-4 w-4" />
                  Gifts &amp; Registry
                </h2>
                <p className="ml-font-editorial mt-3 text-[1rem] leading-[1.75] text-[#4B5563] italic">
                  {d.body}
                </p>
              </div>
            ))}
          </motion.section>
        )}

        {/* RSVP jump */}
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="ml-font-display text-[10px] font-medium tracking-[0.3em] text-[#8C7355] uppercase">
            {formatDateDisplay(site.weddingDate, site.timezone)}
          </p>
          <button
            type="button"
            onClick={onJumpToRsvp}
            className="group mt-5 inline-flex items-center gap-2 bg-[#1F2937] px-6 py-3.5 ml-font-display text-xs font-medium tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(31,41,55,0.5)] transition-colors duration-300 hover:bg-[#374151] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            <Heart className="h-4 w-4 fill-white/20" />
            Kindly Respond
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
