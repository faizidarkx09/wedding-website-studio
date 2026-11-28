// Eternal Moment RSVP — a thin themed wrapper around the shared
// RsvpForm (the same POST /api/rsvp contract, token prefill and
// custom questions every template uses). Golden Hour has its own
// form because it needs a bespoke meal stepper; this template does
// not — a second RSVP implementation would only drift. The wrapper
// adds the ETERNAL section chrome: eyebrow, title, reply-by line
// and the cream paper band. When the deadline has passed, the form
// is replaced by a closed notice (same rule as ÉTERNEL).
"use client";

import { Clock } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import RsvpForm from "../RsvpForm";
import Reveal from "../Reveal";
import { DiamondDivider } from "./Decor";
import { SectionHeading } from "./EternalMomentSections";
import { ETERNAL, FONT_BODY, formatLongDate, rsvpReplyBy } from "./tokens";

export default function EternalMomentRsvpForm({
  site,
  token,
}: {
  site: WeddingSite;
  token?: string;
}) {
  const replyBy = rsvpReplyBy(site);
  const deadline = site.settings.rsvpDeadline ? Date.parse(site.settings.rsvpDeadline) : NaN;
  const closed = !Number.isNaN(deadline) && deadline <= Date.now();

  return (
    <section
      id="rsvp"
      aria-label="RSVP"
      className="w-full px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: ETERNAL.cream }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <Reveal>
          <SectionHeading
            eyebrow={replyBy || "Répondez s'il vous plaît"}
            title="Will You Join Us?"
            intro="Your presence is the greatest gift. Tell us who is coming, and leave a note for the couple."
          />
        </Reveal>

        <div className="mt-12">
          {closed ? (
            <Reveal>
              <div
                className="mx-auto flex max-w-xl items-start gap-3 border px-5 py-4"
                style={{ backgroundColor: ETERNAL.paper, borderColor: ETERNAL.champagne }}
              >
                <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ETERNAL.gold }} aria-hidden="true" />
                <p className={`${FONT_BODY} text-sm leading-relaxed`} style={{ color: ETERNAL.espresso }}>
                  RSVPs for this wedding are now closed
                  {!Number.isNaN(deadline)
                    ? ` (the deadline was ${formatLongDate(site.settings.rsvpDeadline as string, site.timezone)})`
                    : ""}
                  . If you still need to reply, please contact the couple directly.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <RsvpForm site={site} token={token} />
            </Reveal>
          )}
        </div>

        <DiamondDivider className="mt-14" />
      </div>
    </section>
  );
}
