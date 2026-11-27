// Autumn Harvest RSVP form — same contract as Emerald Royale's form,
// wired to the Studio's POST /api/rsvp (the same contract the
// shared RsvpForm uses: siteId, guestName, email, phone, attending,
// guestCount, dietary, allergies, message, answers, updateToken).
// Fields: name → guestName, email → email, attending → attending,
// guests 1–6 → guestCount (stepper; the source caps at 6), the 5
// meal options → answers["meal"], dietary → dietary, message →
// message. No email collection beyond the RSVP itself; the reply-by
// line is the site's editable deadline (60 days before the wedding
// by default).
//
// The form is a kraft-paper TAG: warm kraft background, a punched
// hole + twine loop at the top, a dashed stitch border, and all
// text / inputs on a solid cream paper panel inside the tag — so
// every label, input and the button sit entirely ON the paper at
// every width (320/390/430/768/1280/1440). Container queries only
// for the tag's responsive padding (no viewport `sm:`) so the
// editor's Mobile (390px) preview gets mobile geometry.
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Leaf, Minus, Plus } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { maxGuests, mealOptions, rsvpReplyBy } from "./tokens";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function AutumnHarvestRsvpForm({
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
        className="@container relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#D9B98A] px-5 pt-10 pb-12 text-center text-[#5C3A21] shadow-[0_18px_36px_-14px_rgba(58,36,18,0.45)] @min-[40rem]:px-8 @min-[40rem]:pt-12"
      >
        {/* Punched hole + twine loop */}
        <span aria-hidden="true" className="absolute top-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#9C3D12]/60 bg-[#FFF7E8] shadow-[inset_0_1px_3px_rgba(58,36,18,0.4)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 border-2 border-dashed border-[#5C3A21]/35" />
        <div className="relative z-10 rounded-[4px] bg-[#FFFDF6] px-5 py-10 shadow-[0_8px_20px_-8px_rgba(58,36,18,0.35)] @min-[40rem]:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C05621]/60 bg-[#FFF7E8] text-[#C05621]">
            <Heart className="h-6 w-6 fill-[#C05621]/25" />
          </span>
          <h3 className="ah-font-display mt-5 text-[1.7rem] leading-[1.15] font-semibold text-[#5C3A21]">
            Thank you, {name.trim()}!
          </h3>
          <p className="ah-font-editorial mx-auto mt-3 max-w-[440px] text-[1rem] leading-[1.75] text-[#5C3A21]/85 italic">
            {attending === "yes"
              ? `Your RSVP is saved — party of ${guests}. We cannot wait to celebrate with you.`
              : "Thank you for letting us know. You will be dearly missed."}
          </p>
          {updateUrl && (
            <p className="ah-font-editorial mt-5 text-sm text-[#5C3A21]/70 italic">
              Need to change your reply?{" "}
              <a href={updateUrl} className="text-[#9C3D12] underline underline-offset-2">
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
      className="@container relative mx-auto w-full max-w-[560px] overflow-hidden bg-[#D9B98A] px-5 pt-10 pb-12 text-[#5C3A21] shadow-[0_18px_36px_-14px_rgba(58,36,18,0.45)] @min-[40rem]:px-8 @min-[40rem]:pt-12"
    >
      {/* Punched hole + twine loop */}
      <span aria-hidden="true" className="absolute top-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#9C3D12]/60 bg-[#FFF7E8] shadow-[inset_0_1px_3px_rgba(58,36,18,0.4)]" />
      {/* Dashed stitch border */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 border-2 border-dashed border-[#5C3A21]/35" />

      {/* Solid cream paper panel — every label, input and the button
          sits ON this panel, never on the kraft edge. */}
      <div className="relative z-10 rounded-[4px] bg-[#FFFDF6] px-5 py-9 shadow-[0_8px_20px_-8px_rgba(58,36,18,0.35)] @min-[40rem]:px-8 @min-[40rem]:py-11">
        <p className="ah-font-display text-center text-[10px] font-semibold tracking-[0.34em] text-[#9C3D12] uppercase @min-[40rem]:text-xs">
          RSVP
        </p>
        <h3 className="ah-font-display mt-3 text-center text-[1.7rem] leading-[1.12] font-semibold text-[#5C3A21] @min-[40rem]:text-[1.9rem]">
          Kindly Respond
        </h3>
        <span aria-hidden="true" className="mx-auto mt-3 flex items-center justify-center gap-2 text-[#C05621]">
          <Leaf className="h-4 w-4" />
          <span className="h-px w-16 bg-[#C05621]/50" />
          <Leaf className="h-4 w-4 -scale-x-100" />
        </span>
        {replyBy && (
          <p className="ah-font-display mt-3 text-center text-[11px] font-medium tracking-[0.22em] text-[#9C3D12] uppercase">
            {replyBy}
          </p>
        )}
        {loadingExisting && (
          <p className="ah-font-editorial mt-5 rounded border border-[#C05621]/50 bg-[#FFF7E8] px-4 py-3 text-center text-sm text-[#5C3A21]/80 italic">
            Loading your previous response…
          </p>
        )}

        <div className="mt-7 space-y-5 text-left">
          {/* Name */}
          <div>
            <label htmlFor="ah-rsvp-name" className="ah-font-display block text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
              Full Name
            </label>
            <input
              id="ah-rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="ah-font-editorial mt-2 w-full border border-[#C05621]/50 bg-[#FFFDF6] px-4 py-3 text-[1rem] text-[#5C3A21] placeholder:text-[#5C3A21]/40 focus:border-[#5C3A21] focus:outline-none"
            />
            {errors.name && <p role="alert" className="mt-1.5 text-sm text-[#9C3D12]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="ah-rsvp-email" className="ah-font-display block text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
              Email Address <span aria-hidden="true" className="text-red-700">*</span>
            </label>
            <input
              id="ah-rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="ah-font-editorial mt-2 w-full border border-[#C05621]/50 bg-[#FFFDF6] px-4 py-3 text-[1rem] text-[#5C3A21] placeholder:text-[#5C3A21]/40 focus:border-[#5C3A21] focus:outline-none"
            />
            {errors.email && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.email}</p>}
          </div>

          {/* Attending */}
          <fieldset>
            <legend className="ah-font-display text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
              Will you be attending?
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                aria-pressed={attending === "yes"}
                className={`flex items-center justify-center gap-2 border px-4 py-3 ah-font-display text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                  attending === "yes"
                    ? "border-[#5C3A21] bg-[#5C3A21] text-[#FFF7E8]"
                    : "border-[#C05621]/50 bg-[#FFFDF6] text-[#5C3A21] hover:border-[#5C3A21]"
                }`}
              >
                {attending === "yes" && <Check className="h-4 w-4" />}
                Joyfully Accept
              </button>
              <button
                type="button"
                onClick={() => setAttending("no")}
                aria-pressed={attending === "no"}
                className={`flex items-center justify-center gap-2 border px-4 py-3 ah-font-display text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                  attending === "no"
                    ? "border-[#5C3A21] bg-[#5C3A21] text-[#FFF7E8]"
                    : "border-[#C05621]/50 bg-[#FFFDF6] text-[#5C3A21] hover:border-[#5C3A21]"
                }`}
              >
                {attending === "no" && <Check className="h-4 w-4" />}
                Regretfully Decline
              </button>
            </div>
            {errors.attending && <p role="alert" className="mt-1.5 text-sm text-[#9C3D12]">{errors.attending}</p>}
          </fieldset>

          {attending === "yes" && (
            <>
              {/* Guests stepper */}
              <div>
                <span className="ah-font-display block text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
                  Number of Guests
                </span>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#C05621]/50 bg-[#FFFDF6] text-[#5C3A21] transition-colors hover:border-[#5C3A21] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="ah-font-display min-w-8 text-center text-xl text-[#5C3A21] tabular-nums" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(guestCap, g + 1))}
                    disabled={guests >= guestCap}
                    aria-label="One more guest"
                    className="flex h-11 w-11 items-center justify-center border border-[#C05621]/50 bg-[#FFFDF6] text-[#5C3A21] transition-colors hover:border-[#5C3A21] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="ah-font-editorial text-sm text-[#5C3A21]/70 italic">
                    {guestCap === 1 ? "1 guest maximum" : `up to ${guestCap} guests`}
                  </span>
                </div>
              </div>

              {/* Meal selection */}
              <fieldset>
                <legend className="ah-font-display text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
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
                            ? "border-[#5C3A21] bg-[#5C3A21]/5"
                            : "border-[#C05621]/50 bg-[#FFFDF6] hover:border-[#5C3A21]"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected ? "border-[#5C3A21] bg-[#5C3A21] text-[#FFF7E8]" : "border-[#C05621] text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="ah-font-editorial text-[0.95rem] text-[#5C3A21]">{option}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.meal && <p role="alert" className="mt-1.5 text-sm text-[#9C3D12]">{errors.meal}</p>}
              </fieldset>

              {/* Dietary */}
              <div>
                <label htmlFor="ah-rsvp-dietary" className="ah-font-display block text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
                  Dietary Restrictions <span className="normal-case tracking-normal text-[#5C3A21]/60">(optional)</span>
                </label>
                <input
                  id="ah-rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Allergies or dietary needs"
                  className="ah-font-editorial mt-2 w-full border border-[#C05621]/50 bg-[#FFFDF6] px-4 py-3 text-[1rem] text-[#5C3A21] placeholder:text-[#5C3A21]/40 focus:border-[#5C3A21] focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Message */}
          <div>
            <label htmlFor="ah-rsvp-message" className="ah-font-display block text-[11px] font-semibold tracking-[0.22em] text-[#5C3A21] uppercase">
              A Note for the Couple <span className="normal-case tracking-normal text-[#5C3A21]/60">(optional)</span>
            </label>
            <textarea
              id="ah-rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your wishes, song requests, or memories…"
              rows={4}
              className="ah-font-editorial mt-2 w-full resize-y border border-[#C05621]/50 bg-[#FFFDF6] px-4 py-3 text-[1rem] text-[#5C3A21] placeholder:text-[#5C3A21]/40 focus:border-[#5C3A21] focus:outline-none"
            />
          </div>

          {errors.form && (
            <p role="alert" className="rounded border border-[#9C3D12]/40 bg-[#9C3D12]/10 px-4 py-3 text-sm text-[#9C3D12]">
              {errors.form}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || loadingExisting}
            className="group flex w-full items-center justify-center gap-2 bg-[#5C3A21] px-6 py-4 ah-font-display text-xs font-semibold tracking-[0.28em] text-[#FFF7E8] uppercase shadow-[0_10px_22px_-8px_rgba(58,36,18,0.6)] transition-colors duration-300 hover:bg-[#7A5230] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C3A21]"
          >
            <Heart className="h-4 w-4 fill-[#FFF7E8]/20" />
            {loading ? "Sending your RSVP…" : "Send RSVP"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
