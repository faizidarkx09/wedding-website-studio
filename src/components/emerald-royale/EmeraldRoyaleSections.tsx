// Emerald Royale details + RSVP + footer — emerald pocket sleeve +
// polaroids + gold-leaf ornament, the emerald torn-paper RSVP
// section, and the footer. Only the data comes from the site
// (schedule, accommodations, travel + registry notes are the
// couple's editable DetailBlocks).
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
  Sparkles,
  Shirt,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BotanicalCardDivider } from "./Decor";
import {
  GOLD_LEAF_URL,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  TORN_PAPER_RSVP_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — emerald pocket sleeve + polaroids + gold leaf */
/* ------------------------------------------------------------------ */

export function EmeraldRoyaleDetailsCard({
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
    <div className="relative overflow-hidden bg-[#F7F3E8] px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Gold-Leaf Ornament Floating Accent */}
        <div className="pointer-events-none absolute -top-4 -right-2 hidden w-32 opacity-95 md:block lg:-right-8 lg:w-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GOLD_LEAF_URL}
            alt=""
            referrerPolicy="no-referrer"
            className="er-mask-radial-soft h-auto w-full object-contain"
          />
        </div>

        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#14543D] uppercase sm:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#0B3D2E] sm:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#06231B]/85 sm:text-[1.06rem]"
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A227]/80 sm:w-24" />
          <Sparkles className="h-4 w-4 text-[#14543D]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A227]/80 sm:w-24" />
        </motion.div>

        {/* Main Details Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Emerald Pocket Sleeve */}
          <div className="relative overflow-hidden bg-[#0B3D2E] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(4,26,19,0.45)] sm:px-6 sm:pt-10 sm:pb-8">
            {/* Emerald pocket leather texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-90"
              style={{ backgroundImage: `url(/images/themes/emerald-royale.jpg)` }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14543D]/20 via-transparent to-[#06231B]/50"
            />

            {/* Parchment Detail Card (Ivory letterpress inner card) */}
            <div className="relative z-10 overflow-hidden bg-[#FBF8EF] px-5 py-8 text-[#06231B] shadow-[0_18px_36px_-12px_rgba(4,26,19,0.55)] sm:px-8 sm:py-10">
              {/* Parchment fibers texture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(/images/themes/emerald-royale/bg_ivory_parchment.jpg)` }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#C9A227]/60"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-[#14543D]/25"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Small Polaroid Stack (tilted) */}
                <div className="relative mb-7 flex h-32 w-full items-center justify-center sm:mb-9 sm:h-40">
                  <div className="absolute left-1/2 h-28 w-24 -translate-x-[calc(50%+64px)] -rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(4,26,19,0.45)] sm:h-36 sm:w-32 sm:-translate-x-[calc(50%+84px)]">
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
                  <div className="absolute left-1/2 z-10 h-32 w-28 -translate-x-1/2 rotate-[2deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_16px_30px_-10px_rgba(4,26,19,0.55)] sm:h-40 sm:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO_SUNSET_URL}
                      alt="Golden-hour sunset over the venue"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-1/2 h-28 w-24 translate-x-[calc(-50%+64px)] rotate-[7deg] overflow-hidden bg-white p-1.5 pb-5 shadow-[0_12px_24px_-8px_rgba(4,26,19,0.45)] sm:h-36 sm:w-32 sm:translate-x-[calc(-50%+84px)]">
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

                <p className="er-font-display text-[10px] tracking-[0.34em] text-[#14543D] uppercase sm:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="er-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#0B3D2E] sm:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="er-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#06231B]/80 italic sm:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#14543D]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <BotanicalCardDivider className="mt-5 h-9 w-28 sm:h-10 sm:w-32" />

                {/* Schedule Preview */}
                {schedulePreview.length > 0 && (
                  <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/70 bg-[#F7F3E8] text-[#14543D]">
                          <Clock className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="er-font-display text-[11px] tracking-[0.18em] text-[#0B3D2E] uppercase sm:text-xs">
                            {event.time} · {event.name}
                          </p>
                          {event.description && (
                            <p className="er-font-editorial mt-0.5 text-sm leading-relaxed text-[#06231B]/75 italic">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="er-font-editorial pl-11 text-sm text-[#14543D]/80 italic">
                        + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                      </p>
                    )}
                  </div>
                )}

                {/* Dress Code */}
                {dressCode && (
                  <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#C9A227]/60 bg-[#F7F3E8]/80 px-4 py-2">
                    <Shirt className="h-4 w-4 shrink-0 text-[#14543D]" />
                    <span className="er-font-display text-[10px] tracking-[0.2em] text-[#0B3D2E] uppercase sm:text-[11px]">
                      Dress Code: {dressCode}
                    </span>
                  </div>
                )}

                {/* Accommodations Preview */}
                {hotelList.length > 0 && (
                  <div className="mt-6 w-full max-w-[480px] space-y-2.5 text-left">
                    {hotelList.map((hotel, i) => (
                      <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/70 bg-[#F7F3E8] text-[#14543D]">
                          <BedDouble className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="er-font-display text-[11px] tracking-[0.18em] text-[#0B3D2E] uppercase sm:text-xs">
                            {hotel.name}
                          </p>
                          {hotel.distance && (
                            <p className="er-font-editorial mt-0.5 text-sm text-[#06231B]/75 italic">
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
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/70 bg-[#F7F3E8] text-[#14543D]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="er-font-editorial text-sm leading-relaxed text-[#06231B]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/70 bg-[#F7F3E8] text-[#14543D]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="er-font-editorial text-sm leading-relaxed text-[#06231B]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Wedding Details */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 bg-[#0B3D2E] px-6 py-3 er-font-display text-[11px] tracking-[0.26em] text-[#F7F3E8] uppercase shadow-[0_10px_22px_-8px_rgba(11,61,46,0.6)] transition-colors duration-300 hover:bg-[#14543D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E] sm:text-xs"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Full Wedding Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Bottom Pocket Fold Line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#06231B]/45 to-transparent"
            />
          </div>

          {/* Gold Leaf + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#14543D]/70">
            <Leaf className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#14543D]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RSVPSection — emerald torn-paper frame + RSVP jump                */
/* ------------------------------------------------------------------ */

export function EmeraldRoyaleRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="relative overflow-hidden bg-[#F7F3E8] px-4 pt-4 pb-20 sm:px-6 sm:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Torn Paper Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(4,26,19,0.4)]"
        >
          {/* Torn paper texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${TORN_PAPER_RSVP_URL})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#F7F3E8]/35"
          />

          {/* Text column is constrained to THIS image's measured paper
              bounds: pixel-profiled 2026-11-25 — the cream paper spans
              16.0%–83.7% of the image width (~67% at mid-height, 67.4%
              / 67.3% / 67.8% at y=25/50/75%). 62–64% leaves a ~7px
              margin from the torn edges at every viewport, so the
              heading / body / reply-by line sit ON the cream paper
              instead of spilling onto the emerald frame. */}
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center py-12 text-center sm:w-[64%] sm:py-16">
            <p className="er-font-display text-[10px] tracking-[0.34em] text-[#14543D] uppercase sm:text-xs">
              RSVP
            </p>
            <h3 className="er-font-display mt-3 text-[clamp(1.35rem,5vw,1.9rem)] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#0B3D2E]">
              Will You Join Us?
            </h3>

            <BotanicalCardDivider className="mt-4 h-9 w-28 sm:h-10 sm:w-32" />

            <p className="er-font-editorial mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#06231B]/85 sm:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy — we cannot wait to celebrate with you.
            </p>

            {replyBy && (
              <p className="er-font-display mt-5 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#14543D] uppercase sm:text-xs sm:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-7 inline-flex items-center gap-2 bg-[#0B3D2E] px-5 py-3 er-font-display text-[10px] tracking-[0.2em] text-[#F7F3E8] uppercase shadow-[0_10px_22px_-8px_rgba(11,61,46,0.6)] transition-colors duration-300 hover:bg-[#14543D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E] sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.26em]"
            >
              <Heart className="h-4 w-4 fill-[#F7F3E8]/20" />
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

export function EmeraldRoyaleFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#06231B] px-5 pt-12 pb-10 text-center text-[#F7F3E8] sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/emerald-royale.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#06231B]/30 via-transparent to-[#06231B]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="er-font-script text-[2.2rem] leading-none font-normal text-[#FFFDF9] sm:text-[2.6rem]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="er-font-display mt-3 text-[10px] tracking-[0.3em] text-[#C9A227] uppercase sm:text-xs">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-editorial mt-2 text-sm text-[#EFE7D3]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#C9A227]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="er-font-display text-[11px] tracking-[0.26em] text-[#F7F3E8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="er-font-display text-[11px] tracking-[0.26em] text-[#F7F3E8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="er-font-display text-[11px] tracking-[0.26em] text-[#F7F3E8]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="er-font-editorial mt-7 text-xs text-[#EFE7D3]/60 italic">
          Made with love — Emerald Royale
        </p>
      </div>
    </footer>
  );
}
