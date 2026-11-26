// Forest Whisper details + RSVP + footer — a "trail map" details
// card (a winding path with pinned stops: ceremony → dinner →
// dance), the wooden signboard RSVP section, and the footer. Only
// the data comes from the site (schedule, accommodations, travel +
// registry notes are the couple's editable DetailBlocks).
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
  Navigation,
  Plane,
  Shirt,
  Sparkles,
  TreePine,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { LeafDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  SIGNBOARD_RSVP_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  mapsLink,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* TrailMapPath — the winding dashed path drawn behind the stops.    */
/* A sine S-curve in a 0 0 100 100 viewBox, stretched to the          */
/* container (preserveAspectRatio="none") so it always spans the     */
/* full trail. Decorative only — the stops carry the meaning.        */
/* ------------------------------------------------------------------ */

function TrailMapPath({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <path
        d="M 50 0 C 78 12, 22 24, 50 38 C 78 52, 22 64, 50 78 C 68 88, 38 94, 50 100"
        fill="none"
        stroke="#6A994E"
        strokeWidth="1.6"
        strokeDasharray="7 6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.75"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — trail map with pinned stops                  */
/* ------------------------------------------------------------------ */

export function ForestWhisperDetailsCard({
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
  const venueQuery = [site.content.venueName, site.content.venueAddress]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join(", ");

  return (
    <div className="@container relative overflow-hidden bg-[#F4F1E6] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#1B4332] @min-[40rem]:text-[2.3rem]"
        >
          Follow the Trail
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#1B4332]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every stop along the trail has been lovingly planned — follow the path from the first
          hello to the last dance.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#6A994E]/80 @min-[40rem]:w-24" />
          <TreePine className="h-4 w-4 text-[#2D6A4F]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#6A994E]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Trail Map */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Moss trail-map board */}
          <div className="relative overflow-hidden bg-[#E7EAD9] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(27,67,50,0.45)] ring-1 ring-[#6A994E]/40 @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8">
            {/* Cream trail card */}
            <div className="relative z-10 overflow-hidden bg-[#FBF9F1] px-5 py-8 text-[#1B4332] shadow-[0_18px_36px_-12px_rgba(27,67,50,0.55)] @min-[40rem]:px-8 @min-[40rem]:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#6A994E]/60"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-[#2D6A4F]/25"
              />

              <div className="relative z-10 flex flex-col items-center">
                <p className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="fw-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#1B4332] @min-[40rem]:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="fw-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#1B4332]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2D6A4F]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <LeafDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

                {/* Pinned stops — ceremony → dinner → dance. In narrow
                    containers the stops stack full-width with the pin
                    on the left; in wide containers they alternate
                    left / right along the winding path. */}
                {schedulePreview.length > 0 && (
                  <div className="relative mt-6 w-full max-w-[640px] py-2">
                    <TrailMapPath />
                    <div className="relative flex flex-col gap-8">
                      {schedulePreview.map((event, i) => (
                        <div
                          key={`${event.name}-${i}`}
                          className={`flex items-start gap-3 text-left @min-[40rem]:w-[78%] ${
                            i % 2 === 1
                              ? "@min-[40rem]:ml-auto @min-[40rem]:flex-row-reverse @min-[40rem]:text-right"
                              : ""
                          }`}
                        >
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#FBF9F1] bg-[#2D6A4F] fw-font-display text-sm text-[#F4F1E6] shadow-[0_6px_14px_-4px_rgba(27,67,50,0.5)]">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1 rounded-[4px] bg-[#F4F1E6]/80 px-4 py-3 ring-1 ring-[#6A994E]/30">
                            <p className="fw-font-display text-[11px] tracking-[0.18em] text-[#1B4332] uppercase @min-[40rem]:text-xs">
                              {event.time} · {event.name}
                            </p>
                            {event.description && (
                              <p className="fw-font-editorial mt-0.5 text-sm leading-relaxed text-[#1B4332]/75 italic">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {site.events.length > 3 && (
                        <p className="fw-font-editorial pl-13 text-sm text-[#2D6A4F]/80 italic @min-[40rem]:pl-0 @min-[40rem]:text-center">
                          + {site.events.length - 3} more stop{site.events.length - 3 === 1 ? "" : "s"} along the trail
                        </p>
                      )}

                      {/* Trail's end — the venue pin */}
                      <div className="flex items-start gap-3 text-left @min-[40rem]:w-[78%] @min-[40rem]:ml-auto @min-[40rem]:flex-row-reverse @min-[40rem]:text-right">
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#FBF9F1] bg-[#1B4332] text-[#F4F1E6] shadow-[0_6px_14px_-4px_rgba(27,67,50,0.5)]">
                          <Navigation className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1 rounded-[4px] bg-[#1B4332] px-4 py-3 text-[#F4F1E6]">
                          <p className="fw-font-display text-[11px] tracking-[0.18em] uppercase @min-[40rem]:text-xs">
                            Trail&rsquo;s End — {site.content.venueName || "Our Wedding Venue"}
                          </p>
                          {venueQuery && (
                            <a
                              href={mapsLink(venueQuery)}
                              target="_blank"
                              rel="noreferrer"
                              className="fw-font-editorial mt-1 inline-flex items-center gap-1.5 text-sm text-[#A7C957] italic underline underline-offset-2"
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              Find the trail on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dress Code */}
                {dressCode && (
                  <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#6A994E]/60 bg-[#F4F1E6]/80 px-4 py-2">
                    <Shirt className="h-4 w-4 shrink-0 text-[#2D6A4F]" />
                    <span className="fw-font-display text-[10px] tracking-[0.2em] text-[#1B4332] uppercase @min-[40rem]:text-[11px]">
                      Dress Code: {dressCode}
                    </span>
                  </div>
                )}

                {/* Accommodations Preview */}
                {hotelList.length > 0 && (
                  <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                    {hotelList.map((hotel, i) => (
                      <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                          <BedDouble className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="fw-font-display text-[11px] tracking-[0.18em] text-[#1B4332] uppercase @min-[40rem]:text-xs">
                            {hotel.name}
                          </p>
                          {hotel.distance && (
                            <p className="fw-font-editorial mt-0.5 text-sm text-[#1B4332]/75 italic">
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
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="fw-font-editorial text-sm leading-relaxed text-[#1B4332]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#6A994E]/70 bg-[#F4F1E6] text-[#2D6A4F]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="fw-font-editorial text-sm leading-relaxed text-[#1B4332]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Trail Map */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 bg-[#1B4332] px-6 py-3 fw-font-display text-[11px] tracking-[0.26em] text-[#F4F1E6] uppercase shadow-[0_10px_22px_-8px_rgba(27,67,50,0.6)] transition-colors duration-300 hover:bg-[#2D6A4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] @min-[40rem]:text-xs"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Full Trail Map
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bottom board fold line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#2D6A4F]/45 to-transparent"
            />
          </div>

          {/* Pine + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#2D6A4F]/70">
            <TreePine className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#2D6A4F]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — wooden signboard card + RSVP jump                   */
/* ------------------------------------------------------------------ */

export function ForestWhisperRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#F4F1E6] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[600px]">
        {/* Wooden Signboard Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] overflow-hidden shadow-[0_24px_48px_-16px_rgba(27,67,50,0.4)] @min-[40rem]:aspect-[3/2]"
        >
          {/* Signboard texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SIGNBOARD_RSVP_URL})` }}
          />

          {/* Text column sits ON the wooden board. The board is
              eye-measured from forest-whisper-rsvp.jpg (1920x1280):
              the blank wooden planks span x ~16.5–84% and y
              ~17.5–82% of the image (green wall + ferns outside
              that). The frame is bg-cover, so the board maps to the
              same fractions of the frame vertically whenever the
              frame is height-driven, and horizontally the board
              still spans the frame's centre at both aspects (the
              4:5 mobile crop keeps image x ~23.5–76.5% visible;
              the 3:2 wide frame shows the full width).
              Column width 56% (x 22–78% of the frame) sits well
              inside the board horizontally at both aspects.
              Vertically the padding is sized from the 17.5%/82%
              bounds: mobile pt-24 (96px) / pb-24 (96px) on the
              4:5 frame, wide-container pt-20 (80px) / pb-20 (80px)
              on the 3:2 frame. Estimated margins (content height
              ~267px mobile, ~229px wide): eyebrow top ~+18px below
              the board's top edge on mobile (~+15px wide), button
              bottom ~+4px above the board's bottom edge on mobile
              (~+19px wide). These are ESTIMATES from the image
              measurement, not live-measured margins — the
              coordinator must live-verify at 390px / 320px /
              desktop before calling this done (the Emerald RSVP
              needed three live rounds for exactly this).
              Container queries throughout (@container on the
              frame's parent, `@min-[40rem]:` = container >=
              640px): the editor Mobile preview is a 390px div on
              a desktop viewport, so viewport `sm:` would apply
              desktop padding in a mobile column and push the
              button off the board. DO NOT "simplify" to `sm:`. */}
          <div className="relative z-10 mx-auto flex w-[56%] min-w-0 flex-col items-center pt-24 pb-24 text-center @min-[40rem]:w-[56%] @min-[40rem]:pt-20 @min-[40rem]:pb-20">
            <p className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="fw-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#1B4332] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <LeafDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="fw-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#1B4332]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="fw-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#2D6A4F] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#1B4332] px-3.5 py-2.5 fw-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#F4F1E6] uppercase shadow-[0_10px_22px_-8px_rgba(27,67,50,0.6)] transition-colors duration-300 hover:bg-[#2D6A4F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332] @min-[40rem]:mt-6 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#F4F1E6]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function ForestWhisperFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#14301F] px-5 pt-12 pb-10 text-center text-[#F4F1E6]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14301F]/30 via-transparent to-[#14301F]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="fw-font-script text-[2.2rem] leading-none font-normal text-[#FBF9F1]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="fw-font-display mt-3 text-[10px] tracking-[0.3em] text-[#A7C957] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="fw-font-editorial mt-2 text-sm text-[#E7EAD9]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#6A994E]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="fw-font-display text-[11px] tracking-[0.26em] text-[#F4F1E6]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7C957]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="fw-font-display text-[11px] tracking-[0.26em] text-[#F4F1E6]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7C957]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="fw-font-display text-[11px] tracking-[0.26em] text-[#F4F1E6]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7C957]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="fw-font-editorial mt-7 text-xs text-[#E7EAD9]/60 italic">
          Made with love — Forest Whisper
        </p>
      </div>
    </footer>
  );
}
