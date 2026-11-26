// Aurora details page — the 5-event schedule, dress code, venue +
// travel, the 2 accommodations, and the registry / wishing-well
// note, plus the RSVP jump button. All in frosted aurora glass
// panels on a deep-night background. Only the data comes from the
// site.
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
import { AuroraDivider } from "./Decor";
import {
  accommodations,
  formatDateDisplay,
  formatLongDate,
  mapsLink,
} from "./tokens";

function GlassSection({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      aria-label={label}
      className={`relative overflow-hidden rounded-2xl border border-[#5EEAD4]/25 bg-white/[0.06] px-5 py-8 shadow-[0_18px_36px_-14px_rgba(2,6,23,0.8)] backdrop-blur-md sm:px-8 sm:py-10 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(20, 184, 166, 0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

export default function AuroraDetails({
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
      className="relative min-h-[100dvh] w-full bg-[#0F172A] text-[#F4F7FB]"
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-[#5EEAD4]/25 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 au-font-display text-[11px] font-semibold tracking-[0.24em] text-[#F4F7FB] uppercase transition-colors hover:text-[#5EEAD4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
          <span className="au-font-script hidden text-2xl text-[#5EEAD4] sm:block">
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
          className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[0.02em] text-[#F4F7FB] sm:text-[2.8rem]"
        >
          The Celebration Awaits
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-editorial mt-4 mx-auto max-w-[560px] text-[1rem] leading-[1.75] text-[#E2E8F0]/85 italic sm:text-[1.06rem]"
        >
          {formatLongDate(site.weddingDate, site.timezone)} · {site.content.venueName || "Our Wedding Venue"}
        </motion.p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.34 }}
          className="mx-auto mt-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#5EEAD4]/80 sm:w-24" />
          <Heart className="h-4 w-4 fill-[#5EEAD4]/30 text-[#5EEAD4]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B5CF6]/80 sm:w-24" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 pb-16 sm:px-6 sm:pb-20">
        {/* Schedule of Events */}
        {site.events.length > 0 && (
          <GlassSection label="Schedule of events">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                <CalendarDays className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="au-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB] sm:text-[1.55rem]">
                  Schedule of Events
                </h2>
                <p className="au-font-editorial mt-1 text-sm text-[#E2E8F0]/75 italic">
                  {formatDateDisplay(site.weddingDate, site.timezone)}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {site.events.map((event, i) => (
                <div key={`${event.name}-${i}`} className="flex items-start gap-4">
                  <div className="flex w-[86px] shrink-0 flex-col items-center pt-0.5">
                    <span className="au-font-display text-sm font-semibold tracking-[0.08em] text-[#F4F7FB] tabular-nums">
                      {event.time}
                    </span>
                    <span aria-hidden="true" className="mt-1.5 h-6 w-px bg-[#5EEAD4]/60" />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-[#5EEAD4]/20 pb-5 last:border-b-0 last:pb-0">
                    <p className="au-font-display text-[13px] font-semibold tracking-[0.14em] text-[#F4F7FB] uppercase sm:text-sm">
                      {event.name}
                    </p>
                    {event.description && (
                      <p className="au-font-editorial mt-1 text-sm leading-relaxed text-[#E2E8F0]/80 italic sm:text-[0.95rem]">
                        {event.description}
                      </p>
                    )}
                    {event.venue && (
                      <p className="au-font-editorial mt-1 flex items-center gap-1.5 text-sm text-[#E2E8F0]/70 italic">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5EEAD4]" />
                        {event.venue}
                        {event.address ? ` · ${event.address}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassSection>
        )}

        {/* Dress Code */}
        {dressCode && (
          <GlassSection label="Dress code" className="mt-6 flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
              <Shirt className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="au-font-display text-[1.2rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB] sm:text-[1.35rem]">
                Dress Code
              </h2>
              <p className="au-font-display mt-2 text-[12px] font-semibold tracking-[0.22em] text-[#5EEAD4] uppercase sm:text-sm">
                {dressCode}
              </p>
              <p className="au-font-editorial mt-2 text-sm leading-relaxed text-[#E2E8F0]/85 italic sm:text-[0.95rem]">
                We kindly ask our guests to dress in their finest — formal attire in deep,
                jewel tones is warmly welcomed.
              </p>
            </div>
          </GlassSection>
        )}

        {/* Venue + Travel */}
        {(site.content.venueName || site.content.venueAddress || travelNotes.length > 0) && (
          <GlassSection label="Venue and travel" className="mt-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className="au-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB] sm:text-[1.55rem]">
                Venue &amp; Travel
              </h2>
            </div>
            {site.content.venueName && (
              <p className="au-font-display mt-5 text-[1.1rem] font-semibold tracking-[0.06em] text-[#F4F7FB] uppercase">
                {site.content.venueName}
              </p>
            )}
            {site.content.venueAddress && (
              <p className="au-font-editorial mt-1 text-[0.95rem] leading-relaxed text-[#E2E8F0]/85 italic">
                {site.content.venueAddress}
              </p>
            )}
            {venueQuery && (
              <a
                href={mapsLink(venueQuery)}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 border border-[#5EEAD4]/70 px-5 py-2.5 au-font-display text-[11px] font-semibold tracking-[0.24em] text-[#F4F7FB] uppercase transition-colors duration-300 hover:bg-[#14B8A6]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
              >
                View on Google Maps
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex items-start gap-3 border-t border-[#5EEAD4]/20 pt-5">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                <p className="au-font-editorial text-sm leading-relaxed text-[#E2E8F0]/85 italic sm:text-[0.95rem]">
                  {d.body}
                </p>
              </div>
            ))}
          </GlassSection>
        )}

        {/* Accommodations */}
        {hotelList.length > 0 && (
          <GlassSection label="Where to stay" className="mt-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h2 className="au-font-display text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB] sm:text-[1.55rem]">
                Where to Stay
              </h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="rounded-xl border border-[#5EEAD4]/25 bg-[#1E293B]/60 px-5 py-5">
                  <p className="au-font-display text-[13px] font-semibold tracking-[0.12em] text-[#F4F7FB] uppercase sm:text-sm">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="au-font-editorial mt-1.5 flex items-center gap-1.5 text-sm text-[#E2E8F0]/80 italic">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#5EEAD4]" />
                      {hotel.distance}
                    </p>
                  )}
                  {hotel.note && (
                    <p className="au-font-editorial mt-2 text-sm leading-relaxed text-[#E2E8F0]/80 italic">
                      {hotel.note}
                    </p>
                  )}
                  {hotel.code && (
                    <p className="au-font-display mt-3 text-[11px] font-semibold tracking-[0.2em] text-[#5EEAD4] uppercase">
                      Booking Code: {hotel.code}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </GlassSection>
        )}

        {/* Registry / Wishing Well */}
        {registryNotes.length > 0 && (
          <GlassSection label="Gifts and registry" className="mt-6 text-center">
            <Gift className="mx-auto h-6 w-6 text-[#5EEAD4]" />
            <h2 className="au-font-display mt-3 text-[1.35rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB] sm:text-[1.55rem]">
              Gifts &amp; Registry
            </h2>
            <AuroraDivider className="mt-4 h-8 w-24 opacity-90" />
            {registryNotes.map((d, i) => (
              <p key={`registry-${i}`} className="au-font-editorial mx-auto mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#E2E8F0]/90 italic">
                {d.body}
              </p>
            ))}
          </GlassSection>
        )}

        {/* RSVP Jump */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onJumpToRsvp}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#0F766E] to-[#6D28D9] px-7 py-3.5 au-font-display text-[11px] font-semibold tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(2,6,23,0.8)] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4] sm:text-xs"
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
            className="group inline-flex items-center gap-2 border border-[#5EEAD4]/70 px-6 py-3 au-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F4F7FB] uppercase transition-colors duration-300 hover:bg-[#14B8A6]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4] sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Invitation
          </button>
        </div>
      </div>
    </motion.div>
  );
}
