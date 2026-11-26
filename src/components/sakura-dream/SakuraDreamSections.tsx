// Sakura Dream details + RSVP + footer — cream details card in a
// plum fan sleeve with folding-fan panels, the cherry-blossom
// petal-card RSVP section, and the footer. Only the data comes
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
  MapPin,
  Plane,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { Blossom, FanPleats, PetalDivider } from "./Decor";
import {
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  PETAL_CARD_RSVP_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — plum fan sleeve + folding-fan panels         */
/* ------------------------------------------------------------------ */

export function SakuraDreamDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FFF7FB] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E0A3D] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#2E0A3D]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening beneath the blossoms, full of
          joy and unforgettable moments.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#EC4899]/80 @min-[40rem]:w-24" />
          <Blossom className="h-5 w-5" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#EC4899]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Plum Fan Sleeve */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#F9A8D4] via-[#6B21A8] to-[#4C1D95] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(46,10,61,0.45)] @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8">
            {/* Cream Detail Card */}
            <div className="relative z-10 overflow-hidden bg-[#FFFDFB] px-5 py-8 text-[#2E0A3D] shadow-[0_18px_36px_-12px_rgba(46,10,61,0.55)] @min-[40rem]:px-8 @min-[40rem]:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#EC4899]/60"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-[#5B2A6E]/25"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Folding-fan trio — three small fan panels fanned
                    open (-5° / 0° / +5°), each with a photo inside
                    the fan's arc */}
                <div className="relative mb-7 flex h-32 w-full items-center justify-center @min-[40rem]:mb-9 @min-[40rem]:h-40">
                  <div className="absolute left-1/2 h-28 w-24 -translate-x-[calc(50%+64px)] -rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(46,10,61,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:-translate-x-[calc(50%+84px)]">
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
                  <div className="absolute left-1/2 z-10 h-32 w-28 -translate-x-1/2 rotate-[2deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_16px_30px_-10px_rgba(46,10,61,0.55)] @min-[40rem]:h-40 @min-[40rem]:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO_SUNSET_URL}
                      alt="Blossom sunset over the venue"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-1/2 h-28 w-24 translate-x-[calc(-50%+64px)] rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(46,10,61,0.45)] @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:translate-x-[calc(-50%+84px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO_VEIL_URL}
                      alt="Bride's veil among the blossoms"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Folding-fan pleat header */}
                <FanPleats className="h-12 w-40 @min-[40rem]:h-14 @min-[40rem]:w-48" />

                <p className="sd-font-display mt-4 text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="sd-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#2E0A3D] @min-[40rem]:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="sd-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#2E0A3D]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#EC4899]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <PetalDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

                {/* Schedule Preview */}
                {schedulePreview.length > 0 && (
                  <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                          <Clock className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="sd-font-display text-[11px] tracking-[0.18em] text-[#2E0A3D] uppercase @min-[40rem]:text-xs">
                            {event.time} · {event.name}
                          </p>
                          {event.description && (
                            <p className="sd-font-editorial mt-0.5 text-sm leading-relaxed text-[#2E0A3D]/75 italic">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="sd-font-editorial pl-11 text-sm text-[#6B21A8]/80 italic">
                        + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                      </p>
                    )}
                  </div>
                )}

                {/* Dress Code */}
                {dressCode && (
                  <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#EC4899]/60 bg-[#FDF2F8]/80 px-4 py-2">
                    <Shirt className="h-4 w-4 shrink-0 text-[#6B21A8]" />
                    <span className="sd-font-display text-[10px] tracking-[0.2em] text-[#2E0A3D] uppercase @min-[40rem]:text-[11px]">
                      Dress Code: {dressCode}
                    </span>
                  </div>
                )}

                {/* Accommodations Preview */}
                {hotelList.length > 0 && (
                  <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                    {hotelList.map((hotel, i) => (
                      <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                          <BedDouble className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="sd-font-display text-[11px] tracking-[0.18em] text-[#2E0A3D] uppercase @min-[40rem]:text-xs">
                            {hotel.name}
                          </p>
                          {hotel.distance && (
                            <p className="sd-font-editorial mt-0.5 text-sm text-[#2E0A3D]/75 italic">
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
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="sd-font-editorial text-sm leading-relaxed text-[#2E0A3D]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#EC4899]/70 bg-[#FDF2F8] text-[#6B21A8]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="sd-font-editorial text-sm leading-relaxed text-[#2E0A3D]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Wedding Details */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 bg-[#6B21A8] px-6 py-3 sd-font-display text-[11px] tracking-[0.26em] text-[#FFF7FB] uppercase shadow-[0_10px_22px_-8px_rgba(46,10,61,0.6)] transition-colors duration-300 hover:bg-[#4C1D95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8] @min-[40rem]:text-xs"
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
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#4C1D95]/45 to-transparent"
            />
          </div>

          {/* Blossom + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#6B21A8]/70">
            <Blossom className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#EC4899]/30 text-[#EC4899]" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — cherry-blossom petal card + RSVP jump               */
/* ------------------------------------------------------------------ */

export function SakuraDreamRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFF7FB] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Petal Card Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(46,10,61,0.4)]"
        >
          {/* Cherry-blossom petal-card texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PETAL_CARD_RSVP_URL})` }}
          />

          {/* Text column sits ON the cream paper. The paper is
              eye-measured from sakura-dream-rsvp.jpg (1920x1280):
              the cream card spans x 9%-91% and y 8%-92% of the
              image, with blossom branches intruding from the four
              corners (clear centre column x 25%-75%, y 10%-88%).
              The frame is bg-cover, so on mobile the frame is
              height-driven (image scaled to the frame height, centre
              40% of its width visible — all paper), and on desktop
              it is width-driven (centre ~81% visible, paper edges
              just inside). Column width 62% (x 19%-81%) sits inside
              the cream horizontally; vertically the padding is sized
              from the 8%/92% bounds: mobile pt-24 (96px) / pb-28
              (112px), wide-container pt-20 (80px) / pb-24 (96px).
              Estimated margins (content height ~500px mobile,
              ~420px wide): eyebrow top ~+49px below the paper's top
              edge on mobile (~+32px wide), button bottom ~+65px
              above the paper's bottom edge on mobile (~+48px wide).
              These are ESTIMATES from the image measurement, not
              live-measured margins — the coordinator must live-verify
              at 390px / 320px / desktop before calling this done
              (the Emerald RSVP needed three live rounds for exactly
              this). Container queries throughout (@container on the
              frame's parent, `@min-[40rem]:` = container >=
              640px): the editor Mobile preview is a 390px div on
              a desktop viewport, so viewport `sm:` would apply
              desktop padding in a mobile column and push the
              button off the paper. DO NOT "simplify" to `sm:`. */}
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-24 pb-28 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-20 @min-[40rem]:pb-24">
            <p className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="sd-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#2E0A3D] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <PetalDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="sd-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#2E0A3D]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy beneath the blossoms.
            </p>

            {replyBy && (
              <p className="sd-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#6B21A8] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#6B21A8] px-3.5 py-2.5 sd-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FFF7FB] uppercase shadow-[0_10px_22px_-8px_rgba(46,10,61,0.6)] transition-colors duration-300 hover:bg-[#4C1D95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6B21A8] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FFF7FB]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function SakuraDreamFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#2E0A3D] px-5 pt-12 pb-10 text-center text-[#FFF7FB]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/sakura-dream.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2E0A3D]/30 via-transparent to-[#2E0A3D]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="sd-font-script text-[2.2rem] leading-none font-normal text-[#FFFDFB]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="sd-font-display mt-3 text-[10px] tracking-[0.3em] text-[#F9A8D4] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="sd-font-editorial mt-2 text-sm text-[#FBCFE8]/80 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#EC4899]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="sd-font-display text-[11px] tracking-[0.26em] text-[#FFF7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F9A8D4]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="sd-font-display text-[11px] tracking-[0.26em] text-[#FFF7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F9A8D4]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="sd-font-display text-[11px] tracking-[0.26em] text-[#FFF7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F9A8D4]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="sd-font-editorial mt-7 text-xs text-[#FBCFE8]/60 italic">
          Made with love — Sakura Dream
        </p>
      </div>
    </footer>
  );
}
