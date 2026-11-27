// Peacock Royale RSVP form — wired to the Studio's POST /api/rsvp
// (the same contract the shared RsvpForm uses: siteId, guestName,
// email, phone, attending, guestCount, dietary, allergies, message,
// answers, updateToken). The fields map: name → guestName,
// email → email, attending → attending, guests 1–6 → guestCount
// (stepper; the source caps at 6), the 5 meal options →
// answers["meal"], dietary → dietary, message → message. No email
// collection beyond the RSVP itself; the reply-by line is the
// site's editable deadline (60 days before the wedding by default).
//
// NO viewport `sm:` in this file: the form root is its own
// @container and all wider-screen sizing is @min-[40rem]:. The
// form sits on an ivory card framed by gold feather corners.
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Minus, Plus } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { FeatherEye } from "./Decor";
import { maxGuests, mealOptions, rsvpReplyBy } from "./tokens";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function PeacockRoyaleRsvpForm({
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
        className="relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#FDFBF5] px-6 py-12 text-center text-[#062E2B] shadow-[0_18px_36px_-14px_rgba(4,33,31,0.4)] ring-1 ring-[#D4AF37]/60 @min-[40rem]:px-10"
      >
        <div className="relative z-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37] bg-[#FAF6EC] text-[#062E2B]">
            <Heart className="h-6 w-6 fill-[#0B4F4A]/30" />
          </span>
          <h3 className="er-font-display mt-5 text-[1.7rem] leading-[1.15] font-normal text-[#062E2B]">
            Thank you, {name.trim()}!
          </h3>
          <p className="er-font-editorial mx-auto mt-3 max-w-[440px] text-[1rem] leading-[1.75] text-[#062E2B]/85 italic">
            {attending === "yes"
              ? `Your RSVP is saved — party of ${guests}. We cannot wait to celebrate with you.`
              : "Thank you for letting us know. You will be dearly missed."}
          </p>
          {updateUrl && (
            <p className="er-font-editorial mt-5 text-sm text-[#062E2B]/70 italic">
              Need to change your reply?{" "}
              <a href={updateUrl} className="text-[#062E2B] underline underline-offset-2">
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
      className="relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#FDFBF5] px-6 py-10 text-[#062E2B] shadow-[0_18px_36px_-14px_rgba(4,33,31,0.4)] ring-1 ring-[#D4AF37]/60 @min-[40rem]:px-10 @min-[40rem]:py-12"
    >
      {/* Gold feather frame: double gold border + feather eyes in the corners */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#D4AF37]/80" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] border border-[#0B4F4A]/25" />
      <span aria-hidden="true" className="pointer-events-none absolute top-4 left-4 h-6 w-4 opacity-70"><FeatherEye className="h-full w-full" /></span>
      <span aria-hidden="true" className="pointer-events-none absolute top-4 right-4 h-6 w-4 opacity-70"><FeatherEye className="h-full w-full" /></span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-6 w-4 opacity-70"><FeatherEye className="h-full w-full" /></span>
      <span aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 h-6 w-4 opacity-70"><FeatherEye className="h-full w-full" /></span>

      <div className="relative z-10">
        <p className="er-font-display text-center text-[10px] tracking-[0.34em] text-[#0B4F4A] uppercase @min-[40rem]:text-xs">
          RSVP
        </p>
        <h3 className="er-font-display mt-3 text-center text-[1.7rem] leading-[1.12] font-normal text-[#062E2B] @min-[40rem]:text-[1.9rem]">
          Kindly Respond
        </h3>
        {replyBy && (
          <p className="er-font-display mt-2 text-center text-[11px] tracking-[0.22em] text-[#0B4F4A] uppercase">
            {replyBy}
          </p>
        )}
        {loadingExisting && (
          <p className="mt-5 rounded border border-[#D4AF37] bg-[#FAF6EC] px-4 py-3 text-center er-font-editorial text-sm text-[#062E2B]/80 italic">
            Loading your previous response…
          </p>
        )}

        <div className="mt-7 space-y-5 text-left">
          {/* Name */}
          <div>
            <label htmlFor="pr-rsvp-name" className="er-font-display block text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
              Full Name
            </label>
            <input
              id="pr-rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="mt-2 w-full border border-[#D4AF37]/70 bg-[#FFFFFF] px-4 py-3 er-font-editorial text-[1rem] text-[#062E2B] placeholder:text-[#062E2B]/40 focus:border-[#062E2B] focus:outline-none"
            />
            {errors.name && <p role="alert" className="mt-1.5 text-sm text-[#0B4F4A]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="pr-rsvp-email" className="er-font-display block text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
              Email Address <span aria-hidden="true" className="text-red-700">*</span>
            </label>
            <input
              id="pr-rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 w-full border border-[#D4AF37]/70 bg-[#FFFFFF] px-4 py-3 er-font-editorial text-[1rem] text-[#062E2B] placeholder:text-[#062E2B]/40 focus:border-[#062E2B] focus:outline-none"
            />
            {errors.email && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.email}</p>}
          </div>

          {/* Attending */}
          <fieldset>
            <legend className="er-font-display text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
              Will you be attending?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                aria-pressed={attending === "yes"}
                className={`flex items-center justify-center gap-2 border px-4 py-3 er-font-display text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "yes"
                    ? "border-[#062E2B] bg-[#062E2B] text-[#FDFBF5]"
                    : "border-[#D4AF37]/70 bg-[#FFFFFF] text-[#062E2B] hover:border-[#062E2B]"
                }`}
              >
                {attending === "yes" && <Check className="h-4 w-4" />}
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                aria-pressed={attending === "no"}
                className={`flex items-center justify-center gap-2 border px-4 py-3 er-font-display text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "no"
                    ? "border-[#062E2B] bg-[#062E2B] text-[#FDFBF5]"
                    : "border-[#D4AF37]/70 bg-[#FFFFFF] text-[#062E2B] hover:border-[#062E2B]"
                }`}
              >
                {attending === "no" && <Check className="h-4 w-4" />}
                Regretfully Decline
              </button>
            </div>
            {errors.attending && <p role="alert" className="mt-1.5 text-sm text-[#0B4F4A]">{errors.attending}</p>}
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Guests stepper */}
              <div>
                <span className="er-font-display block text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
                  Number of Guests
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#D4AF37]/70 bg-[#FFFFFF] text-[#062E2B] transition-colors hover:border-[#062E2B] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="er-font-display min-w-8 text-center text-xl text-[#062E2B] tabular-nums" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(guestCap, g + 1))}
                    disabled={guests >= guestCap}
                    aria-label="One more guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#D4AF37]/70 bg-[#FFFFFF] text-[#062E2B] transition-colors hover:border-[#062E2B] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="er-font-editorial text-sm text-[#062E2B]/70 italic">
                    {guestCap === 1 ? "1 guest maximum" : `up to ${guestCap} guests`}
                  </span>
                </div>
              </div>

              {/* Meal selection */}
              <fieldset>
                <legend className="er-font-display text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
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
                        className={`flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-[#062E2B] bg-[#062E2B]/5"
                            : "border-[#D4AF37]/70 bg-[#FFFFFF] hover:border-[#062E2B]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-[#062E2B] bg-[#062E2B] text-[#FDFBF5]" : "border-[#D4AF37] text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="er-font-editorial text-[0.95rem] text-[#062E2B]">{option}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.meal && <p role="alert" className="mt-1.5 text-sm text-[#0B4F4A]">{errors.meal}</p>}
              </fieldset>

              {/* Dietary */}
              <div>
                <label htmlFor="pr-rsvp-dietary" className="er-font-display block text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
                  Dietary Restrictions <span className="normal-case tracking-normal text-[#062E2B]/60">(optional)</span>
                </label>
                <input
                  id="pr-rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Allergies or dietary needs"
                  className="mt-2 w-full border border-[#D4AF37]/70 bg-[#FFFFFF] px-4 py-3 er-font-editorial text-[1rem] text-[#062E2B] placeholder:text-[#062E2B]/40 focus:border-[#062E2B] focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label htmlFor="pr-rsvp-message" className="er-font-display block text-[11px] tracking-[0.22em] text-[#062E2B] uppercase">
              A Note for the Couple <span className="normal-case tracking-normal text-[#062E2B]/60">(optional)</span>
            </label>
            <textarea
              id="pr-rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes, song requests, or memories…"
              rows={4}
              className="mt-2 w-full resize-y border border-[#D4AF37]/70 bg-[#FFFFFF] px-4 py-3 er-font-editorial text-[1rem] text-[#062E2B] placeholder:text-[#062E2B]/40 focus:border-[#062E2B] focus:outline-none"
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded border border-[#0B4F4A]/40 bg-[#0B4F4A]/10 px-4 py-3 text-sm text-[#0B4F4A]">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || loadingExisting}
            className="group flex w-full items-center justify-center gap-2 bg-[#062E2B] px-6 py-4 er-font-display text-xs tracking-[0.28em] text-[#FDFBF5] uppercase shadow-[0_10px_22px_-8px_rgba(4,33,31,0.6)] transition-colors duration-300 hover:bg-[#0B4F4A] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B]"
          >
            <Heart className="h-4 w-4 fill-[#FDFBF5]/20" />
            {loading ? "Sending your RSVP…" : "Send RSVP"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
