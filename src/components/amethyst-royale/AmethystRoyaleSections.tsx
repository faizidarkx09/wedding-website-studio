// Amethyst Royale details + RSVP + footer — crystal panels in a
// staggered grid (not a sleeve), the gem-shaped hexagon RSVP card
// over the crystal-border photograph, and the footer. Only the data
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
  Gem,
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FacetDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  PHOTO_HANDS_URL,
  PHOTO_SUNSET_URL,
  PHOTO_VEIL_URL,
  RSVP_GEM_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* CrystalPanel — a white faceted panel with a hexagonal icon chip   */
/* ------------------------------------------------------------------ */

function CrystalPanel({
  icon,
  title,
  children,
  wide = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#FFFDFF] px-5 py-7 text-left text-[#2E1065] shadow-[0_18px_36px_-14px_rgba(46,16,101,0.35)] ring-1 ring-[#7C3AED]/25 @min-[40rem]:px-7 @min-[40rem]:py-8 ${
        wide ? "@min-[40rem]:col-span-2" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7C3AED]/35"
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#4C1D95] text-[#E9D5FF]"
            style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}
          >
            {icon}
          </span>
          <h4 className="ar-font-display text-[1.15rem] leading-[1.2] font-normal tracking-[0.04em] text-[#2E1065] @min-[40rem]:text-[1.3rem]">
            {title}
          </h4>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — staggered crystal panels                     */
/* ------------------------------------------------------------------ */

export function AmethystRoyaleDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#F5F0FA] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E1065] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#2E1065]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for an evening of amethyst light, joy, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#7C3AED]/80 @min-[40rem]:w-24" />
          <Gem className="h-4 w-4 text-[#5B21B6]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#7C3AED]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Staggered Crystal Panels — 2 columns on wide containers,
            single column on mobile; odd panels sit lower for a
            faceted stagger. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid w-full max-w-[820px] gap-5 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-6"
        >
          {/* Venue + Schedule (wide panel) */}
          <CrystalPanel
            wide
            icon={<CalendarDays className="h-4 w-4" />}
            title={site.content.venueName || "Our Wedding Venue"}
          >
            <p className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase @min-[40rem]:text-xs">
              {formatShortDate(site.weddingDate, site.timezone)}
            </p>
            {site.content.venueAddress && (
              <p className="ar-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#2E1065]/80 italic @min-[40rem]:text-[0.95rem]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5B21B6]" />
                {site.content.venueAddress}
              </p>
            )}

            <FacetDivider className="mt-5 h-8 w-24 @min-[40rem]:h-9 @min-[40rem]:w-28" />

            {schedulePreview.length > 0 && (
              <div className="mt-4 space-y-3">
                {schedulePreview.map((event, i) => (
                  <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 bg-[#7C3AED]"
                    />
                    <div className="min-w-0">
                      <p className="ar-font-display text-[11px] tracking-[0.18em] text-[#2E1065] uppercase @min-[40rem]:text-xs">
                        {event.time} · {event.name}
                      </p>
                      {event.description && (
                        <p className="ar-font-editorial mt-0.5 text-sm leading-relaxed text-[#2E1065]/75 italic">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {site.events.length > 3 && (
                  <p className="ar-font-editorial pl-5 text-sm text-[#5B21B6]/80 italic">
                    + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                  </p>
                )}
              </div>
            )}
          </CrystalPanel>

          {/* Dress Code */}
          {dressCode && (
            <CrystalPanel icon={<Shirt className="h-4 w-4" />} title="Dress Code">
              <p className="ar-font-display text-[12px] tracking-[0.22em] uppercase @min-[40rem]:text-sm">
                {dressCode}
              </p>
              <p className="ar-font-editorial mt-2 text-sm leading-relaxed text-[#2E1065]/80 italic">
                We kindly ask our guests to dress in their finest — formal attire in deep,
                violet tones is warmly welcomed.
              </p>
            </CrystalPanel>
          )}

          {/* Accommodations */}
          {hotelList.length > 0 && (
            <CrystalPanel icon={<BedDouble className="h-4 w-4" />} title="Where to Stay">
              <div className="space-y-2.5">
                {hotelList.map((hotel, i) => (
                  <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 bg-[#7C3AED]"
                    />
                    <div className="min-w-0">
                      <p className="ar-font-display text-[11px] tracking-[0.18em] text-[#2E1065] uppercase @min-[40rem]:text-xs">
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p className="ar-font-editorial mt-0.5 text-sm text-[#2E1065]/75 italic">
                          {hotel.distance}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CrystalPanel>
          )}

          {/* Travel / Registry notes */}
          {(travelNotes.length > 0 || registryNotes.length > 0) && (
            <CrystalPanel icon={<Plane className="h-4 w-4" />} title="Travel & Gifts">
              {travelNotes.map((d, i) => (
                <p key={`travel-${i}`} className="ar-font-editorial text-sm leading-relaxed text-[#2E1065]/80 italic">
                  {d.body}
                </p>
              ))}
              {registryNotes.map((d, i) => (
                <p key={`registry-${i}`} className="ar-font-editorial mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#2E1065]/80 italic">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#5B21B6]" />
                  {d.body}
                </p>
              ))}
            </CrystalPanel>
          )}

          {/* Small photo strip inside the grid */}
          <div className="relative grid grid-cols-3 gap-2 @min-[40rem]:col-span-2">
            {[PHOTO_HANDS_URL, PHOTO_SUNSET_URL, PHOTO_VEIL_URL].map((src, i) => (
              <div key={src} className={`relative aspect-[4/3] overflow-hidden ${i === 1 ? "@min-[40rem]:-translate-y-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i === 0 ? "Joined hands with wedding rings" : i === 1 ? "Lavender sunset over the venue" : "Bride's veil in violet light"}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* View Full Wedding Details */}
        <motion.button
          type="button"
          onClick={onOpenDetails}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group mt-10 inline-flex items-center gap-2 bg-[#2E1065] px-6 py-3 ar-font-display text-[11px] tracking-[0.26em] text-[#F5F0FA] uppercase shadow-[0_10px_22px_-8px_rgba(46,16,101,0.6)] transition-colors duration-300 hover:bg-[#4C1D95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1065] @min-[40rem]:text-xs"
        >
          <CalendarDays className="h-4 w-4" />
          View Full Wedding Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>

        {/* Gem + Heart accent row */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[#5B21B6]/70">
          <Gem className="h-4 w-4" />
          <Heart className="h-4 w-4 fill-[#5B21B6]/30" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — gem-shaped hexagon card over the crystal border    */
/* ------------------------------------------------------------------ */

export function AmethystRoyaleRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#F5F0FA] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      {/* Crystal-border photograph as the section backdrop, softened
          with a lavender wash so the gem card reads clearly. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${RSVP_GEM_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F5F0FA]/70 via-[#F5F0FA]/40 to-[#F5F0FA]/80"
      />

      <div className="relative mx-auto max-w-[760px]">
        {/* Gem-shaped hexagon card. The card is CSS (clip-path), so
            the text is ALWAYS on the card at every width — no image
            measurement, no padding estimates. The flat-top hexagon
            (25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)
            narrows toward its top and bottom points, so the text
            column is 58% wide and the vertical padding is generous
            (pt-20/pb-20): at the eyebrow's height the card already
            spans ~17%–83%, and the column sits at 21%–79% — inside
            with margin at 320px, 390px, 430px and desktop alike.
            The drop-shadow lives on the wrapper (filter) so it
            follows the clipped shape instead of being cut off.
            Container queries throughout (@container on the section,
            `@min-[40rem]:` = container >= 640px): the editor
            Mobile preview is a 390px div on a desktop viewport, so
            viewport `sm:` would apply desktop padding in a mobile
            column. DO NOT "simplify" to `sm:`. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative drop-shadow-[0_24px_48px_-16px_rgba(46,16,101,0.45)]"
        >
          <div
            className="relative bg-[#FFFDFF]"
            style={{
              clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
            }}
          >
            <div className="relative z-10 mx-auto flex w-[58%] min-w-0 flex-col items-center pt-20 pb-20 text-center @min-[40rem]:w-[56%] @min-[40rem]:pt-24 @min-[40rem]:pb-24">
              <p className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase @min-[40rem]:text-xs">
                RSVP
              </p>
              <h3 className="ar-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#2E1065] @min-[40rem]:text-[1.9rem]">
                Will You Join Us?
              </h3>

              <FacetDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

              <p className="ar-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#2E1065]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
                Your presence is the greatest gift. Please let us know if you can
                share in our joy.
              </p>

              {replyBy && (
                <p className="ar-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#5B21B6] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                  {replyBy}
                </p>
              )}

              <button
                type="button"
                onClick={onJumpToRsvp}
                className="group mt-4 inline-flex items-center gap-2 bg-[#2E1065] px-3.5 py-2.5 ar-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#F5F0FA] uppercase shadow-[0_10px_22px_-8px_rgba(46,16,101,0.6)] transition-colors duration-300 hover:bg-[#4C1D95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1065] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
              >
                <Heart className="h-3.5 w-3.5 fill-[#F5F0FA]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function AmethystRoyaleFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#2E1065] px-5 pt-12 pb-10 text-center text-[#F5F0FA]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2E1065]/30 via-transparent to-[#2E1065]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="ar-font-script text-[2.2rem] leading-none font-normal text-[#FFFDFF]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="ar-font-display mt-3 text-[10px] tracking-[0.3em] text-[#C4B5FD] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="ar-font-editorial mt-2 text-sm text-[#E9D5FF]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#7C3AED]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="ar-font-display text-[11px] tracking-[0.26em] text-[#F5F0FA]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="ar-font-display text-[11px] tracking-[0.26em] text-[#F5F0FA]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="ar-font-display text-[11px] tracking-[0.26em] text-[#F5F0FA]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="ar-font-editorial mt-7 text-xs text-[#E9D5FF]/60 italic">
          Made with love — Amethyst Royale
        </p>
      </div>
    </footer>
  );
}
