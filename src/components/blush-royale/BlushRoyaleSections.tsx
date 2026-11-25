// Blush Royale details + RSVP + footer. Details live in soft
// blush ROUNDED cards (never a parchment pocket sleeve, never
// polaroids); the RSVP intro sits on the blush watercolor card
// artwork with its text column constrained to the card's measured
// inner cream panel (see the geometry note below). Only the data
// comes from the site.
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
import { FloralDivider } from "./Decor";
import {
  DETAIL_IMAGE_URL,
  RSVP_CARD_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* DetailsCard — soft blush rounded cards + bouquet banner           */
/* ------------------------------------------------------------------ */

export function BlushRoyaleDetailsCard({
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
    <div className="relative overflow-hidden bg-[#FBF6F3] px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#5C323B] sm:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#5C323B]/85 sm:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of elegance, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B76E79]/80 sm:w-24" />
          <Sparkles className="h-4 w-4 text-[#B76E79]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B76E79]/80 sm:w-24" />
        </motion.div>

        {/* Main Details Card — soft blush rounded card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px] overflow-hidden rounded-[2rem] border border-[#EFC9CE]/70 bg-[#FFFDFB] shadow-[0_24px_48px_-16px_rgba(92,50,59,0.3)]"
        >
          {/* Blush bouquet banner */}
          <div className="relative h-44 overflow-hidden sm:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DETAIL_IMAGE_URL}
              alt="Blush rose bouquet with rose-gold ribbon"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FFFDFB] via-transparent to-transparent"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center px-5 pt-2 pb-8 sm:px-8 sm:pb-10">
            <p className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs">
              {formatShortDate(site.weddingDate, site.timezone)}
            </p>
            <h4 className="br-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#5C323B] sm:text-[1.75rem]">
              {site.content.venueName || "Our Wedding Venue"}
            </h4>
            {site.content.venueAddress && (
              <p className="br-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#5C323B]/80 italic sm:text-[0.95rem]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B76E79]" />
                {site.content.venueAddress}
              </p>
            )}

            <FloralDivider className="mt-5 h-9 w-28 sm:h-10 sm:w-32" />

            {/* Schedule Preview */}
            {schedulePreview.length > 0 && (
              <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                {schedulePreview.map((event, i) => (
                  <div
                    key={`${event.name}-${i}`}
                    className="flex items-start gap-3 rounded-2xl bg-[#F6DDE0]/50 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#FFFDFB] text-[#B76E79]">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="br-font-display text-[11px] tracking-[0.18em] text-[#5C323B] uppercase sm:text-xs">
                        {event.time} · {event.name}
                      </p>
                      {event.description && (
                        <p className="br-font-editorial mt-0.5 text-sm leading-relaxed text-[#5C323B]/75 italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {site.events.length > 3 && (
                  <p className="br-font-editorial pl-4 text-sm text-[#7A4A55]/80 italic">
                    + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                  </p>
                )}
              </div>
            )}

            {/* Dress Code */}
            {dressCode && (
              <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#B76E79]/50 bg-[#F6DDE0]/60 px-4 py-2">
                <Shirt className="h-4 w-4 shrink-0 text-[#B76E79]" />
                <span className="br-font-display text-[10px] tracking-[0.2em] text-[#5C323B] uppercase sm:text-[11px]">
                  Dress Code: {dressCode}
                </span>
              </div>
            )}

            {/* Accommodations Preview */}
            {hotelList.length > 0 && (
              <div className="mt-6 grid w-full max-w-[560px] gap-3 sm:grid-cols-2">
                {hotelList.map((hotel, i) => (
                  <div
                    key={`${hotel.name}-${i}`}
                    className="flex items-start gap-3 rounded-2xl border border-[#EFC9CE]/70 bg-[#F6DDE0]/40 px-4 py-3 text-left"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#FFFDFB] text-[#B76E79]">
                      <BedDouble className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="br-font-display text-[11px] tracking-[0.18em] text-[#5C323B] uppercase sm:text-xs">
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p className="br-font-editorial mt-0.5 text-sm text-[#5C323B]/75 italic">
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
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#F6DDE0]/60 text-[#B76E79]">
                  <Plane className="h-3.5 w-3.5" />
                </span>
                <p className="br-font-editorial text-sm leading-relaxed text-[#5C323B]/80 italic">
                  {d.body}
                </p>
              </div>
            ))}
            {registryNotes.map((d, i) => (
              <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#F6DDE0]/60 text-[#B76E79]">
                  <Gift className="h-3.5 w-3.5" />
                </span>
                <p className="br-font-editorial text-sm leading-relaxed text-[#5C323B]/80 italic">
                  {d.body}
                </p>
              </div>
            ))}

            {/* View Full Wedding Details */}
            <button
              type="button"
              onClick={onOpenDetails}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#B76E79] px-6 py-3 br-font-display text-[11px] tracking-[0.26em] text-[#FFFDFB] uppercase shadow-[0_10px_22px_-8px_rgba(183,110,121,0.6)] transition-colors duration-300 hover:bg-[#9E5B66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-xs"
            >
              <CalendarDays className="h-4 w-4" />
              View Full Wedding Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Heart accent row */}
          <div className="flex items-center justify-center gap-4 pb-6 text-[#B76E79]/70">
            <Heart className="h-4 w-4 fill-[#B76E79]/20" />
            <Sparkles className="h-4 w-4" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — blush watercolor card + RSVP jump                   */
/* ------------------------------------------------------------------ */

export function BlushRoyaleRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="relative overflow-hidden bg-[#FBF6F3] px-4 pt-4 pb-20 sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Blush Watercolor Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[1.5rem] shadow-[0_24px_48px_-16px_rgba(92,50,59,0.3)]"
        >
          {/* Blush watercolor card texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_CARD_URL})` }}
          />

          {/* RSVP CARD GEOMETRY (RB lesson, 2026-11-25): the card
              artwork's inner cream panel spans ~24–76% of the image
              width (eye-measured from the wash-frame edges; pixel
              profiling was confounded because the outer background
              is the same cream as the panel) and ~28–76% of its
              height. The text column is therefore constrained to
              w-[52%] centred, with vertical padding keeping the
              content inside the panel at every viewport — the
              heading / body / reply-by line sit ON the cream panel
              instead of spilling onto the blush wash frame. The
              frame itself is a light blush wash (unlike RB's dark
              burgundy), so even edge text would stay legible. */}
          <div className="relative z-10 mx-auto flex w-[52%] min-w-0 flex-col items-center py-12 text-center sm:py-16">
            <p className="br-font-display text-[10px] tracking-[0.34em] text-[#7A4A55] uppercase sm:text-xs">
              RSVP
            </p>
            <h3 className="br-font-display mt-3 text-[clamp(1.35rem,5vw,1.9rem)] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#5C323B]">
              Will You Join Us?
            </h3>

            <FloralDivider className="mt-4 h-9 w-28 sm:h-10 sm:w-32" />

            <p className="br-font-editorial mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#5C323B]/85 sm:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy — we cannot wait to celebrate with you.
            </p>

            {replyBy && (
              <p className="br-font-display mt-5 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#7A4A55] uppercase sm:text-xs sm:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#B76E79] px-5 py-3 br-font-display text-[10px] tracking-[0.2em] text-[#FFFDFB] uppercase shadow-[0_10px_22px_-8px_rgba(183,110,121,0.6)] transition-colors duration-300 hover:bg-[#9E5B66] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.26em]"
            >
              <Heart className="h-4 w-4 fill-[#FFFDFB]/20" />
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
/* Footer — Cover / Our Story / Wedding Details links + date line    */
/* ------------------------------------------------------------------ */

export function BlushRoyaleFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#EFC9CE] px-5 pt-12 pb-10 text-center text-[#5C323B] sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/blush-royale.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EFC9CE]/40 via-transparent to-[#E8B4B8]/50"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="br-font-script text-[2.2rem] leading-none font-normal text-[#B76E79] sm:text-[2.6rem]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="br-font-display mt-3 text-[10px] tracking-[0.3em] text-[#7A4A55] uppercase sm:text-xs">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="br-font-editorial mt-2 text-sm text-[#5C323B]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#B76E79]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="br-font-display text-[11px] tracking-[0.26em] text-[#5C323B]/90 uppercase transition-colors hover:text-[#B76E79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="br-font-display text-[11px] tracking-[0.26em] text-[#5C323B]/90 uppercase transition-colors hover:text-[#B76E79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="br-font-display text-[11px] tracking-[0.26em] text-[#5C323B]/90 uppercase transition-colors hover:text-[#B76E79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="br-font-editorial mt-7 text-xs text-[#5C323B]/60 italic">
          Made with love — Blush Royale
        </p>
      </div>
    </footer>
  );
}
