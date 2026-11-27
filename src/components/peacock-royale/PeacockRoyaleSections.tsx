// Peacock Royale details + RSVP + footer — jewel-box details
// card (arch photo fan + jewel boxes), the feather-framed RSVP
// card section, and the footer. Only the data comes from the site
// (schedule, accommodations, travel + registry notes are the
// couple's editable DetailBlocks).
//
// NO viewport `sm:` anywhere in this file: the RSVP section is
// container-queried (@min-[40rem]:) for the same reason as
// Emerald's round-3 fix — the editor's Mobile (390px) preview
// renders inside a 390px div on a desktop viewport, so viewport
// queries misfire there. The details card uses the same container
// queries for consistency.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock,
  Feather,
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FeatherDivider } from "./Decor";
import {
  PHOTO_HANDS_URL,
  PHOTO_GARDEN_URL,
  COVER_IMAGE_URL,
  RSVP_CARD_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — jewel boxes + arch photo fan                 */
/* ------------------------------------------------------------------ */

export function PeacockRoyaleDetailsCard({
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
    // NOTE: this root IS the @container for the @min-[40rem]: rules
    // used by its descendants — its own padding is fixed, because an
    // element cannot query its own container.
    <div className="relative overflow-hidden bg-[#FDFBF5] px-4 pt-16 pb-20 @container">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#062E2B] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#062E2B]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of jewel tones, golden light, and
          unforgettable moments beneath a fan of peacock feathers.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37] @min-[40rem]:w-24" />
          <Feather className="h-4 w-4 text-[#0B4F4A]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37] @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details Card — deep teal jewel panel */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Deep Teal Jewel Panel */}
          <div className="relative overflow-hidden border-t-4 border-[#D4AF37] bg-[#062E2B] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(4,33,31,0.5)] @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#128C7E]/25 via-transparent to-[#04211F]/60"
            />

            {/* Ivory Detail Card (gold-trimmed inner card) */}
            <div className="relative z-10 overflow-hidden bg-[#FDFBF5] px-5 py-8 text-[#062E2B] shadow-[0_18px_36px_-12px_rgba(4,33,31,0.55)] ring-1 ring-[#D4AF37]/60 @min-[40rem]:px-8 @min-[40rem]:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 border border-[#D4AF37]/80"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-[#0B4F4A]/25"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Arch Photo Fan (three arch-framed photos fanned) */}
                <div className="relative mb-7 flex h-32 w-full items-center justify-center @min-[40rem]:mb-9 @min-[40rem]:h-40">
                  <div className="absolute left-1/2 h-28 w-24 -translate-x-[calc(50%+64px)] -rotate-[7deg] overflow-hidden rounded-t-[999px] bg-white shadow-[0_12px_24px_-8px_rgba(4,33,31,0.45)] ring-2 ring-[#D4AF37]/70 @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:-translate-x-[calc(50%+84px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO_HANDS_URL}
                      alt="Joined hands with a peacock-feather bouquet"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute left-1/2 z-10 h-32 w-28 -translate-x-1/2 overflow-hidden rounded-t-[999px] bg-white shadow-[0_16px_30px_-10px_rgba(4,33,31,0.55)] ring-2 ring-[#D4AF37] @min-[40rem]:h-40 @min-[40rem]:w-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={COVER_IMAGE_URL}
                      alt="Bride and groom beneath a fan of peacock feathers"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-[50%_30%]"
                    />
                  </div>
                  <div className="absolute left-1/2 h-28 w-24 translate-x-[calc(-50%+64px)] rotate-[7deg] overflow-hidden rounded-t-[999px] bg-white shadow-[0_12px_24px_-8px_rgba(4,33,31,0.45)] ring-2 ring-[#D4AF37]/70 @min-[40rem]:h-36 @min-[40rem]:w-32 @min-[40rem]:translate-x-[calc(-50%+84px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PHOTO_GARDEN_URL}
                      alt="Couple walking a feather-lined garden path"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <p className="er-font-display text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="er-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-normal text-[#062E2B] @min-[40rem]:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="er-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#062E2B]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0B4F4A]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <FeatherDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

                {/* Schedule Preview */}
                {schedulePreview.length > 0 && (
                  <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#0B4F4A]">
                          <Clock className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="er-font-display text-[11px] tracking-[0.18em] text-[#062E2B] uppercase @min-[40rem]:text-xs">
                            {event.time} · {event.name}
                          </p>
                          {event.description && (
                            <p className="er-font-editorial mt-0.5 text-sm leading-relaxed text-[#062E2B]/75 italic">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="er-font-editorial pl-11 text-sm text-[#0B4F4A]/80 italic">
                        {`+ ${site.events.length - 3} more moment${site.events.length - 3 === 1 ? "" : "s"} on the day`}
                      </p>
                    )}
                  </div>
                )}

                {/* Dress Code + Accommodations — jewel boxes */}
                {(dressCode || hotelList.length > 0) && (
                  <div className="mt-6 grid w-full max-w-[480px] gap-3 text-left @min-[40rem]:grid-cols-2">
                    {dressCode && (
                      <div className="flex items-start gap-2.5 border-t-4 border-[#D4AF37] bg-[#062E2B] px-4 py-3 text-[#FDFBF5]">
                        <Shirt className="mt-0.5 h-4 w-4 shrink-0 text-[#E7C86A]" />
                        <div>
                          <p className="er-font-display text-[10px] tracking-[0.2em] uppercase">Dress Code</p>
                          <p className="er-font-display mt-1 text-[11px] tracking-[0.14em] uppercase">{dressCode}</p>
                        </div>
                      </div>
                    )}
                    {hotelList.slice(0, 1).map((hotel, i) => (
                      <div
                        key={`${hotel.name}-${i}`}
                        className="flex items-start gap-2.5 border-t-4 border-[#0F766E] bg-[#0F766E]/8 px-4 py-3"
                      >
                        <BedDouble className="mt-0.5 h-4 w-4 shrink-0 text-[#0B4F4A]" />
                        <div>
                          <p className="er-font-display text-[10px] tracking-[0.2em] text-[#0B4F4A] uppercase">Where to Stay</p>
                          <p className="er-font-display mt-1 text-[11px] tracking-[0.14em] text-[#062E2B] uppercase">{hotel.name}</p>
                          {hotel.distance && (
                            <p className="er-font-editorial mt-0.5 text-sm text-[#062E2B]/75 italic">{hotel.distance}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Travel / Registry notes */}
                {travelNotes.map((d, i) => (
                  <div key={`travel-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#0B4F4A]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="er-font-editorial text-sm leading-relaxed text-[#062E2B]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#0B4F4A]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="er-font-editorial text-sm leading-relaxed text-[#062E2B]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Wedding Details */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 bg-[#062E2B] px-6 py-3 er-font-display text-[11px] tracking-[0.26em] text-[#FDFBF5] uppercase shadow-[0_10px_22px_-8px_rgba(4,33,31,0.6)] transition-colors duration-300 hover:bg-[#0B4F4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] @min-[40rem]:text-xs"
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
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#04211F]/50 to-transparent"
            />
          </div>

          {/* Feather + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#0B4F4A]/70">
            <Feather className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#0B4F4A]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RSVPSection — feather-framed card + RSVP jump                     */
/* ------------------------------------------------------------------ */

export function PeacockRoyaleRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    // NOTE: the frame's @container parent is the max-w-[760px] div
    // below; this root's own padding is fixed (no ancestor container
    // exists for it to query).
    <div className="relative overflow-hidden bg-[#FDFBF5] px-4 pt-4 pb-20">
      <div className="@container relative mx-auto max-w-[760px]">
        {/* Feather-Framed Card Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(4,33,31,0.45)]"
        >
          {/* Feather-framed card artwork */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_CARD_URL})` }}
          />

          {/* Text column sits ON the ivory paper. The paper is
              pixel-profiled from the cropped peacock-royale-
              rsvp.jpg (1200x923): the card spans x 2.7%-97.2% and
              y 5.9%-95.7% of the image (the crop is tight around
              the card, with a thin teal-velvet margin). The gold
              feather frame's inner edge sits at roughly x 9-91%
              and y 11-88% — the text column must stay inside it.
              The frame is bg-cover: at mobile widths the frame is
              taller than the image, so the image scales by height
              and the paper covers the full frame width, with its
              top edge at ~5.9% and its bottom edge at ~95.7% of
              the FRAME height — while the text column runs pt -> H-pb.
              CONTAINER QUERIES (same Emerald round-3 lesson): the
              frame's parent is @container, and every sizing rule
              in this section is @min-[40rem]: (container >= 640px)
              — never a viewport `sm:` — so the editor's Mobile
              (390px) preview gets mobile geometry, not desktop
              geometry in a 390px column. DO NOT "simplify" this to
              `@sm:`: Tailwind v4's container `@sm` breakpoint is
              24rem (384px), NOT the 40rem viewport `sm:`.
              Measured margins (paper band 5.9%-95.7% of H, frame
              ornaments ~11%-88%):
              mobile frame (~342px wide, H ~510px): paper 30-488px,
              text 112-382px — margins +82px top, +106px bottom.
              Desktop frame (760px wide, H ~436px): paper 26-417px,
              text 80-340px — margins +54px top, +77px bottom. The
              column is w-[62%] / @min-[40rem]:w-[64%], well inside
              the paper's 2.7-97.2% x-range at every width. */}
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-28 pb-32 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-20 @min-[40rem]:pb-24">
            <p className="er-font-display text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="er-font-display mt-3 text-[1.35rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#062E2B] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <FeatherDivider className="mt-3 h-8 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-10 @min-[40rem]:w-32" />

            <p className="er-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#062E2B]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy — we cannot wait to celebrate with you beneath
              a fan of peacock feathers.
            </p>

            {replyBy && (
              <p className="er-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#0B4F4A] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#062E2B] px-3.5 py-2.5 er-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FDFBF5] uppercase shadow-[0_10px_22px_-8px_rgba(4,33,31,0.6)] transition-colors duration-300 hover:bg-[#0B4F4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FDFBF5]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function PeacockRoyaleFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    // NOTE: this footer IS the @container for the @min-[40rem]: rules
    // used by its descendants — its own padding is fixed, because an
    // element cannot query its own container.
    <footer className="relative overflow-hidden bg-[#04211F] px-5 pt-12 pb-10 text-center text-[#FDFBF5] @container">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#04211F]/30 via-transparent to-[#04211F]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="er-font-script text-[2.2rem] leading-none font-normal text-[#FFFFFF] @min-[40rem]:text-[2.6rem]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="er-font-display mt-3 text-[10px] tracking-[0.3em] text-[#E7C86A] uppercase @min-[40rem]:text-xs">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-editorial mt-2 text-sm text-[#FDFBF5]/80 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="er-font-display text-[11px] tracking-[0.26em] text-[#FDFBF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="er-font-display text-[11px] tracking-[0.26em] text-[#FDFBF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="er-font-display text-[11px] tracking-[0.26em] text-[#FDFBF5]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="er-font-editorial mt-7 text-xs text-[#FDFBF5]/60 italic">
          Made with love — Peacock Royale
        </p>
      </div>
    </footer>
  );
}
