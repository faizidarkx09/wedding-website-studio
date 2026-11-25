// Blush Royale renderer — view machine (cover → invitation →
// story → details) following the Studio's renderer contract
// (props: site, envelope, preview).
//
// Views, in order:
//   cover      — BlushRoyaleCover (blush wash, rose-gold script,
//                wax-seal emblem + live monogram)
//   invitation — BlushRoyaleEnvelope + Introduction + Countdown
//                (blush wash band) + StoryPreview (CIRCULAR photos
//                with floral rings) + DetailsCard (blush rounded
//                cards) + RSVPSection (blush watercolor card) +
//                RSVP form + footer
//   story      — BlushRoyaleStory (ringed circles + paragraphs)
//   details    — BlushRoyaleDetails (blush rounded cards)
//
// NO music engine: this template ships without music by design.
"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { WashSurface } from "./Decor";
import BlushRoyaleCover from "./BlushRoyaleCover";
import BlushRoyaleEnvelope from "./BlushRoyaleEnvelope";
import {
  BlushRoyaleCountdown,
  BlushRoyaleIntroduction,
  BlushRoyaleStoryPreview,
} from "./BlushRoyaleHero";
import {
  BlushRoyaleDetailsCard,
  BlushRoyaleFooter,
  BlushRoyaleRsvpSection,
} from "./BlushRoyaleSections";
import BlushRoyaleStory from "./BlushRoyaleStory";
import BlushRoyaleDetails from "./BlushRoyaleDetails";
import BlushRoyaleRsvpForm from "./BlushRoyaleRsvpForm";
import { resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function BlushRoyaleRenderer({
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
    const el = document.getElementById("br-rsvp-form");
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
    <div className="blush-royale min-h-dvh w-full">
      {/* Fast-load: preload the hero/cover image (same fix as
          Royal Burgundy / ÉTERNEL / Blossom). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-50 bg-[#B76E79] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Blush Royale template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <BlushRoyaleCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <div key="invitation">
            {/* Cream invitation body */}
            <WashSurface variant="cream">
              <BlushRoyaleEnvelope site={site} />
              {showWelcome && <BlushRoyaleIntroduction site={site} />}
            </WashSurface>

            {/* Blush wash countdown band */}
            {showCountdown && (
              <WashSurface variant="wash" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <BlushRoyaleCountdown site={site} />
              </WashSurface>
            )}

            {/* Circular floral-ring story preview */}
            <BlushRoyaleStoryPreview site={site} onOpenStory={openStory} />

            {/* Cream details + RSVP */}
            <WashSurface variant="cream">
              <BlushRoyaleDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <BlushRoyaleRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="br-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6">
                  <BlushRoyaleRsvpForm site={site} />
                </div>
              )}
            </WashSurface>

            <BlushRoyaleFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </div>
        )}

        {currentView === "story" && (
          <BlushRoyaleStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <BlushRoyaleDetails
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
