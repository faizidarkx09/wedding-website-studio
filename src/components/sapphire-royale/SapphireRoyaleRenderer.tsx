// Sapphire Royale renderer — art-deco night view machine
// (cover → invitation → story → details) adapted to the Studio's
// renderer contract (props: site, envelope, preview).
//
// Views, in order:
//   cover      — OpeningCover (navy velvet, silver seal, sunburst)
//   invitation — EnvelopeInvitation + WeddingIntroduction + Countdown
//                (navy band) + StoryPreview (three horizontal photo
//                cards) + WeddingDetailsCard (navy panels + silver
//                rules) + RSVPSection (ice panel) + RSVP form + footer
//   story      — StoryPage (photo cards + paragraphs)
//   details    — WeddingDetailsPage (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// NO music engine on this template (no ambientMusic, no toggle).
// HostGuestListModal is NOT ported (host-only admin list; guests
// never see RSVP data) — the footer links are Cover / Our Story /
// Wedding Details only.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { NightSurface } from "./Decor";
import SapphireRoyaleCover from "./SapphireRoyaleCover";
import SapphireRoyaleEnvelope from "./SapphireRoyaleEnvelope";
import {
  SapphireRoyaleCountdown,
  SapphireRoyaleIntroduction,
  SapphireRoyaleStoryPreview,
} from "./SapphireRoyaleHero";
import {
  SapphireRoyaleDetailsCard,
  SapphireRoyaleFooter,
  SapphireRoyaleRsvpSection,
} from "./SapphireRoyaleSections";
import SapphireRoyaleStory from "./SapphireRoyaleStory";
import SapphireRoyaleDetails from "./SapphireRoyaleDetails";
import SapphireRoyaleRsvpForm from "./SapphireRoyaleRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function SapphireRoyaleRenderer({
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
    const el = document.getElementById("sr-rsvp-form");
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
    <div className="sapphire-royale min-h-dvh w-full">
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom / Royal Burgundy). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#0A1F44] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Sapphire Royale template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <SapphireRoyaleCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <div key="invitation">
            {/* Ice invitation body */}
            <NightSurface variant="ice">
              <SapphireRoyaleEnvelope site={site} />
              {showWelcome && <SapphireRoyaleIntroduction site={site} />}
            </NightSurface>

            {/* Navy countdown band */}
            {showCountdown && (
              <NightSurface variant="navy" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <SapphireRoyaleCountdown site={site} />
              </NightSurface>
            )}

            {/* Three horizontal photo cards */}
            <SapphireRoyaleStoryPreview site={site} onOpenStory={openStory} />

            {/* Ice details + RSVP */}
            <NightSurface variant="ice">
              <SapphireRoyaleDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <SapphireRoyaleRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="sr-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6">
                  <SapphireRoyaleRsvpForm site={site} />
                </div>
              )}
            </NightSurface>

            <SapphireRoyaleFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </div>
        )}

        {currentView === "story" && (
          <SapphireRoyaleStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <SapphireRoyaleDetails
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
