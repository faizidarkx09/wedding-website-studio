// Winter Frost details + RSVP + footer — frosted-glass details
// card over a frost backdrop, the ice-blue ticket RSVP section,
// and the footer. Only the data comes from the site (schedule,
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
//
// RSVP TICKET — the frost image is used ONLY as a decorative top
// strip with no text on it. Every word and the button sit on the
// ticket's white body, so the text can never drift off the paper at
// any width (320 / 390 / 430 / 768 / 1280 / 1440).
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
  Snowflake,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SnowflakeDivider } from "./Decor";
import {
  RSVP_FROST_URL,
  STORY_AISLE_URL,
  STORY_CHAPEL_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — frosted-glass panels over a frost backdrop   */
/* ------------------------------------------------------------------ */

export function WinterFrostDetailsCard({
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
    <div className="@container relative overflow-hidden px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      {/* Frost backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${RSVP_FROST_URL})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#EAF4FB]/70 via-[#EAF4FB]/40 to-[#EAF4FB]/80"
      />

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#12395B] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#12395B]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a day of falling snow, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#7FB3D9]/80 @min-[40rem]:w-24" />
          <Snowflake className="h-4 w-4 text-[#1B4A6B]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#7FB3D9]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Frosted-Glass Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Frosted glass: translucent white + backdrop blur over the
              frost backdrop, with an ice-blue frame. */}
          <div className="relative overflow-hidden bg-white/75 px-5 py-8 text-[#12395B] shadow-[0_24px_48px_-16px_rgba(11,37,64,0.45)] ring-1 ring-[#BDE0F5]/80 backdrop-blur-xl @min-[40rem]:px-8 @min-[40rem]:py-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-[#7FB3D9]/60"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[15px] border border-[#12395B]/25"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Frosted photo strip (chapel + aisle, tilted) */}
              <div className="relative mb-7 flex h-32 w-full items-center justify-center @min-[40rem]:mb-9 @min-[40rem]:h-40">
                <div className="absolute left-1/2 h-28 w-24 -translate-x-[calc(50%+64px)] -rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(11,37,64,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:-translate-x-[calc(50%+84px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={STORY_CHAPEL_URL}
                    alt="The couple laughing outside a snow-covered chapel"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-1/2 z-10 h-32 w-28 -translate-x-1/2 rotate-[2deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_16px_30px_-10px_rgba(11,37,64,0.55)] @min-[40rem]:h-40 @min-[40rem]:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={STORY_AISLE_URL}
                    alt="Winter wedding aisle with white roses and frosted greenery"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-1/2 h-28 w-24 translate-x-[calc(-50%+64px)] rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(11,37,64,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:translate-x-[calc(-50%+84px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={STORY_CHAPEL_URL}
                    alt="Snow-covered chapel in winter"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <p className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase @min-[40rem]:text-xs">
                {formatShortDate(site.weddingDate, site.timezone)}
              </p>
              <h4 className="wf-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#12395B] @min-[40rem]:text-[1.75rem]">
                {site.content.venueName || "Our Wedding Venue"}
              </h4>
              {site.content.venueAddress && (
                <p className="wf-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#12395B]/80 italic @min-[40rem]:text-[0.95rem]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1B4A6B]" />
                  {site.content.venueAddress}
                </p>
              )}

              <SnowflakeDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

              {/* Schedule Preview */}
              {schedulePreview.length > 0 && (
                <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                  {schedulePreview.map((event, i) => (
                    <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-[#EAF4FB] text-[#1B4A6B]">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="wf-font-display text-[11px] tracking-[0.18em] text-[#12395B] uppercase @min-[40rem]:text-xs">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p className="wf-font-editorial mt-0.5 text-sm leading-relaxed text-[#12395B]/75 italic">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {site.events.length > 3 && (
                    <p className="wf-font-editorial pl-11 text-sm text-[#1B4A6B]/80 italic">
                      {`+ ${site.events.length - 3} more moment${site.events.length - 3 === 1 ? "" : "s"} on the day`}
                    </p>
                  )}
                </div>
              )}

              {/* Dress Code */}
              {dressCode && (
                <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#7FB3D9]/60 bg-[#EAF4FB]/80 px-4 py-2">
                  <Shirt className="h-4 w-4 shrink-0 text-[#1B4A6B]" />
                  <span className="wf-font-display text-[10px] tracking-[0.2em] text-[#12395B] uppercase @min-[40rem]:text-[11px]">
                    Dress Code: {dressCode}
                  </span>
                </div>
              )}

              {/* Accommodations Preview */}
              {hotelList.length > 0 && (
                <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                  {hotelList.map((hotel, i) => (
                    <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-[#EAF4FB] text-[#1B4A6B]">
                        <BedDouble className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="wf-font-display text-[11px] tracking-[0.18em] text-[#12395B] uppercase @min-[40rem]:text-xs">
                          {hotel.name}
                        </p>
                        {hotel.distance && (
                          <p className="wf-font-editorial mt-0.5 text-sm text-[#12395B]/75 italic">
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
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-[#EAF4FB] text-[#1B4A6B]">
                    <Plane className="h-3.5 w-3.5" />
                  </span>
                  <p className="wf-font-editorial text-sm leading-relaxed text-[#12395B]/80 italic">
                    {d.body}
                  </p>
                </div>
              ))}
              {registryNotes.map((d, i) => (
                <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7FB3D9]/70 bg-[#EAF4FB] text-[#1B4A6B]">
                    <Gift className="h-3.5 w-3.5" />
                  </span>
                  <p className="wf-font-editorial text-sm leading-relaxed text-[#12395B]/80 italic">
                    {d.body}
                  </p>
                </div>
              ))}

              {/* View Full Wedding Details */}
              <button
                type="button"
                onClick={onOpenDetails}
                className="group mt-8 inline-flex items-center gap-2 bg-[#12395B] px-6 py-3 wf-font-display text-[11px] tracking-[0.26em] text-[#FDFEFF] uppercase shadow-[0_10px_22px_-8px_rgba(11,37,64,0.6)] transition-colors duration-300 hover:bg-[#1B4A6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B] @min-[40rem]:text-xs"
              >
                <CalendarDays className="h-4 w-4" />
                View Full Wedding Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Snowflake + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#1B4A6B]/70">
            <Snowflake className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#1B4A6B]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — ice-blue ticket card + RSVP jump                    */
/* ------------------------------------------------------------------ */

export function WinterFrostRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#EAF4FB] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Ice-Blue Ticket Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-white shadow-[0_24px_48px_-16px_rgba(11,37,64,0.4)] ring-1 ring-[#BDE0F5]"
        >
          {/* Decorative frost strip — image only, NO text on it */}
          <div
            aria-hidden="true"
            className="h-20 w-full bg-cover bg-center @min-[40rem]:h-24"
            style={{ backgroundImage: `url(${RSVP_FROST_URL})` }}
          />
          {/* Ticket perforation: dashed rule + side notches */}
          <div aria-hidden="true" className="relative">
            <div className="border-t-2 border-dashed border-[#7FB3D9]/70" />
            <span className="absolute top-0 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#EAF4FB] ring-1 ring-[#BDE0F5]" />
            <span className="absolute top-0 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#EAF4FB] ring-1 ring-[#BDE0F5]" />
          </div>

          {/* Ticket body — ALL text and the button sit on this white
              body, never on the image strip. */}
          <div className="relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-center px-6 pt-8 pb-10 text-center @min-[40rem]:px-10 @min-[40rem]:pt-10 @min-[40rem]:pb-12">
            <p className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="wf-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#12395B] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <SnowflakeDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="wf-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#12395B]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="wf-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#1B4A6B] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#12395B] px-3.5 py-2.5 wf-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FDFEFF] uppercase shadow-[0_10px_22px_-8px_rgba(11,37,64,0.6)] transition-colors duration-300 hover:bg-[#1B4A6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FDFEFF]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function WinterFrostFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#0B2540] px-5 pt-12 pb-10 text-center text-[#FDFEFF]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/winter-frost.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B2540]/30 via-transparent to-[#0B2540]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="wf-font-script text-[2.2rem] leading-none font-normal text-[#FFFFFF]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="wf-font-display mt-3 text-[10px] tracking-[0.3em] text-[#BDE0F5] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="wf-font-editorial mt-2 text-sm text-[#D6EBF9]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#7FB3D9]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="wf-font-display text-[11px] tracking-[0.26em] text-[#FDFEFF]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BDE0F5]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="wf-font-display text-[11px] tracking-[0.26em] text-[#FDFEFF]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BDE0F5]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="wf-font-display text-[11px] tracking-[0.26em] text-[#FDFEFF]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BDE0F5]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="wf-font-editorial mt-7 text-xs text-[#D6EBF9]/60 italic">
          Made with love — Winter Frost
        </p>
      </div>
    </footer>
  );
}
