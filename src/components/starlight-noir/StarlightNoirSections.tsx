// Starlight Noir details + RSVP + footer — the details LEDGER
// (gold-on-black ruled list, no panels), the gold-foil ticket RSVP
// section, and the footer. Only the data comes from the site
// (schedule, accommodations, travel + registry notes are the
// couple's editable DetailBlocks).
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
  Star,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  RSVP_TICKET_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — the gold-on-black LEDGER. Every detail is a  */
/* ruled ledger row (gold hairline above, time/label in gold Cinzel,  */
/* detail in cream editorial) — no cream panels, no sleeve.           */
/* ------------------------------------------------------------------ */

export function StarlightNoirDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#0A0A0A] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase @min-[40rem]:text-xs"
        >
          Wedding Details
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F5EFE0] @min-[40rem]:text-[2.3rem]"
        >
          The Night, In Detail
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#F5EFE0]/80 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a night beneath the stars, of joy and
          unforgettable moments.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/80 @min-[40rem]:w-24" />
          <Star className="h-4 w-4 fill-[#D4AF37]/60 text-[#D4AF37]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* The Ledger — ruled rows on black */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px] border-y border-[#D4AF37]/50 px-2 py-2 text-left @min-[40rem]:px-6"
        >
          {/* Venue row */}
          <div className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-5 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4">
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="w-36 shrink-0 text-[10px] tracking-[0.28em] text-[#F2D98C] uppercase @min-[40rem]:text-[11px]"
            >
              {formatShortDate(site.weddingDate, site.timezone)}
            </p>
            <div className="min-w-0">
              <h4
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[1.3rem] leading-[1.2] font-normal text-[#F5EFE0] @min-[40rem]:text-[1.55rem]"
              >
                {site.content.venueName || "Our Wedding Venue"}
              </h4>
              {site.content.venueAddress && (
                <p
                  style={{ fontFamily: FONT_EDITORIAL }}
                  className="mt-1.5 flex items-center gap-1.5 text-sm text-[#F5EFE0]/75 italic @min-[40rem]:text-[0.95rem]"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                  {site.content.venueAddress}
                </p>
              )}
            </div>
          </div>

          {/* Schedule rows */}
          {schedulePreview.map((event, i) => (
            <div
              key={`${event.name}-${i}`}
              className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4"
            >
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex w-36 shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase @min-[40rem]:text-xs"
              >
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {event.time}
              </p>
              <div className="min-w-0">
                <p
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="text-[11px] tracking-[0.18em] text-[#F5EFE0] uppercase @min-[40rem]:text-xs"
                >
                  {event.name}
                </p>
                {event.description && (
                  <p
                    style={{ fontFamily: FONT_EDITORIAL }}
                    className="mt-0.5 text-sm leading-relaxed text-[#F5EFE0]/70 italic"
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
              className="border-b border-[#D4AF37]/25 px-2 py-3 text-sm text-[#F2D98C]/80 italic @min-[40rem]:px-4 @min-[40rem]:pl-[11.5rem]"
            >
              + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on
              the night
            </p>
          )}

          {/* Dress code row */}
          {dressCode && (
            <div className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4">
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex w-36 shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase @min-[40rem]:text-xs"
              >
                <Shirt className="h-3.5 w-3.5 shrink-0" />
                Dress Code
              </p>
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="text-[11px] tracking-[0.18em] text-[#F5EFE0] uppercase @min-[40rem]:text-xs"
              >
                {dressCode}
              </p>
            </div>
          )}

          {/* Accommodations rows */}
          {hotelList.map((hotel, i) => (
            <div
              key={`${hotel.name}-${i}`}
              className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4"
            >
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex w-36 shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase @min-[40rem]:text-xs"
              >
                <BedDouble className="h-3.5 w-3.5 shrink-0" />
                Stay
              </p>
              <div className="min-w-0">
                <p
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="text-[11px] tracking-[0.18em] text-[#F5EFE0] uppercase @min-[40rem]:text-xs"
                >
                  {hotel.name}
                </p>
                {hotel.distance && (
                  <p
                    style={{ fontFamily: FONT_EDITORIAL }}
                    className="mt-0.5 text-sm text-[#F5EFE0]/70 italic"
                  >
                    {hotel.distance}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Travel / Registry notes */}
          {travelNotes.map((d, i) => (
            <div
              key={`travel-${i}`}
              className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4"
            >
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex w-36 shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase @min-[40rem]:text-xs"
              >
                <Plane className="h-3.5 w-3.5 shrink-0" />
                Travel
              </p>
              <p
                style={{ fontFamily: FONT_EDITORIAL }}
                className="text-sm leading-relaxed text-[#F5EFE0]/75 italic"
              >
                {d.body}
              </p>
            </div>
          ))}
          {registryNotes.map((d, i) => (
            <div
              key={`registry-${i}`}
              className="flex flex-col gap-1 border-b border-[#D4AF37]/25 px-2 py-4 last:border-b-0 @min-[40rem]:flex-row @min-[40rem]:items-baseline @min-[40rem]:gap-6 @min-[40rem]:px-4"
            >
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex w-36 shrink-0 items-center gap-2 text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase @min-[40rem]:text-xs"
              >
                <Gift className="h-3.5 w-3.5 shrink-0" />
                Gifts
              </p>
              <p
                style={{ fontFamily: FONT_EDITORIAL }}
                className="text-sm leading-relaxed text-[#F5EFE0]/75 italic"
              >
                {d.body}
              </p>
            </div>
          ))}

          {/* View Full Wedding Details */}
          <div className="flex justify-center px-2 py-6 @min-[40rem]:px-4">
            <button
              type="button"
              onClick={onOpenDetails}
              style={{ fontFamily: FONT_DISPLAY }}
              className="group inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3 text-[11px] tracking-[0.26em] text-[#0A0A0A] uppercase shadow-[0_10px_22px_-8px_rgba(212,175,55,0.5)] transition-colors duration-300 hover:bg-[#F2D98C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] @min-[40rem]:text-xs"
            >
              <CalendarDays className="h-4 w-4" />
              View Full Wedding Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Star accent row */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[#D4AF37]/70">
          <Star className="h-4 w-4 fill-[#D4AF37]/40" />
          <Heart className="h-4 w-4 fill-[#D4AF37]/30" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — the gold-foil ticket. The ticket is a content-sized */
/* black card: the gold-foil ticket image is its background (bg-     */
/* cover) under a dark overlay, with a CSS double gold border and    */
/* perforation notches at the sides. Because the card is sized by    */
/* its content — never by the image's aspect — the text column is    */
/* ALWAYS inside the ticket at every width (320/390/430/768/1280).   */
/* The image is decorative chrome: at mobile widths bg-cover crops  */
/* its sides, but the card's own gold border still frames the text.  */
/* Container queries throughout (@container on the frame's parent).  */
/* ------------------------------------------------------------------ */

export function StarlightNoirRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#0A0A0A] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Gold-Foil Ticket */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-[#D4AF37]/80 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.8)]"
        >
          {/* Ticket image background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_TICKET_URL})` }}
          />
          {/* Dark overlay so gold type stays high-contrast on the ticket */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#0A0A0A]/72" />

          {/* CSS double gold border — the ticket's true edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 z-20 border border-[#D4AF37]/70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[15px] z-20 border border-[#D4AF37]/25"
          />

          {/* Perforation notches — ticket punches at mid-height */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-0 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A0A0A] ring-1 ring-[#D4AF37]/60"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-0 z-20 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A0A0A] ring-1 ring-[#D4AF37]/60"
          />

          {/* Text column — inside the ticket, always on black */}
          <div className="relative z-10 mx-auto flex w-full max-w-[520px] flex-col items-center px-8 py-12 text-center @min-[40rem]:px-10 @min-[40rem]:py-16">
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase @min-[40rem]:text-xs"
            >
              RSVP
            </p>
            <h3
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-3 text-[1.5rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#F5EFE0] @min-[40rem]:text-[1.9rem]"
            >
              Will You Join Us?
            </h3>

            <ConstellationDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#F5EFE0]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]"
            >
              Your presence is the greatest gift. Please let us know if you can share in our
              joy beneath the stars.
            </p>

            {replyBy && (
              <p
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#F2D98C] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]"
              >
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              style={{ fontFamily: FONT_DISPLAY }}
              className="group mt-5 inline-flex items-center gap-2 bg-[#D4AF37] px-6 py-3 text-[11px] tracking-[0.2em] whitespace-nowrap text-[#0A0A0A] uppercase shadow-[0_10px_22px_-8px_rgba(212,175,55,0.5)] transition-colors duration-300 hover:bg-[#F2D98C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#0A0A0A]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
              Kindly Respond
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 @min-[40rem]:h-3.5 @min-[40rem]:w-3.5" />
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

export function StarlightNoirFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#050505] px-5 pt-12 pb-10 text-center text-[#F5EFE0]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(/images/themes/starlight-noir.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/80"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p
          style={{ fontFamily: FONT_SCRIPT }}
          className="text-[2.2rem] leading-none font-normal text-[#D4AF37]"
        >
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[10px] tracking-[0.3em] text-[#F2D98C] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-2 text-sm text-[#F5EFE0]/75 italic"
        >
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[11px] tracking-[0.26em] text-[#F5EFE0]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-[11px] tracking-[0.26em] text-[#F5EFE0]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            style={{ fontFamily: FONT_DISPLAY }}
            className="text-[11px] tracking-[0.26em] text-[#F5EFE0]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Wedding Details
          </button>
        </nav>

        <p
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-7 text-xs text-[#F5EFE0]/60 italic"
        >
          Made with love — Starlight Noir
        </p>
      </div>
    </footer>
  );
}
