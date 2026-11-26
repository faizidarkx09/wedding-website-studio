// Sunflower Fields RSVP form — same contract as Emerald Royale's
// form, wired to the Studio's POST /api/rsvp (the same contract the
// shared RsvpForm uses: siteId, guestName, email, phone, attending,
// guestCount, dietary, allergies, message, answers, updateToken).
// Fields: name → guestName, email → email, attending → attending,
// guests 1–6 → guestCount (stepper; the source caps at 6), the 5
// meal options → answers["meal"], dietary → dietary, message →
// message. No email collection beyond the RSVP itself; the reply-by
// line is the site's editable deadline (60 days before the wedding
// by default).
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Minus, Plus } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { FONT_DISPLAY, FONT_EDITORIAL, maxGuests, mealOptions, rsvpReplyBy } from "./tokens";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function SunflowerFieldsRsvpForm({
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
        className="relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#FFFEF5] px-6 py-12 text-center text-[#14532D] shadow-[0_18px_36px_-14px_rgba(20,83,45,0.4)]"
      >
        <div className="relative z-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#EAB308]/70 bg-[#FFFBEB] text-[#14532D]">
            <Heart className="h-6 w-6 fill-[#166534]/30" />
          </span>
          <h3
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-5 text-[1.7rem] leading-[1.15] font-semibold text-[#14532D]"
          >
            Thank you, {name.trim()}!
          </h3>
          <p
            style={{ fontFamily: FONT_EDITORIAL }}
            className="mx-auto mt-3 max-w-[440px] text-[1rem] leading-[1.75] font-semibold text-[#14532D]/85 italic"
          >
            {attending === "yes"
              ? `Your RSVP is saved — party of ${guests}. We cannot wait to celebrate with you.`
              : "Thank you for letting us know. You will be dearly missed."}
          </p>
          {updateUrl && (
            <p
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-5 text-sm font-semibold text-[#14532D]/70 italic"
            >
              Need to change your reply?{" "}
              <a href={updateUrl} className="text-[#14532D] underline underline-offset-2">
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
      className="relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#FFFEF5] px-6 py-10 text-[#14532D] shadow-[0_18px_36px_-14px_rgba(20,83,45,0.4)]"
    >
      {/* Sunflower letterpress border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#EAB308]/60" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] border border-[#166534]/25" />

      <div className="relative z-10">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-center text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          RSVP
        </p>
        <h3
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-center text-[1.7rem] leading-[1.12] font-semibold text-[#14532D]"
        >
          Kindly Respond
        </h3>
        {replyBy && (
          <p
            style={{ fontFamily: FONT_DISPLAY }}
            className="mt-2 text-center text-[11px] tracking-[0.22em] text-[#166534] uppercase"
          >
            {replyBy}
          </p>
        )}
        {loadingExisting && (
          <p
            style={{ fontFamily: FONT_EDITORIAL }}
            className="mt-5 rounded border border-[#EAB308]/50 bg-[#FFFBEB] px-4 py-3 text-center text-sm font-semibold text-[#14532D]/80 italic"
          >
            Loading your previous response…
          </p>
        )}

        <div className="mt-7 space-y-5 text-left">
          {/* Name */}
          <div>
            <label
              htmlFor="sf-rsvp-name"
              style={{ fontFamily: FONT_DISPLAY }}
              className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
            >
              Full Name
            </label>
            <input
              id="sf-rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-2 w-full border border-[#EAB308]/60 bg-[#FFFEF5] px-4 py-3 text-[1rem] text-[#14532D] placeholder:text-[#14532D]/40 focus:border-[#14532D] focus:outline-none"
            />
            {errors.name && <p role="alert" className="mt-1.5 text-sm text-[#B45309]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="sf-rsvp-email"
              style={{ fontFamily: FONT_DISPLAY }}
              className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
            >
              Email Address
            </label>
            <input
              id="sf-rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-2 w-full border border-[#EAB308]/60 bg-[#FFFEF5] px-4 py-3 text-[1rem] text-[#14532D] placeholder:text-[#14532D]/40 focus:border-[#14532D] focus:outline-none"
            />
            {errors.email && <p role="alert" className="mt-1.5 text-sm text-[#B45309]">{errors.email}</p>}
          </div>

          {/* Attending */}
          <fieldset>
            <legend
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
            >
              Will you be attending?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                aria-pressed={attending === "yes"}
                style={{ fontFamily: FONT_DISPLAY }}
                className={`flex items-center justify-center gap-2 border px-4 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "yes"
                    ? "border-[#14532D] bg-[#14532D] text-[#FFFBEB]"
                    : "border-[#EAB308]/60 bg-[#FFFEF5] text-[#14532D] hover:border-[#14532D]"
                }`}
              >
                {attending === "yes" && <Check className="h-4 w-4" />}
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                aria-pressed={attending === "no"}
                style={{ fontFamily: FONT_DISPLAY }}
                className={`flex items-center justify-center gap-2 border px-4 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "no"
                    ? "border-[#14532D] bg-[#14532D] text-[#FFFBEB]"
                    : "border-[#EAB308]/60 bg-[#FFFEF5] text-[#14532D] hover:border-[#14532D]"
                }`}
              >
                {attending === "no" && <Check className="h-4 w-4" />}
                Regretfully Decline
              </button>
            </div>
            {errors.attending && <p role="alert" className="mt-1.5 text-sm text-[#B45309]">{errors.attending}</p>}
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Guests stepper */}
              <div>
                <span
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
                >
                  Number of Guests
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#EAB308]/60 bg-[#FFFEF5] text-[#14532D] transition-colors hover:border-[#14532D] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="min-w-10 text-center text-lg font-semibold text-[#14532D] tabular-nums"
                  >
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(guestCap, g + 1))}
                    disabled={guests >= guestCap}
                    aria-label="One more guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#EAB308]/60 bg-[#FFFEF5] text-[#14532D] transition-colors hover:border-[#14532D] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span
                    style={{ fontFamily: FONT_EDITORIAL }}
                    className="text-sm font-semibold text-[#14532D]/70 italic"
                  >
                    {guests === 1 ? "Just you" : `Including you — up to ${guestCap}`}
                  </span>
                </div>
              </div>

              {/* Entrée */}
              <div>
                <label
                  htmlFor="sf-rsvp-meal"
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
                >
                  Entrée Choice
                </label>
                <select
                  id="sf-rsvp-meal"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  style={{ fontFamily: FONT_EDITORIAL }}
                  className="mt-2 w-full border border-[#EAB308]/60 bg-[#FFFEF5] px-4 py-3 text-[1rem] text-[#14532D] focus:border-[#14532D] focus:outline-none"
                >
                  <option value="">Choose your entrée…</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.meal && <p role="alert" className="mt-1.5 text-sm text-[#B45309]">{errors.meal}</p>}
              </div>

              {/* Dietary */}
              <div>
                <label
                  htmlFor="sf-rsvp-dietary"
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
                >
                  Dietary Requirements <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="sf-rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Allergies, preferences…"
                  style={{ fontFamily: FONT_EDITORIAL }}
                  className="mt-2 w-full border border-[#EAB308]/60 bg-[#FFFEF5] px-4 py-3 text-[1rem] text-[#14532D] placeholder:text-[#14532D]/40 focus:border-[#14532D] focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label
              htmlFor="sf-rsvp-message"
              style={{ fontFamily: FONT_DISPLAY }}
              className="block text-[11px] tracking-[0.22em] text-[#14532D] uppercase"
            >
              A Note for the Couple <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id="sf-rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes…"
              rows={3}
              style={{ fontFamily: FONT_EDITORIAL }}
              className="mt-2 w-full resize-y border border-[#EAB308]/60 bg-[#FFFEF5] px-4 py-3 text-[1rem] text-[#14532D] placeholder:text-[#14532D]/40 focus:border-[#14532D] focus:outline-none"
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded border border-[#B45309]/50 bg-[#FEF3C7] px-4 py-3 text-sm font-semibold text-[#92400E]">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group flex w-full items-center justify-center gap-2 bg-[#14532D] px-6 py-3.5 text-[12px] tracking-[0.26em] text-[#FFFBEB] uppercase shadow-[0_10px_22px_-8px_rgba(20,83,45,0.6)] transition-colors duration-300 hover:bg-[#166534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] disabled:opacity-60"
          >
            <Heart className="h-4 w-4 fill-[#FFFBEB]/20" />
            {loading ? "Sending…" : "Send RSVP"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
