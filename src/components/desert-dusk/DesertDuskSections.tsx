// Desert Dusk details + RSVP + footer — oasis arch cards in a
// terracotta sleeve, the sand-toned postcard RSVP section, and the
// dusk footer. Only the data comes from the site (schedule,
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
  Moon,
  Plane,
  Shirt,
  Sun,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DuneDivider } from "./Decor";
import {
  DETAIL_IMAGE_URL,
  RSVP_POSTCARD_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — terracotta sleeve + oasis arch cards         */
/* ------------------------------------------------------------------ */

export function DesertDuskDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FFF8EC] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3A2A20] @min-[40rem]:text-[2.3rem]"
        >
          An Oasis Awaits You
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3A2A20]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of desert warmth, joy, and
          unforgettable moments beneath the stars.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C2703D]/80 @min-[40rem]:w-24" />
          <Sun className="h-4 w-4 text-[#8A4A22]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C2703D]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Terracotta Sleeve */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#D9A05B] via-[#C2703D] to-[#8A4A22] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(58,42,32,0.45)] @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8">
            {/* Sand Detail Card */}
            <div className="relative z-10 overflow-hidden bg-[#FFFDF6] px-5 py-8 text-[#3A2A20] shadow-[0_18px_36px_-12px_rgba(58,42,32,0.55)] @min-[40rem]:px-8 @min-[40rem]:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#C2703D]/60"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-[#6B3A5C]/25"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Oasis arch photo — the envelope artwork in an arch frame */}
                <div className="relative mb-7 h-40 w-32 overflow-hidden rounded-t-full bg-[#F5E6D3] shadow-[0_16px_30px_-10px_rgba(58,42,32,0.55)] ring-2 ring-[#C2703D]/50 @min-[40rem]:mb-9 @min-[40rem]:h-48 @min-[40rem]:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DETAIL_IMAGE_URL}
                    alt="Terracotta wedding envelope on desert sand"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="dd-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#3A2A20] @min-[40rem]:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="dd-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#3A2A20]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8A4A22]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <DuneDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

                {/* Schedule Preview */}
                {schedulePreview.length > 0 && (
                  <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C2703D]/70 bg-[#FFF8EC] text-[#8A4A22]">
                          <Clock className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="dd-font-display text-[11px] tracking-[0.18em] text-[#3A2A20] uppercase @min-[40rem]:text-xs">
                            {event.time} · {event.name}
                          </p>
                          {event.description && (
                            <p className="dd-font-editorial mt-0.5 text-sm leading-relaxed text-[#3A2A20]/75 italic">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="dd-font-editorial pl-11 text-sm text-[#8A4A22]/80 italic">
                        + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                      </p>
                    )}
                  </div>
                )}

                {/* Dress Code */}
                {dressCode && (
                  <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#C2703D]/60 bg-[#FFF8EC]/80 px-4 py-2">
                    <Shirt className="h-4 w-4 shrink-0 text-[#8A4A22]" />
                    <span className="dd-font-display text-[10px] tracking-[0.2em] text-[#3A2A20] uppercase @min-[40rem]:text-[11px]">
                      Dress Code: {dressCode}
                    </span>
                  </div>
                )}

                {/* Accommodations — mini oasis arch cards */}
                {hotelList.length > 0 && (
                  <div className="mt-6 grid w-full max-w-[520px] gap-4 @min-[40rem]:grid-cols-2">
                    {hotelList.map((hotel, i) => (
                      <div
                        key={`${hotel.name}-${i}`}
                        className="rounded-t-full border border-[#C2703D]/50 bg-[#FFF8EC]/80 px-4 pt-7 pb-4 text-center"
                      >
                        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#C2703D]/70 bg-[#FFFDF6] text-[#8A4A22]">
                          <BedDouble className="h-4 w-4" />
                        </span>
                        <p className="dd-font-display mt-2.5 text-[11px] tracking-[0.18em] text-[#3A2A20] uppercase @min-[40rem]:text-xs">
                          {hotel.name}
                        </p>
                        {hotel.distance && (
                          <p className="dd-font-editorial mt-1 text-sm text-[#3A2A20]/75 italic">
                            {hotel.distance}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Travel / Registry notes */}
                {travelNotes.map((d, i) => (
                  <div key={`travel-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C2703D]/70 bg-[#FFF8EC] text-[#8A4A22]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="dd-font-editorial text-sm leading-relaxed text-[#3A2A20]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C2703D]/70 bg-[#FFF8EC] text-[#8A4A22]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="dd-font-editorial text-sm leading-relaxed text-[#3A2A20]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Wedding Details */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 bg-[#3A2A20] px-6 py-3 dd-font-display text-[11px] tracking-[0.26em] text-[#FFF8EC] uppercase shadow-[0_10px_22px_-8px_rgba(58,42,32,0.6)] transition-colors duration-300 hover:bg-[#5C4030] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3A2A20] @min-[40rem]:text-xs"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Full Wedding Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bottom Sleeve Fold Line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#5C4030]/45 to-transparent"
            />
          </div>

          {/* Sun + Moon + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#8A4A22]/70">
            <Sun className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#8A4A22]/30" />
            <Moon className="h-4 w-4" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — sand-toned postcard + RSVP jump                     */
/* ------------------------------------------------------------------ */

export function DesertDuskRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFF8EC] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Postcard Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(58,42,32,0.4)]"
        >
          {/* Postcard texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_POSTCARD_URL})` }}
          />

          {/* Text column sits ON the cream paper. The paper is
              eye-measured from rsvp-postcard.jpg (1920x1280): the
              smooth cream panel spans x 20.5%-81.5% and y
              19%-81.5% of the image (terracotta border + torn
              edge all round). The frame is bg-cover, so the cream
              maps to the same fractions of the frame whenever the
              frame is height-driven (mobile + editor preview), and
              to the image's scaled height when width-driven
              (desktop).
              Column width 58% (x 21%-79%) sits well inside the
              cream horizontally. Vertically the padding is sized
              from the 19%/81.5% bounds: mobile pt-40 (160px) /
              pb-36 (144px), wide-container pt-36 (144px) /
              pb-32 (128px). Estimated margins (content height
              ~380px mobile, ~300px wide): eyebrow top ~+30px
              below the cream's top edge on mobile (~+35px wide),
              button bottom ~+14px above the cream's bottom edge
              on mobile (~+20px wide). These are ESTIMATES from
              the image measurement, not live-measured margins —
              the coordinator must live-verify at 390px / 320px /
              desktop before calling this done (the Emerald RSVP
              needed three live rounds for exactly this).
              Container queries throughout (@container on the
              frame's parent, `@min-[40rem]:` = container >=
              640px): the editor Mobile preview is a 390px div on
              a desktop viewport, so viewport `sm:` would apply
              desktop padding in a mobile column and push the
              button off the paper. DO NOT "simplify" to `sm:`. */}
          <div className="relative z-10 mx-auto flex w-[58%] min-w-0 flex-col items-center pt-40 pb-36 text-center @min-[40rem]:pt-36 @min-[40rem]:pb-32">
            <p className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="dd-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#3A2A20] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <DuneDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="dd-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#3A2A20]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="dd-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#8A4A22] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#3A2A20] px-3.5 py-2.5 dd-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FFF8EC] uppercase shadow-[0_10px_22px_-8px_rgba(58,42,32,0.6)] transition-colors duration-300 hover:bg-[#5C4030] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3A2A20] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FFF8EC]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function DesertDuskFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#3D2133] px-5 pt-12 pb-10 text-center text-[#FFF8EC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/desert-dusk.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3D2133]/30 via-transparent to-[#3D2133]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="dd-font-script text-[2.2rem] leading-none font-normal text-[#FFFDF9]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="dd-font-display mt-3 text-[10px] tracking-[0.3em] text-[#D9A05B] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="dd-font-editorial mt-2 text-sm text-[#F5E6D3]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#C2703D]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="dd-font-display text-[11px] tracking-[0.26em] text-[#FFF8EC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A05B]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="dd-font-display text-[11px] tracking-[0.26em] text-[#FFF8EC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A05B]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="dd-font-display text-[11px] tracking-[0.26em] text-[#FFF8EC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A05B]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="dd-font-editorial mt-7 text-xs text-[#F5E6D3]/60 italic">
          Made with love — Desert Dusk
        </p>
      </div>
    </footer>
  );
}

// (No extra exports — the details page imports its own photos.)
