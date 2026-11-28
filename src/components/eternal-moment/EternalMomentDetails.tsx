// Eternal Moment details — the celebration timeline (events),
// the venue with map, the dress-code swatch cards, and the
// couple's "good to know" detail blocks.
//
// No calendar download: the Studio has no ICS mechanism to reuse
// (no VCALENDAR helper, route or component anywhere in the app),
// so events link out to directions instead of offering a file the
// Studio cannot generate.
import type { WeddingSite } from "@/lib/types";
import Reveal from "../Reveal";
import { DiamondDivider, Hairline } from "./Decor";
import { SectionHeading } from "./EternalMomentSections";
import {
  DRESS_SWATCHES,
  ETERNAL,
  FONT_BODY,
  FONT_DISPLAY,
  TEMPLATE_EVENT_PHOTOS,
  VENUE_IMAGE_URL,
  dressCodeNotes,
  formatEventDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* EternalMomentEvents — vertical timeline on a fine gold rule with */
/* diamond markers; each event pairs its photo with date, time,    */
/* venue, address, description and a directions link. Photos       */
/* alternate sides on desktop.                                     */
/* ------------------------------------------------------------------ */

export function EternalMomentEvents({ site }: { site: WeddingSite }) {
  return (
    <section id="events" aria-label="Celebration events" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="The celebration"
          title="When & Where"
          intro="Everything happening across the wedding — times, places, and what to wear."
        />
      </Reveal>

      <div className="relative mt-14">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] w-px sm:left-1/2 sm:-translate-x-1/2"
          style={{ backgroundColor: `${ETERNAL.gold}66` }}
        />
        <div className="flex flex-col gap-14 sm:gap-20">
          {site.events.map((event, i) => {
            const photo = (event.photo ?? "").trim() || TEMPLATE_EVENT_PHOTOS[i % TEMPLATE_EVENT_PHOTOS.length];
            const directions = (event.directionsUrl ?? "").trim() || mapsLink(`${event.venue} ${event.address}`.trim());
            const flip = i % 2 === 1;
            return (
              <Reveal key={event.id}>
                <article className="relative pl-10 sm:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-0 block h-[15px] w-[15px] rotate-45 border-2 sm:left-1/2 sm:-translate-x-1/2"
                    style={{ backgroundColor: ETERNAL.ivory, borderColor: ETERNAL.gold }}
                  />
                  <div className="grid items-start gap-6 sm:grid-cols-2 sm:gap-14">
                    <div className={flip ? "sm:order-2" : ""}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`${event.name} — event photo`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                    <div className={flip ? "sm:order-1 sm:text-right" : ""}>
                      <p className="font-mono text-[0.65rem] font-medium tracking-[0.3em] uppercase" style={{ color: ETERNAL.goldDeep }}>
                        {formatEventDate(event.date)}
                      </p>
                      <h3 className={`${FONT_DISPLAY} mt-2 text-3xl leading-tight font-medium sm:text-4xl`} style={{ color: ETERNAL.espresso }}>
                        {event.name}
                      </h3>
                      <p className={`${FONT_BODY} mt-2 text-[0.95rem] font-semibold tracking-wide`} style={{ color: ETERNAL.goldDeep }}>
                        {event.time}
                      </p>
                      <p className={`${FONT_BODY} mt-3 text-[1rem] font-semibold`} style={{ color: ETERNAL.espresso }}>
                        {event.venue}
                      </p>
                      {event.address ? (
                        <p className={`${FONT_BODY} mt-1 text-sm`} style={{ color: ETERNAL.stone }}>
                          {event.address}
                        </p>
                      ) : null}
                      {event.description ? (
                        <p className={`${FONT_BODY} mt-3 text-[1rem] leading-[1.8]`} style={{ color: `${ETERNAL.espresso}D9` }}>
                          {event.description}
                        </p>
                      ) : null}
                      <a
                        href={directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${FONT_BODY} mt-4 inline-block text-sm font-semibold underline underline-offset-4 transition hover:opacity-70`}
                        style={{ color: ETERNAL.goldDeep }}
                      >
                        Get directions →
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EternalMomentVenue — the venue photo, name + address, an        */
/* OpenStreetMap/Google embed and a directions link. The map is a  */
/* plain embed (no API key); the couple's own mapLink wins when    */
/* set, else a Google search link for the venue.                    */
/* ------------------------------------------------------------------ */

export function EternalMomentVenue({ site }: { site: WeddingSite }) {
  const venueImage = (site.content.venueImage ?? "").trim() || VENUE_IMAGE_URL;
  const query = [site.content.venueName, site.content.venueAddress].map((s) => (s ?? "").trim()).filter(Boolean).join(", ");
  const directions = (site.content.mapLink ?? "").trim() || mapsLink(query);

  return (
    <section
      id="venue"
      aria-label="Venue"
      className="w-full px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: ETERNAL.cream }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <SectionHeading eyebrow="Location" title="The Venue" />
        </Reveal>
        <div className="mt-12 grid items-start gap-10 sm:grid-cols-2">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={venueImage}
              alt={`${site.content.venueName || "Wedding venue"} — venue photo`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            <p className={`${FONT_DISPLAY} mt-6 text-3xl leading-tight font-medium`} style={{ color: ETERNAL.espresso }}>
              {site.content.venueName}
            </p>
            {site.content.venueAddress ? (
              <p className={`${FONT_BODY} mt-2 leading-relaxed`} style={{ color: ETERNAL.stone }}>
                {site.content.venueAddress}
              </p>
            ) : null}
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className={`${FONT_BODY} mt-5 inline-block rounded-full border px-6 py-3 text-sm font-semibold transition hover:opacity-75`}
              style={{ borderColor: ETERNAL.gold, color: ETERNAL.goldDeep }}
            >
              Get directions →
            </a>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden border" style={{ borderColor: `${ETERNAL.gold}66` }}>
              <iframe
                title={`Map — ${site.content.venueName || "wedding venue"}`}
                src={mapsEmbedUrl(query)}
                loading="lazy"
                className="aspect-[4/3] w-full border-0"
              />
            </div>
            <p className={`${FONT_BODY} mt-4 text-sm leading-relaxed italic`} style={{ color: ETERNAL.stone }}>
              The map above is a guide — please follow the directions link for live navigation on the day.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EternalMomentDressCode — the five palette swatches as cards,    */
/* the couple's dress-code text as the intro, and any kind:"dress" */
/* detail blocks as notes underneath.                               */
/* ------------------------------------------------------------------ */

export function EternalMomentDressCode({ site }: { site: WeddingSite }) {
  const intro = site.content.dressCode.trim();
  const notes = dressCodeNotes(site);

  return (
    <section id="dress-code" aria-label="Dress code" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Dress code"
          title="What to Wear"
          intro={intro || "Our palette for the celebration — wear what makes you feel your best in these shades."}
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DRESS_SWATCHES.map((swatch) => (
          <Reveal key={swatch.id}>
            <article
              className="flex h-full flex-col overflow-hidden border"
              style={{ borderColor: `${ETERNAL.gold}66`, backgroundColor: ETERNAL.paper }}
            >
              <div
                className="flex h-28 items-end p-4"
                style={{ backgroundColor: swatch.hex, color: swatch.textOn }}
              >
                <span className="font-mono text-[0.65rem] font-medium tracking-[0.25em] uppercase">
                  {swatch.hex}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className={`${FONT_DISPLAY} text-xl font-medium`} style={{ color: ETERNAL.espresso }}>
                  {swatch.name}
                </h3>
                <Hairline className="mt-3" />
                <p className={`${FONT_BODY} mt-3 text-sm leading-relaxed`} style={{ color: `${ETERNAL.espresso}B3` }}>
                  {swatch.guidance}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {notes.length > 0 ? (
        <div className="mx-auto mt-10 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
          {notes.map((note) => (
            <Reveal key={note.id}>
              <div
                className="h-full border px-6 py-5"
                style={{ backgroundColor: ETERNAL.paper, borderColor: `${ETERNAL.gold}66` }}
              >
                <h3 className={`${FONT_DISPLAY} text-xl font-medium`} style={{ color: ETERNAL.espresso }}>
                  {note.title}
                </h3>
                <p className={`${FONT_BODY} mt-2 text-sm leading-relaxed whitespace-pre-line`} style={{ color: `${ETERNAL.espresso}CC` }}>
                  {note.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      ) : null}
      <DiamondDivider className="mt-14" />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EternalMomentInfoBlocks — the couple's remaining detail blocks   */
/* (travel, accommodation, parking, registry, notes…) as "Good to  */
/* know" cards. Dress blocks live with the dress code above.        */
/* ------------------------------------------------------------------ */

const INFO_KIND_LABELS: Record<string, string> = {
  venue: "Venue",
  travel: "Travel",
  accommodation: "Accommodation",
  parking: "Parking",
  accessibility: "Accessibility",
  registry: "Gift registry",
  notes: "Good to know",
};

export function EternalMomentInfoBlocks({ site }: { site: WeddingSite }) {
  const blocks = (site.content.details ?? []).filter(
    (b) => !b.hidden && b.kind !== "dress" && (b.title.trim() || b.body.trim()),
  );
  if (blocks.length === 0) return null;

  return (
    <section id="details" aria-label="Good to know" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <SectionHeading eyebrow="Details" title="Good to Know" intro="Everything guests need for the day." />
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {blocks.map((block) => (
          <Reveal key={block.id}>
            <article
              className="h-full border px-6 py-7"
              style={{ backgroundColor: ETERNAL.paper, borderColor: `${ETERNAL.gold}66` }}
            >
              <p className="font-mono text-[0.65rem] font-medium tracking-[0.3em] uppercase" style={{ color: ETERNAL.goldDeep }}>
                {INFO_KIND_LABELS[block.kind] ?? "Details"}
              </p>
              <h3 className={`${FONT_DISPLAY} mt-2 text-2xl font-medium`} style={{ color: ETERNAL.espresso }}>
                {block.title}
              </h3>
              <p className={`${FONT_BODY} mt-2 leading-relaxed whitespace-pre-line`} style={{ color: `${ETERNAL.espresso}D9` }}>
                {block.body}
              </p>
              {block.linkUrl ? (
                <a
                  href={block.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${FONT_BODY} mt-4 inline-block text-sm font-semibold underline underline-offset-4 transition hover:opacity-70`}
                  style={{ color: ETERNAL.goldDeep }}
                >
                  {block.linkLabel || "Open link"} →
                </a>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
