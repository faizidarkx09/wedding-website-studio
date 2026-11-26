// Rose Garden details page — the 3 seed packets (Ceremony /
// Reception / Venue), the 5-event schedule, dress code, venue +
// travel, the 2 accommodations, and the registry / wishing-well
// note, plus the RSVP jump button. Only the data comes from the
// site. Container queries only — no viewport `sm:`.
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
  Leaf,
  MapPin,
  Plane,
  Shirt,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { RoseDivider, RoseMark } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  formatShortDate,
  mapsLink,
} from "./tokens";

export default function RoseGardenDetails({
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

  const byName = (needle: string) =>
    site.events.find((e) => e.name.toLowerCase().includes(needle));
  const ceremony = byName("ceremony") ?? site.events[0];
  const reception = byName("reception") ?? site.events[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="@container relative min-h-[100dvh] w-full bg-[#FFF7F2] text-[#3D1420]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#B3124F]/30 bg-[#FFF7F2]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 @min-[40rem]:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 rg-font-display text-[11px] tracking-[0.24em] text-[#3D1420] uppercase transition-colors hover:text-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="rg-font-script hidden text-2xl text-[#B3124F] @min-[40rem]:block">
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
          className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-3 text-[2.2rem] leading-[1.1] font-normal tracking-[0.02em] text-[#3D1420] @min-[40rem]:text-[2.8rem]"
        >
          Planted with Love
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#3D1420]/85 italic @min-[40rem]:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B3124F]/80 @min-[40rem]:w-24" />
          <Heart className="h-4 w-4 fill-[#7E0C37]/30 text-[#7E0C37]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B3124F]/80 @min-[40rem]:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 @min-[40rem]:px-6 @min-[40rem]:pb-20">
        {/* Seed packets — Ceremony / Reception / Venue */}
        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Ceremony, reception and venue"
          className="grid gap-5 @min-[40rem]:grid-cols-3"
        >
          {[
            {
              label: "Packet No. 01",
              title: "The Ceremony",
              lines: ceremony
                ? [
                    ceremony.time
                      ? `${ceremony.time} · ${formatShortDate(site.weddingDate, site.timezone)}`
                      : "",
                    ceremony.venue || "",
                    ceremony.description || "",
                  ].filter(Boolean)
                : [],
              footer: "Sow with love",
            },
            {
              label: "Packet No. 02",
              title: "The Reception",
              lines: reception
                ? [
                    reception.time
                      ? `${reception.time} · ${formatShortDate(site.weddingDate, site.timezone)}`
                      : "",
                    reception.venue || "",
                    reception.description || "",
                  ].filter(Boolean)
                : [],
              footer: "Sow with joy",
            },
            {
              label: "Packet No. 03",
              title: site.content.venueName || "Our Wedding Venue",
              lines: [site.content.venueAddress || ""].filter(Boolean),
              footer: "Sow with hope",
            },
          ].map((packet) => (
            <article
              key={packet.label}
              className="relative flex flex-col overflow-hidden bg-[#FFFCF8] text-left shadow-[0_16px_32px_-14px_rgba(61,20,32,0.4)] ring-1 ring-[#B3124F]/25"
            >
              <div className="relative bg-[#B3124F] px-5 pt-4 pb-3 text-[#FFF7F2]">
                <p className="rg-font-display text-[9px] tracking-[0.3em] uppercase opacity-90">
                  {packet.label}
                </p>
                <h2 className="rg-font-display mt-1 text-[1.15rem] leading-[1.2] font-normal tracking-[0.04em] uppercase">
                  {packet.title}
                </h2>
              </div>
              <div className="relative flex flex-1 flex-col px-5 py-5">
                <RoseMark className="h-7 w-7 text-[#B3124F]" />
                <div className="mt-3 space-y-1.5">
                  {packet.lines.map((line, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "rg-font-display text-[12px] tracking-[0.1em] text-[#3D1420] uppercase"
                          : "rg-font-editorial text-[0.95rem] leading-[1.6] text-[#3D1420]/80 italic"
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <p className="rg-font-display mt-auto flex items-center gap-1.5 pt-4 text-[10px] tracking-[0.24em] text-[#3E6B3A] uppercase">
                  <Leaf className="h-3.5 w-3.5" />
                  {packet.footer}
                </p>
              </div>
            </article>
          ))}
        </motion.section>

        {/* Schedule of Events */}
        {site.events.length > 0 && (
          <motion.section
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Schedule of events"
            className="relative mt-6 overflow-hidden bg-[#FFFCF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(61,20,32,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#B3124F]/60" />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFF7F2] text-[#7E0C37]">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="rg-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#3D1420] @min-[40rem]:text-[1.55rem]">
                    Schedule of Events
                  </h2>
                  <p className="rg-font-editorial mt-1 text-sm text-[#3D1420]/75 italic">
                    {formatDateDisplay(site.weddingDate, site.timezone)}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                {site.events.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                    <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                      <span className="rg-font-display text-sm tracking-[0.08em] text-[#3D1420] tabular-nums">
                        {event.time}
                      </span>
                      <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#B3124F]/60" />
                    </div>
                    <div className="min-w-0 flex-1 border-b border-[#B3124F]/25 pb-5 last:border-b-0 last:pb-0">
                      <p className="rg-font-display text-[13px] tracking-[0.14em] text-[#3D1420] uppercase @min-[40rem]:text-sm">
                        {event.name}
                      </p>
                      {event.description && (
                        <p className="rg-font-editorial mt-1 text-sm leading-relaxed text-[#3D1420]/80 italic @min-[40rem]:text-[0.95rem]">
                          {event.description}
                        </p>
                      )}
                      {event.venue && (
                        <p className="rg-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#3D1420]/70 italic">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7E0C37]" />
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
            className="mt-6 flex items-start gap-4 bg-[#2F5230] px-5 py-6 text-[#FFF7F2] shadow-[0_18px_36px_-14px_rgba(61,20,32,0.5)] @min-[40rem]:px-7"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F4A7B9]/70 bg-[#3E6B3A] text-[#FFF7F2]">
              <Shirt className="h-4 w-4" />
            </span>
            <div>
              <h2 className="rg-font-display text-[1.2rem] leading-none font-normal tracking-[0.04em] @min-[40rem]:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="rg-font-display mt-2 text-[12px] tracking-[0.22em] uppercase @min-[40rem]:text-sm">
                {dressCode}
              </p>
              <p className="rg-font-editorial mt-2 text-sm leading-relaxed text-[#FFF7F2]/85 italic @min-[40rem]:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in
                deep, warm tones is warmly welcomed.
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
            className="mt-6 bg-[#FFFCF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(61,20,32,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFF7F2] text-[#7E0C37]">
                <MapPin className="h-4 w-4" />
              </span>
              <h2 className="rg-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#3D1420] @min-[40rem]:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p className="rg-font-display mt-5 text-[1.1rem] tracking-[0.06em] text-[#3D1420] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="rg-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#3D1420]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 border border-[#3D1420]/70 px-5 py-2.5 rg-font-display text-[11px] tracking-[0.24em] text-[#3D1420] uppercase transition-colors duration-300 hover:bg-[#3D1420] hover:text-[#FFF7F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#B3124F]/25 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#7E0C37]" />
                <p className="rg-font-editorial text-sm leading-relaxed text-[#3D1420]/85 italic @min-[40rem]:text-[0.95rem]">
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
            className="mt-6 bg-[#FFFCF8] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(61,20,32,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFF7F2] text-[#7E0C37]">
                <BedDouble className="h-4 w-4" />
              </span>
              <h2 className="rg-font-display text-[1.35rem] leading-none font-normal tracking-[0.04em] text-[#3D1420] @min-[40rem]:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 @min-[40rem]:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="border border-[#B3124F]/40 bg-[#FFF7F2]/70 px-5 py-5">
                  <p className="rg-font-display text-[13px] tracking-[0.12em] text-[#3D1420] uppercase @min-[40rem]:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="rg-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#3D1420]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#7E0C37]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="rg-font-editorial mt-2 text-sm leading-relaxed text-[#3D1420]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="rg-font-display mt-3 text-[11px] tracking-[0.2em] text-[#7E0C37] uppercase">
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
            className="mt-6 bg-[#B3124F] px-5 py-8 text-center text-[#FFF7F2] shadow-[0_18px_36px_-14px_rgba(61,20,32,0.5)] @min-[40rem]:px-8 @min-[40rem]:py-10"
          >
            <Gift className="mx-auto h-6 w-6 text-[#F4A7B9]" />
            <h2 className="rg-font-display mt-3 text-[1.35rem] leading-none font-normal tracking-[0.04em] @min-[40rem]:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <RoseDivider light className="mt-4 h-8 w-24 opacity-90" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="rg-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#FFF7F2]/90 italic">
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
            className="group inline-flex items-center gap-2 bg-[#B3124F] px-7 py-3.5 rg-font-display text-[11px] tracking-[0.26em] text-[#FFF7F2] uppercase shadow-[0_10px_22px_-8px_rgba(126,12,55,0.6)] transition-colors duration-300 hover:bg-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F] @min-[40rem]:text-xs"
          >
            <Heart className="h-4 w-4 fill-[#FFF7F2]/20" />
            Kindly Respond to Our Invitation
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 border border-[#3D1420]/70 px-6 py-3 rg-font-display text-[11px] tracking-[0.26em] text-[#3D1420] uppercase transition-colors duration-300 hover:bg-[#3D1420] hover:text-[#FFF7F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F] @min-[40rem]:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
