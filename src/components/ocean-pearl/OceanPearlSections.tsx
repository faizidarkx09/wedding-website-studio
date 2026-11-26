// Ocean Pearl details + RSVP + footer — bubble-card details in an
// aqua tide band, the "message in a bottle" RSVP card, and the
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
  Gift,
  Heart,
  MapPin,
  Plane,
  Shirt,
  Users,
  Waves,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { WaveDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  RSVP_IMAGE_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — aqua tide band + bubble cards                */
/* ------------------------------------------------------------------ */

export function OceanPearlDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#F7FBFC] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display mt-3 text-[1.9rem] leading-[1.12] font-bold tracking-[0.02em] text-[#0E3A45] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-body mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#0E3A45]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a day by the sea — sunshine, salt air, and
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
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#2E8B9A]/80 @min-[40rem]:w-24" />
          <Waves className="h-4 w-4 text-[#1F6B78]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#2E8B9A]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Main Details Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px]"
        >
          {/* Aqua Tide Band */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#7FC4CE] via-[#2E8B9A] to-[#1F6B78] px-4 pt-8 pb-6 shadow-[0_24px_48px_-16px_rgba(14,58,69,0.45)] @min-[40rem]:px-6 @min-[40rem]:pt-10 @min-[40rem]:pb-8">
            {/* Pearl Bubble Card */}
            <div className="relative z-10 overflow-hidden rounded-[2rem] bg-white px-5 py-8 text-[#0E3A45] shadow-[0_18px_36px_-12px_rgba(14,58,69,0.55)] @min-[40rem]:px-8 @min-[40rem]:py-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-[#2E8B9A]/50"
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Floating bubble medallions */}
                <div className="mb-6 flex items-center justify-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2E8B9A]/60 bg-[#D8EDEF] text-[#1F6B78]">
                    <Waves className="h-5 w-5" />
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2E8B9A]/60 bg-[#F7FBFC] text-[#1F6B78] shadow-[0_8px_18px_-6px_rgba(14,58,69,0.4)]">
                    <Heart className="h-6 w-6 fill-[#2E8B9A]/30" />
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2E8B9A]/60 bg-[#D8EDEF] text-[#1F6B78]">
                    <Users className="h-5 w-5" />
                  </span>
                </div>

                <p className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase @min-[40rem]:text-xs">
                  {formatShortDate(site.weddingDate, site.timezone)}
                </p>
                <h4 className="op-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-bold text-[#0E3A45] @min-[40rem]:text-[1.75rem]">
                  {site.content.venueName || "Our Wedding Venue"}
                </h4>
                {site.content.venueAddress && (
                  <p className="op-font-body mt-2 flex items-center gap-1.5 text-sm text-[#0E3A45]/80 italic @min-[40rem]:text-[0.95rem]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2E8B9A]" />
                    {site.content.venueAddress}
                  </p>
                )}

                <WaveDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

                {/* Schedule Preview — time bubbles */}
                {schedulePreview.length > 0 && (
                  <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                    {schedulePreview.map((event, i) => (
                      <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2E8B9A]/70 bg-[#D8EDEF] text-center text-[9px] leading-tight font-bold tracking-wide text-[#0E3A45]">
                          {event.time}
                        </span>
                        <div className="min-w-0 pt-1">
                          <p className="op-font-display text-[11px] font-semibold tracking-[0.18em] text-[#0E3A45] uppercase @min-[40rem]:text-xs">
                            {event.name}
                          </p>
                          {event.description && (
                            <p className="op-font-body mt-0.5 text-sm leading-relaxed text-[#0E3A45]/75 italic">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {site.events.length > 3 && (
                      <p className="op-font-body pl-14 text-sm text-[#1F6B78]/80 italic">
                        + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                      </p>
                    )}
                  </div>
                )}

                {/* Dress Code */}
                {dressCode && (
                  <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#2E8B9A]/60 bg-[#D8EDEF]/70 px-4 py-2">
                    <Shirt className="h-4 w-4 shrink-0 text-[#1F6B78]" />
                    <span className="op-font-display text-[10px] font-semibold tracking-[0.2em] text-[#0E3A45] uppercase @min-[40rem]:text-[11px]">
                      Dress Code: {dressCode}
                    </span>
                  </div>
                )}

                {/* Accommodations Preview — bubble cards */}
                {hotelList.length > 0 && (
                  <div className="mt-6 grid w-full max-w-[560px] gap-3 text-left @min-[40rem]:grid-cols-2">
                    {hotelList.map((hotel, i) => (
                      <div
                        key={`${hotel.name}-${i}`}
                        className="flex items-start gap-3 rounded-[1.5rem] border border-[#2E8B9A]/40 bg-[#F7FBFC] px-4 py-4"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2E8B9A]/70 bg-[#D8EDEF] text-[#1F6B78]">
                          <BedDouble className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="op-font-display text-[11px] font-semibold tracking-[0.14em] text-[#0E3A45] uppercase @min-[40rem]:text-xs">
                            {hotel.name}
                          </p>
                          {hotel.distance && (
                            <p className="op-font-body mt-0.5 text-sm text-[#0E3A45]/75 italic">
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
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2E8B9A]/70 bg-[#D8EDEF] text-[#1F6B78]">
                      <Plane className="h-3.5 w-3.5" />
                    </span>
                    <p className="op-font-body text-sm leading-relaxed text-[#0E3A45]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}
                {registryNotes.map((d, i) => (
                  <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[480px] items-start gap-3 text-left">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2E8B9A]/70 bg-[#D8EDEF] text-[#1F6B78]">
                      <Gift className="h-3.5 w-3.5" />
                    </span>
                    <p className="op-font-body text-sm leading-relaxed text-[#0E3A45]/80 italic">
                      {d.body}
                    </p>
                  </div>
                ))}

                {/* View Full Wedding Details */}
                <button
                  type="button"
                  onClick={onOpenDetails}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#0E3A45] px-6 py-3 op-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F7FBFC] uppercase shadow-[0_10px_22px_-8px_rgba(14,58,69,0.6)] transition-colors duration-300 hover:bg-[#164E5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45] @min-[40rem]:text-xs"
                >
                  <CalendarDays className="h-4 w-4" />
                  View Full Wedding Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Wave + Heart accent row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-[#1F6B78]/70">
            <Waves className="h-4 w-4" />
            <Heart className="h-4 w-4 fill-[#2E8B9A]/30" />
            <Users className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — "message in a bottle" card                          */
/* ------------------------------------------------------------------ */

export function OceanPearlRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      {/* Message-in-a-bottle photo backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${RSVP_IMAGE_URL})` }}
      />
      {/* Deep-sea wash so the pearl bottle card pops and stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14, 58, 69, 0.42) 0%, rgba(14, 58, 69, 0.18) 40%, rgba(14, 58, 69, 0.48) 100%)",
        }}
      />

      {/* The bottle — narrow, centred. The text column IS the bottle
          card (max-w-[420px], px-6): every line of copy and the
          button sit on the pearl paper by construction, never on the
          photo. The photo is a decorative backdrop only — there is
          no photo-paper to measure against, unlike the torn-paper
          RSVP it replaces. Container queries throughout (@container
          on this section, `@min-[40rem]:` = container >= 640px):
          the editor Mobile preview is a 390px div on a desktop
          viewport, so viewport `sm:` would apply desktop padding in
          a mobile column and push the button off the paper. DO NOT
          "simplify" to `sm:`. Margins are ESTIMATES from the card
          geometry, not live-measured — the coordinator must
          live-verify at 390px / 320px / desktop before calling
          this done. */}
      <div className="relative z-10 mx-auto flex max-w-[420px] flex-col items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full flex-col items-center"
        >
          {/* Bottle neck + cork */}
          <div aria-hidden="true" className="flex flex-col items-center">
            <div className="h-4 w-11 rounded-t-md bg-[#E9DCC8] shadow-[0_2px_6px_rgba(14,58,69,0.35)]" />
            <div className="h-9 w-14 border-x border-[#2E8B9A]/40 bg-[#F7FBFC]/95" />
          </div>

          {/* Bottle body — the paper the text sits on */}
          <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#F7FBFC] px-6 pt-7 pb-9 text-center shadow-[0_24px_48px_-16px_rgba(14,58,69,0.55)] @min-[40rem]:px-9 @min-[40rem]:pt-9 @min-[40rem]:pb-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-[#2E8B9A]/50"
            />
            <div className="relative z-10 flex flex-col items-center">
              <p className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase @min-[40rem]:text-xs">
                RSVP
              </p>
              <h3 className="op-font-display mt-3 text-[1.35rem] leading-[1.15] font-bold tracking-[0.02em] text-balance text-[#0E3A45] @min-[40rem]:text-[1.7rem]">
                Will You Join Us?
              </h3>

              <WaveDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

              <p className="op-font-body mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#0E3A45]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
                Your presence is the greatest gift. Please let us know if you can
                share in our joy — send your message in a bottle.
              </p>

              {replyBy && (
                <p className="op-font-display mt-4 text-[10px] leading-[1.9] font-semibold tracking-[0.12em] text-balance text-[#1F6B78] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                  {replyBy}
                </p>
              )}

              <button
                type="button"
                onClick={onJumpToRsvp}
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[#0E3A45] px-6 py-3 op-font-display text-[11px] font-semibold tracking-[0.22em] whitespace-nowrap text-[#F7FBFC] uppercase shadow-[0_10px_22px_-8px_rgba(14,58,69,0.6)] transition-colors duration-300 hover:bg-[#164E5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
              >
                <Heart className="h-3.5 w-3.5 fill-[#F7FBFC]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function OceanPearlFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#0E3A45] px-5 pt-12 pb-10 text-center text-[#F7FBFC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0E3A45]/30 via-transparent to-[#0E3A45]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="op-font-display text-[1.9rem] leading-none font-bold tracking-[0.04em] text-white uppercase">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="op-font-display mt-3 text-[10px] font-semibold tracking-[0.3em] text-[#7FC4CE] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="op-font-body mt-2 text-sm text-[#D8EDEF]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#2E8B9A]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="op-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F7FBFC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FC4CE]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="op-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F7FBFC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FC4CE]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="op-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F7FBFC]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FC4CE]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="op-font-body mt-7 text-xs text-[#D8EDEF]/60 italic">
          Made with love — Ocean Pearl
        </p>
      </div>
    </footer>
  );
}
