// Emerald Royale renderer — view machine (cover → invitation →
// story → details) following the RoyalBurgundyRenderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — EmeraldRoyaleCover (emerald leather, gold filigree
//                crest, live monogram, gold shimmer sweep)
//   invitation — EmeraldRoyaleEnvelope (wax-seal envelope + welcome +
//                countdown on an emerald band) + StoryPreview (emerald
//                film strip with gold tape) + DetailsCard + RSVPSection
//                (emerald torn-paper) + RSVP form + footer
//   story      — EmeraldRoyaleStory (gold-tape film strip + triptych
//                + paragraphs)
//   details    — EmeraldRoyaleDetails (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// NO music on this template — there is no ambientMusic engine and
// no music toggle anywhere. The envelope's gold wax seal is the
// interaction instead.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import EmeraldRoyaleCover from "./EmeraldRoyaleCover";
import EmeraldRoyaleEnvelope from "./EmeraldRoyaleEnvelope";
import {
  EmeraldRoyaleCountdown,
  EmeraldRoyaleIntroduction,
  EmeraldRoyaleStoryPreview,
} from "./EmeraldRoyaleHero";
import {
  EmeraldRoyaleDetailsCard,
  EmeraldRoyaleFooter,
  EmeraldRoyaleRsvpSection,
} from "./EmeraldRoyaleSections";
import EmeraldRoyaleStory from "./EmeraldRoyaleStory";
import EmeraldRoyaleDetails from "./EmeraldRoyaleDetails";
import EmeraldRoyaleRsvpForm from "./EmeraldRoyaleRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function EmeraldRoyaleRenderer({
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

  const openInvitation = () => {
    setCurrentView("invitation");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
    const el = document.getElementById("er-rsvp-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToCover = () => {
    setCurrentView("cover");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
    <div className="emerald-royale min-h-dvh w-full bg-[#F7F3E8]">
      {/* Root bg matches the invitation's first (parchment) surface so
          the cover-exit → invitation-entrance dissolve passes through
          parchment, never a white flash. The cover itself is full-bleed
          emerald, so this is invisible until the transition. */}
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal
          Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#0B3D2E] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Emerald Royale template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <EmeraldRoyaleCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Parchment invitation body */}
            <PaperSurface variant="parchment">
              <EmeraldRoyaleEnvelope site={site} />
              {showWelcome && <EmeraldRoyaleIntroduction site={site} />}
            </PaperSurface>

            {/* Emerald countdown band */}
            {showCountdown && (
              <PaperSurface variant="emerald" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <EmeraldRoyaleCountdown site={site} />
              </PaperSurface>
            )}

            {/* Emerald film strip with gold tape */}
            <EmeraldRoyaleStoryPreview site={site} onOpenStory={openStory} />

            {/* Parchment details + RSVP */}
            <PaperSurface variant="parchment">
              <EmeraldRoyaleDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <EmeraldRoyaleRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="er-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6">
                  <EmeraldRoyaleRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <EmeraldRoyaleFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </motion.div>
        )}

        {currentView === "story" && (
          <EmeraldRoyaleStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <EmeraldRoyaleDetails
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
