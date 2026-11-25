// Blush Royale details page — schedule, dress code, venue +
// travel, accommodations and registry, each in its own soft blush
// ROUNDED card (never a parchment sleeve). Only the data comes
// from the site.
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
import { FloralDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

export default function BlushRoyaleDetails({
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

  const card =
    "mt-6 rounded-[1.75rem] border border-[#EFC9CE]/70 bg-[#FFFDFB] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(92,50,59,0.25)] sm:px-8 sm:py-10";
  const iconBadge =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#F6DDE0]/70 text-[#B76E79]";
  const sectionTitle =
    "br-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#5C323B] sm:text-[1.55rem]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full bg-[#FBF6F3] text-[#5C323B]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#EFC9CE]/60 bg-[#FBF6F3]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 br-font-display text-[11px] tracking-[0.24em] text-[#B76E79] uppercase transition-colors hover:text-[#5C323B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="br-font-script hidden text-2xl text-[#B76E79] sm:block">
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
          className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#5C323B] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#5C323B]/85 italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B76E79]/80 sm:w-24" />
          <Heart className="h-4 w-4 fill-[#B76E79]/30 text-[#B76E79]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B76E79]/80 sm:w-24" />
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
            className={card}
          >
            <div className="flex items-center gap-3">
              <span className={iconBadge}>
                <CalendarDays className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className={sectionTitle}>Schedule of Events</h2>
                <p className="br-font-editorial mt-1 text-sm text-[#5C323B]/75 italic">
                  {formatDateDisplay(site.weddingDate, site.timezone)}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {site.events.map((event, i) => (
                <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                  <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                    <span className="br-font-display text-sm tracking-[0.08em] text-[#B76E79] tabular-nums">
                      {event.time}
                    </span>
                    <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#B76E79]/50" />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-[#EFC9CE]/60 pb-5 last:border-b-0 last:pb-0">
                    <p className="br-font-display text-[13px] tracking-[0.14em] text-[#5C323B] uppercase sm:text-sm">
                      {event.name}
                    </p>
                    {event.description && (
                      <p className="br-font-editorial mt-1 text-sm leading-relaxed text-[#5C323B]/80 italic sm:text-[0.95rem]">
                        {event.description}
                      </p>
                    )}
                    {event.venue && (
                      <p className="br-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#5C323B]/70 italic">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B76E79]" />
                        {event.venue}
                        {event.address ? ` · ${event.address}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
            className="mt-6 flex items-start gap-4 rounded-[1.75rem] bg-[#B76E79] px-5 py-6 text-[#FFFDFB] shadow-[0_18px_36px_-14px_rgba(183,110,121,0.5)] sm:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFFDFB]/50 bg-[#9E5B66] text-[#FFFDFB]">
              <Shirt className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="br-font-display text-[1.2rem] leading-none font-normal tracking-[0.04em] sm:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="br-font-display mt-2 text-[12px] tracking-[0.22em] uppercase sm:text-sm">
                {dressCode}
              </p>
              <p className="br-font-editorial mt-2 text-sm leading-relaxed text-[#F6DDE0]/90 italic sm:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in
                soft, blush tones is warmly welcomed.
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
            className={card}
          >
            <div className="flex items-center gap-3">
              <span className={iconBadge}>
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className={sectionTitle}>Venue &amp; Travel</h2>
            </div>
            {site.content.venueName && (
              <p className="br-font-display mt-5 text-[1.1rem] tracking-[0.06em] text-[#5C323B] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="br-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#5C323B]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-full border border-[#B76E79]/70 px-5 py-2.5 br-font-display text-[11px] tracking-[0.24em] text-[#B76E79] uppercase transition-colors duration-300 hover:bg-[#B76E79] hover:text-[#FFFDFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#EFC9CE]/60 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#B76E79]" />
                <p className="br-font-editorial text-sm leading-relaxed text-[#5C323B]/85 italic sm:text-[0.95rem]">
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
            className={card}
          >
            <div className="flex items-center gap-3">
              <span className={iconBadge}>
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h2 className={sectionTitle}>Where to Stay</h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="rounded-2xl border border-[#EFC9CE]/70 bg-[#F6DDE0]/40 px-5 py-5">
                  <p className="br-font-display text-[13px] tracking-[0.12em] text-[#5C323B] uppercase sm:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="br-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#5C323B]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#B76E79]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="br-font-editorial mt-2 text-sm leading-relaxed text-[#5C323B]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="br-font-display mt-3 text-[11px] tracking-[0.2em] text-[#7A4A55] uppercase">
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
            className="mt-6 rounded-[1.75rem] bg-[#B76E79] px-5 py-8 text-center text-[#FFFDFB] shadow-[0_18px_36px_-14px_rgba(183,110,121,0.5)] sm:px-8 sm:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#F6DDE0]" />
            <h2 className="br-font-display mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] sm:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <FloralDivider className="mt-4 h-8 w-24 opacity-90 [&_path]:stroke-[#F6DDE0] [&_circle]:fill-[#F6DDE0]" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="br-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#F6DDE0]/90 italic">
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
            className="group inline-flex items-center gap-2 rounded-full bg-[#B76E79] px-7 py-3.5 br-font-display text-[11px] tracking-[0.26em] text-[#FFFDFB] uppercase shadow-[0_10px_22px_-8px_rgba(183,110,121,0.6)] transition-colors duration-300 hover:bg-[#9E5B66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#FFFDFB]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-full border border-[#B76E79]/70 px-6 py-3 br-font-display text-[11px] tracking-[0.26em] text-[#B76E79] uppercase transition-colors duration-300 hover:bg-[#B76E79] hover:text-[#FFFDFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
