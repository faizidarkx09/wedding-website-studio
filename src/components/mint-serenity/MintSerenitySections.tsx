// Mint Serenity details + RSVP + footer — details in soft pill
// cards (fully rounded, not panels), the mint bubble RSVP card,
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
import { BubbleDivider } from "./Decor";
import {
  FONT_BODY,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  PHOTO_HANDS_URL,
  PHOTO_MEADOW_URL,
  RSVP_BG_URL,
  STORY_GARDEN_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — soft pill cards in a mint wash               */
/* ------------------------------------------------------------------ */

export function MintSerenityDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#ECFDF5] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      {/* Drifting bubble accents */}
      <span aria-hidden="true" className="pointer-events-none absolute top-12 left-8 h-12 w-12 rounded-full border border-[#065F46]/20 bg-white/50" />
      <span aria-hidden="true" className="pointer-events-none absolute right-10 bottom-24 h-8 w-8 rounded-full border border-[#065F46]/20 bg-white/60" />

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="text-[10px] tracking-[0.34em] text-[#047857] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#052E22] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_EDITORIAL}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#052E22]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a day of soft mint light, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#065F46]/80 @min-[40rem]:w-24" />
          <Leaf className="h-4 w-4 text-[#047857]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#065F46]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details — soft pill cards */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Mint bubble cluster (photo bubbles above the pills) */}
          <div className="relative mb-8 flex h-32 w-full items-center justify-center @min-[40rem]:mb-10 @min-[40rem]:h-40">
            <div className="absolute left-1/2 h-28 w-28 -translate-x-[calc(50%+72px)] overflow-hidden rounded-full bg-white p-1.5 shadow-[0_12px_24px_-8px_rgba(6,95,70,0.45)] ring-4 ring-white @min-[40rem]:h-36 @min-[40rem]:w-36 @min-[40rem]:-translate-x-[calc(50%+92px)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTO_HANDS_URL}
                alt="Joined hands with wedding rings"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="absolute left-1/2 z-10 h-32 w-32 -translate-x-1/2 overflow-hidden rounded-full bg-white p-1.5 shadow-[0_16px_30px_-10px_rgba(6,95,70,0.55)] ring-4 ring-white @min-[40rem]:h-40 @min-[40rem]:w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STORY_GARDEN_URL}
                alt="The couple laughing together in a mint garden"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="absolute left-1/2 h-28 w-28 translate-x-[calc(-50%+72px)] overflow-hidden rounded-full bg-white p-1.5 shadow-[0_12px_24px_-8px_rgba(6,95,70,0.45)] ring-4 ring-white @min-[40rem]:h-36 @min-[40rem]:w-36 @min-[40rem]:translate-x-[calc(-50%+92px)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTO_MEADOW_URL}
                alt="A quiet meadow in soft morning light"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Pill stack */}
          <div className="flex flex-col gap-4 text-left @min-[40rem]:gap-5">
            {/* Venue pill */}
            <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] @min-[40rem]:px-8 @min-[40rem]:py-7">
              <div className="flex flex-col items-center text-center">
                <p style={FONT_DISPLAY} className="text-[10px] tracking-[0.34em] text-[#047857] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4
                  style={FONT_DISPLAY}
                  className="mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#052E22] @min-[40rem]:text-[1.75rem]"
                >
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p style={FONT_EDITORIAL} className="mt-2 flex items-center gap-1.5 text-sm text-[#052E22]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#047857]" />
                    {site.content.venueAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Schedule pill */}
            {schedulePreview.length > 0 && (
              <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] @min-[40rem]:px-8 @min-[40rem]:py-7">
                <BubbleDivider className="mb-5 h-8 w-28 @min-[40rem]:h-9 @min-[40rem]:w-32" />
                <div className="mx-auto w-full max-w-[480px] space-y-3">
                  {schedulePreview.map((event, i) => (
                    <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p style={FONT_DISPLAY} className="text-[11px] tracking-[0.18em] text-[#052E22] uppercase @min-[40rem]:text-xs">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p style={FONT_EDITORIAL} className="mt-0.5 text-sm leading-relaxed text-[#052E22]/75 italic">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {site.events.length > 3 && (
                    <p style={FONT_EDITORIAL} className="pl-11 text-sm text-[#047857]/80 italic">
                      + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Dress code pill */}
            {dressCode && (
              <div className="flex items-center justify-center gap-2.5 rounded-full bg-[#065F46] px-5 py-3.5 shadow-[0_12px_24px_-10px_rgba(6,95,70,0.6)] @min-[40rem]:px-6">
                <Shirt className="h-4 w-4 shrink-0 text-[#A7F3D0]" />
                <span style={FONT_DISPLAY} className="text-[10px] tracking-[0.2em] text-white uppercase @min-[40rem]:text-[11px]">
                  Dress Code: {dressCode}
                </span>
              </div>
            )}

            {/* Accommodations pill */}
            {hotelList.length > 0 && (
              <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] @min-[40rem]:px-8 @min-[40rem]:py-7">
                <div className="mx-auto w-full max-w-[480px] space-y-2.5">
                  {hotelList.map((hotel, i) => (
                    <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                        <BedDouble className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p style={FONT_DISPLAY} className="text-[11px] tracking-[0.18em] text-[#052E22] uppercase @min-[40rem]:text-xs">
                          {hotel.name}
                        </p>
                        {hotel.distance && (
                          <p style={FONT_EDITORIAL} className="mt-0.5 text-sm text-[#052E22]/75 italic">
                            {hotel.distance}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel / Registry pills */}
            {travelNotes.map((d, i) => (
              <div key={`travel-${i}`} className="flex w-full items-start gap-3 rounded-[2rem] bg-white px-6 py-5 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] @min-[40rem]:px-8">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                  <Plane className="h-3.5 w-3.5" />
                </span>
                <p style={FONT_EDITORIAL} className="text-sm leading-relaxed text-[#052E22]/80 italic">
                  {d.body}
                </p>
              </div>
            ))}
            {registryNotes.map((d, i) => (
              <div key={`registry-${i}`} className="flex w-full items-start gap-3 rounded-[2rem] bg-white px-6 py-5 shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] @min-[40rem]:px-8">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
                  <Gift className="h-3.5 w-3.5" />
                </span>
                <p style={FONT_EDITORIAL} className="text-sm leading-relaxed text-[#052E22]/80 italic">
                  {d.body}
                </p>
              </div>
            ))}
          </div>

          {/* View Full Wedding Details */}
          <button
            type="button"
            onClick={onOpenDetails}
            style={FONT_DISPLAY}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#065F46] px-7 py-3.5 text-[11px] tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46] @min-[40rem]:text-xs"
          >
            <CalendarDays className="h-4 w-4" />
            View Full Wedding Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Leaf + Heart accent row */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[#047857]/70">
            <Leaf className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#047857]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — mint bubble card over the bubble-paper background   */
/* ------------------------------------------------------------------ */

export function MintSerenityRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#ECFDF5] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Bubble-paper frame — the RSVP background image fills the
            frame; the white bubble CARD inside it holds ALL the text.
            The cream panel in rsvp-bubbles.jpg (eye-measured x
            27–74%, y 26–70%) is too small and too short for the full
            RSVP copy at every width, so the copy does NOT sit on the
            image's panel: it sits on the card, and the card sits on
            the image. The card is inset from the frame edges
            (mx-3 / px-6) and carries its own padding, so the text
            and the button are inside the card — and therefore on the
            paper — at 320 / 390 / 430 / 768 / 1280 / 1440 by
            construction, with no eye-measured offsets to drift.
            Container queries throughout (@container on the frame's
            parent, `@min-[40rem]:` = container >= 640px): the
            editor Mobile preview is a 390px div on a desktop
            viewport, so viewport `sm:` would apply desktop padding
            in a mobile column and push the button off the card. DO
            NOT "simplify" to `sm:`. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-[0_24px_48px_-16px_rgba(6,95,70,0.4)]"
        >
          {/* Bubble-paper background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_BG_URL})` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#ECFDF5]/25"
          />

          {/* Mint bubble card — ALL RSVP text lives inside it */}
          <div className="relative z-10 mx-3 my-10 flex flex-col items-center rounded-[2rem] bg-white/95 px-5 py-10 text-center shadow-[0_18px_36px_-14px_rgba(6,95,70,0.45)] ring-1 ring-[#A7F3D0] @min-[40rem]:mx-8 @min-[40rem]:my-14 @min-[40rem]:px-10 @min-[40rem]:py-12">
            {/* Bubble decorations on the card */}
            <span aria-hidden="true" className="pointer-events-none absolute top-4 left-5 h-8 w-8 rounded-full border border-[#065F46]/30 bg-[#ECFDF5]/70" />
            <span aria-hidden="true" className="pointer-events-none absolute right-6 bottom-5 h-5 w-5 rounded-full border border-[#065F46]/25 bg-[#ECFDF5]/80" />
            <span aria-hidden="true" className="pointer-events-none absolute top-6 right-8 h-3 w-3 rounded-full bg-[#A7F3D0]/80" />

            <p style={FONT_DISPLAY} className="text-[10px] tracking-[0.34em] text-[#047857] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3
              style={FONT_DISPLAY}
              className="mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#052E22] @min-[40rem]:text-[1.9rem]"
            >
              Will You Join Us?
            </h3>

            <BubbleDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p style={FONT_EDITORIAL} className="mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#052E22]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p style={FONT_DISPLAY} className="mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#047857] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              style={FONT_DISPLAY}
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[#065F46] px-6 py-3 text-[10px] tracking-[0.18em] whitespace-nowrap text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-white/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function MintSerenityFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#052E22] px-5 pt-12 pb-10 text-center text-[#ECFDF5]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(/images/themes/mint-serenity.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#052E22]/30 via-transparent to-[#052E22]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p style={FONT_SCRIPT} className="text-[2.2rem] leading-none font-normal text-[#FFFFFF]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p style={FONT_DISPLAY} className="mt-3 text-[10px] tracking-[0.3em] text-[#A7F3D0] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p style={FONT_EDITORIAL} className="mt-2 text-sm text-[#D1FAE5]/80 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#A7F3D0]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              style={FONT_DISPLAY}
              className="text-[11px] tracking-[0.26em] text-[#ECFDF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7F3D0]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            style={FONT_DISPLAY}
            className="text-[11px] tracking-[0.26em] text-[#ECFDF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7F3D0]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            style={FONT_DISPLAY}
            className="text-[11px] tracking-[0.26em] text-[#ECFDF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7F3D0]"
          >
            Wedding Details
          </button>
        </nav>

        <p style={FONT_EDITORIAL} className="mt-7 text-xs text-[#D1FAE5]/60 italic">
          Made with love — Mint Serenity
        </p>
      </div>
    </footer>
  );
}
