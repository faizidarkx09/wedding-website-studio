// Tropical Palm details + RSVP + footer — details as palm-framed
// tiles (venue, schedule, dress code, hotels in a green frame with
// palm-leaf corners), the palm-leaf-card RSVP section, and the
// footer. Only the data comes from the site (schedule,
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
  Palmtree,
  Plane,
  Shirt,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PalmDivider } from "./Decor";
import {
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  PALM_LEAF_RSVP_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* PalmTile — one framed tile inside the details grid                */
/* ------------------------------------------------------------------ */

function PalmTile({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-[#FFFDF6] px-5 py-6 text-left text-[#14301C] shadow-[0_14px_28px_-12px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30">
      {/* Palm-leaf corner accents */}
      <Palmtree
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 -right-2 h-10 w-10 rotate-12 text-[#15803D]/15"
      />
      <Palmtree
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 -left-2 h-10 w-10 -rotate-45 text-[#06B6D4]/15"
      />
      <div className="relative z-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#15803D]/60 bg-[#FFFBEB] text-[#166534]">
          {icon}
        </span>
        <p className="tp-font-display mt-4 text-[11px] tracking-[0.22em] text-[#14301C] uppercase">
          {title}
        </p>
        <div className="mt-2.5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — palm-framed tiles + photo strip              */
/* ------------------------------------------------------------------ */

export function TropicalPalmDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#FFFBEB] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14301C] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#14301C]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a day of sun, sea and sand — and
          unforgettable moments under the palms.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#15803D]/80 @min-[40rem]:w-24" />
          <Palmtree className="h-4 w-4 text-[#166534]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#15803D]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Palm-framed tile grid */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Deep-palm frame */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#15803D] via-[#14532D] to-[#0E7490] p-3 shadow-[0_24px_48px_-16px_rgba(20,83,45,0.45)] @min-[40rem]:p-4">
            <div className="relative z-10 grid grid-cols-1 gap-3 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-4">
              {/* Venue tile */}
              <PalmTile icon={<MapPin className="h-4 w-4" />} title="The Venue">
                <p className="tp-font-display text-[1.05rem] leading-snug text-[#14301C]">
                  {site.content.venueName || "Our Wedding Venue"}
                </p>
                {site.content.venueAddress && (
                  <p className="tp-font-editorial mt-1.5 text-sm leading-relaxed text-[#14301C]/75 italic">
                    {site.content.venueAddress}
                  </p>
                )}
                <p className="tp-font-display mt-2 text-[10px] tracking-[0.24em] text-[#0E7490] uppercase">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
              </PalmTile>

              {/* Schedule tile */}
              {schedulePreview.length > 0 && (
                <PalmTile icon={<Clock className="h-4 w-4" />} title="The Day's Flow">
                  <div className="space-y-2.5">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`}>
                        <p className="tp-font-display text-[11px] tracking-[0.14em] text-[#14301C] uppercase">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p className="tp-font-editorial mt-0.5 text-sm leading-relaxed text-[#14301C]/75 italic">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="tp-font-editorial text-sm text-[#166534]/80 italic">
                        + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                      </p>
                    )}
                  </div>
                </PalmTile>
              )}

              {/* Dress code tile */}
              {dressCode && (
                <PalmTile icon={<Shirt className="h-4 w-4" />} title="Dress Code">
                  <p className="tp-font-editorial text-[0.95rem] leading-relaxed text-[#14301C]/85 italic">
                    {dressCode}
                  </p>
                  <p className="tp-font-editorial mt-2 text-sm text-[#14301C]/60 italic">
                    Light fabrics, island colours — and comfortable shoes for the sand.
                  </p>
                </PalmTile>
              )}

              {/* Accommodations tile */}
              {hotelList.length > 0 && (
                <PalmTile icon={<BedDouble className="h-4 w-4" />} title="Where to Stay">
                  <div className="space-y-2.5">
                    {hotelList.map((hotel, i) => (
                      <div key={`${hotel.name}-${i}`}>
                        <p className="tp-font-display text-[11px] tracking-[0.14em] text-[#14301C] uppercase">
                          {hotel.name}
                        </p>
                        {hotel.distance && (
                          <p className="tp-font-editorial mt-0.5 text-sm text-[#14301C]/75 italic">
                            {hotel.distance}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </PalmTile>
              )}

              {/* Travel / registry notes span the full row */}
              {travelNotes.map((d, i) => (
                <div
                  key={`travel-${i}`}
                  className="relative overflow-hidden bg-[#FFFDF6] px-5 py-5 text-left text-[#14301C] shadow-[0_14px_28px_-12px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30 @min-[40rem]:col-span-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#15803D]/60 bg-[#FFFBEB] text-[#166534]">
                      <Plane className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="tp-font-display text-[11px] tracking-[0.22em] text-[#14301C] uppercase">
                        Getting There
                      </p>
                      <p className="tp-font-editorial mt-1.5 text-sm leading-relaxed text-[#14301C]/80 italic">
                        {d.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {registryNotes.map((d, i) => (
                <div
                  key={`registry-${i}`}
                  className="relative overflow-hidden bg-[#FFFDF6] px-5 py-5 text-left text-[#14301C] shadow-[0_14px_28px_-12px_rgba(20,83,45,0.35)] ring-1 ring-[#15803D]/30 @min-[40rem]:col-span-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#15803D]/60 bg-[#FFFBEB] text-[#166534]">
                      <Gift className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="tp-font-display text-[11px] tracking-[0.22em] text-[#14301C] uppercase">
                        Gifts &amp; Registry
                      </p>
                      <p className="tp-font-editorial mt-1.5 text-sm leading-relaxed text-[#14301C]/80 italic">
                        {d.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo strip along the frame's base */}
            <div className="relative z-10 mt-3 grid grid-cols-3 gap-3 @min-[40rem]:mt-4 @min-[40rem]:gap-4">
              {[
                { src: PHOTO_HANDS_URL, alt: "Joined hands with wedding rings" },
                { src: PHOTO_SUNSET_URL, alt: "Golden-hour sunset over the sea" },
                { src: PHOTO_VEIL_URL, alt: "Bride's veil in island light" },
              ].map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/3] overflow-hidden bg-white p-1 pb-4 shadow-[0_12px_24px_-8px_rgba(10,46,25,0.5)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* View Full Wedding Details */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onOpenDetails}
              className="group inline-flex items-center gap-2 bg-[#14532D] px-6 py-3 tp-font-display text-[11px] tracking-[0.26em] text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] @min-[40rem]:text-xs"
            >
              <CalendarDays className="h-4 w-4" />
              View Full Wedding Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Palm + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#166534]/70">
            <Palmtree className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#166534]/30" />
            <Users className="h-4 w-4" />
            <Sun className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — palm-leaf card + RSVP jump                          */
/* ------------------------------------------------------------------ */

export function TropicalPalmRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFFBEB] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Palm-Leaf Card Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(20,83,45,0.4)]"
        >
          {/* Palm-leaf card texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PALM_LEAF_RSVP_URL})` }}
          />

          {/* Text column sits ON the cream paper. The paper is
              eye-measured from rsvp-paper.jpg (1920x1280): the
              smooth cream panel spans x 11.6%-88.5% and y 11%-88%
              of the image (palm fronds + a thin turquoise border
              all round; the turquoise rule itself sits at x
              1.4%-98.5%, y 1.8%-98%). The frame is bg-cover, so the
              cream maps to the same fractions of the frame whenever
              the frame is height-driven (mobile + editor preview),
              and to the image's scaled height when width-driven
              (desktop).
              Column width 62% (x 19%-81%) sits well inside the
              cream horizontally. Vertically the padding is sized
              from the 11%/88% bounds: mobile pt-28 (112px) /
              pb-32 (128px), wide-container pt-24 (96px) /
              pb-28 (112px) — the panel is roomier than Golden
              Hour's torn paper (19%-81%), so these paddings keep
              the eyebrow ~+30px below the cream's top edge and the
              button ~+35px above its bottom edge on mobile. These
              are ESTIMATES from the image measurement, not
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
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-28 pb-32 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-24 @min-[40rem]:pb-28">
            <p className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="tp-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#14301C] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <PalmDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="tp-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#14301C]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy beneath the palms.
            </p>

            {replyBy && (
              <p className="tp-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#0E7490] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#14532D] px-3.5 py-2.5 tp-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FFFBEB]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function TropicalPalmFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#0A2E19] px-5 pt-12 pb-10 text-center text-[#FFFBEB]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(/images/themes/tropical-palm.jpg)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A2E19]/30 via-transparent to-[#0A2E19]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="tp-font-script text-[2.2rem] leading-none font-normal text-[#FFFDF9]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="tp-font-display mt-3 text-[10px] tracking-[0.3em] text-[#FDE68A] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="tp-font-editorial mt-2 text-sm text-[#FEF3C7]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#06B6D4]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="tp-font-display text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06B6D4]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="tp-font-display text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06B6D4]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="tp-font-display text-[11px] tracking-[0.26em] text-[#FFFBEB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06B6D4]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="tp-font-editorial mt-7 text-xs text-[#FEF3C7]/60 italic">
          Made with love — Tropical Palm
        </p>
      </div>
    </footer>
  );
}
