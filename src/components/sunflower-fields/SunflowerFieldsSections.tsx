// Sunflower Fields details + RSVP + footer — details as solid
// sunflower-yellow BLOCKS with dark-green type (not cream panels),
// the RSVP as a seed-packet card (not torn paper), and the footer.
// Only the data comes from the site (schedule, accommodations,
// travel + registry notes are the couple's editable DetailBlocks).
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
  Sprout,
  Sun,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SunflowerBloom, SunflowerDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  SEED_PACKET_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — sunflower-yellow blocks                       */
/* ------------------------------------------------------------------ */

export function SunflowerFieldsDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FFFBEB] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#166534] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14532D] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#14532D]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a day of sunshine, joy, and unforgettable
          moments among the sunflowers.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#EAB308]/80 @min-[40rem]:w-24" />
          <Sun className="h-4 w-4 text-[#166534]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#EAB308]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Yellow blocks */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Venue block — solid sunflower yellow */}
          <div className="relative overflow-hidden bg-[#FACC15] px-5 py-8 text-[#14532D] shadow-[0_24px_48px_-16px_rgba(20,83,45,0.45)] @min-[40rem]:px-8 @min-[40rem]:py-10">
            <SunflowerBloom
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 opacity-25"
            />
            <div className="relative z-10 flex flex-col items-center">
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[10px] tracking-[0.34em] text-[#14532D] uppercase @min-[40rem]:text-xs"
              >
                {formatShortDate(site.weddingDate, site.timezone)}
              </p>
              <h4
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-semibold text-[#14532D] @min-[40rem]:text-[1.75rem]"
              >
                {site.content.venueName || "Our Wedding Venue"}
              </h4>
              {site.content.venueAddress && (
                <p
                  style={{ fontFamily: FONT_EDITORIAL }}
                  className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#14532D]/85 italic @min-[40rem]:text-[0.95rem]"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#14532D]" />
                  {site.content.venueAddress}
                </p>
              )}

              <SunflowerDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

              {/* Schedule Preview */}
              {schedulePreview.length > 0 && (
                <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                  {schedulePreview.map((event, i) => (
                    <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#14532D]/40 bg-[#FFFBEB] text-[#14532D]">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p
                          style={{ fontFamily: FONT_DISPLAY }}
                          className="text-[11px] font-semibold tracking-[0.18em] text-[#14532D] uppercase @min-[40rem]:text-xs"
                        >
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p
                            style={{ fontFamily: FONT_EDITORIAL }}
                            className="mt-0.5 text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
                          >
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {site.events.length > 3 && (
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="pl-11 text-sm font-semibold text-[#14532D]/75 italic"
                    >
                      + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dress code — deep-green strip */}
          {dressCode && (
            <div className="mt-4 flex items-center justify-center gap-2.5 bg-[#14532D] px-4 py-3 text-[#FFFBEB]">
              <Shirt className="h-4 w-4 shrink-0 text-[#FACC15]" />
              <span
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[10px] tracking-[0.2em] uppercase @min-[40rem]:text-[11px]"
              >
                Dress Code: {dressCode}
              </span>
            </div>
          )}

          {/* Accommodations + travel + registry — cream blocks with
              yellow left borders */}
          {(hotelList.length > 0 || travelNotes.length > 0 || registryNotes.length > 0) && (
            <div className="mt-4 grid gap-4 text-left @min-[40rem]:grid-cols-2">
              {hotelList.map((hotel, i) => (
                <div
                  key={`${hotel.name}-${i}`}
                  className="border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EAB308]/70 bg-[#FFFBEB] text-[#14532D]">
                      <BedDouble className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p
                        style={{ fontFamily: FONT_DISPLAY }}
                        className="text-[11px] font-semibold tracking-[0.18em] text-[#14532D] uppercase @min-[40rem]:text-xs"
                      >
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p
                          style={{ fontFamily: FONT_EDITORIAL }}
                          className="mt-0.5 text-sm font-semibold text-[#14532D]/75 italic"
                        >
                          {hotel.distance}
                        </p>
                      )}
                      {hotel.note && (
                        <p
                          style={{ fontFamily: FONT_EDITORIAL }}
                          className="mt-1 text-sm leading-relaxed text-[#14532D]/80"
                        >
                          {hotel.note}
                        </p>
                      )}
                      {hotel.code && (
                        <p
                          style={{ fontFamily: FONT_DISPLAY }}
                          className="mt-1.5 text-[10px] tracking-[0.18em] text-[#166534] uppercase"
                        >
                          Booking Code: {hotel.code}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {travelNotes.map((d, i) => (
                <div
                  key={`travel-${i}`}
                  className="border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EAB308]/70 bg-[#FFFBEB] text-[#14532D]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
                    >
                      {d.body}
                    </p>
                  </div>
                </div>
              ))}
              {registryNotes.map((d, i) => (
                <div
                  key={`registry-${i}`}
                  className="border-l-4 border-[#FACC15] bg-[#FFFEF5] p-5 shadow-[0_12px_24px_-12px_rgba(20,83,45,0.35)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EAB308]/70 bg-[#FFFBEB] text-[#14532D]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p
                      style={{ fontFamily: FONT_EDITORIAL }}
                      className="text-sm leading-relaxed font-semibold text-[#14532D]/80 italic"
                    >
                      {d.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Full Wedding Details */}
          <button
            type="button"
            onClick={onOpenDetails}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group mt-8 inline-flex items-center gap-2 bg-[#14532D] px-6 py-3 text-[11px] tracking-[0.26em] text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] @min-[40rem]:text-xs"
          >
            <CalendarDays className="h-4 w-4" />
            View Full Wedding Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Sun + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#166534]/70">
            <Sun className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#166534]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — a seed-packet card. The packet is built in HTML    */
/* (cream paper, folded top flap, painted sunflower, dashed          */
/* perforation) so ALL of its text sits on the paper by              */
/* construction at every width — no photo measurement to get wrong.  */
/* The seed-packet photograph appears as a small framed polaroid     */
/* beside the packet on wide containers.                             */
/* ------------------------------------------------------------------ */

export function SunflowerFieldsRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFFBEB] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center"
        >
          {/* Seed-packet photograph — framed polaroid */}
          <figure className="w-[180px] shrink-0 rotate-[-3deg] bg-[#FFFEF5] p-2 pb-6 shadow-[0_16px_30px_-10px_rgba(20,83,45,0.5)] ring-1 ring-[#EAB308]/40 @min-[40rem]:mt-10 @min-[40rem]:w-[210px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SEED_PACKET_URL}
              alt="A cream seed packet with a painted sunflower"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-2 text-center text-[9px] tracking-[0.24em] text-[#14532D] uppercase"
            >
              Plant a seed of love
            </figcaption>
          </figure>

          {/* The seed packet itself */}
          <div className="relative w-full max-w-[480px] overflow-hidden bg-[#FFFEF5] shadow-[0_24px_48px_-16px_rgba(20,83,45,0.4)] ring-1 ring-[#EAB308]/50">
            {/* Folded top flap */}
            <div
              aria-hidden="true"
              className="relative h-10 bg-[#FDE68A]"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-10 h-px bg-[#EAB308]/60"
            />
            {/* Painted sunflower + label */}
            <div className="relative z-10 mx-auto flex flex-col items-center px-6 pt-5 pb-9 text-center @min-[40rem]:px-10 @min-[40rem]:pb-11">
              <SunflowerBloom className="h-20 w-20 @min-[40rem]:h-24 @min-[40rem]:w-24" />
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-3 flex items-center gap-1.5 text-[10px] tracking-[0.34em] text-[#166534] uppercase @min-[40rem]:text-xs"
              >
                <Sprout className="h-3.5 w-3.5" />
                RSVP · Sunflower Seeds
              </p>
              <h3
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-3 text-[1.25rem] leading-[1.15] font-semibold text-balance text-[#14532D] @min-[40rem]:text-[1.9rem]"
              >
                Will You Join Us?
              </h3>

              <SunflowerDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

              <p
                style={{ fontFamily: FONT_EDITORIAL }}
                className="mt-3 max-w-[420px] text-[1rem] leading-[1.75] font-semibold text-[#14532D]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]"
              >
                Your presence is the greatest gift. Please let us know if you can share in our
                joy — and take a seed home to grow something beautiful.
              </p>

              {replyBy && (
                <p
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#166534] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]"
                >
                  {replyBy}
                </p>
              )}

              <button
                type="button"
                onClick={onJumpToRsvp}
                style={{ fontFamily: FONT_DISPLAY }}
                className="group mt-4 inline-flex items-center gap-2 bg-[#14532D] px-7 py-3.5 text-[11px] tracking-[0.26em] whitespace-nowrap text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] @min-[40rem]:mt-7 @min-[40rem]:text-xs"
              >
                <Heart className="h-3.5 w-3.5 fill-[#FFFBEB]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
                Kindly Respond
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 @min-[40rem]:h-3.5 @min-[40rem]:w-3.5" />
              </button>

              {/* Dashed perforation + packet footer */}
              <div
                aria-hidden="true"
                className="mt-7 w-full border-t border-dashed border-[#166534]/50"
              />
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-3 text-[9px] tracking-[0.28em] text-[#166534]/80 uppercase"
              >
                Grown with love · Sunflower Fields
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — Cover / Our Story / Wedding Details links + date line    */
/* ------------------------------------------------------------------ */

export function SunflowerFieldsFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#14532D] px-5 pt-12 pb-10 text-center text-[#FFFBEB]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14532D]/40 via-transparent to-[#14532D]/75"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p
          style={{ fontFamily: FONT_SCRIPT }}
          className="text-[2.2rem] leading-none font-normal text-[#FFFEF5]"
        >
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[10px] tracking-[0.3em] text-[#FACC15] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-2 text-sm font-semibold text-[#FEF9C3]/80 italic"
        >
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#FACC15]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FACC15]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FACC15]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FACC15]"
          >
            Wedding Details
          </button>
        </nav>

        <p
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-7 text-xs font-semibold text-[#FEF9C3]/60 italic"
        >
          Made with love — Sunflower Fields
        </p>
      </div>
    </footer>
  );
}
