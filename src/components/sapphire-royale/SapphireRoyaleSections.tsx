// Sapphire Royale details + RSVP + footer. Details are NAVY
// PANELS with silver rules (not a parchment card, not polaroids):
// a navy schedule panel, a navy venue panel, ice panels for
// accommodations. The RSVP intro is PANEL-BASED (no framed image):
// an ice panel with a navy border, and all text stays inside the
// panel with clear margins at every viewport — at 320px the panel
// is px-4 with a w-full text column, so nothing can spill outside
// (the Royal Burgundy torn-paper lesson, applied from the start by
// not using a framed image at all). Only the data comes from the
// site (schedule, accommodations, travel + registry notes are the
// couple's editable DetailBlocks).
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock,
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DecoDivider, FanPatternBand } from "./Decor";
import {
  BALLROOM_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — navy panels with silver rules                */
/* ------------------------------------------------------------------ */

export function SapphireRoyaleDetailsCard({
  site,
  onOpenDetails,
}: {
  site: WeddingSite;
  onOpenDetails: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const schedulePreview = site.events.slice(0, 3);
  const dressCode = site.content.dressCode.trim();
  const hotelList = accommodations(site);
  const travelNotes = site.content.details.filter(
    (d) => d.kind === "travel" && !d.hidden && d.body.trim(),
  );
  const registryNotes = site.content.details.filter(
    (d) => d.kind === "registry" && !d.hidden && d.body.trim(),
  );

  return (
    <div className="relative overflow-hidden bg-[#F2F4F8] px-4 pt-16 pb-20 text-[#12294D] sm:px-6 sm:pt-20 sm:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display text-[10px] tracking-[0.34em] text-[#12294D] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#0A1F44] sm:text-[2.3rem]"
        >
          The Night Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#12294D]/85 sm:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of silver light, joy, and
          unforgettable moments.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C0C0C8] sm:w-24" />
          <Sparkles className="h-4 w-4 text-[#12294D]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C0C0C8] sm:w-24" />
        </motion.div>

        {/* Main navy panel with silver rules */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px] overflow-hidden bg-[#0A1F44] px-5 py-8 text-[#F2F4F8] shadow-[0_24px_48px_-16px_rgba(6,18,43,0.55)] sm:px-8 sm:py-10"
        >
          <FanPatternBand />
          <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#C0C0C8]/50" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] border border-[#C0C0C8]/20" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Ballroom accent image */}
            <div className="relative w-full overflow-hidden border border-[#C0C0C8]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BALLROOM_URL}
                alt="Art-deco grand ballroom at night in midnight navy and silver"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="aspect-[16/7] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06122B]/60 via-transparent to-transparent"
              />
            </div>

            <p className="sr-font-display mt-6 text-[10px] tracking-[0.34em] text-[#C0C0C8] uppercase sm:text-xs">
              {formatShortDate(site.weddingDate, site.timezone)}
            </p>
            <h4 className="sr-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#FFFFFF] sm:text-[1.75rem]">
              {site.content.venueName || "Our Wedding Venue"}
            </h4>
            {site.content.venueAddress && (
              <p className="sr-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#D9D9DE]/85 italic sm:text-[0.95rem]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C0C0C8]" />
                {site.content.venueAddress}
              </p>
            )}

            <DecoDivider className="mt-5 h-5 w-28 sm:w-32" />

            {/* Schedule Preview — silver rules between rows */}
            {schedulePreview.length > 0 && (
              <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                {schedulePreview.map((event, i) => (
                  <div
                    key={`${event.name}-${i}`}
                    className="flex items-start gap-3 border-b border-[#C0C0C8]/25 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 rotate-45 items-center justify-center border border-[#C0C0C8]/70 bg-[#12294D] text-[#D9D9DE]">
                      <Clock className="h-3.5 w-3.5 -rotate-45" />
                    </span>
                    <div className="min-w-0">
                      <p className="sr-font-display text-[11px] tracking-[0.18em] text-[#FFFFFF] uppercase sm:text-xs">
                        {event.time} · {event.name}
                      </p>
                      {event.description && (
                        <p className="sr-font-editorial mt-0.5 text-sm leading-relaxed text-[#D9D9DE]/80 italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {site.events.length > 3 && (
                  <p className="sr-font-editorial pl-11 text-sm text-[#C0C0C8] italic">
                    + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                  </p>
                )}
              </div>
            )}

            {/* Dress Code */}
            {dressCode && (
              <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#C0C0C8]/60 bg-[#12294D]/80 px-4 py-2">
                <Shirt className="h-4 w-4 shrink-0 text-[#C0C0C8]" />
                <span className="sr-font-display text-[10px] tracking-[0.2em] text-[#FFFFFF] uppercase sm:text-[11px]">
                  Dress Code: {dressCode}
                </span>
              </div>
            )}

            {/* Accommodations Preview */}
            {hotelList.length > 0 && (
              <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                {hotelList.map((hotel, i) => (
                  <div
                    key={`${hotel.name}-${i}`}
                    className="flex items-start gap-3 border-b border-[#C0C0C8]/25 pb-2.5 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 rotate-45 items-center justify-center border border-[#C0C0C8]/70 bg-[#12294D] text-[#D9D9DE]">
                      <BedDouble className="h-3.5 w-3.5 -rotate-45" />
                    </span>
                    <div className="min-w-0">
                      <p className="sr-font-display text-[11px] tracking-[0.18em] text-[#FFFFFF] uppercase sm:text-xs">
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p className="sr-font-editorial mt-0.5 text-sm text-[#D9D9DE]/80 italic">
                          {hotel.distance}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Travel / Registry notes */}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 rotate-45 items-center justify-center border border-[#C0C0C8]/70 bg-[#12294D] text-[#D9D9DE]">
                  <Plane className="h-3.5 w-3.5 -rotate-45" />
                </span>
                <p className="sr-font-editorial text-sm leading-relaxed text-[#D9D9DE]/85 italic">
                  {d.body}
                </p>
              </div>
            ))}
            {registryNotes.map((d, i) => (
              <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 rotate-45 items-center justify-center border border-[#C0C0C8]/70 bg-[#12294D] text-[#D9D9DE]">
                  <Gift className="h-3.5 w-3.5 -rotate-45" />
                </span>
                <p className="sr-font-editorial text-sm leading-relaxed text-[#D9D9DE]/85 italic">
                  {d.body}
                </p>
              </div>
            ))}

            {/* View Full Wedding Details */}
            <button
              type="button"
              onClick={onOpenDetails}
              className="group mt-8 inline-flex items-center gap-2 bg-[#F2F4F8] px-6 py-3 sr-font-display text-[11px] tracking-[0.26em] text-[#0A1F44] uppercase shadow-[0_10px_22px_-8px_rgba(6,18,43,0.6)] transition-colors duration-300 hover:bg-[#FFFFFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8] sm:text-xs"
            >
              <CalendarDays className="h-4 w-4" />
              View Full Wedding Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Silver accent row */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[#12294D]/70">
          <Sparkles className="h-4 w-4" />
          <Heart className="h-4 w-4 fill-[#12294D]/20" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — panel-based intro + RSVP jump (no framed image)     */
/* ------------------------------------------------------------------ */

export function SapphireRoyaleRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="relative overflow-hidden bg-[#F2F4F8] px-4 pt-4 pb-20 text-[#12294D] sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Ice panel with navy border — text is a plain in-flow
            column inside the panel (px-5 sm:px-10, py-12 sm:py-16),
            so at the narrowest 320px viewport every line still sits
            inside the panel with clear margins. No framed image, so
            the torn-paper spill geometry cannot occur. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-[#0A1F44]/25 bg-[#E9EDF3] shadow-[0_24px_48px_-16px_rgba(6,18,43,0.4)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(/images/themes/sapphire-royale/ice-texture.jpg)` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-[#C0C0C8]/80"
          />
          <div className="relative z-10 flex w-full flex-col items-center px-5 py-12 text-center sm:px-10 sm:py-16">
            <p className="sr-font-display text-[10px] tracking-[0.34em] text-[#12294D] uppercase sm:text-xs">
              RSVP
            </p>
            <h3 className="sr-font-display mt-3 text-[clamp(1.35rem,5vw,1.9rem)] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#0A1F44]">
              Will You Join Us?
            </h3>

            <DecoDivider className="mt-4 h-5 w-28 sm:w-32" />

            <p className="sr-font-editorial mt-4 w-full max-w-[520px] text-[1rem] leading-[1.75] text-[#12294D]/85 sm:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy — we cannot wait to celebrate with you.
            </p>

            {replyBy && (
              <p className="sr-font-display mt-5 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#12294D] uppercase sm:text-xs sm:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-7 inline-flex max-w-full items-center gap-2 bg-[#0A1F44] px-5 py-3 sr-font-display text-[10px] tracking-[0.2em] text-[#F2F4F8] uppercase shadow-[0_10px_22px_-8px_rgba(10,31,68,0.6)] transition-colors duration-300 hover:bg-[#12294D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A1F44] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.26em]"
            >
              <Heart className="h-4 w-4 shrink-0 fill-[#F2F4F8]/20" />
              Kindly Respond
              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — Cover / Our Story / Wedding Details links + date line    */
/* ------------------------------------------------------------------ */

export function SapphireRoyaleFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#06122B] px-5 pt-12 pb-10 text-center text-[#F2F4F8] sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/sapphire-royale.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06122B]/30 via-transparent to-[#06122B]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="sr-font-script text-[2.2rem] leading-none font-normal text-[#FFFFFF] sm:text-[2.6rem]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="sr-font-display mt-3 text-[10px] tracking-[0.3em] text-[#C0C0C8] uppercase sm:text-xs">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="sr-font-editorial mt-2 text-sm text-[#D9D9DE]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#C0C0C8]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="sr-font-display text-[11px] tracking-[0.26em] text-[#F2F4F8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="sr-font-display text-[11px] tracking-[0.26em] text-[#F2F4F8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="sr-font-display text-[11px] tracking-[0.26em] text-[#F2F4F8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="sr-font-editorial mt-7 text-xs text-[#D9D9DE]/60 italic">
          Made with love — Sapphire Royale
        </p>
      </div>
    </footer>
  );
}
