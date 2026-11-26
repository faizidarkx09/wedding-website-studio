// Vintage Lace details + RSVP + footer — vintage postcards for
// the details preview (each block a postcard with a stamp and a
// postmark, never panels), the lace-edged letter RSVP section on
// the lace-bordered paper photograph, and the footer. Only the data
// comes from the site (schedule, accommodations, travel + registry
// notes are the couple's editable DetailBlocks).
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
  Mail,
  MapPin,
  Plane,
  Shirt,
  Stamp,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { LaceDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  RSVP_PAPER_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* Postcard — one vintage postcard: cream card, perforated stamp    */
/* square top-right, circular postmark, title + body. Slight tilt  */
/* alternates by index, like postcards laid on a table.             */
/* ------------------------------------------------------------------ */

function Postcard({
  title,
  eyebrow,
  children,
  tilt = 0,
  stampLabel = "LOVE",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  tilt?: number;
  stampLabel?: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#FFFDF8] px-5 py-6 text-left text-[#4A3A2E] shadow-[0_16px_32px_-12px_rgba(74,58,46,0.45)] ring-1 ring-[#8B7355]/35"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* Postcard back lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[86px] w-px bg-[#8B7355]/25"
      />
      {/* Stamp */}
      <div className="absolute top-3 right-3 flex h-14 w-12 flex-col items-center justify-center border border-dashed border-[#8B7355]/70 bg-[#EAD3D3] text-center">
        <Stamp className="h-4 w-4 text-[#A66A6E]" />
        <span className="vl-font-display mt-0.5 text-[7px] font-semibold tracking-[0.14em] text-[#6B563E] uppercase">
          {stampLabel}
        </span>
      </div>
      {/* Postmark */}
      <div className="absolute top-[4.6rem] right-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#8B7355]/50">
        <Heart className="h-3.5 w-3.5 fill-[#A66A6E]/40 text-[#A66A6E]" />
      </div>

      <div className="relative z-10 pr-16">
        {eyebrow && (
          <p className="vl-font-display text-[9px] font-semibold tracking-[0.3em] text-[#6B563E] uppercase">
            {eyebrow}
          </p>
        )}
        <h4 className="vl-font-display mt-1.5 text-[1.15rem] leading-[1.2] font-semibold text-[#4A3A2E]">
          {title}
        </h4>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — vintage postcards in a 2-column spread      */
/* ------------------------------------------------------------------ */

export function VintageLaceDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FDF8F0] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase @min-[40rem]:text-xs"
        >
          Wedding details
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-3 text-[1.9rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#4A3A2E] @min-[40rem]:text-[2.3rem]"
        >
          Postcards from Our Day
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4A3A2E] @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned — here are the postcards we would send you,
          if the post could carry this much joy.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 w-full"
        >
          <LaceDivider className="h-7 w-36" />
        </motion.div>

        {/* Postcard spread */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="grid w-full max-w-[860px] grid-cols-1 gap-5 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-6"
        >
          {/* Venue postcard with a photo strip */}
          <Postcard
            title={site.content.venueName || "Our Wedding Venue"}
            eyebrow={formatShortDate(site.weddingDate, site.timezone)}
            tilt={-0.8}
            stampLabel="VENUE"
          >
            <div className="mb-3 flex gap-2">
              {[PHOTO_HANDS_URL, PHOTO_SUNSET_URL].map((src, i) => (
                <div key={i} className="relative aspect-[4/3] w-1/2 overflow-hidden border-2 border-white shadow-[0_8px_16px_-6px_rgba(74,58,46,0.4)] ring-1 ring-[#8B7355]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={i === 0 ? "Joined hands with wedding rings" : "Sunset over the venue"}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {site.content.venueAddress && (
              <p className="vl-font-editorial flex items-start gap-1.5 text-sm leading-relaxed text-[#4A3A2E] italic">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A66A6E]" />
                {site.content.venueAddress}
              </p>
            )}
          </Postcard>

          {/* Schedule postcard */}
          <Postcard title="Order of the Day" eyebrow="Schedule" tilt={0.7} stampLabel="DAY">
            {schedulePreview.length > 0 ? (
              <div className="space-y-3">
                {schedulePreview.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8B7355]/60 bg-[#FDF8F0] text-[#A66A6E]">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="vl-font-display text-[11px] font-semibold tracking-[0.16em] text-[#4A3A2E] uppercase">
                        {event.time} · {event.name}
                      </p>
                      {event.description && (
                        <p className="vl-font-editorial mt-0.5 text-sm leading-relaxed text-[#4A3A2E] italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {site.events.length > 3 && (
                  <p className="vl-font-editorial pl-11 text-sm text-[#6B563E] italic">
                    + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                  </p>
                )}
              </div>
            ) : (
              <p className="vl-font-editorial text-sm leading-relaxed text-[#4A3A2E] italic">
                The day&rsquo;s schedule will be shared here.
              </p>
            )}
          </Postcard>

          {/* Dress code postcard */}
          {dressCode && (
            <Postcard title="What to Wear" eyebrow="Dress code" tilt={0.6} stampLabel="STYLE">
              <p className="vl-font-editorial flex items-start gap-2.5 text-sm leading-relaxed text-[#4A3A2E] italic">
                <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A6E]" />
                {dressCode}
              </p>
            </Postcard>
          )}

          {/* Hotels postcard */}
          {hotelList.length > 0 && (
            <Postcard title="Where to Stay" eyebrow="Accommodation" tilt={-0.6} stampLabel="STAY">
              <div className="space-y-2.5">
                {hotelList.map((hotel, i) => (
                  <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8B7355]/60 bg-[#FDF8F0] text-[#A66A6E]">
                      <BedDouble className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="vl-font-display text-[11px] font-semibold tracking-[0.16em] text-[#4A3A2E] uppercase">
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p className="vl-font-editorial mt-0.5 text-sm text-[#4A3A2E] italic">
                          {hotel.distance}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Postcard>
          )}

          {/* Travel postcard */}
          {travelNotes.map((d, i) => (
            <Postcard key={`travel-${i}`} title={d.title || "Getting There"} eyebrow="Travel" tilt={i % 2 === 0 ? 0.6 : -0.6} stampLabel="ROAD">
              <p className="vl-font-editorial flex items-start gap-2.5 text-sm leading-relaxed text-[#4A3A2E] italic">
                <Plane className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A6E]" />
                {d.body}
              </p>
            </Postcard>
          ))}

          {/* Registry postcard */}
          {registryNotes.map((d, i) => (
            <Postcard key={`registry-${i}`} title={d.title || "Gifts & Registry"} eyebrow="Registry" tilt={i % 2 === 0 ? -0.6 : 0.6} stampLabel="GIFT">
              <p className="vl-font-editorial flex items-start gap-2.5 text-sm leading-relaxed text-[#4A3A2E] italic">
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#A66A6E]" />
                {d.body}
              </p>
            </Postcard>
          ))}
        </motion.div>

        {/* View Full Wedding Details */}
        <motion.button
          type="button"
          onClick={onOpenDetails}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-10 inline-flex items-center gap-2 bg-[#4A3A2E] px-6 py-3 vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#FDF8F0] uppercase shadow-[0_10px_22px_-8px_rgba(74,58,46,0.6)] transition-colors duration-300 hover:bg-[#6B563E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E] @min-[40rem]:text-xs"
        >
          <CalendarDays className="h-4 w-4" />
          View Full Wedding Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — lace-edged letter on the lace-bordered paper photo */
/* ------------------------------------------------------------------ */

export function VintageLaceRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FDF8F0] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Lace-edged letter frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(74,58,46,0.4)] ring-1 ring-[#8B7355]/40"
        >
          {/* Lace-bordered paper texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_PAPER_URL})` }}
          />

          {/* Text column sits ON the cream paper. The paper is
              eye-measured from rsvp-paper.jpg (1200x800): the
              smooth cream panel spans x 14%-86% and y 19%-84% of
              the image (lace border all round). The frame is
              bg-cover, so the cream maps to the same fractions of
              the frame whenever the frame is height-driven (mobile
              + editor preview), and to the image's scaled height
              when width-driven (desktop).
              Column width 62% (x 19%-81%) sits well inside the
              cream horizontally. Vertically the padding is sized
              from the 19%/84% bounds: pt-36 (144px) / pb-36
              (144px) both bands. Estimated margins (content height
              ~470px mobile, ~420px wide): eyebrow top ~+14px
              below the cream's top edge on mobile (~+16px wide),
              button bottom ~+18px above the cream's bottom edge
              on mobile (~+24px wide). These are ESTIMATES from
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
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-36 pb-36 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-32 @min-[40rem]:pb-32">
            <p className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="vl-font-display mt-3 text-[1.25rem] leading-[1.15] font-semibold tracking-[0.02em] text-balance text-[#4A3A2E] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <LaceDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="vl-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#4A3A2E] @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="vl-font-display mt-4 text-[10px] leading-[1.9] font-semibold tracking-[0.12em] text-balance text-[#6B563E] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#4A3A2E] px-3.5 py-2.5 vl-font-display text-[9px] font-semibold tracking-[0.1em] whitespace-nowrap text-[#FDF8F0] uppercase shadow-[0_10px_22px_-8px_rgba(74,58,46,0.6)] transition-colors duration-300 hover:bg-[#6B563E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Mail className="h-3.5 w-3.5 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function VintageLaceFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#4A3A2E] px-5 pt-12 pb-10 text-center text-[#FDF8F0]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#4A3A2E]/40 via-transparent to-[#4A3A2E]/75"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="vl-font-script text-[2.2rem] leading-none font-normal text-[#FDF8F0]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="vl-font-display mt-3 text-[10px] font-semibold tracking-[0.3em] text-[#EAD3D3] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="vl-font-editorial mt-2 text-sm text-[#F7EBD9] italic">{footerLocation(site)}</p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#C08A8E]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#FDF8F0] uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08A8E]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#FDF8F0] uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08A8E]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="vl-font-display text-[11px] font-semibold tracking-[0.26em] text-[#FDF8F0] uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08A8E]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="vl-font-editorial mt-7 text-xs text-[#F7EBD9] italic">
          Made with love — Vintage Lace
        </p>
      </div>
    </footer>
  );
}
