// ÉTERNEL renderer — assembles the template in PRD order: envelope →
// nav → hero → welcome → story → countdown → events → venue → gallery
// → RSVP → footer. Every section reads from the site document; the
// sections themselves decide whether they render (visibility settings,
// presence of data). Used by the shared SiteRenderer branch and by the
// /w/[slug]/rsvp page via EternelRsvpForm.
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Clock } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ETERNEL, coupleNames, formatLongDate, initials, willRenderSection } from "./tokens";
import { Divider, FloralDrift, Flower } from "./Decor";
import EternelEnvelope from "./EternelEnvelope";
import EternelNav from "./EternelNav";
import EternelHero, { resolveEternelHeroSrc } from "./EternelHero";
import { EternelCountdown, EternelEvents, EternelVenue, EternelWelcome, EternelStory } from "./EternelSections";
import EternelGallery from "./EternelGallery";
import EternelRsvpForm from "./EternelRsvpForm";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.3 }}
      className="fixed right-5 bottom-5 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white shadow-lg"
      style={{ backgroundColor: ETERNEL.espresso, pointerEvents: visible ? "auto" : "none" }}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </motion.button>
  );
}

export default function EternelRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  const names = coupleNames(site);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);
  // Preload the hero photo so it starts downloading with the document,
  // not after hydration / envelope open — the photo is visible instantly.
  const heroSrc = resolveEternelHeroSrc(site);

  const rsvpOpen =
    site.settings.rsvpEnabled &&
    (!site.settings.rsvpDeadline || Date.parse(site.settings.rsvpDeadline) > Date.now());
  const rsvpClosed =
    site.settings.rsvpEnabled &&
    site.settings.rsvpDeadline &&
    Date.parse(site.settings.rsvpDeadline) <= Date.now();

  return (
    <div
      className="eternel-paper min-h-svh"
      style={{ backgroundColor: ETERNEL.ivory, color: ETERNEL.espresso, fontFamily: "var(--font-manrope), sans-serif" }}
    >
      {heroSrc ? (
        // React hoists this <link> into <head>: the hero photo is fetched
        // with the document instead of waiting for the <img> to render.
        <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />
      ) : null}
      {preview ? (
        <div
          className="relative z-30 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white"
          style={{ backgroundColor: ETERNEL.espresso }}
        >
          Preview — this is how the ÉTERNEL template looks with placeholder content. Your couple&rsquo;s
          details will appear here once the website is customised.
        </div>
      ) : null}

      {envelope ? <EternelEnvelope site={site} /> : null}
      <EternelNav site={site} />

      <main>
        <EternelHero site={site} />
        {willRenderSection(site, "welcome") ? <EternelWelcome site={site} /> : null}
        {willRenderSection(site, "story") ? <EternelStory site={site} /> : null}
        {willRenderSection(site, "countdown") ? <EternelCountdown site={site} /> : null}
        {willRenderSection(site, "events") ? <EternelEvents site={site} /> : null}
        {willRenderSection(site, "venue") ? <EternelVenue site={site} /> : null}
        {willRenderSection(site, "gallery") ? <EternelGallery site={site} /> : null}

        {/* 09 · RSVP */}
        {site.settings.rsvpEnabled ? (
          <section id="rsvp" aria-label="RSVP" className="mx-auto w-full max-w-4xl" style={{ backgroundColor: ETERNEL.secondaryBg }}>
            <div className="px-5 py-20 sm:py-24">
              <div className="text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: ETERNEL.gold }}>
                  Répondez s&rsquo;il vous plaît
                </p>
                <h2 className="font-eternel mt-3 text-[clamp(2rem,5vw,3rem)] leading-tight font-medium" style={{ color: ETERNEL.espresso }}>
                  Kindly respond
                </h2>
                <Divider variant={3} className="mx-auto mt-4 h-4 w-44" style={{ color: ETERNEL.gold }} />
                <p className="mx-auto mt-4 max-w-xl leading-relaxed" style={{ color: `${ETERNEL.espresso}CC` }}>
                  We would be honoured by your presence.
                  {site.settings.rsvpDeadline
                    ? ` Please reply by ${formatLongDate(site.settings.rsvpDeadline, site.timezone)}.`
                    : ""}
                </p>
              </div>
              <div className="mt-10">
                {rsvpOpen ? (
                  <EternelRsvpForm site={site} />
                ) : rsvpClosed ? (
                  <div className="mx-auto flex max-w-xl items-start gap-3 rounded-sm border bg-white px-5 py-4" style={{ borderColor: ETERNEL.champagne }}>
                    <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ETERNEL.gold }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed">
                      RSVPs for this wedding are now closed
                      {site.settings.rsvpDeadline
                        ? ` (the deadline was ${formatLongDate(site.settings.rsvpDeadline, site.timezone)})`
                        : ""}
                      . If you still need to reply, please contact the couple directly.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* 10 · Thank-you footer */}
      <footer className="relative overflow-hidden" style={{ backgroundColor: ETERNEL.espresso, color: ETERNEL.ivory }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center"
        >
          <FloralDrift>
            <Flower variant={1} className="h-10 w-10 opacity-70" style={{ color: ETERNEL.champagne }} />
          </FloralDrift>
          <p className="eternel-script mt-4 text-4xl sm:text-5xl" style={{ color: ETERNEL.champagne }}>
            {names}
          </p>
          <p className="mt-3 text-sm font-medium tracking-[0.2em] uppercase opacity-80">{dateLine}</p>
          <Divider variant={2} className="mt-6 h-4 w-44" style={{ color: ETERNEL.gold }} />
          <p className="mt-6 max-w-md text-sm leading-relaxed opacity-75">
            Thank you for sharing this day with us. We cannot wait to celebrate together.
          </p>
          <p className="mt-8 text-[11px] font-semibold tracking-[0.3em] uppercase opacity-50">
            Éternel · {initials(site)}
          </p>
        </motion.div>
      </footer>

      <BackToTop />
    </div>
  );
}
