"use client";

import { useEffect, useState } from "react";
import type { RsvpResponse, WeddingSite } from "@/lib/types";

interface RsvpFormProps {
  site: WeddingSite;
  /** Update token from ?token= — prefill + replace instead of duplicate. */
  token?: string;
}

interface FormState {
  guestName: string;
  email: string;
  phone: string;
  attending: boolean | null;
  guestCount: string;
  dietary: string;
  allergies: string;
  message: string;
  answers: Record<string, string>;
}

interface Errors {
  guestName?: string;
  email?: string;
  phone?: string;
  attending?: string;
  guestCount?: string;
  dietary?: string;
  allergies?: string;
  message?: string;
  form?: string;
  answers?: Record<string, string>;
}

const EMPTY: FormState = {
  guestName: "",
  email: "",
  phone: "",
  attending: null,
  guestCount: "1",
  dietary: "",
  allergies: "",
  message: "",
  answers: {},
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function RsvpForm({ site, token }: RsvpFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(token));
  const [updateToken, setUpdateToken] = useState<string | null>(token ?? null);
  const [done, setDone] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);

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
            phone: r.phone ?? "",
            attending: typeof r.attending === "boolean" ? r.attending : null,
            guestCount: String(r.guestCount ?? 1),
            dietary: r.dietary ?? "",
            allergies: r.allergies ?? "",
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

  // Returns the errors object when validation fails (null when it
  // passes) so the submit handler can move focus to the first problem
  // field instead of leaving the guest staring at an unchanged form.
  function validate(): Errors | null {
    const next: Errors = {};
    const answerErrors: Record<string, string> = {};
    if (!form.guestName.trim()) next.guestName = "Please enter your full name.";
    if (form.attending === null) next.attending = "Please say whether you are attending.";
    const count = form.attending === false ? 0 : Number(form.guestCount);
    if (form.attending === true && (!Number.isInteger(count) || count < 1 || count > 10)) {
      next.guestCount = "Guest count must be between 1 and 10.";
    }
    // Email is required: the couple needs it to confirm the RSVP, and
    // every template form already requires it — the standalone page
    // must not silently accept a response the templates would reject.
    if (!form.email.trim()) next.email = "Please share your email so we can confirm your RSVP.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "That email address does not look right.";
    }
    for (const q of site.customQuestions) {
      if (q.required && !(form.answers[q.id] ?? "").trim()) {
        answerErrors[q.id] = "This question is required.";
      }
    }
    if (Object.keys(answerErrors).length > 0) next.answers = answerErrors;
    setErrors(next);
    return Object.keys(next).length === 0 ? null : next;
  }

  /** Move keyboard focus to the first field that failed validation, in
   * the form's visual order, so a failed submit is never silent. */
  function focusFirstError(errs: Errors) {
    if (errs.guestName) {
      document.getElementById("guestName")?.focus();
      return;
    }
    if (errs.attending) {
      document.querySelector<HTMLInputElement>('input[name="attending"]')?.focus();
      return;
    }
    if (errs.guestCount) {
      document.getElementById("guestCount")?.focus();
      return;
    }
    if (errs.email) {
      document.getElementById("email")?.focus();
      return;
    }
    if (errs.answers) {
      const firstId = Object.keys(errs.answers)[0];
      if (firstId) document.getElementById(`q-${firstId}`)?.focus();
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (errs) {
      focusFirstError(errs);
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        siteId: site.id,
        guestName: form.guestName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        attending: form.attending,
        guestCount: form.attending === false ? 0 : Number(form.guestCount),
        dietary: form.dietary.trim(),
        allergies: form.allergies.trim(),
        message: form.message.trim(),
        answers: form.answers,
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

  if (done && savedToken) {
    const updateUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`
        : `/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`;
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p aria-hidden="true" className="text-4xl">✓</p>
        <h2 className="mt-3 text-2xl font-bold text-stone-900">Thank you, {form.guestName.trim()}!</h2>
        <p className="mt-3 leading-relaxed text-stone-600">
          {form.attending
            ? `Your RSVP is saved — party of ${Number(form.guestCount)}. We cannot wait to celebrate with you.`
            : "We are sorry you cannot make it — thank you for letting us know."}
        </p>
        <div className="mt-6 rounded-xl bg-stone-50 p-5 text-left">
          <p className="text-sm font-semibold text-stone-900">Save this link to update your RSVP later:</p>
          <a href={updateUrl} className="mt-2 block break-all text-sm font-medium text-amber-800 underline">
            {updateUrl}
          </a>
          <p className="mt-2 text-xs leading-relaxed text-stone-500">
            Anyone with this link can change your response, so keep it private. Your update token is{" "}
            <code className="rounded bg-stone-200 px-1.5 py-0.5 text-xs">{savedToken}</code>.
          </p>
        </div>
        <a
          href={`/w/${site.slug}`}
          className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Back to the wedding website
        </a>
      </div>
    );
  }

  const inputCls =
    "mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-stone-900 focus:outline-none disabled:opacity-60";
  const labelCls = "block text-sm font-semibold text-stone-800";
  const errCls = "mt-1.5 text-sm font-medium text-red-700";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {loadingExisting ? (
        <p className="mb-4 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Loading your previous response…
        </p>
      ) : null}
      {errors.form ? (
        <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="guestName" className={labelCls}>
          Full name <span aria-hidden="true" className="text-red-700">*</span>
        </label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          autoComplete="name"
          required
          value={form.guestName}
          onChange={(e) => set("guestName", e.target.value)}
          aria-invalid={Boolean(errors.guestName)}
          aria-describedby={errors.guestName ? "guestName-error" : undefined}
          className={inputCls}
        />
        {errors.guestName ? (
          <p id="guestName-error" role="alert" className={errCls}>{errors.guestName}</p>
        ) : null}
      </div>

      <fieldset className="mt-6">
        <legend className={labelCls}>
          Will you be attending? <span aria-hidden="true" className="text-red-700">*</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-3" role="radiogroup" aria-label="Attending">
          {([
            { value: true, label: "Yes, I will be there" },
            { value: false, label: "No, I cannot make it" },
          ] as const).map((opt) => (
            <label
              key={opt.label}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium ${
                form.attending === opt.value
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 text-stone-800"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value={opt.value ? "yes" : "no"}
                checked={form.attending === opt.value}
                onChange={() => {
                  set("attending", opt.value);
                  // Keep state truthful: a decline means 0 guests, matching
                  // the disabled count input (which shows 0) and onSubmit.
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

      <div className="mt-6">
        <label htmlFor="guestCount" className={labelCls}>
          Number of guests (including you)
        </label>
        <input
          id="guestCount"
          name="guestCount"
          type="number"
          min={form.attending === false ? 0 : 1}
          max={10}
          step={1}
          value={form.attending === false ? 0 : form.guestCount}
          disabled={form.attending === false}
          onChange={(e) => set("guestCount", e.target.value)}
          aria-invalid={Boolean(errors.guestCount)}
          aria-describedby={errors.guestCount ? "guestCount-error" : "guestCount-hint"}
          className={inputCls}
        />
        <p id="guestCount-hint" className="mt-1.5 text-xs text-stone-500">
          {form.attending === false
            ? "Guest count is 0 because you are not attending."
            : "Between 1 and 10 guests."}
        </p>
        {errors.guestCount ? (
          <p id="guestCount-error" role="alert" className={errCls}>{errors.guestCount}</p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>
            Email <span aria-hidden="true" className="text-red-700">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCls}
          />
          {errors.email ? (
            <p id="email-error" role="alert" className={errCls}>{errors.email}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dietary" className={labelCls}>Dietary requirements</label>
          <input
            id="dietary"
            name="dietary"
            type="text"
            placeholder="e.g. Vegetarian"
            value={form.dietary}
            onChange={(e) => set("dietary", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="allergies" className={labelCls}>Allergies</label>
          <input
            id="allergies"
            name="allergies"
            type="text"
            placeholder="e.g. Peanuts"
            value={form.allergies}
            onChange={(e) => set("allergies", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {site.customQuestions.map((q) => (
        <div key={q.id} className="mt-6">
          <label htmlFor={`q-${q.id}`} className={labelCls}>
            {q.label}
            {q.required ? <span aria-hidden="true" className="text-red-700"> *</span> : null}
          </label>
          {q.type === "choice" && q.options && q.options.length > 0 ? (
            <select
              id={`q-${q.id}`}
              value={form.answers[q.id] ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, answers: { ...f.answers, [q.id]: e.target.value } }))
              }
              aria-invalid={Boolean(errors.answers?.[q.id])}
              className={inputCls}
            >
              <option value="">Choose an option</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={`q-${q.id}`}
              type="text"
              value={form.answers[q.id] ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, answers: { ...f.answers, [q.id]: e.target.value } }))
              }
              aria-invalid={Boolean(errors.answers?.[q.id])}
              className={inputCls}
            />
          )}
          {errors.answers?.[q.id] ? (
            <p role="alert" className={errCls}>{errors.answers[q.id]}</p>
          ) : null}
        </div>
      ))}

      <div className="mt-6">
        <label htmlFor="message" className={labelCls}>Message for the couple</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {loading ? "Sending…" : updateToken ? "Update my RSVP" : "Send RSVP"}
      </button>
      <p className="mt-3 text-center text-xs text-stone-500">
        {updateToken
          ? "You are updating your existing response — this replaces it, it does not create a second one."
          : "You will get a link after sending, so you can update this response later."}
      </p>
    </form>
  );
}
