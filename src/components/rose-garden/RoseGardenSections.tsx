// Rose Garden details + RSVP + footer — details in "seed packet"
// cards (Ceremony, Reception, Venue), the rose-bordered letter RSVP
// section, and the footer. Only the data comes from the site
// (schedule, accommodations, travel + registry notes are the
// couple's editable DetailBlocks).
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
  Sun,
  Users,
} from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { RoseDivider, RoseMark } from "./Decor";
import {
  RSVP_LETTER_URL,
  STORY_HANDS_URL,
  accommodations,
  footerLocation,
  formatDateDisplay,
  formatShortDate,
  rsvpReplyBy,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* Seed packets — Ceremony / Reception / Venue                       */
/* ------------------------------------------------------------------ */

interface SeedPacket {
  label: string;
  title: string;
  lines: string[];
  footer: string;
}

function seedPackets(site: WeddingSite): SeedPacket[] {
  const byName = (needle: string) =>
    site.events.find((e) => e.name.toLowerCase().includes(needle));
  const ceremony = byName("ceremony") ?? site.events[0];
  const reception = byName("reception") ?? site.events[1];
  const packets: SeedPacket[] = [];
  if (ceremony) {
    packets.push({
      label: "Packet No. 01",
      title: "The Ceremony",
      lines: [
        ceremony.time ? `${ceremony.time} · ${formatShortDate(site.weddingDate, site.timezone)}` : "",
        ceremony.venue || "",
        ceremony.description || "",
      ].filter(Boolean),
      footer: "Sow with love",
    });
  }
  if (reception) {
    packets.push({
      label: "Packet No. 02",
      title: "The Reception",
      lines: [
        reception.time ? `${reception.time} · ${formatShortDate(site.weddingDate, site.timezone)}` : "",
        reception.venue || "",
        reception.description || "",
      ].filter(Boolean),
      footer: "Sow with joy",
    });
  }
  packets.push({
    label: "Packet No. 03",
    title: site.content.venueName || "Our Wedding Venue",
    lines: [site.content.venueAddress || ""].filter(Boolean),
    footer: "Sow with hope",
  });
  return packets;
}

function SeedPacketCard({ packet, index }: { packet: SeedPacket; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden bg-[#FFFCF8] text-left shadow-[0_16px_32px_-14px_rgba(61,20,32,0.4)] ring-1 ring-[#B3124F]/25"
    >
      {/* Packet top tab — the folded seed-packet header */}
      <div className="relative bg-[#B3124F] px-5 pt-4 pb-3 text-[#FFF7F2]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[#7E0C37]/60"
          style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)" }}
        />
        <p className="rg-font-display text-[9px] tracking-[0.3em] uppercase opacity-90">
          {packet.label}
        </p>
        <h4 className="rg-font-display mt-1 text-[1.15rem] leading-[1.2] font-normal tracking-[0.04em] uppercase">
          {packet.title}
        </h4>
      </div>
      {/* Packet body */}
      <div className="relative flex flex-1 flex-col px-5 py-5">
        <RoseMark className="h-7 w-7 text-[#B3124F]" />
        <div className="mt-3 space-y-1.5">
          {packet.lines.map((line, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "rg-font-display text-[12px] tracking-[0.1em] text-[#3D1420] uppercase"
                  : "rg-font-editorial text-[0.95rem] leading-[1.6] text-[#3D1420]/80 italic"
              }
            >
              {line}
            </p>
          ))}
        </div>
        <p className="rg-font-display mt-auto flex items-center gap-1.5 pt-4 text-[10px] tracking-[0.24em] text-[#3E6B3A] uppercase">
          <Leaf className="h-3.5 w-3.5" />
          {packet.footer}
        </p>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingDetailsCard — seed packets + schedule + stay + travel      */
/* ------------------------------------------------------------------ */

export function RoseGardenDetailsCard({
  site,
  onOpenDetails,
}: {
  site: WeddingSite;
  onOpenDetails: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const packets = seedPackets(site);
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
    <div className="@container relative overflow-hidden bg-[#FFF7F2] px-4 pt-16 pb-20 @min-[40rem]:px-6 @min-[40rem]:pt-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Eyebrow + Title */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase @min-[40rem]:text-xs"
        >
          WEDDING DETAILS
        </motion.p>
        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3D1420] @min-[40rem]:text-[2.3rem]"
        >
          Planted with Love
        </motion.h3>
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3D1420]/85 @min-[40rem]:text-[1.06rem]"
        >
          Every detail has been lovingly planted for a day among the roses — here is
          everything you need to bloom alongside us.
        </motion.p>

        {/* Decorative Divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 mb-10 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B3124F]/80 @min-[40rem]:w-24" />
          <Sun className="h-4 w-4 text-[#7E0C37]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B3124F]/80 @min-[40rem]:w-24" />
        </motion.div>

        {/* Seed packets — 1 column narrow, 3 columns wide */}
        <div className="grid w-full max-w-[860px] grid-cols-1 gap-5 @min-[40rem]:grid-cols-3">
          {packets.map((packet, i) => (
            <SeedPacketCard key={packet.label} packet={packet} index={i} />
          ))}
        </div>

        {/* Schedule Preview */}
        {schedulePreview.length > 0 && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-[560px] space-y-3 text-left"
          >
            {schedulePreview.map((event, i) => (
              <div key={`${event.name}-${i}`} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFFCF8] text-[#7E0C37]">
                  <Clock className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="rg-font-display text-[11px] tracking-[0.18em] text-[#3D1420] uppercase @min-[40rem]:text-xs">
                    {event.time} · {event.name}
                  </p>
                  {event.description && (
                    <p className="rg-font-editorial mt-0.5 text-sm leading-relaxed text-[#3D1420]/75 italic">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {site.events.length > 3 && (
              <p className="rg-font-editorial pl-11 text-sm text-[#7E0C37]/80 italic">
                + {site.events.length - 3} more moment{site.events.length - 3 === 1 ? "" : "s"} on the day
              </p>
            )}
          </motion.div>
        )}

        {/* Dress Code */}
        {dressCode && (
          <div className="mt-6 flex items-center gap-2.5 rounded-full border border-[#B3124F]/60 bg-[#FFFCF8]/80 px-4 py-2">
            <Shirt className="h-4 w-4 shrink-0 text-[#7E0C37]" />
            <span className="rg-font-display text-[10px] tracking-[0.2em] text-[#3D1420] uppercase @min-[40rem]:text-[11px]">
              Dress Code: {dressCode}
            </span>
          </div>
        )}

        {/* Accommodations Preview */}
        {hotelList.length > 0 && (
          <div className="mt-6 w-full max-w-[560px] space-y-2.5 text-left">
            {hotelList.map((hotel, i) => (
              <div key={`${hotel.name}-${i}`} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFFCF8] text-[#7E0C37]">
                  <BedDouble className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="rg-font-display text-[11px] tracking-[0.18em] text-[#3D1420] uppercase @min-[40rem]:text-xs">
                    {hotel.name}
                  </p>
                  {hotel.distance && (
                    <p className="rg-font-editorial mt-0.5 text-sm text-[#3D1420]/75 italic">
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
          <div key={`travel-${i}`} className="mt-5 flex w-full max-w-[560px] items-start gap-3 text-left">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFFCF8] text-[#7E0C37]">
              <Plane className="h-3.5 w-3.5" />
            </span>
            <p className="rg-font-editorial text-sm leading-relaxed text-[#3D1420]/80 italic">
              {d.body}
            </p>
          </div>
        ))}
        {registryNotes.map((d, i) => (
          <div key={`registry-${i}`} className="mt-5 flex w-full max-w-[560px] items-start gap-3 text-left">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/70 bg-[#FFFCF8] text-[#7E0C37]">
              <Gift className="h-3.5 w-3.5" />
            </span>
            <p className="rg-font-editorial text-sm leading-relaxed text-[#3D1420]/80 italic">
              {d.body}
            </p>
          </div>
        ))}

        {/* View Full Wedding Details */}
        <button
          type="button"
          onClick={onOpenDetails}
          className="group mt-8 inline-flex items-center gap-2 bg-[#B3124F] px-6 py-3 rg-font-display text-[11px] tracking-[0.26em] text-[#FFF7F2] uppercase shadow-[0_10px_22px_-8px_rgba(126,12,55,0.6)] transition-colors duration-300 hover:bg-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F] @min-[40rem]:text-xs"
        >
          <CalendarDays className="h-4 w-4" />
          View Full Wedding Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Rose + Leaf accent row */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[#7E0C37]/70">
          <RoseMark className="h-5 w-5" />
          <Heart className="h-4 w-4 fill-[#7E0C37]/30" />
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RsvpSection — rose-bordered letter card + RSVP jump               */
/* ------------------------------------------------------------------ */

export function RoseGardenRsvpSection({
  site,
  onJumpToRsvp,
}: {
  site: WeddingSite;
  onJumpToRsvp: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const replyBy = rsvpReplyBy(site);

  return (
    <div className="@container relative overflow-hidden bg-[#FFF7F2] px-4 pt-4 pb-20 @min-[40rem]:pb-24">
      <div className="relative mx-auto max-w-[760px]">
        {/* Rose-Bordered Letter Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden shadow-[0_24px_48px_-16px_rgba(61,20,32,0.4)]"
        >
          {/* Rose-bordered letter texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RSVP_LETTER_URL})` }}
          />

          {/* Text column sits ON the cream paper. The paper is
              eye-measured from rose-garden-rsvp.jpg (1920x1280):
              the blank cream sheet spans x 17%-83% and y 13%-85%
              of the image (deep-rose border all round, roses
              overlapping the corners). The frame is bg-cover, so
              the cream maps to the same fractions of the frame
              whenever the frame is height-driven (mobile + editor
              preview), and to the image's scaled height when
              width-driven (desktop).
              Column width 62% (x 19%-81%) sits well inside the
              cream horizontally. Vertically the padding is sized
              from the 13%/85% bounds: mobile pt-32 (128px) /
              pb-36 (144px), wide-container pt-28 (112px) /
              pb-32 (128px). Estimated margins (content height
              ~577px mobile, ~558px wide): eyebrow top ~+18px
              below the cream's top edge on mobile (~+8px wide),
              button bottom ~+17px above the cream's bottom edge
              on mobile (~+8px wide). These are ESTIMATES from
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
          <div className="relative z-10 mx-auto flex w-[62%] min-w-0 flex-col items-center pt-32 pb-36 text-center @min-[40rem]:w-[64%] @min-[40rem]:pt-28 @min-[40rem]:pb-32">
            <p className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase @min-[40rem]:text-xs">
              RSVP
            </p>
            <h3 className="rg-font-display mt-3 text-[1.25rem] leading-[1.15] font-normal tracking-[0.02em] text-balance text-[#3D1420] @min-[40rem]:text-[1.9rem]">
              Will You Join Us?
            </h3>

            <RoseDivider className="mt-3 h-7 w-28 @min-[40rem]:mt-4 @min-[40rem]:h-8 @min-[40rem]:w-32" />

            <p className="rg-font-editorial mt-3 max-w-[520px] text-[1rem] leading-[1.75] text-[#3D1420]/85 @min-[40rem]:mt-4 @min-[40rem]:text-[1.06rem]">
              Your presence is the greatest gift. Please let us know if you can
              share in our joy.
            </p>

            {replyBy && (
              <p className="rg-font-display mt-4 text-[10px] leading-[1.9] tracking-[0.12em] text-balance text-[#7E0C37] uppercase @min-[40rem]:mt-5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.2em]">
                {replyBy}
              </p>
            )}

            <button
              type="button"
              onClick={onJumpToRsvp}
              className="group mt-4 inline-flex items-center gap-2 bg-[#B3124F] px-3.5 py-2.5 rg-font-display text-[9px] tracking-[0.1em] whitespace-nowrap text-[#FFF7F2] uppercase shadow-[0_10px_22px_-8px_rgba(126,12,55,0.6)] transition-colors duration-300 hover:bg-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F] @min-[40rem]:mt-7 @min-[40rem]:px-7 @min-[40rem]:py-3.5 @min-[40rem]:text-xs @min-[40rem]:tracking-[0.26em]"
            >
              <Heart className="h-3.5 w-3.5 fill-[#FFF7F2]/20 @min-[40rem]:h-4 @min-[40rem]:w-4" />
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

export function RoseGardenFooter({
  site,
  showCoverLink = true,
  onNavigate,
}: {
  site: WeddingSite;
  showCoverLink?: boolean;
  onNavigate: (view: "cover" | "story" | "details") => void;
}) {
  return (
    <footer className="relative overflow-hidden bg-[#3D1420] px-5 pt-12 pb-10 text-center text-[#FFF7F2]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${STORY_HANDS_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#3D1420]/30 via-transparent to-[#3D1420]/70"
      />

      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center">
        <p className="rg-font-script text-[2.2rem] leading-none font-normal text-[#FFF7F2]">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="rg-font-display mt-3 text-[10px] tracking-[0.3em] text-[#F4A7B9] uppercase">
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </p>
        <p className="rg-font-editorial mt-2 text-sm text-[#FFF7F2]/75 italic">
          {footerLocation(site)}
        </p>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#B3124F]/80 to-transparent"
        />

        <nav aria-label="Footer" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showCoverLink && (
            <button
              type="button"
              onClick={() => onNavigate("cover")}
              className="rg-font-display text-[11px] tracking-[0.26em] text-[#FFF7F2]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4A7B9]"
            >
              Cover
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate("story")}
            className="rg-font-display text-[11px] tracking-[0.26em] text-[#FFF7F2]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4A7B9]"
          >
            Our Story
          </button>
          <button
            type="button"
            onClick={() => onNavigate("details")}
            className="rg-font-display text-[11px] tracking-[0.26em] text-[#FFF7F2]/90 uppercase transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4A7B9]"
          >
            Wedding Details
          </button>
        </nav>

        <p className="rg-font-editorial mt-7 text-xs text-[#FFF7F2]/60 italic">
          Made with love — Rose Garden
        </p>
      </div>
    </footer>
  );
}
