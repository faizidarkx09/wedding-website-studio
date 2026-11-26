// Aurora details + RSVP + footer — details in frosted aurora
// glass panels, the RSVP as a glowing-edge card over a dark aurora
// sky, and the footer. Only the data comes from the site (schedule,
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
  MoonStar,
  Plane,
  Shirt,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { AuroraDivider } from "./Decor";
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
/* GlassPanel — frosted aurora glass panel                           */
/* ------------------------------------------------------------------ */

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#5EEAD4]/25 bg-white/[0.06] shadow-[0_18px_36px_-14px_rgba(2,6,23,0.7)] backdrop-blur-md ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(20, 184, 166, 0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — aurora glass panels                          */
/* ------------------------------------------------------------------ */

export function AuroraDetailsCard({
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
    <div className="@container relative overflow-hidden bg-[#0F172A] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 85% 0%, rgba(139, 92, 246, 0.14) 0%, transparent 60%), radial-gradient(ellipse 70% 45% at 10% 100%, rgba(20, 184, 166, 0.12) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-3 text-[1.9rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#F4F7FB] @min-[40rem]:text-[2.3rem]"
        >
          The Celebration Awaits
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#E2E8F0]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planned for a night beneath the lights — joy,
          wonder, and unforgettable moments.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#5EEAD4]/80 @min-[40rem]:w-24" />
          <MoonStar className="h-4 w-4 text-[#5EEAD4]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#8B5CF6]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Glass Panels — venue + schedule in one panel, then a
            2-col grid of dress code / hotels / travel / registry */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px] text-left"
        >
          <GlassPanel className="px-5 py-8 @min-[40rem]:px-8 @min-[40rem]:py-10">
            <div className="flex flex-col items-center text-center">
              <p className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase @min-[40rem]:text-xs">
                {formatShortDate(site.weddingDate, site.timezone)}
              </p>
              <h4 className="au-font-display mt-2 max-w-[520px] text-[1.45rem] leading-[1.2] font-semibold text-[#F4F7FB] @min-[40rem]:text-[1.75rem]">
                {site.content.venueName || "Our Wedding Venue"}
              </h4>
              {site.content.venueAddress && (
                <p className="au-font-editorial mt-2 flex items-center gap-1.5 text-sm text-[#E2E8F0]/85 italic @min-[40rem]:text-[0.95rem]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5EEAD4]" />
                  {site.content.venueAddress}
                </p>
              )}

              <AuroraDivider className="mt-5 h-9 w-28 @min-[40rem]:h-10 @min-[40rem]:w-32" />

              {/* Schedule Preview */}
              {schedulePreview.length > 0 && (
                <div className="mt-5 w-full max-w-[480px] space-y-3 text-left">
                  {schedulePreview.map((event, i) => (
                    <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="au-font-display text-[11px] font-semibold tracking-[0.18em] text-[#F4F7FB] uppercase @min-[40rem]:text-xs">
                          {event.time} · {event.name}
                        </p>
                        {event.description && (
                          <p className="au-font-editorial mt-0.5 text-sm leading-relaxed text-[#E2E8F0]/75 italic">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {site.events.length > 3 && (
                    <p className="au-font-editorial pl-11 text-sm text-[#5EEAD4]/85 italic">
                      + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
                    </p>
                  )}
                </div>
              )}
            </div>
          </GlassPanel>

          <div className="mt-5 grid gap-5 @min-[40rem]:grid-cols-2">
            {/* Dress Code */}
            {dressCode && (
              <GlassPanel className="flex items-start gap-4 px-5 py-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                  <Shirt className="h-4 w-4" />
                </span>
                <div>
                  <h5 className="au-font-display text-[1.1rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB]">
                    Dress Code
                  </h5>
                  <p className="au-font-display mt-2 text-[12px] font-semibold tracking-[0.22em] text-[#5EEAD4] uppercase">
                    {dressCode}
                  </p>
                </div>
              </GlassPanel>
            )}

            {/* Accommodations Preview */}
            {hotelList.length > 0 && (
              <GlassPanel className="px-5 py-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <h5 className="au-font-display text-[1.1rem] leading-none font-semibold tracking-[0.04em] text-[#F4F7FB]">
                    Where to Stay
                  </h5>
                </div>
                <div className="mt-4 space-y-2.5">
                  {hotelList.map((hotel, i) => (
                    <div key={`${hotel.name}-${i}`}>
                      <p className="au-font-display text-[11px] font-semibold tracking-[0.18em] text-[#F4F7FB] uppercase @min-[40rem]:text-xs">
                        {hotel.name}
                      </p>
                      {hotel.distance && (
                        <p className="au-font-editorial mt-0.5 text-sm text-[#E2E8F0]/75 italic">
                          {hotel.distance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Travel notes */}
            {travelNotes.map((d, i) => (
              <GlassPanel key={`travel-${i}`} className="flex items-start gap-3 px-5 py-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                  <Plane className="h-3.5 w-3.5" />
                </span>
                <p className="au-font-editorial text-sm leading-relaxed text-[#E2E8F0]/85 italic">
                  {d.body}
                </p>
              </GlassPanel>
            ))}

            {/* Registry notes */}
            {registryNotes.map((d, i) => (
              <GlassPanel key={`registry-${i}`} className="flex items-start gap-3 px-5 py-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[#5EEAD4]">
                  <Gift className="h-3.5 w-3.5" />
                </span>
                <p className="au-font-editorial text-sm leading-relaxed text-[#E2E8F0]/85 italic">
                  {d.body}
                </p>
              </GlassPanel>
            ))}
          </div>

          {/* View Full Wedding Details */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onOpenDetails}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#0F766E] to-[#6D28D9] px-6 py-3 au-font-display text-[11px] font-semibold tracking-[0.26em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(2,6,23,0.8)] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4] @min-[40rem]:text-xs"
            >
              <CalendarDays className="h-4 w-4" />
              View Full Wedding Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Moon + Heart accent row */}
        <div className="mt-5 flex items-center justify-center gap-4 text-[#5EEAD4]/70">
          <MoonStar className="h-4 w-4" />
          <Heart className="h-4 w-4 fill-[#5EEAD4]/30" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — glowing-edge card over a dark aurora sky            */
/* ------------------------------------------------------------------ */

export function AuroraRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#020617] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      {/* Dark aurora sky backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${RSVP_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]/70"
      />

      <div className="relative mx-auto max-w-[760px]">
        {/* Glowing-edge card — the RSVP text sits ENTIRELY on the
            opaque night card (never on the photo itself), so the
            copy and the button are readable at every width
            (320/390/430/768/1280/1440). The photo is only a dim
            backdrop behind the card. The gradient border is a
            1.5px teal→violet frame with a soft outer glow; the card
            is 95% opaque night so no photo brightness leaks through
            the text. Container queries throughout (@container on the
            section, `@min-[40rem]:` = container >= 640px): the
            editor Mobile preview is a 390px div on a desktop
            viewport, so viewport `sm:` would apply desktop padding
            in a mobile column and push the button off the card. DO
            NOT "simplify" to `sm:`. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl bg-gradient-to-br from-[#14B8A6] via-[#5EEAD4]/40 to-[#8B5CF6] p-[1.5px] shadow-[0_0_48px_rgba(20,184,166,0.28),0_24px_48px_-16px_rgba(2,6,23,0.8)]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0F172A]/95 px-6 py-12 text-center @min-[40rem]:px-12 @min-[40rem]:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(20, 184, 166, 0.16) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10 mx-auto flex max-w-[520px] flex-col items-center">
              <p className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase @min-[40rem]:text-xs">
                RSVP
              </p>
              <h3 className="au-font-display mt-3 text-[1.5rem] leading-[1.15] font-semibold tracking-[0.02em] text-balance text-[#F4F7FB] @min-[40rem]:text-[1.9rem]">
                Will You Join Us?
              </h3>

              <AuroraDivider className="mt-4 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

              <p className="au-font-editorial mt-4 max-w-[520px] text-[1rem] leading-[1.75] text-[#E2E8F0]/90 @min-[40rem]:text-[1.06rem]">
                Your presence is the greatest gift. Please let us know if you can share in
                our joy beneath the northern lights.
              </p>

              {replyBy && (
                <p className="au-font-display mt-5 text-[10px] leading-[1.9] font-semibold tracking-[0.12em] text-balance text-[#5EEAD4] uppercase @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                  {replyBy}
                </p>
              )}

              <button
                type="button"
                onClick={onJumpToRsvp}
                className="group mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#0F766E] to-[#6D28D9] px-7 py-3.5 au-font-display text-[11px] font-semibold tracking-[0.26em] whitespace-nowrap text-white uppercase shadow-[0_10px_22px_-8px_rgba(2,6,23,0.8)] transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4] @min-[40rem]:text-xs"
              >
                <Heart className="h-4 w-4 fill-white/20" />
                Kindly Respond
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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

export function AuroraFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#020617] px-5 pt-12 pb-10 text-center text-[#F4F7FB]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/75"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="au-font-script text-[2.2rem] leading-none font-normal text-[#F8FAFC]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="au-font-display mt-3 text-[10px] font-semibold tracking-[0.3em] text-[#5EEAD4] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="au-font-editorial mt-2 text-sm text-[#E2E8F0]/80 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#5EEAD4]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="au-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F4F7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="au-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F4F7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="au-font-display text-[11px] font-semibold tracking-[0.26em] text-[#F4F7FB]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="au-font-editorial mt-7 text-xs text-[#E2E8F0]/60 italic">
          Made with love — Aurora
        </p>
      </div>
    </footer>
  );
}
