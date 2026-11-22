import Link from "next/link";
import type { TemplateId, WeddingSite } from "@/lib/types";
import Countdown from "./Countdown";

interface SiteRendererProps {
  site: WeddingSite;
  /** Preview renders bypass the published-only gate (template previews). */
  preview?: boolean;
}

/** Clean "not available" page shared by the renderer and the /w routes. */
export function SiteUnavailable({ message }: { message?: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Wedding Website Studio
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-900 sm:text-4xl">
        This wedding website is not available
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-stone-600">
        {message ??
          "This site may still be a draft, or it may have been unpublished by the couple. Please check the link and try again, or ask the couple for the correct address."}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
      >
        Back to Wedding Website Studio
      </Link>
    </main>
  );
}

function formatDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return new Date(dateIso).toLocaleDateString("en-US");
  }
}

function formatEventDate(date: string): string {
  const parsed = Date.parse(`${date}T12:00:00`);
  if (Number.isNaN(parsed)) return date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed));
}

/* ---------- per-template presentation ---------- */

function headingClass(templateId: TemplateId): string {
  switch (templateId) {
    case "the-editorial":
      return "text-xs font-semibold uppercase tracking-[0.3em]";
    case "the-romance":
      return "text-2xl italic";
    case "the-modern":
      return "text-sm font-black uppercase tracking-[0.25em]";
    case "the-countryside":
      return "text-sm font-bold uppercase tracking-[0.2em]";
    case "the-classic":
      return "text-xs font-semibold uppercase tracking-[0.35em]";
  }
}

function divider(templateId: TemplateId, accent: string): React.ReactNode {
  switch (templateId) {
    case "the-romance":
      return (
        <p aria-hidden="true" className="mt-2 text-xl" style={{ color: accent }}>
          ❦
        </p>
      );
    case "the-modern":
      return (
        <span
          aria-hidden="true"
          className="mt-3 block h-1.5 w-16"
          style={{ backgroundColor: accent }}
        />
      );
    case "the-classic":
      return (
        <div aria-hidden="true" className="mt-3 flex items-center justify-center gap-2">
          <span className="h-px w-16" style={{ backgroundColor: accent }} />
          <span className="inline-block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
          <span className="h-px w-16" style={{ backgroundColor: accent }} />
        </div>
      );
    case "the-countryside":
      return (
        <p aria-hidden="true" className="mt-2 text-lg" style={{ color: accent }}>
          ~ ✿ ~
        </p>
      );
    default:
      return <span aria-hidden="true" className="mx-auto mt-3 block h-px w-16 bg-current opacity-40" />;
  }
}

function SectionHeading({
  site,
  title,
  intro,
}: {
  site: WeddingSite;
  title: string;
  intro?: string;
}) {
  const align =
    site.templateId === "the-modern" ? "text-left" : "text-center";
  return (
    <div className={align}>
      <h2 className={headingClass(site.templateId)} style={{ color: site.templateSnapshot.palette.accent }}>
        {title}
      </h2>
      {divider(site.templateId, site.templateSnapshot.palette.accent)}
      {intro ? <p className="mt-3 max-w-xl leading-relaxed opacity-80">{intro}</p> : null}
    </div>
  );
}

function sectionSpacing(templateId: TemplateId): string {
  switch (templateId) {
    case "the-editorial":
      return "py-16 sm:py-20";
    case "the-romance":
      return "py-14 sm:py-16";
    case "the-modern":
      return "py-14 sm:py-20";
    case "the-countryside":
      return "py-14 sm:py-16";
    case "the-classic":
      return "py-16 sm:py-20";
  }
}

/* ---------- sections ---------- */

function Hero({ site }: { site: WeddingSite }) {
  const { content, templateSnapshot: tpl } = site;
  const names = `${content.partnerA} & ${content.partnerB}`;
  const dateLine = formatDate(site.weddingDate, site.timezone);

  if (site.templateId === "the-modern") {
    return (
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-10 pb-14 sm:pt-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
            We&apos;re getting married
          </p>
          <h1 className="mt-4 text-5xl leading-[0.95] font-black uppercase sm:text-7xl">
            {content.partnerA}
            <span className="block" style={{ color: tpl.palette.accent }}>
              &amp;
            </span>
            {content.partnerB}
          </h1>
          <p className="mt-5 text-lg font-semibold uppercase tracking-widest">{dateLine}</p>
          <p className="mt-4 max-w-md leading-relaxed opacity-80">{content.welcome}</p>
          <Link
            href={`/w/${site.slug}/rsvp`}
            className="mt-8 inline-block rounded-none px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:opacity-85"
            style={{ backgroundColor: tpl.palette.accent }}
          >
            RSVP now
          </Link>
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImage}
            alt={`${names} — wedding photo`}
            className="aspect-[4/5] w-full object-cover"
            loading="eager"
          />
        </div>
      </section>
    );
  }

  if (site.templateId === "the-countryside") {
    return (
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-10 pb-14 sm:pt-14 md:grid-cols-2">
        <div className="order-2 md:order-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImage}
            alt={`${names} — wedding photo`}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
            loading="eager"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: tpl.palette.accent }}>
            {content.subtitle}
          </p>
          <h1 className="mt-3 text-5xl leading-tight font-bold sm:text-6xl">
            {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
          </h1>
          <p className="mt-4 text-lg">{dateLine}</p>
          <p className="mt-4 leading-relaxed opacity-85">{content.welcome}</p>
          <Link
            href={`/w/${site.slug}/rsvp`}
            className="mt-7 inline-block rounded-full px-7 py-3 text-sm font-bold text-white transition hover:opacity-85"
            style={{ backgroundColor: tpl.palette.accent }}
          >
            Let us know you&apos;re coming
          </Link>
        </div>
      </section>
    );
  }

  // Editorial, Romance, Classic: centred hero (each with its own flavour).
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-12 pb-14 text-center sm:pt-16">
      <p
        className={
          site.templateId === "the-romance"
            ? "text-base italic"
            : "text-xs font-semibold uppercase tracking-[0.3em]"
        }
        style={{ color: tpl.palette.accent }}
      >
        {content.subtitle}
      </p>
      <h1
        className={
          site.templateId === "the-romance"
            ? "mt-4 text-6xl leading-tight sm:text-7xl"
            : site.templateId === "the-classic"
              ? "mt-4 text-5xl leading-tight tracking-wide sm:text-7xl"
              : "mt-4 text-5xl leading-tight sm:text-7xl"
        }
      >
        {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
      </h1>
      {site.templateId === "the-classic" ? (
        <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-20" style={{ backgroundColor: tpl.palette.accent }} />
          <span className="inline-block h-2 w-2 rotate-45" style={{ backgroundColor: tpl.palette.accent }} />
          <span className="h-px w-20" style={{ backgroundColor: tpl.palette.accent }} />
        </div>
      ) : site.templateId === "the-romance" ? (
        <p aria-hidden="true" className="mt-3 text-2xl" style={{ color: tpl.palette.accent }}>
          ❦ ❦ ❦
        </p>
      ) : (
        <span aria-hidden="true" className="mx-auto mt-5 block h-px w-20 bg-current opacity-40" />
      )}
      <p className="mt-5 text-lg sm:text-xl">{dateLine}</p>
      <p className="mx-auto mt-4 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.heroImage}
        alt={`${names} — wedding photo`}
        className={
          site.templateId === "the-romance"
            ? "mx-auto mt-10 aspect-[16/9] w-full rounded-[2rem] object-cover"
            : site.templateId === "the-classic"
              ? "mx-auto mt-10 aspect-[16/9] w-full border-4 object-cover"
              : "mx-auto mt-10 aspect-[16/9] w-full object-cover"
        }
        style={site.templateId === "the-classic" ? { borderColor: tpl.palette.accent } : undefined}
        loading="eager"
      />
    </section>
  );
}

function CountdownSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showCountdown || !site.settings.countdownEnabled) return null;
  const soft = site.templateSnapshot.palette.accentSoft;
  return (
    <section
      className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing(site.templateId)}`}
      aria-label="Countdown to the wedding"
    >
      <div
        className={
          site.templateId === "the-romance"
            ? "rounded-[2rem] px-6 py-10"
            : site.templateId === "the-modern"
              ? "border-2 border-current px-6 py-10"
              : "rounded-xl px-6 py-10"
        }
        style={{ backgroundColor: soft }}
      >
        <SectionHeading site={site} title="Counting down" />
        <div className="mt-8">
          <Countdown
            date={site.weddingDate}
            timezone={site.timezone}
            style={site.settings.countdownStyle}
            postMessage={site.content.postWeddingMessage}
          />
        </div>
      </div>
    </section>
  );
}

function StorySection({ site }: { site: WeddingSite }) {
  if (!site.settings.showStory) return null;
  if (site.templateId === "the-countryside") {
    return (
      <section className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing(site.templateId)}`}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading site={site} title="Our story" />
            <p className="mt-6 leading-relaxed whitespace-pre-line opacity-90">{site.content.story}</p>
          </div>
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: site.templateSnapshot.palette.accentSoft }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: site.templateSnapshot.palette.accent }}>
              The day
            </p>
            <p className="mt-3 text-2xl font-semibold">{formatDate(site.weddingDate, site.timezone)}</p>
            <p className="mt-2 leading-relaxed opacity-85">
              {site.content.venueName} — {site.content.venueAddress}
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="Our story" />
      <p className="mt-8 text-lg leading-relaxed whitespace-pre-line opacity-90">{site.content.story}</p>
    </section>
  );
}

function EventsSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showEvents || site.events.length === 0) return null;
  const accent = site.templateSnapshot.palette.accent;
  const soft = site.templateSnapshot.palette.accentSoft;
  const grid =
    site.templateId === "the-modern"
      ? "mt-10 grid gap-6 md:grid-cols-3"
      : site.templateId === "the-editorial"
        ? "mt-10 space-y-8"
        : "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="When & where" intro="Everything happening across the weekend." />
      <div className={grid}>
        {site.events.map((event) => (
          <article
            key={event.id}
            className={
              site.templateId === "the-romance"
                ? "rounded-[1.5rem] border p-6"
                : site.templateId === "the-modern"
                  ? "border-t-4 p-6"
                  : site.templateId === "the-classic"
                    ? "border p-6 text-center"
                    : "rounded-xl p-6"
            }
            style={{
              backgroundColor: soft,
              ...(site.templateId === "the-modern" ? { borderTopColor: accent } : {}),
              ...(site.templateId === "the-classic" || site.templateId === "the-romance"
                ? { borderColor: accent }
                : {}),
            }}
          >
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p className="mt-2 font-medium" style={{ color: accent }}>
              {formatEventDate(event.date)} · {event.time}
            </p>
            <p className="mt-1 font-medium">{event.venue}</p>
            <p className="text-sm opacity-75">{event.address}</p>
            {event.description ? <p className="mt-3 text-sm leading-relaxed opacity-85">{event.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function VenueSection({ site }: { site: WeddingSite }) {
  const { content } = site;
  if (!content.venueName && !content.venueAddress) return null;
  return (
    <section className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="The venue" />
      <p className="mt-8 text-2xl font-semibold">{content.venueName}</p>
      {content.venueAddress ? <p className="mt-2 leading-relaxed opacity-85">{content.venueAddress}</p> : null}
      {content.mapLink ? (
        <a
          href={content.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border px-6 py-3 text-sm font-semibold transition hover:opacity-75"
          style={{ borderColor: site.templateSnapshot.palette.accent, color: site.templateSnapshot.palette.accent }}
        >
          View on a map
        </a>
      ) : null}
    </section>
  );
}

function GallerySection({ site }: { site: WeddingSite }) {
  if (!site.settings.showGallery || site.gallery.length === 0) return null;
  const accent = site.templateSnapshot.palette.accent;
  const container =
    site.templateId === "the-countryside"
      ? "mt-10 columns-1 gap-4 sm:columns-2 [&>*]:mb-4"
      : site.templateId === "the-modern"
        ? "mt-10 grid gap-4 sm:grid-cols-3"
        : "mt-10 grid gap-4 sm:grid-cols-2";
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
      <div className={container}>
        {site.gallery.map((image, i) => (
          <figure key={image.id} className={site.templateId === "the-modern" && i === 0 ? "sm:col-span-2 sm:row-span-2" : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.caption || `Gallery photo ${i + 1}`}
              loading="lazy"
              className={
                site.templateId === "the-romance"
                  ? "aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                  : site.templateId === "the-countryside"
                    ? "w-full rounded-2xl object-cover"
                    : site.templateId === "the-classic"
                      ? "aspect-[4/3] w-full border-2 object-cover"
                      : "aspect-[4/3] w-full object-cover"
              }
              style={site.templateId === "the-classic" ? { borderColor: accent } : undefined}
            />
            {image.caption ? (
              <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function DressCodeSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showDressCode || !site.content.dressCode) return null;
  return (
    <section className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="Dress code" />
      <p
        className="mx-auto mt-8 max-w-xl rounded-xl px-6 py-6 text-lg leading-relaxed"
        style={{ backgroundColor: site.templateSnapshot.palette.accentSoft }}
      >
        {site.content.dressCode}
      </p>
    </section>
  );
}

function RsvpTeaser({ site }: { site: WeddingSite }) {
  const accent = site.templateSnapshot.palette.accent;
  const deadline = site.settings.rsvpDeadline
    ? formatDate(site.settings.rsvpDeadline, site.timezone)
    : null;
  return (
    <section className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing(site.templateId)}`}>
      <SectionHeading site={site} title="Will you be there?" />
      <p className="mx-auto mt-4 max-w-xl leading-relaxed opacity-85">
        {site.settings.rsvpEnabled
          ? "Please let us know if you can make it — it helps us save you a seat (and a slice of cake)."
          : "RSVP is now closed. Thank you to everyone who has already replied."}
        {deadline && site.settings.rsvpEnabled ? ` Kindly reply by ${deadline}.` : ""}
      </p>
      <Link
        href={`/w/${site.slug}/rsvp`}
        className="mt-8 inline-block rounded-full px-9 py-3.5 text-sm font-bold text-white transition hover:opacity-85"
        style={{ backgroundColor: accent }}
      >
        RSVP
      </Link>
    </section>
  );
}

/* ---------- renderer ---------- */

export default function SiteRenderer({ site, preview = false }: SiteRendererProps) {
  if (site.status !== "published" && !preview) {
    return <SiteUnavailable />;
  }

  const palette = site.templateSnapshot.palette;
  const sections = site.templateSnapshot.sections;

  const renderSection = (key: string): React.ReactNode => {
    switch (key) {
      case "hero":
        return <Hero key="hero" site={site} />;
      case "countdown":
        return <CountdownSection key="countdown" site={site} />;
      case "story":
        return <StorySection key="story" site={site} />;
      case "events":
        return <EventsSection key="events" site={site} />;
      case "venue":
        return <VenueSection key="venue" site={site} />;
      case "gallery":
        return <GallerySection key="gallery" site={site} />;
      case "dress-code":
        return <DressCodeSection key="dress-code" site={site} />;
      case "rsvp":
        return <RsvpTeaser key="rsvp" site={site} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-full w-full ${site.templateSnapshot.fontClass}`}
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      {preview ? (
        <p className="bg-stone-900 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Template preview — demo content
        </p>
      ) : null}
      {sections.map(renderSection)}
      <footer className="border-t px-5 py-12 text-center" style={{ borderColor: palette.accent }}>
        <p className="text-lg font-semibold">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed opacity-80">{site.content.footerMessage}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] opacity-60">
          {formatDate(site.weddingDate, site.timezone)}
        </p>
      </footer>
    </div>
  );
}
