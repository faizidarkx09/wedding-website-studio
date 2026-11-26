// Rustic Charm details + RSVP + footer — chalkboard details card,
// the burlap-tag RSVP section, and the footer. Only the data comes
// from the site (schedule, accommodations, travel + registry notes
// are the couple's editable DetailBlocks).
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
  Leaf,
  MapPin,
  Plane,
  Shirt,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ChalkDivider, TwineDivider } from "./Decor";
import {
  BURLAP_TAG_RSVP_URL,
  COVER_IMAGE_URL,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — chalkboard preview card                       */
/* ------------------------------------------------------------------ */

export function RusticCharmDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FEF3C7] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display text-[10px] tracking-[0.34em] text-[#92400E] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#451A03] @min-[40rem]:text-[2.3rem]"
        >
          Written on the Board
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#451A03]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of barn light, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#78350F]/80 @min-[40rem]:w-24" />
          <Leaf className="h-4 w-4 text-[#92400E]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#78350F]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details Card — the chalkboard */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Wooden frame + chalkboard */}
          <div
            className="relative overflow-hidden rounded-[4px] border-[6px] border-[#78350F] bg-[#232B1E] px-4 pt-8 pb-6 text-[#FEF3C7] shadow-[0_24px_48px_-16px_rgba(69,26,3,0.45)] @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 80% at 50% 40%, rgba(254,243,199,0.06) 0%, transparent 70%)",
            }}
          >
            <div className="relative z-10 flex flex-col items-center px-2 py-2 @min-[40rem]:px-4 @min-[40rem]:py-2">
              {/* Small pegged-photo row (tilted) */}
              <div className="relative mb-7 flex h-32 w-full items-center justify-center @min-[40rem]:mb-9 @min-[40rem]:h-40">
                <div className="absolute left-1/2 h-28 w-24 -translate-x-[calc(50%+64px)] -rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(45,26,3,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:-translate-x-[calc(50%+84px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO_HANDS_URL}
                    alt="Joined hands with wedding rings"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-1/2 z-10 h-32 w-28 -translate-x-1/2 rotate-[2deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_16px_30px_-10px_rgba(45,26,3,0.55)] @min-[40rem]:h-40 @min-[40rem]:w-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO_SUNSET_URL}
                    alt="Golden-hour sunset over the barn"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-1/2 h-28 w-24 translate-x-[calc(-50%+64px)] rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(45,26,3,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:translate-x-[calc(-50%+84px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PHOTO_VEIL_URL}
                    alt="Bride's veil in golden light"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <p className="rc-font-display text-[10px] tracking-[0.34em] text-[#D9F99D] uppercase @min-[40rem]:text-xs">
                {formatShortDate(site.weddingDate, site.timezone)}
              </p>
              <h4 className="rc-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#FEF3C7] @min-[40rem]:text-[1.75rem]">
                {site.content.venueName || "Our Wedding Venue"}
              </h4>
              {site.content.venueAddress && (
                <p className="rc-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#FEF3C7]/80 italic @min-[40rem]:text-[0.95rem]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D9F99D]" />
                  {site.content.venueAddress}
                </p>
              )}

              <ChalkDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

              {/* Schedule Preview */}
              {schedulePreview.length > 0 && (
                <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                  {schedulePreview.map((event, i) => (
                    <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FEF3C7]/60 bg-[#FEF3C7]/10 text-[#D9F99D]">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="rc-font-display text-[11px] tracking-[0.18em] text-[#FEF3C7] uppercase @min-[40rem]:text-xs">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p className="rc-font-editorial mt-0.5 text-sm leading-relaxed text-[#FEF3C7]/75 italic">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {site.events.length > 3 && (
                    <p className="rc-font-editorial pl-11 text-sm text-[#D9F99D]/80 italic">
                      + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                    </p>
                  )}
                </div>
              )}

              {/* Dress Code */}
              {dressCode && (
                <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#FEF3C7]/50 bg-[#FEF3C7]/10 px-4 py-2">
                  <Shirt className="h-4 w-4 shrink-0 text-[#D9F99D]" />
                  <span className="rc-font-display text-[10px] tracking-[0.2em] text-[#FEF3C7] uppercase @min-[40rem]:text-[11px]">
                    Dress Code: {dressCode}
                  </span>
                </div>
              )}

              {/* Accommodations Preview */}
              {hotelList.length > 0 && (
                <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                  {hotelList.map((hotel, i) => (
                    <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FEF3C7]/60 bg-[#FEF3C7]/10 text-[#D9F99D]">
                        <BedDouble className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="rc-font-display text-[11px] tracking-[0.18em] text-[#FEF3C7] uppercase @min-[40rem]:text-xs">
                          {hotel.name}
                        </p>
                        {hotel.distance && (
                          <p className="rc-font-editorial mt-0.5 text-sm text-[#FEF3C7]/75 italic">
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
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FEF3C7]/60 bg-[#FEF3C7]/10 text-[#D9F99D]">
                    <Plane className="h-3.5 w-3.5" />
                  </span>
                  <p className="rc-font-editorial text-sm leading-relaxed text-[#FEF3C7]/80 italic">
                    {d.body}
                  </p>
                </div>
              ))}
              {registryNotes.map((d, i) => (
                <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FEF3C7]/60 bg-[#FEF3C7]/10 text-[#D9F99D]">
                    <Gift className="h-3.5 w-3.5" />
                  </span>
                  <p className="rc-font-editorial text-sm leading-relaxed text-[#FEF3C7]/80 italic">
                    {d.body}
                  </p>
                </div>
              ))}

              {/* View Full Wedding Details */}
              <button
                type="button"
                onClick={onOpenDetails}
                className="group mt-8 inline-flex items-center gap-2 bg-[#FEF3C7] px-6 py-3 rc-font-display text-[11px] tracking-[0.26em] text-[#232B1E] uppercase shadow-[0_10px_22px_-8px_rgba(45,26,3,0.6)] transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FEF3C7] @min-[40rem]:text-xs"
              >
                <CalendarDays className="h-4 w-4" />
                View Full Wedding Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Leaf + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#92400E]/70">
            <Leaf className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#92400E]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — burlap tag + RSVP jump                              */
/* ------------------------------------------------------------------ */

export function RusticCharmRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FEF3C7] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[520px]">
        {/* Burlap Tag Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(69,26,3,0.4)]"
        >
          {/* Burlap tag texture — aspect-[3/4] crop of the 1920x1280
              master: the tag is portrait inside the landscape frame,
              so the 3:4 crop keeps the whole tag (x 20–80% of the
              frame, y 20–92%) and the twine coil at the top. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BURLAP_TAG_RSVP_URL})` }}
          />

          {/* Text column sits ON the burlap tag. The tag is
              eye-measured from rustic-charm-rsvp.jpg (1920x1280):
              the tag spans x 35%-65% and y 20%-92% of the image.
              In the aspect-[3/4] cover crop the tag maps to x
              20%-80% and y 20%-92% of the frame, so the column
              width 54% (x 23%-77%) sits inside the tag
              horizontally. Vertically the padding is sized from
              the 20%/92% bounds: padding-top is a % of the frame
              WIDTH (CSS rule), and the frame height is 1.333x its
              width, so pt-[27%] ≈ 36% of the height — just below
              the tag's pointed top and its twine hole. Content is
              kept short (eyebrow, two-line title, divider, short
              copy, reply-by, button) so it ends above the tag's
              bottom edge (~92% of height) at 390px and desktop;
              at 320px the type tightens via @max-[22rem]:.
              These are ESTIMATES from the image measurement, not
              live-measured margins — the coordinator must
              live-verify at 390px / 320px / desktop before calling
              this done (the Emerald RSVP needed three live rounds
              for exactly this).
              Container queries throughout (@container on the
              frame's parent, `@min-[40rem]:` = container >=
              640px): the editor Mobile preview is a 390px div on
              a desktop viewport, so viewport `sm:` would apply
              desktop padding in a mobile column and push the
              button off the tag. DO NOT "simplify" to `sm:`. */}
          <div className="relative z-10 mx-auto flex aspect-[3/4] w-full flex-col items-center justify-start pt-[27%] pb-[9%] text-center @min-[40rem]:pt-[24%] @min-[40rem]:pb-[8%]">
            <div className="flex w-[54%] min-w-0 flex-col items-center">
              <p className="rc-font-display text-[10px] tracking-[0.34em] text-[#451A03] uppercase @min-[40rem]:text-xs @max-[22rem]:text-[9px]">
                RSVP
              </p>
              <h3 className="rc-font-display mt-2 text-[1.15rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#451A03] @min-[40rem]:mt-3 @min-[40rem]:text-[1.9rem] @max-[22rem]:text-[1.05rem]">
                Will You Join Us?
              </h3>

              <TwineDivider className="mt-2 h-6 w-24 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32 @max-[22rem]:mt-1.5 @max-[22rem]:h-5" />

              <p className="rc-font-editorial mt-2 max-w-[520px] text-[0.95rem] leading-[1.6] text-[#451A03]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem] @max-[22rem]:text-[0.85rem] @max-[22rem]:leading-[1.5]">
                Your presence is the greatest gift. Please let us know if you can
                share in our joy.
              </p>

              {replyBy && (
                <p className="rc-font-display mt-3 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#92400E] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em] @max-[22rem]:mt-2 @max-[22rem]:text-[9px]">
                  {replyBy}
                </p>
              )}

              <button
                type="button"
                onClick={onJumpToRsvp}
                className="group mt-3 inline-flex items-center gap-2 bg-[#451A03] px-3.5 py-2.5 rc-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FEF3C7] uppercase shadow-[0_10px_22px_-8px_rgba(69,26,3,0.6)] transition-colors duration-300 hover:bg-[#78350F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em] @max-[22rem]:mt-2"
              >
                <Heart className="h-3.5 w-3.5 fill-[#FEF3C7]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
                Kindly Respond
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 @min-[40rem]:h-3.5 @min-[40rem]:w-3.5" />
              </button>
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

export function RusticCharmFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#2D1F14] px-5 pt-12 pb-10 text-center text-[#FEF3C7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2D1F14]/30 via-transparent to-[#2D1F14]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="rc-font-script text-[2.2rem] leading-none font-normal text-[#FFFDF9]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="rc-font-display mt-3 text-[10px] tracking-[0.3em] text-[#D9F99D] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="rc-font-editorial mt-2 text-sm text-[#FEF3C7]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#A16207]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="rc-font-display text-[11px] tracking-[0.26em] text-[#FEF3C7]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9F99D]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="rc-font-display text-[11px] tracking-[0.26em] text-[#FEF3C7]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9F99D]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="rc-font-display text-[11px] tracking-[0.26em] text-[#FEF3C7]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9F99D]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="rc-font-editorial mt-7 text-xs text-[#FEF3C7]/60 italic">
          Made with love — Rustic Charm
        </p>
      </div>
    </footer>
  );
}
