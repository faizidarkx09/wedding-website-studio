// Coral Sunset details + RSVP + footer — details preview as coral
// rounded tiles, the sunset-postcard RSVP section, and the footer.
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
  Sun,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SunsetDivider } from "./Decor";
import {
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  RSVP_POSTCARD_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — coral rounded tiles                          */
/* ------------------------------------------------------------------ */

export function CoralSunsetDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FFF6EE] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display text-[10px] tracking-[0.34em] text-[#C94A2E] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3D1F2B] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3D1F2B]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of coral light, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#E85D3D]/80 @min-[40rem]:w-24" />
          <Sun className="h-4 w-4 text-[#C94A2E]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#E85D3D]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Rounded tiles — 2-col grid on wide containers */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="grid w-full max-w-[820px] gap-4 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-5"
        >
          {/* Schedule tile — deep plum */}
          <div className="rounded-[24px] bg-[#2E1420] px-6 py-8 text-left text-[#FFF6EE] shadow-[0_18px_36px_-14px_rgba(46,20,32,0.55)] @min-[40rem]:px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FF7F50]/70 bg-[#3D1F2B] text-[#FFDAB9]">
              <CalendarDays className="h-4.5 w-4.5" />
            </span>
            <p className="cs-font-display mt-4 text-[10px] tracking-[0.34em] text-[#FF7F50] uppercase @min-[40rem]:text-xs">
              {formatShortDate(site.weddingDate, site.timezone)}
            </p>
            <h4 className="cs-font-display mt-2 text-[1.45rem] leading-[1.2] font-normal text-[#FFF6EE] @min-[40rem]:text-[1.6rem]">
              {site.content.venueName || "Our Wedding Venue"}
            </h4>
            {site.content.venueAddress && (
              <p className="cs-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#FFDAB9]/85 italic">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FF7F50]" />
                {site.content.venueAddress}
              </p>
            )}
            {schedulePreview.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-[#FF7F50]/25 pt-5">
                {schedulePreview.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FF7F50]/70 bg-[#3D1F2B] text-[#FFDAB9]">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="cs-font-display text-[11px] tracking-[0.18em] text-[#FFF6EE] uppercase @min-[40rem]:text-xs">
                        {event.time} · {event.name}
                      </p>
                      {event.description && (
                        <p className="cs-font-editorial mt-0.5 text-sm leading-relaxed text-[#FFDAB9]/80 italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {site.events.length > 3 && (
                  <p className="cs-font-editorial pl-11 text-sm text-[#FF7F50]/90 italic">
                    + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Photo tile — sunset trio */}
          <div className="relative overflow-hidden rounded-[24px] shadow-[0_18px_36px_-14px_rgba(46,20,32,0.5)]">
            <div className="grid h-full grid-cols-3">
              {[PHOTO_HANDS_URL, PHOTO_SUNSET_URL, PHOTO_VEIL_URL].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === 0 ? "Joined hands with wedding rings" : i === 1 ? "Coral sunset over the venue" : "Bride's veil in sunset light"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full min-h-56 w-full object-cover"
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1420]/55 via-transparent to-transparent"
            />
            <p className="absolute inset-x-0 bottom-0 px-4 py-4 text-center cs-font-display text-[11px] tracking-[0.28em] text-[#FFF6EE] uppercase drop-shadow-[0_2px_4px_rgba(46,20,32,0.8)]">
              As the Sun Sets
            </p>
          </div>

          {/* Dress code tile — peach */}
          {dressCode && (
            <div className="rounded-[24px] bg-[#FFDAB9] px-6 py-7 text-left text-[#3D1F2B] shadow-[0_18px_36px_-14px_rgba(46,20,32,0.35)] @min-[40rem]:px-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C94A2E]/50 bg-[#FFF6EE] text-[#C94A2E]">
                <Shirt className="h-4.5 w-4.5" />
              </span>
              <h4 className="cs-font-display mt-4 text-[1.25rem] leading-none font-normal tracking-[0.04em]">
                Dress Code
              </h4>
              <p className="cs-font-display mt-2 text-[12px] tracking-[0.22em] uppercase">
                {dressCode}
              </p>
              <p className="cs-font-editorial mt-2 text-sm leading-relaxed text-[#3D1F2B]/80 italic">
                We kindly ask our guests to dress in their finest — formal attire in
                warm, sunset tones is warmly welcomed.
              </p>
            </div>
          )}

          {/* Stays + travel tile — cream */}
          {(hotelList.length > 0 || travelNotes.length > 0) && (
            <div className="rounded-[24px] bg-[#FFFBF5] px-6 py-7 text-left text-[#3D1F2B] shadow-[0_18px_36px_-14px_rgba(46,20,32,0.35)] ring-1 ring-[#E85D3D]/30 @min-[40rem]:px-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E85D3D]/60 bg-[#FFF6EE] text-[#C94A2E]">
                <BedDouble className="h-4.5 w-4.5" />
              </span>
              <h4 className="cs-font-display mt-4 text-[1.25rem] leading-none font-normal tracking-[0.04em]">
                Where to Stay
              </h4>
              {hotelList.map((hotel, i) => (
                <div key={`${hotel.name}-${i}`} className="mt-3">
                  <p className="cs-font-display text-[12px] tracking-[0.14em] text-[#3D1F2B] uppercase">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="cs-font-editorial mt-0.5 text-sm text-[#3D1F2B]/75 italic">
                      {hotel.distance}
                    </p>
                  )}
                </div>
              ))}
              {travelNotes.map((d, i) => (
                <div key={`travel-${i}`} className="mt-4 flex items-start gap-3 border-t border-[#E85D3D]/25 pt-4">
                  <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#C94A2E]" />
                  <p className="cs-font-editorial text-sm leading-relaxed text-[#3D1F2B]/80 italic">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Registry tile — coral */}
          {registryNotes.length > 0 && (
            <div className="rounded-[24px] bg-[#FF7F50] px-6 py-7 text-left text-[#2E1420] shadow-[0_18px_36px_-14px_rgba(46,20,32,0.4)] @min-[40rem]:col-span-2 @min-[40rem]:px-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFF6EE]/60 bg-[#E85D3D] text-[#FFF6EE]">
                <Gift className="h-4.5 w-4.5" />
              </span>
              <h4 className="cs-font-display mt-4 text-[1.25rem] leading-none font-normal tracking-[0.04em]">
                Gifts &amp; Registry
              </h4>
              {registryNotes.map((d, i) => (
                <p key={`registry-${i}`} className="cs-font-editorial mt-2 max-w-[520px] text-[1rem] leading-[1.75] text-[#2E1420]/90 italic">
                  {d.body}
                </p>
              ))}
            </div>
          )}
        </motion.div>

        {/* View Full Wedding Details */}
        <motion.button
          type="button"
          onClick={onOpenDetails}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#2E1420] px-6 py-3.5 cs-font-display text-[11px] tracking-[0.26em] text-[#FFF6EE] uppercase shadow-[0_10px_22px_-8px_rgba(46,20,32,0.6)] transition-colors duration-300 hover:bg-[#3D1F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1420] @min-[40rem]:text-xs"
        >
          <CalendarDays className="h-4 w-4" />
          View Full Wedding Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>

        {/* Sun + Heart accent row */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[#C94A2E]/70">
          <Sun className="h-4 w-4" />
          <Heart className="h-4 w-4 fill-[#C94A2E]/30" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — sunset postcard + RSVP jump                        */
/* ------------------------------------------------------------------ */

export function CoralSunsetRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFF6EE] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Sunset Postcard Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[10px] shadow-[0_24px_48px_-16px_rgba(46,20,32,0.4)]"
        >
          {/* Postcard artwork */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_POSTCARD_URL})` }}
          />

          {/* Text column sits ON the cream panel. The panel is
              eye-measured from rsvp-postcard.jpg (1200x800): the
              smooth cream panel spans x 13%-87% and y 20%-83% of
              the image (sunset watercolour border all round). The
              frame is bg-cover, so the cream maps to the same
              fractions of the frame whenever the frame is
              height-driven (mobile + editor preview), and to the
              image's scaled height when width-driven (desktop).
              Column width 62% (x 19%-81%) sits well inside the
              cream horizontally. Vertically the padding is sized
              from the 20%/83% bounds: mobile pt-[9.5rem] (152px) /
              pb-36 (144px), wide-container pt-36 (144px) /
              pb-32 (128px). Estimated margins (content height
              ~430px mobile, ~450px wide): eyebrow top ~+6px below
              the cream's top edge on mobile, button bottom ~+18px
              above the cream's bottom edge on mobile. These are
              ESTIMATES from the image measurement, not
              live-measured margins — the coordinator must
              live-verify at 390px / 320px / desktop before calling
              this done (the Emerald RSVP needed three live rounds
              for exactly this).
              Container queries throughout (@container on the
              frame's parent, `@min-[40rem]:` = container >=
              640px): the editor Mobile preview is a 390px div on
              a desktop viewport, so viewport `sm:` would apply
              desktop padding in a mobile column and push the
              button off the paper. DO NOT "simplify" to `sm:`. */}
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-[9.5rem] pb-36 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-36 @min-[40rem]:pb-32">
            <p className="cs-font-display text-[10px] tracking-[0.34em] text-[#C94A2E] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="cs-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#3D1F2B] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <SunsetDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="cs-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#3D1F2B]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="cs-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#C94A2E] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-[#2E1420] px-3.5 py-2.5 cs-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FFF6EE] uppercase shadow-[0_10px_22px_-8px_rgba(46,20,32,0.6)] transition-colors duration-300 hover:bg-[#3D1F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1420] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FFF6EE]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function CoralSunsetFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#2E1420] px-5 pt-12 pb-10 text-center text-[#FFF6EE]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/coral-sunset.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2E1420]/30 via-transparent to-[#2E1420]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="cs-font-script text-[2.2rem] leading-none font-normal text-[#FFF6EE]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="cs-font-display mt-3 text-[10px] tracking-[0.3em] text-[#FF7F50] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="cs-font-editorial mt-2 text-sm text-[#FFDAB9]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#E85D3D]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="cs-font-display text-[11px] tracking-[0.26em] text-[#FFF6EE]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7F50]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="cs-font-display text-[11px] tracking-[0.26em] text-[#FFF6EE]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7F50]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="cs-font-display text-[11px] tracking-[0.26em] text-[#FFF6EE]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF7F50]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="cs-font-editorial mt-7 text-xs text-[#FFDAB9]/60 italic">
          Made with love — Coral Sunset
        </p>
      </div>
    </footer>
  );
}
