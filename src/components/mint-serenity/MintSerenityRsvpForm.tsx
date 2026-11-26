// Mint Serenity RSVP form — same contract as Golden Hour's form,
// wired to the Studio's POST /api/rsvp (the same contract the
// shared RsvpForm uses: siteId, guestName, email, phone, attending,
// guestCount, dietary, allergies, message, answers, updateToken).
// Fields: name → guestName, email → email, attending → attending,
// guests 1–6 → guestCount (stepper; the source caps at 6), the 5
// meal options → answers["meal"], dietary → dietary, message →
// message. No email collection beyond the RSVP itself; the reply-by
// line is the site's editable deadline (60 days before the wedding
// by default). The form sits in a white bubble card (fully rounded)
// on the mint wash.
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Minus, Plus } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { FONT_DISPLAY, FONT_EDITORIAL, maxGuests, mealOptions, rsvpReplyBy } from "./tokens";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function MintSerenityRsvpForm({
  site,
  token,
}: {
  site: WeddingSite;
  token?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(1);
  const [meal, setMeal] = useState("");
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(token));
  const [updateToken, setUpdateToken] = useState<string | null>(token ?? null);

  const guestCap = Math.min(6, maxGuests(site));
  const options = mealOptions(site);
  const replyBy = rsvpReplyBy(site);

  // Prefill from an existing response when ?token= is present (the
  // update link from a previous confirmation).
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/rsvp?token=${encodeURIComponent(token)}`);
        const data: unknown = await res.json().catch(() => null);
        if (cancelled) return;
        const rsvp: unknown = isRecord(data) ? (data.rsvp ?? data) : null;
        if (res.ok && isRecord(rsvp) && typeof rsvp.guestName === "string") {
          const r = rsvp as Partial<RsvpResponse>;
          setName(r.guestName ?? "");
          setEmail(r.email ?? "");
          setAttending(typeof r.attending === "boolean" ? (r.attending ? "yes" : "no") : null);
          setGuests(typeof r.guestCount === "number" && r.guestCount >= 1 ? r.guestCount : 1);
          const prevMeal = r.answers && typeof r.answers === "object" ? (r.answers as Record<string, unknown>)["meal"] : "";
          setMeal(typeof prevMeal === "string" ? prevMeal : "");
          setDietary(r.dietary ?? "");
          setMessage(r.message ?? "");
        } else {
          setErrors({
            form: "We could not find a response for that update link. You can still send a new RSVP below.",
          });
        }
      } catch {
        if (!cancelled) {
          setErrors({
            form: "We could not load your previous response. You can still send a new RSVP below.",
          });
        }
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!email.trim()) next.email = "Please share your email so we can confirm your RSVP.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email does not look quite right.";
    if (attending === null) next.attending = "Please let us know if you can join us.";
    if (attending === "yes" && !meal) next.meal = "Please choose your entrée.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        siteId: site.id,
        guestName: name.trim(),
        email: email.trim(),
        phone: "",
        attending: attending === "yes",
        guestCount: attending === "yes" ? guests : 0,
        dietary: dietary.trim(),
        allergies: "",
        message: message.trim(),
        answers: attending === "yes" ? { meal } : {},
      };
      if (updateToken) body.updateToken = updateToken;
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await res.json().catch(() => null);
      if (res.ok && isRecord(data) && data.ok === true && typeof data.updateToken === "string") {
        setSavedToken(data.updateToken);
        setDone(true);
      } else {
        const msg =
          isRecord(data) && typeof data.error === "string"
            ? data.error
            : "Something went wrong sending your RSVP. Please try again.";
        setErrors({ form: msg });
      }
    } catch {
      setErrors({ form: "Something went wrong sending your RSVP. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const updateUrl =
      typeof window !== "undefined" && savedToken
        ? `${window.location.origin}/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`
        : "";
    return (
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-white px-6 py-12 text-center text-[#052E22] shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] sm:px-10"
      >
        <div className="relative z-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5] text-[#052E22]">
            <Heart className="h-6 w-6 fill-[#047857]/30" />
          </span>
          <h3 style={FONT_DISPLAY} className="mt-5 text-[1.7rem] leading-[1.15] font-normal text-[#052E22]">
            Thank you, {name.trim()}!
          </h3>
          <p style={FONT_EDITORIAL} className="mx-auto mt-3 max-w-[440px] text-[1rem] leading-[1.75] text-[#052E22]/85 italic">
            {attending === "yes"
              ? `Your RSVP is saved — party of ${guests}. We cannot wait to celebrate with you.`
              : "Thank you for letting us know. You will be dearly missed."}
          </p>
          {updateUrl && (
            <p style={FONT_EDITORIAL} className="mt-5 text-sm text-[#052E22]/70 italic">
              Need to change your reply?{" "}
              <a href={updateUrl} className="text-[#052E22] underline underline-offset-2">
                Update your RSVP
              </a>
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-white px-6 py-10 text-[#052E22] shadow-[0_18px_36px_-14px_rgba(6,95,70,0.4)] ring-1 ring-[#A7F3D0] sm:px-10 sm:py-12"
    >
      {/* Mint bubble border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-[#065F46]/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] rounded-[1.3rem] border border-[#10B981]/25" />

      <div className="relative z-10">
        <p style={FONT_DISPLAY} className="text-center text-[10px] tracking-[0.34em] text-[#047857] uppercase sm:text-xs">
          RSVP
        </p>
        <h3 style={FONT_DISPLAY} className="mt-3 text-center text-[1.7rem] leading-[1.12] font-normal text-[#052E22] sm:text-[1.9rem]">
          Kindly Respond
        </h3>
        {replyBy && (
          <p style={FONT_DISPLAY} className="mt-2 text-center text-[11px] tracking-[0.22em] text-[#047857] uppercase">
            {replyBy}
          </p>
        )}
        {loadingExisting && (
          <p style={FONT_EDITORIAL} className="mt-5 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-center text-sm text-[#052E22]/80 italic">
            Loading your previous response…
          </p>
        )}

        <div className="mt-7 space-y-5 text-left">
          {/* Name */}
          <div>
            <label htmlFor="ms-rsvp-name" style={FONT_DISPLAY} className="block text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
              Full Name
            </label>
            <input
              id="ms-rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              style={FONT_EDITORIAL}
              className="mt-2 w-full rounded-full border border-[#A7F3D0] bg-[#FDFEFD] px-5 py-3 text-[1rem] text-[#052E22] placeholder:text-[#052E22]/40 focus:border-[#065F46] focus:outline-none"
            />
            {errors.name && <p role="alert" className="mt-1.5 text-sm text-[#047857]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="ms-rsvp-email" style={FONT_DISPLAY} className="block text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
              Email Address
            </label>
            <input
              id="ms-rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={FONT_EDITORIAL}
              className="mt-2 w-full rounded-full border border-[#A7F3D0] bg-[#FDFEFD] px-5 py-3 text-[1rem] text-[#052E22] placeholder:text-[#052E22]/40 focus:border-[#065F46] focus:outline-none"
            />
            {errors.email && <p role="alert" className="mt-1.5 text-sm text-[#047857]">{errors.email}</p>}
          </div>

          {/* Attending */}
          <fieldset>
            <legend style={FONT_DISPLAY} className="text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
              Will you be attending?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                aria-pressed={attending === "yes"}
                style={FONT_DISPLAY}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "yes"
                    ? "border-[#065F46] bg-[#065F46] text-white"
                    : "border-[#A7F3D0] bg-[#FDFEFD] text-[#052E22] hover:border-[#065F46]"
                }`}
              >
                {attending === "yes" && <Check className="h-4 w-4" />}
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                aria-pressed={attending === "no"}
                style={FONT_DISPLAY}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "no"
                    ? "border-[#065F46] bg-[#065F46] text-white"
                    : "border-[#A7F3D0] bg-[#FDFEFD] text-[#052E22] hover:border-[#065F46]"
                }`}
              >
                {attending === "no" && <Check className="h-4 w-4" />}
                Regretfully Decline
              </button>
            </div>
            {errors.attending && <p role="alert" className="mt-1.5 text-sm text-[#047857]">{errors.attending}</p>}
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Guests stepper */}
              <div>
                <span style={FONT_DISPLAY} className="block text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
                  Number of Guests
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer guest"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#FDFEFD] text-[#052E22] transition-colors hover:border-[#065F46] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span style={FONT_DISPLAY} className="min-w-8 text-center text-xl text-[#052E22] tabular-nums" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(guestCap, g + 1))}
                    disabled={guests >= guestCap}
                    aria-label="One more guest"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#FDFEFD] text-[#052E22] transition-colors hover:border-[#065F46] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span style={FONT_EDITORIAL} className="text-sm text-[#052E22]/70 italic">
                    {guestCap === 1 ? "1 guest maximum" : `up to ${guestCap} guests`}
                  </span>
                </div>
              </div>

              {/* Meal selection */}
              <fieldset>
                <legend style={FONT_DISPLAY} className="text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
                  Entrée Selection
                </legend>
                <div className="mt-2 space-y-2">
                  {options.map((option) => {
                    const selected = meal === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMeal(option)}
                        aria-pressed={selected}
                        className={`flex w-full items-center gap-3 rounded-full border px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-[#065F46] bg-[#065F46]/5"
                            : "border-[#A7F3D0] bg-[#FDFEFD] hover:border-[#065F46]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-[#065F46] bg-[#065F46] text-white" : "border-[#A7F3D0] text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span style={FONT_EDITORIAL} className="text-[0.95rem] text-[#052E22]">{option}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.meal && <p role="alert" className="mt-1.5 text-sm text-[#047857]">{errors.meal}</p>}
              </fieldset>

              {/* Dietary */}
              <div>
                <label htmlFor="ms-rsvp-dietary" style={FONT_DISPLAY} className="block text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
                  Dietary Restrictions <span className="normal-case tracking-normal text-[#052E22]/60">(optional)</span>
                </label>
                <input
                  id="ms-rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Allergies or dietary needs"
                  style={FONT_EDITORIAL}
                  className="mt-2 w-full rounded-full border border-[#A7F3D0] bg-[#FDFEFD] px-5 py-3 text-[1rem] text-[#052E22] placeholder:text-[#052E22]/40 focus:border-[#065F46] focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label htmlFor="ms-rsvp-message" style={FONT_DISPLAY} className="block text-[11px] tracking-[0.22em] text-[#052E22] uppercase">
              A Note for the Couple <span className="normal-case tracking-normal text-[#052E22]/60">(optional)</span>
            </label>
            <textarea
              id="ms-rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes, song requests, or memories…"
              rows={4}
              style={FONT_EDITORIAL}
              className="mt-2 w-full resize-y rounded-[1.5rem] border border-[#A7F3D0] bg-[#FDFEFD] px-5 py-3 text-[1rem] text-[#052E22] placeholder:text-[#052E22]/40 focus:border-[#065F46] focus:outline-none"
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded-[1.5rem] border border-[#047857]/40 bg-[#047857]/10 px-4 py-3 text-sm text-[#047857]">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || loadingExisting}
            style={FONT_DISPLAY}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#065F46] px-6 py-4 text-xs tracking-[0.28em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            <Heart className="h-4 w-4 fill-white/20" />
            {loading ? "Sending your RSVP…" : "Send RSVP"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
