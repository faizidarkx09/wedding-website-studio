// Forest Whisper details page — the full trail map (every event as
// a pinned stop on the winding path), dress code, venue + travel,
// the accommodations, and the registry / wishing-well note, plus the
// RSVP jump button. Only the data comes from the site.
//
// CONTAINER QUERIES ONLY for layout in this file: the editor's
// Mobile (390px) preview renders this inside a 390px div on a
// desktop viewport, so viewport queries would apply desktop geometry
// in a mobile-sized column. Every responsive rule here is
// `@min-[40rem]:` on a `@container` parent.
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
  Navigation,
  Plane,
  Shirt,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { LeafDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

export default function ForestWhisperDetails({
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
      className="@container relative min-h-[100dvh] w-full bg-[#F4F1E6] text-[#1B4332]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#6A994E]/30 bg-[#F4F1E6]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 @min-[40rem]:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 fw-font-display text-[11px] tracking-[0.24em] text-[#1B4332] uppercase transition-colors hover:text-[#2D6A4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="fw-font-script hidden text-2xl text-[#2D6A4F] @min-[40rem]:block">
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
          className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#1B4332] @min-[40rem]:text-[2.8rem]"
        >
          Follow the Trail
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#1B4332]/85 italic @min-[40rem]:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#6A994E]/80 @min-[40rem]:w-24" />
          <Heart className="h-4 w-4 fill-[#2D6A4F]/30 text-[#2D6A4F]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#6A994E]/80 @min-[40rem]:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 @min-[40rem]:px-6 @min-[40rem]:pb-20">
        {/* Full trail map — every event as a pinned stop */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Trail map of events"
            className="relative overflow-hidden bg-[#FBF9F1] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(27,67,50,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#6A994E]/60" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                  <CalendarDays className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="fw-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#1B4332] @min-[40rem]:text-[1.55rem]">
                    Trail Map of the Day
                  </h2>
                  <p className="fw-font-editorial mt-1 text-sm text-[#1B4332]/75 italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              {/* Winding path with pinned stops */}
              <div className="relative mt-8">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <path
                    d="M 50 0 C 78 12, 22 24, 50 38 C 78 52, 22 64, 50 78 C 68 88, 38 94, 50 100"
                    fill="none"
                    stroke="#6A994E"
                    strokeWidth="1.6"
                    strokeDasharray="7 6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="0.75"
                  />
                </svg>
                <div className="relative flex flex-col gap-7">
                  {site.events.map((event, i) => (
                    <div
                      key={`${event.name}-${i}`}
                      className={`flex items-start gap-4 @min-[40rem]:w-[78%] ${
                        i % 2 === 1 ? "@min-[40rem]:ml-auto @min-[40rem]:flex-row-reverse @min-[40rem]:text-right" : ""
                      }`}
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#FBF9F1] bg-[#2D6A4F] fw-font-display text-sm text-[#F4F1E6] shadow-[0_6px_14px_-4px_rgba(27,67,50,0.5)]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1 rounded-[4px] bg-[#F4F1E6]/80 px-4 py-3 ring-1 ring-[#6A994E]/30">
                        <p className="fw-font-display text-[13px] tracking-[0.14em] text-[#1B4332] uppercase @min-[40rem]:text-sm">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p className="fw-font-editorial mt-1 text-sm leading-relaxed text-[#1B4332]/80 italic @min-[40rem]:text-[0.95rem]">
                            {event.description}
                          </p>
                        )}
                        {event.venue && (
                          <p className="fw-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#1B4332]/70 italic">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2D6A4F]" />
                            {event.venue}
                            {event.address ? ` · ${event.address}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Trail's end — the venue pin */}
                  <div className="flex items-start gap-4 @min-[40rem]:w-[78%] @min-[40rem]:ml-auto @min-[40rem]:flex-row-reverse @min-[40rem]:text-right">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#FBF9F1] bg-[#1B4332] text-[#F4F1E6] shadow-[0_6px_14px_-4px_rgba(27,67,50,0.5)]">
                      <Navigation className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 rounded-[4px] bg-[#1B4332] px-4 py-3 text-[#F4F1E6]">
                      <p className="fw-font-display text-[13px] tracking-[0.14em] uppercase @min-[40rem]:text-sm">
                        Trail&rsquo;s End — {site.content.venueName || "Our Wedding Venue"}
                      </p>
                      {venueQuery && (
                        <a
                          href={mapsLink(venueQuery)}
                          target="_blank"
                          rel="noreferrer"
                          className="fw-font-editorial mt-1 inline-flex items-center gap-1.5 text-sm text-[#A7C957] italic underline underline-offset-2"
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          Find the trail on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
            className="mt-6 flex items-start gap-4 bg-[#1B4332] px-5 py-6 text-[#F4F1E6] shadow-[0_18px_36px_-14px_rgba(27,67,50,0.5)] @min-[40rem]:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A7C957]/70 bg-[#2D6A4F] text-[#F4F1E6]">
              <Shirt className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="fw-font-display text-[1.2rem] leading-none font-normal tracking-[0.04em] @min-[40rem]:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="fw-font-display mt-2 text-[12px] tracking-[0.22em] uppercase @min-[40rem]:text-sm">
                {dressCode}
              </p>
              <p className="fw-font-editorial mt-2 text-sm leading-relaxed text-[#E7EAD9]/85 italic @min-[40rem]:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in
                deep, woodland tones is warmly welcomed.
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
            className="mt-6 bg-[#FBF9F1] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(27,67,50,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className="fw-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#1B4332] @min-[40rem]:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p className="fw-font-display mt-5 text-[1.1rem] tracking-[0.06em] text-[#1B4332] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="fw-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#1B4332]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 border border-[#1B4332]/70 px-5 py-2.5 fw-font-display text-[11px] tracking-[0.24em] text-[#1B4332] uppercase transition-colors duration-300 hover:bg-[#1B4332] hover:text-[#F4F1E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#6A994E]/25 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]" />
                <p className="fw-font-editorial text-sm leading-relaxed text-[#1B4332]/85 italic @min-[40rem]:text-[0.95rem]">
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
            className="mt-6 bg-[#FBF9F1] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(27,67,50,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h2 className="fw-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#1B4332] @min-[40rem]:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 @min-[40rem]:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="border border-[#6A994E]/40 bg-[#F4F1E6]/70 px-5 py-5">
                  <p className="fw-font-display text-[13px] tracking-[0.12em] text-[#1B4332] uppercase @min-[40rem]:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="fw-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#1B4332]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#2D6A4F]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="fw-font-editorial mt-2 text-sm leading-relaxed text-[#1B4332]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="fw-font-display mt-3 text-[11px] tracking-[0.2em] text-[#2D6A4F] uppercase">
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
            className="mt-6 bg-[#1B4332] px-5 py-8 text-center text-[#F4F1E6] shadow-[0_18px_36px_-14px_rgba(27,67,50,0.5)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#A7C957]" />
            <h2 className="fw-font-display mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] @min-[40rem]:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <LeafDivider className="mt-4 h-8 w-24 opacity-90 [&_line]:stroke-[#A7C957] [&_path]:fill-[#A7C957]" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="fw-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#E7EAD9]/90 italic">
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
            className="group inline-flex items-center gap-2 bg-[#1B4332] px-7 py-3.5 fw-font-display text-[11px] tracking-[0.26em] text-[#F4F1E6] uppercase shadow-[0_10px_22px_-8px_rgba(27,67,50,0.6)] transition-colors duration-300 hover:bg-[#2D6A4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] @min-[40rem]:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#F4F1E6]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#1B4332]/70 px-6 py-3 fw-font-display text-[11px] tracking-[0.26em] text-[#1B4332] uppercase transition-colors duration-300 hover:bg-[#1B4332] hover:text-[#F4F1E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] @min-[40rem]:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
