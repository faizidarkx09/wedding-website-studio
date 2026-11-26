// Marble Luxe details + RSVP + footer — a minimal line-divided
// LIST for the details preview (no panels, no sleeves), a clean
// white RSVP card with a gold rule on a marble ground, and a
// minimal white footer. Only the data comes from the site (schedule,
// accommodations, travel + registry notes are the couple's editable
// DetailBlocks).
//
// CONTAINER QUERIES ONLY in this file: no viewport `sm:` anywhere.
// The editor's Mobile (390px) preview renders this inside a 390px
// div on a desktop viewport, so viewport queries would apply desktop
// geometry in a mobile-sized column (the Emerald RSVP Round 3 bug).
// Every responsive rule here is `@min-[40rem]:` on a `@container`
// parent (container >= 640px), which keeps the original 640px
// threshold measured on the container.
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
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { GoldDivider } from "./Decor";
import {
  DETAIL_IMAGE_URL,
  RSVP_MARBLE_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — framed envelope photo + line-divided list    */
/* ------------------------------------------------------------------ */

export function MarbleLuxeDetailsCard({
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
    <div className="@container relative overflow-hidden bg-white px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-3 text-[1.9rem] leading-[1.12] font-medium tracking-[0.02em] text-[#1F2937] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4B5563] @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been quietly planned for a day of white marble, gold light, and
          unforgettable moments.
        </motion.p>

        {/* Framed envelope photograph */}
        <motion.figure
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 w-full max-w-[460px] border border-[#B49A70]/50 bg-white p-2 shadow-[0_18px_36px_-16px_rgba(31,41,55,0.3)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DETAIL_IMAGE_URL}
            alt="White wedding envelope with a thin gold border on white marble"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="block aspect-[3/2] w-full object-cover"
          />
          <figcaption className="flex items-center justify-center gap-2 px-2 py-3 text-[10px] font-medium tracking-[0.28em] text-[#4B5563] uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
            {formatShortDate(site.weddingDate, site.timezone)}
            <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
          </figcaption>
        </motion.figure>

        {/* Minimal line-divided list */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full max-w-[620px] text-left"
        >
          {/* Venue row */}
          <div className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6">
            <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
              <MapPin className="h-3.5 w-3.5" />
              Venue
            </span>
            <span className="text-right">
              <span className="ml-font-display block text-[1.05rem] font-medium text-[#1F2937]">
                {site.content.venueName || "Our Wedding Venue"}
              </span>
              {site.content.venueAddress && (
                <span className="ml-font-editorial mt-0.5 block text-sm text-[#4B5563] italic">
                  {site.content.venueAddress}
                </span>
              )}
            </span>
          </div>

          {/* Schedule preview rows */}
          {schedulePreview.map((event, i) => (
            <div
              key={`${event.name}-${i}`}
              className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6"
            >
              <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                <Clock className="h-3.5 w-3.5" />
                {event.time}
              </span>
              <span className="text-right">
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
          {site.events.length > 3 && (
            <p className="ml-font-editorial border-t border-[#E5E0D8] py-4 text-center text-sm text-[#8C7355] italic">
              + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on
              the day
            </p>
          )}

          {/* Dress code row */}
          {dressCode && (
            <div className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6">
              <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                <Shirt className="h-3.5 w-3.5" />
                Dress Code
              </span>
              <span className="ml-font-display text-[1.05rem] font-medium text-[#1F2937] @min-[40rem]:text-right">
                {dressCode}
              </span>
            </div>
          )}

          {/* Accommodation rows */}
          {hotelList.map((hotel, i) => (
            <div
              key={`${hotel.name}-${i}`}
              className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6"
            >
              <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                <BedDouble className="h-3.5 w-3.5" />
                Stay
              </span>
              <span className="text-right">
                <span className="ml-font-display block text-[1.05rem] font-medium text-[#1F2937]">
                  {hotel.name}
                </span>
                {hotel.distance && (
                  <span className="ml-font-editorial mt-0.5 block text-sm text-[#4B5563] italic">
                    {hotel.distance}
                  </span>
                )}
              </span>
            </div>
          ))}

          {/* Travel / Registry notes */}
          {travelNotes.map((d, i) => (
            <div
              key={`travel-${i}`}
              className="flex flex-col gap-1 border-t border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6"
            >
              <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                <Plane className="h-3.5 w-3.5" />
                Travel
              </span>
              <span className="ml-font-editorial max-w-[420px] text-sm leading-relaxed text-[#4B5563] italic @min-[40rem]:text-right">
                {d.body}
              </span>
            </div>
          ))}
          {registryNotes.map((d, i) => (
            <div
              key={`registry-${i}`}
              className="flex flex-col gap-1 border-t border-b border-[#E5E0D8] py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:justify-between @min-[40rem]:gap-6"
            >
              <span className="ml-font-display flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-[#8C7355] uppercase">
                <Gift className="h-3.5 w-3.5" />
                Gifts
              </span>
              <span className="ml-font-editorial max-w-[420px] text-sm leading-relaxed text-[#4B5563] italic @min-[40rem]:text-right">
                {d.body}
              </span>
            </div>
          ))}
          {travelNotes.length === 0 && registryNotes.length === 0 && (
            <div aria-hidden="true" className="border-t border-[#E5E0D8]" />
          )}
        </motion.div>

        {/* View Full Wedding Details */}
        <button
          type="button"
          onClick={onOpenDetails}
          className="group mt-10 inline-flex items-center gap-2 bg-[#1F2937] px-6 py-3 ml-font-display text-[11px] font-medium tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(31,41,55,0.5)] transition-colors duration-300 hover:bg-[#374151] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937] @min-[40rem]:text-xs"
        >
          <CalendarDays className="h-4 w-4" />
          View Full Wedding Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — clean white card with a gold rule, on marble       */
/* ------------------------------------------------------------------ */

export function MarbleLuxeRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden px-4 py-20 @min-[40rem]:py-24">
      {/* Marble ground — the white card sits ON it, so every word of
          the RSVP copy is on plain white at every width. The marble
          texture is a backdrop only; no text ever sits on the photo,
          so there is nothing to measure against the image (the
          Emerald/Golden Hour RSVP trap does not apply here). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${RSVP_MARBLE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/30"
      />

      <div className="relative z-10 mx-auto max-w-[560px]">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-white px-6 py-12 text-center shadow-[0_24px_48px_-16px_rgba(31,41,55,0.35)] @min-[40rem]:px-12 @min-[40rem]:py-14"
        >
          {/* Gold rule across the top of the card */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#B49A70]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 border border-[#B49A70]/50"
          />

          <div className="relative z-10 flex flex-col items-center">
            <p className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="ml-font-display mt-3 text-[1.6rem] leading-[1.15] font-medium tracking-[0.02em] text-balance text-[#1F2937] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <GoldDivider className="mt-4 h-3 w-28 @min-[40rem]:mt-5 @min-[40rem]:w-32" />

            <p className="ml-font-editorial mt-4 max-w-[440px] text-[1rem] leading-[1.75] text-[#4B5563] @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can share in our
              joy.
            </p>

            {replyBy && (
              <p className="ml-font-display mt-5 text-[10px] leading-[1.9] font-medium tracking-[0.12em] text-balance text-[#8C7355] uppercase @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-6 inline-flex items-center gap-2 bg-[#1F2937] px-6 py-3.5 ml-font-display text-xs font-medium tracking-[0.26em] whitespace-nowrap text-white uppercase shadow-[0_10px_22px_-8px_rgba(31,41,55,0.5)] transition-colors duration-300 hover:bg-[#374151] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937] @min-[40rem]:mt-7"
            >
              <Heart className="h-4 w-4 fill-white/20" />
              Kindly Respond
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — minimal white footer with a hairline rule                */
/* ------------------------------------------------------------------ */

export function MarbleLuxeFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-[#E5E0D8] bg-white px-5 pt-12 pb-10 text-center text-[#1F2937]">
      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="ml-font-script text-[2.2rem] leading-none font-normal text-[#8C7355]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="ml-font-display mt-3 text-[10px] font-medium tracking-[0.3em] text-[#4B5563] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="ml-font-editorial mt-2 text-sm text-[#6B7280] italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="ml-font-display text-[11px] font-medium tracking-[0.26em] text-[#1F2937] uppercase transition-colors hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="ml-font-display text-[11px] font-medium tracking-[0.26em] text-[#1F2937] uppercase transition-colors hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="ml-font-display text-[11px] font-medium tracking-[0.26em] text-[#1F2937] uppercase transition-colors hover:text-[#8C7355] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="ml-font-editorial mt-7 text-xs text-[#6B7280] italic">
          Made with love — Marble Luxe
        </p>
      </div>
    </footer>
  );
}
