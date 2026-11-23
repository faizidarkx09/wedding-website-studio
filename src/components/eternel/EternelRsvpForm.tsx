// ÉTERNEL RSVP form — posts to the EXISTING Neon-backed POST /api/rsvp
// (no new backend, no localStorage demo). Fields per the PRD: guest
// name, email (optional), attendance (Joyfully Accept / Regretfully
// Decline), guest count with the configured max, meal preference (stored
// in the RSVP answers map, so it shows in the admin list and CSV
// export), dietary requirements, message, plus the site's custom
// questions. Validation, loading and success states included; an update
// token (?token=) prefills and replaces the existing response.
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { ETERNEL, maxGuests } from "./tokens";

interface FormState {
  guestName: string;
  email: string;
  attending: boolean | null;
  guestCount: string;
  meal: string;
  dietary: string;
  message: string;
  answers: Record<string, string>;
}

interface Errors {
  guestName?: string;
  email?: string;
  attending?: string;
  guestCount?: string;
  meal?: string;
  dietary?: string;
  message?: string;
  form?: string;
  answers?: Record<string, string>;
}

const EMPTY: FormState = {
  guestName: "",
  email: "",
  attending: null,
  guestCount: "1",
  meal: "",
  dietary: "",
  message: "",
  answers: {},
};

const MEAL_OPTIONS = ["No preference", "Chicken", "Fish", "Vegetarian", "Vegan"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function EternelRsvpForm({ site, token }: { site: WeddingSite; token?: string }) {
  const max = maxGuests(site);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(token));
  const [updateToken, setUpdateToken] = useState<string | null>(token ?? null);
  const [done, setDone] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Prefill from an existing response when ?token= is present.
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
          setForm({
            guestName: r.guestName ?? "",
            email: r.email ?? "",
            attending: typeof r.attending === "boolean" ? r.attending : null,
            guestCount: String(r.guestCount ?? 1),
            meal: r.answers?.["meal-preference"] ?? "",
            dietary: r.dietary ?? "",
            message: r.message ?? "",
            answers: r.answers ?? {},
          });
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

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Errors = {};
    const answerErrors: Record<string, string> = {};
    if (!form.guestName.trim()) next.guestName = "Please enter your full name.";
    if (form.attending === null) next.attending = "Please say whether you are attending.";
    const count = form.attending === false ? 0 : Number(form.guestCount);
    if (form.attending === true && (!Number.isInteger(count) || count < 1 || count > max)) {
      next.guestCount = `Guest count must be between 1 and ${max}.`;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "That email address does not look right.";
    }
    for (const q of site.customQuestions) {
      if (q.required && !(form.answers[q.id] ?? "").trim()) {
        answerErrors[q.id] = "This question is required.";
      }
    }
    if (Object.keys(answerErrors).length > 0) next.answers = answerErrors;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      const answers: Record<string, string> = { ...form.answers };
      if (form.meal) answers["meal-preference"] = form.meal;
      const body: Record<string, unknown> = {
        siteId: site.id,
        guestName: form.guestName.trim(),
        email: form.email.trim(),
        phone: "",
        attending: form.attending,
        guestCount: form.attending === false ? 0 : Number(form.guestCount),
        dietary: form.dietary.trim(),
        allergies: "",
        message: form.message.trim(),
        answers,
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
        const message =
          isRecord(data) && typeof data.error === "string"
            ? data.error
            : "Something went wrong sending your RSVP. Please try again.";
        setErrors({ form: message });
      }
    } catch {
      setErrors({ form: "Something went wrong sending your RSVP. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "mt-1.5 w-full rounded-sm border bg-white px-4 py-3 text-[#302821] focus:outline-2 focus:outline-offset-1 disabled:opacity-60";
  const labelCls = "block text-sm font-semibold";
  const errCls = "mt-1.5 text-sm font-medium text-red-700";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done && savedToken ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="mx-auto w-full max-w-xl rounded-sm border bg-white p-8 text-center shadow-sm"
          style={{ borderColor: ETERNEL.champagne }}
        >
          <span
            aria-hidden="true"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: ETERNEL.sage }}
          >
            <Check className="h-7 w-7" />
          </span>
          <h2 className="font-eternel mt-4 text-3xl font-medium" style={{ color: ETERNEL.espresso }}>
            Thank you, {form.guestName.trim()}!
          </h2>
          <p className="mt-3 leading-relaxed" style={{ color: `${ETERNEL.espresso}CC` }}>
            {form.attending
              ? `Your RSVP is saved — party of ${Number(form.guestCount)}. We cannot wait to celebrate with you.`
              : "We are sorry you cannot make it — thank you for letting us know."}
          </p>
          <div className="mt-6 rounded-sm p-5 text-left" style={{ backgroundColor: ETERNEL.secondaryBg }}>
            <p className="text-sm font-semibold" style={{ color: ETERNEL.espresso }}>
              Save this link to update your RSVP later:
            </p>
            <a
              href={`/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`}
              className="mt-2 block break-all text-sm font-medium underline"
              style={{ color: ETERNEL.gold }}
            >
              {typeof window !== "undefined"
                ? `${window.location.origin}/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`
                : `/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`}
            </a>
            <p className="mt-2 text-xs leading-relaxed opacity-70">
              Anyone with this link can change your response, so keep it private.
            </p>
          </div>
          <a
            href={`/w/${site.slug}`}
            className="mt-6 inline-flex min-h-12 items-center rounded-full px-7 text-sm font-bold tracking-wide text-white uppercase transition hover:opacity-85"
            style={{ backgroundColor: ETERNEL.espresso }}
          >
            Back to the wedding website
          </a>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="mx-auto w-full max-w-xl rounded-sm border bg-white p-6 shadow-sm sm:p-8"
          style={{ borderColor: ETERNEL.champagne }}
        >
          {loadingExisting ? (
            <p className="mb-4 rounded-sm px-4 py-3 text-sm" style={{ backgroundColor: ETERNEL.secondaryBg }}>
              Loading your previous response…
            </p>
          ) : null}
          {errors.form ? (
            <p role="alert" className="mb-5 rounded-sm bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errors.form}
            </p>
          ) : null}

          <div>
            <label htmlFor="eternel-guestName" className={labelCls} style={{ color: ETERNEL.espresso }}>
              Full name <span aria-hidden="true" className="text-red-700">*</span>
            </label>
            <input
              id="eternel-guestName"
              name="guestName"
              type="text"
              autoComplete="name"
              required
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              aria-invalid={Boolean(errors.guestName)}
              className={inputCls}
              style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
            />
            {errors.guestName ? (
              <p role="alert" className={errCls}>{errors.guestName}</p>
            ) : null}
          </div>

          <fieldset className="mt-6">
            <legend className={labelCls} style={{ color: ETERNEL.espresso }}>
              Will you be attending? <span aria-hidden="true" className="text-red-700">*</span>
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Attending">
              {([
                { value: true, label: "Joyfully Accept" },
                { value: false, label: "Regretfully Decline" },
              ] as const).map((opt) => (
                <label
                  key={opt.label}
                  className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 py-3 text-center text-sm font-semibold transition"
                  style={
                    form.attending === opt.value
                      ? { borderColor: ETERNEL.espresso, backgroundColor: ETERNEL.espresso, color: "#FFFFFF" }
                      : { borderColor: ETERNEL.taupe, color: ETERNEL.espresso }
                  }
                >
                  <input
                    type="radio"
                    name="attending"
                    value={opt.value ? "yes" : "no"}
                    checked={form.attending === opt.value}
                    onChange={() => {
                      set("attending", opt.value);
                      if (opt.value === false) set("guestCount", "0");
                    }}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {errors.attending ? (
              <p role="alert" className={errCls}>{errors.attending}</p>
            ) : null}
          </fieldset>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="eternel-guestCount" className={labelCls} style={{ color: ETERNEL.espresso }}>
                Number of guests
              </label>
              <input
                id="eternel-guestCount"
                name="guestCount"
                type="number"
                min={form.attending === false ? 0 : 1}
                max={max}
                step={1}
                value={form.attending === false ? 0 : form.guestCount}
                disabled={form.attending === false}
                onChange={(e) => set("guestCount", e.target.value)}
                aria-invalid={Boolean(errors.guestCount)}
                className={inputCls}
                style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
              />
              <p className="mt-1.5 text-xs opacity-60">
                {form.attending === false
                  ? "Guest count is 0 because you are not attending."
                  : `Including you — between 1 and ${max} guests.`}
              </p>
              {errors.guestCount ? (
                <p role="alert" className={errCls}>{errors.guestCount}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="eternel-meal" className={labelCls} style={{ color: ETERNEL.espresso }}>
                Meal preference
              </label>
              <select
                id="eternel-meal"
                value={form.meal}
                onChange={(e) => set("meal", e.target.value)}
                className={inputCls}
                style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
              >
                <option value="">Choose a meal</option>
                {MEAL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="eternel-email" className={labelCls} style={{ color: ETERNEL.espresso }}>
              Email <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input
              id="eternel-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={inputCls}
              style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
            />
            {errors.email ? (
              <p role="alert" className={errCls}>{errors.email}</p>
            ) : null}
          </div>

          <div className="mt-6">
            <label htmlFor="eternel-dietary" className={labelCls} style={{ color: ETERNEL.espresso }}>
              Dietary requirements <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input
              id="eternel-dietary"
              name="dietary"
              type="text"
              placeholder="e.g. Vegetarian, gluten-free"
              value={form.dietary}
              onChange={(e) => set("dietary", e.target.value)}
              className={inputCls}
              style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
            />
          </div>

          {site.customQuestions.map((q) => (
            <div key={q.id} className="mt-6">
              <label htmlFor={`eternel-q-${q.id}`} className={labelCls} style={{ color: ETERNEL.espresso }}>
                {q.label}
                {q.required ? <span aria-hidden="true" className="text-red-700"> *</span> : null}
              </label>
              {q.type === "choice" && q.options && q.options.length > 0 ? (
                <select
                  id={`eternel-q-${q.id}`}
                  value={form.answers[q.id] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answers: { ...f.answers, [q.id]: e.target.value } }))
                  }
                  aria-invalid={Boolean(errors.answers?.[q.id])}
                  className={inputCls}
                  style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
                >
                  <option value="">Choose an option</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={`eternel-q-${q.id}`}
                  type="text"
                  value={form.answers[q.id] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, answers: { ...f.answers, [q.id]: e.target.value } }))
                  }
                  aria-invalid={Boolean(errors.answers?.[q.id])}
                  className={inputCls}
                  style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
                />
              )}
              {errors.answers?.[q.id] ? (
                <p role="alert" className={errCls}>{errors.answers[q.id]}</p>
              ) : null}
            </div>
          ))}

          <div className="mt-6">
            <label htmlFor="eternel-message" className={labelCls} style={{ color: ETERNEL.espresso }}>
              Message for the couple <span className="font-normal opacity-60">(optional)</span>
            </label>
            <textarea
              id="eternel-message"
              name="message"
              rows={4}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={inputCls}
              style={{ borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 min-h-12 w-full cursor-pointer rounded-full px-6 text-sm font-bold tracking-wide text-white uppercase transition hover:opacity-85 disabled:opacity-60"
            style={{ backgroundColor: ETERNEL.espresso }}
          >
            {loading ? "Sending…" : updateToken ? "Update my RSVP" : "Send RSVP"}
          </button>
          <p className="mt-3 text-center text-xs opacity-60">
            {updateToken
              ? "You are updating your existing response — this replaces it, it does not create a second one."
              : "You will get a link after sending, so you can update this response later."}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
