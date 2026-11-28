// Royal Burgundy renderer — 1:1 port of the source's App.tsx
// view machine (cover → invitation → story → details) adapted to
// the Studio's renderer contract (props: site only).
//
// Views, in the source's order:
//   cover      — OpeningCover (burgundy leather, heart seal, OPEN THE INVITATION)
//   invitation — EnvelopeInvitation + WeddingIntroduction + Countdown
//                (parchment, then a burgundy band) + StoryPreview
//                (burgundy film strip) + WeddingDetailsCard + RSVPSection
//                + RSVP form (parchment) + footer
//   story      — StoryPage (film strip + triptych + paragraphs)
//   details    — WeddingDetailsPage (schedule, dress code, venue +
//                travel, accommodations, registry, RSVP jump)
//
// Music: the source's own chamber-waltz synth engine
// (src/lib/ambientMusic.ts, "Clair de Lune — Chamber Waltz") —
// never autoplays; it starts only from the vinyl medallion toggle
// in the envelope, exactly as in the source. A couple-configured
// music URL plays through the same engine instead.
// HostGuestListModal is NOT ported (host-only admin list; guests
// never see RSVP data) — the footer links are Cover / Our Story /
// Wedding Details only.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import { createWeddingMusicEngine } from "./ambientMusic";
import RoyalBurgundyCover from "./RoyalBurgundyCover";
import RoyalBurgundyEnvelope from "./RoyalBurgundyEnvelope";
import {
  RoyalBurgundyCountdown,
  RoyalBurgundyIntroduction,
  RoyalBurgundyStoryPreview,
} from "./RoyalBurgundyHero";
import {
  RoyalBurgundyDetailsCard,
  RoyalBurgundyFooter,
  RoyalBurgundyRsvpSection,
} from "./RoyalBurgundySections";
import RoyalBurgundyStory from "./RoyalBurgundyStory";
import RoyalBurgundyDetails from "./RoyalBurgundyDetails";
import RoyalBurgundyRsvpForm from "./RoyalBurgundyRsvpForm";
import { musicUrl, resolveHeroSrc, willRenderSection } from "./tokens";

type View = "cover" | "invitation" | "story" | "details";

export default function RoyalBurgundyRenderer({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const savedScrollRef = useRef(0);
  const engineRef = useRef<ReturnType<typeof createWeddingMusicEngine> | null>(null);

  // Create the music engine once (client-only, Web Audio).
  useEffect(() => {
    const engine = createWeddingMusicEngine(musicUrl(site));
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
    // The engine URL is the site's configured music URL; a change
    // needs a fresh engine (remount on activation change is enough —
    // the site object is stable per page load).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = async () => {
    const engine = engineRef.current;
    if (!engine) return;
    try {
      const next = await engine.toggle();
      setIsPlaying(next);
    } catch {
      setIsPlaying(engine.isPlaying());
    }
  };

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
    const el = document.getElementById("rb-rsvp-form");
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
    <div className="royal-burgundy min-h-dvh w-full">
      {/* Fast-load: preload the hero/cover image (the user explicitly
          wants fast loading — same fix as ÉTERNEL / Blossom). */}
      <link rel="preload" as="image" href={heroSrc} fetchPriority="high" />

      {preview ? (
        <div className="relative z-30 bg-[#570F20] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
          Preview — this is how the Royal Burgundy template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {currentView === "cover" && envelope && (
          <RoyalBurgundyCover key="cover" site={site} onOpen={openInvitation} />
        )}

        {currentView === "invitation" && (
          <div key="invitation">
            {/* Parchment invitation body */}
            <PaperSurface variant="parchment">
              <RoyalBurgundyEnvelope
                site={site}
                isMusicPlaying={isPlaying}
                onToggleMusic={toggleMusic}
              />
              {showWelcome && <RoyalBurgundyIntroduction site={site} />}
            </PaperSurface>

            {/* Burgundy countdown band */}
            {showCountdown && (
              <PaperSurface variant="burgundy" className="px-4 pt-14 sm:px-6 sm:pt-16">
                <RoyalBurgundyCountdown site={site} />
              </PaperSurface>
            )}

            {/* Burgundy film strip */}
            <RoyalBurgundyStoryPreview site={site} onOpenStory={openStory} />

            {/* Parchment details + RSVP */}
            <PaperSurface variant="parchment">
              <RoyalBurgundyDetailsCard site={site} onOpenDetails={openDetails} />
              {showRsvp && <RoyalBurgundyRsvpSection site={site} onJumpToRsvp={jumpToRsvp} />}
              {showRsvp && (
                <div id="rb-rsvp-form" className="scroll-mt-6 px-4 pb-20 sm:px-6">
                  <RoyalBurgundyRsvpForm site={site} />
                </div>
              )}
            </PaperSurface>

            <RoyalBurgundyFooter site={site} showCoverLink={envelope} onNavigate={navigateFromFooter} />
          </div>
        )}

        {currentView === "story" && (
          <RoyalBurgundyStory key="story" site={site} onBack={backToInvitation} />
        )}

        {currentView === "details" && (
          <RoyalBurgundyDetails
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
