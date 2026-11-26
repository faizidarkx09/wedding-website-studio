// Autumn Harvest renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — AutumnHarvestCover (TYPOGRAPHIC cover: big Playfair
//                serif names over a leaf-pattern photograph, leaf
//                wreath with live monogram, drifting leaves)
//   invitation — AutumnHarvestEnvelope (burnt-orange envelope, live
//                SVG maple-leaf wax seal, card tucked INSIDE at rest)
//                + Introduction + Countdown (burnt-orange band) +
//                StoryPreview (MASONRY grid) + DetailsCard (harvest
//                table rows) + RsvpSection (kraft-paper tag) + RSVP
//                form + footer
//   story      — AutumnHarvestStory (masonry grid + paragraphs)
//   details    — AutumnHarvestDetails (harvest-table rows: schedule,
//                dress code, venue + travel, accommodations,
//                registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The leaf seal is the interaction
// instead.
//
// Fonts: the .ah-* classes are defined by the <style> block below
// (self-contained in this folder — no globals.css edit needed,
// Aurora precedent). They use next/font variables already loaded
// by layout.tsx: Playfair Display display serif, Great Vibes
// script, Allura alternate script, Cormorant Garamond editorial
// serif, Lora body.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import AutumnHarvestCover from "./AutumnHarvestCover";
import AutumnHarvestEnvelope from "./AutumnHarvestEnvelope";
import {
  AutumnHarvestCountdown,
  AutumnHarvestIntroduction,
  AutumnHarvestStoryPreview,
} from "./AutumnHarvestHero";
import {
  AutumnHarvestDetailsCard,
  AutumnHarvestFooter,
  AutumnHarvestRsvpSection,
} from "./AutumnHarvestSections";
import AutumnHarvestStory from "./AutumnHarvestStory";
import AutumnHarvestDetails from "./AutumnHarvestDetails";
import AutumnHarvestRsvpForm from "./AutumnHarvestRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

const AUTUMN_FONT_CSS = `
.ah-font-script { font-family: var(--font-great-vibes), "Snell Roundhand", cursive; font-weight: 400; }
.ah-font-script-alt { font-family: var(--font-allura), "Snell Roundhand", cursive; font-weight: 400; }
.ah-font-display { font-family: var(--font-playfair), Georgia, "Times New Roman", serif; font-weight: 400; }
.ah-font-editorial { font-family: var(--font-cormorant), Georgia, "Times New Roman", serif; font-weight: 400; }
.ah-font-body { font-family: var(--font-lora), Georgia, "Times New Roman", serif; font-weight: 400; }
`;

export default function AutumnHarvestRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  // With no envelope (editor live preview) start on the invitation —
  // the cover would block editing there (same contract as the other
  // template renderers).
  const [currentView, setCurrentView] = useState<View>(envelope ? "cover" : "invitation");
  const savedScrollRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // On template preview pages (/templates/[id]) this renderer sits far
  // down a long page (SiteNav + facts + How-to-buy above it), so
  // document top 0 is NOT the cover — scrolling there yanks the
  // viewport ~2 screens above the cover at the exact moment its exit
  // starts, and the ceremony plays off-screen while the user sees
  // the template facts. On guest sites the renderer IS the whole page,
  // so top 0 is correct there. In preview, scroll to this renderer's
  // own top instead, keeping the viewport on the cover. (Same fix as
  // Sapphire/Blush Round 3 — do NOT "simplify" to window.scrollTo.)
  const scrollToRendererTop = () => {
    if (preview && rootRef.current) {
      const top = rootRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const openInvitation = () => {
    setCurrentView("invitation");
    scrollToRendererTop();
  };

  const openStory = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("story");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const openDetails = () => {
    savedScrollRef.current = window.scrollY;
    setCurrentView("details");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const backToInvitation = () => {
    setCurrentView("invitation");
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollRef.current, behavior: "instant" as ScrollBehavior });
    });
  };

  const jumpToRsvp = () => {
    const el = document.getElementById("ah-rsvp-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToCover = () => {
    setCurrentView("cover");
    scrollToRendererTop();
  };

  const navigateFromFooter = (view: "cover" | "story" | "details") => {
    if (view === "cover") goToCover();
    else if (view === "story") openStory();
    else openDetails();
  };

  const heroSrc = resolveHeroSrc(site);
  const showWelcome = willRenderSection(site, "welcome");
  const showCountdown = willRenderSection(site, "countdown");
  const showRsvp = willRenderSection(site, "rsvp");

  return (
    <div ref={rootRef} className="autumn-harvest min-h-dvh w-full bg-[#FFF7E8]">
      {/* Scoped Autumn Harvest font classes (see header comment). */}
      <style>{AUTUMN_FONT_CSS}</style>
      {/* Root bg matches the invitation's first (cream) surface so
          the cover-exit → invitation-entrance dissolve passes through
          cream, never a white flash. The cover itself is a leaf-pattern
          photograph on cream, so this is invisible until the
          transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#3A2412] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Autumn Harvest template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <AutumnHarvestCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Cream invitation body */}
            <PaperSurface variant="cream">
              <AutumnHarvestEnvelope site={site} />
              {showWelcome && <AutumnHarvestIntroduction site={site} />}
            </PaperSurface>

            {/* Burnt-orange countdown band */}
            {showCountdown && (
              <PaperSurface variant="orange" className="px-4 pt-14">
                <AutumnHarvestCountdown site={site} />
              </PaperSurface>
            )}

            {/* Masonry story preview */}
            <AutumnHarvestStoryPreview site={site} onOpenStory={openStory} />

            {/* Harvest-table details + kraft-tag RSVP */}
            <AutumnHarvestDetailsCard site={site} onOpenDetails={openDetails} />
            {showRsvp && <AutumnHarvestRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
            {showRsvp && (
              <div id="ah-rsvp-form" className="scroll-mt-6 bg-[#FFF7E8] px-4 pb-20">
                <AutumnHarvestRsvpForm site={site} />
              </div>
            )}

            <AutumnHarvestFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <AutumnHarvestStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <AutumnHarvestDetails
            key="details"
            site={site}
            onBack={backToInvitation}
            onJumpToRsvp={() => {
              setCurrentView("invitation");
              requestAnimationFrame(() => {
                requestAnimationFrame(() => jumpToRsvp());
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
