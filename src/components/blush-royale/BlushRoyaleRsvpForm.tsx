// Blush Royale RSVP form — wired to the Studio's POST /api/rsvp
// (the same contract the shared RsvpForm uses: siteId, guestName,
// email, phone, attending, guestCount, dietary, allergies, message,
// answers, updateToken). Fields map: name → guestName, email →
// email, attending → attending, guests 1–6 → guestCount (stepper),
// the 5 meal options → answers["meal"], dietary → dietary, message
// → message. No email collection beyond the RSVP itself; the
// reply-by line is the site's editable deadline (60 days before the
// wedding by default).
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Minus, Plus } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { maxGuests, mealOptions, rsvpReplyBy } from "./tokens";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function BlushRoyaleRsvpForm({
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
        className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] bg-[#FFFDFB] px-6 py-12 text-center text-[#5C323B] shadow-[0_18px_36px_-14px_rgba(92,50,59,0.3)] sm:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(/images/themes/blush-royale/cream.jpg)` }}
        />
        <div className="relative z-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#B76E79]/60 bg-[#F6DDE0] text-[#B76E79]">
            <Heart className="h-6 w-6 fill-[#B76E79]/30" />
          </span>
          <h3 className="br-font-display mt-5 text-[1.7rem] leading-[1.15] font-normal text-[#5C323B]">
            Thank you, {name.trim()}!
          </h3>
          <p className="br-font-editorial mx-auto mt-3 max-w-[440px] text-[1rem] leading-[1.75] text-[#5C323B]/85 italic">
            {attending === "yes"
              ? `Your RSVP is saved — party of ${guests}. We cannot wait to celebrate with you.`
              : "Thank you for letting us know. You will be dearly missed."}
          </p>
          {updateUrl && (
            <p className="br-font-editorial mt-5 text-sm text-[#5C323B]/70 italic">
              Need to change your reply?{" "}
              <a href={updateUrl} className="text-[#B76E79] underline underline-offset-2">
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
      className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] bg-[#FFFDFB] px-6 py-10 text-[#5C323B] shadow-[0_18px_36px_-14px_rgba(92,50,59,0.3)] sm:px-10 sm:py-12"
    >
      {/* Cream paper texture + rose-gold border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url(/images/themes/blush-royale/cream.jpg)` }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-[#B76E79]/50" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[15px] rounded-[1.25rem] border border-[#E8B4B8]/50" />

      <div className="relative z-10">
        <p className="br-font-display text-center text-[10px] tracking-[0.34em] text-[#7A4A55] uppercase sm:text-xs">
          RSVP
        </p>
        <h3 className="br-font-display mt-3 text-center text-[1.7rem] leading-[1.12] font-normal text-[#5C323B] sm:text-[1.9rem]">
          Kindly Respond
        </h3>
        {replyBy && (
          <p className="br-font-display mt-2 text-center text-[11px] tracking-[0.22em] text-[#7A4A55] uppercase">
            {replyBy}
          </p>
        )}
        {loadingExisting && (
          <p className="mt-5 rounded-2xl border border-[#B76E79]/40 bg-[#F6DDE0] px-4 py-3 text-center br-font-editorial text-sm text-[#5C323B]/80 italic">
            Loading your previous response…
          </p>
        )}

        <div className="mt-7 space-y-5 text-left">
          {/* Name */}
          <div>
            <label htmlFor="br-rsvp-name" className="br-font-display block text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
              Full Name
            </label>
            <input
              id="br-rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-[#B76E79]/50 bg-[#FFFDFB] px-4 py-3 br-font-editorial text-[1rem] text-[#5C323B] placeholder:text-[#5C323B]/40 focus:border-[#B76E79] focus:outline-none"
            />
            {errors.name && <p role="alert" className="mt-1.5 text-sm text-[#B76E79]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="br-rsvp-email" className="br-font-display block text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
              Email Address
            </label>
            <input
              id="br-rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-[#B76E79]/50 bg-[#FFFDFB] px-4 py-3 br-font-editorial text-[1rem] text-[#5C323B] placeholder:text-[#5C323B]/40 focus:border-[#B76E79] focus:outline-none"
            />
            {errors.email && <p role="alert" className="mt-1.5 text-sm text-[#B76E79]">{errors.email}</p>}
          </div>

          {/* Attending */}
          <fieldset>
            <legend className="br-font-display text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
              Will you be attending?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                aria-pressed={attending === "yes"}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 br-font-display text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "yes"
                    ? "border-[#B76E79] bg-[#B76E79] text-[#FFFDFB]"
                    : "border-[#B76E79]/50 bg-[#FFFDFB] text-[#5C323B] hover:border-[#B76E79]"
                }`}
              >
                {attending === "yes" && <Check className="h-4 w-4" />}
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                aria-pressed={attending === "no"}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 br-font-display text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  attending === "no"
                    ? "border-[#B76E79] bg-[#B76E79] text-[#FFFDFB]"
                    : "border-[#B76E79]/50 bg-[#FFFDFB] text-[#5C323B] hover:border-[#B76E79]"
                }`}
              >
                {attending === "no" && <Check className="h-4 w-4" />}
                Regretfully Decline
              </button>
            </div>
            {errors.attending && <p role="alert" className="mt-1.5 text-sm text-[#B76E79]">{errors.attending}</p>}
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Guests stepper */}
              <div>
                <span className="br-font-display block text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
                  Number of Guests
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer guest"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#FFFDFB] text-[#B76E79] transition-colors hover:border-[#B76E79] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="br-font-display min-w-8 text-center text-xl text-[#5C323B] tabular-nums" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(guestCap, g + 1))}
                    disabled={guests >= guestCap}
                    aria-label="One more guest"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B76E79]/50 bg-[#FFFDFB] text-[#B76E79] transition-colors hover:border-[#B76E79] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="br-font-editorial text-sm text-[#5C323B]/70 italic">
                    {guestCap === 1 ? "1 guest maximum" : `up to ${guestCap} guests`}
                  </span>
                </div>
              </div>

              {/* Meal selection */}
              <fieldset>
                <legend className="br-font-display text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
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
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-[#B76E79] bg-[#B76E79]/5"
                            : "border-[#B76E79]/50 bg-[#FFFDFB] hover:border-[#B76E79]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-[#B76E79] bg-[#B76E79] text-[#FFFDFB]" : "border-[#B76E79] text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="br-font-editorial text-[0.95rem] text-[#5C323B]">{option}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.meal && <p role="alert" className="mt-1.5 text-sm text-[#B76E79]">{errors.meal}</p>}
              </fieldset>

              {/* Dietary */}
              <div>
                <label htmlFor="br-rsvp-dietary" className="br-font-display block text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
                  Dietary Restrictions <span className="normal-case tracking-normal text-[#5C323B]/60">(optional)</span>
                </label>
                <input
                  id="br-rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Allergies or dietary needs"
                  className="mt-2 w-full rounded-xl border border-[#B76E79]/50 bg-[#FFFDFB] px-4 py-3 br-font-editorial text-[1rem] text-[#5C323B] placeholder:text-[#5C323B]/40 focus:border-[#B76E79] focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label htmlFor="br-rsvp-message" className="br-font-display block text-[11px] tracking-[0.22em] text-[#5C323B] uppercase">
              A Note for the Couple <span className="normal-case tracking-normal text-[#5C323B]/60">(optional)</span>
            </label>
            <textarea
              id="br-rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes, song requests, or memories…"
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-[#B76E79]/50 bg-[#FFFDFB] px-4 py-3 br-font-editorial text-[1rem] text-[#5C323B] placeholder:text-[#5C323B]/40 focus:border-[#B76E79] focus:outline-none"
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded-xl border border-[#B76E79]/40 bg-[#B76E79]/10 px-4 py-3 text-sm text-[#B76E79]">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || loadingExisting}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#B76E79] px-6 py-4 br-font-display text-xs tracking-[0.28em] text-[#FFFDFB] uppercase shadow-[0_10px_22px_-8px_rgba(183,110,121,0.6)] transition-colors duration-300 hover:bg-[#9E5B66] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            <Heart className="h-4 w-4 fill-[#FFFDFB]/20" />
            {loading ? "Sending your RSVP…" : "Send RSVP"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
