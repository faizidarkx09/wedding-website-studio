// Dolce Vita RSVP — a 1:1 port of the standalone's RSVP modal
// (index.html §10 + styles.css "RSVP modal" + script.js §7): the
// header photo, "Confirm Your Attendance!", the deadline line, the
// three fields (name / Will you come? single-choice / food
// intolerances) and the sky-blue Submit button with its shine sweep.
//
// ONE functional change (required by the Studio): submissions POST
// to the EXISTING Neon-backed POST /api/rsvp instead of the
// standalone's demo-only localStorage. The Studio API has no
// "maybe" state, so "I'll tell you a bit later" is recorded as a
// non-attending response with the note in the message + answers
// (the couple can see it, and the guest gets an update link to
// change it later). Validation, loading and success states
// included; an update token (?token=) prefills and replaces the
// existing response.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { RsvpResponse, WeddingSite } from "@/lib/types";
import { DOLCE, RSVP_HEADER_IMAGE_URL, rsvpDeadlineLabel } from "./tokens";

type Attend = "yes" | "no" | "later";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export default function DolceVitaRsvpForm({
  site,
  token,
  onClose,
}: {
  site: WeddingSite;
  token?: string;
  /** In the modal, closes it. On the standalone /rsvp page this is
   * absent and the success state links back to the site instead. */
  onClose?: () => void;
}) {
  const [guestName, setGuestName] = useState("");
  const [attend, setAttend] = useState<Attend | null>(null);
  const [food, setFood] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(token));
  const [updateToken, setUpdateToken] = useState<string | null>(token ?? null);
  const [done, setDone] = useState(false);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [successBody, setSuccessBody] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const deadlineLabel = rsvpDeadlineLabel(site);

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
          setGuestName(r.guestName ?? "");
          setFood(r.dietary ?? "");
          if (typeof r.attending === "boolean") {
            if (r.attending) setAttend("yes");
            else if (r.answers?.["attendance-note"]) setAttend("later");
            else setAttend("no");
          }
        } else {
          setError("We could not find a response for that update link. You can still send a new RSVP below.");
        }
      } catch {
        if (!cancelled) {
          setError("We could not load your previous response. You can still send a new RSVP below.");
        }
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = guestName.trim();
    if (!name) {
      setError("Please enter your name.");
      nameRef.current?.focus();
      return;
    }
    if (!attend) {
      setError("Please tell us whether you will come.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const answers: Record<string, string> = {};
      if (attend === "later") answers["attendance-note"] = "I'll tell you a bit later";
      const body: Record<string, unknown> = {
        siteId: site.id,
        guestName: name,
        email: "",
        phone: "",
        attending: attend === "yes",
        guestCount: attend === "yes" ? 1 : 0,
        dietary: food.trim(),
        allergies: "",
        message: attend === "later" ? "I'll tell you a bit later" : "",
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
        setSuccessBody(
          attend === "yes"
            ? `Thank you, ${name}! Your RSVP has been saved. We can’t wait to celebrate with you!`
            : attend === "no"
              ? `Thank you, ${name}! Your RSVP has been saved. We’ll miss you — thank you for letting us know.`
              : `Thank you, ${name}! Your RSVP has been saved. No rush at all — we hope to hear from you soon.`,
        );
        setDone(true);
      } else {
        const message =
          isRecord(data) && typeof data.error === "string"
            ? data.error
            : "Something went wrong sending your RSVP. Please try again.";
        setError(message);
      }
    } catch {
      setError("Something went wrong sending your RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // The header photo + body shell are the standalone's modal card
  // content: the photo stays visible on the success state too.
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="dolce-modal-header-img" src={RSVP_HEADER_IMAGE_URL} alt="Couple walking on a beach at sunset" />
      <div className="dolce-modal-body">
        {done && savedToken ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="dolce-rsvp-success"
          >
            <p className="dolce-success-script">Thank you!</p>
            <p className="dolce-success-body">{successBody}</p>
            <div className="dolce-update-box">
              <p className="dolce-update-title">Save this link to update your RSVP later:</p>
              <a
                href={`/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`}
                className="dolce-update-link"
                style={{ color: DOLCE.blueDeep }}
              >
                {typeof window !== "undefined"
                  ? `${window.location.origin}/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`
                  : `/w/${site.slug}/rsvp?token=${encodeURIComponent(savedToken)}`}
              </a>
              <p className="dolce-update-note">
                Anyone with this link can change your response, so keep it private.
              </p>
            </div>
            {onClose ? (
              <button type="button" onClick={onClose} className="dolce-btn-submit">
                <span>Close</span>
              </button>
            ) : (
              <a href={`/w/${site.slug}`} className="dolce-btn-submit dolce-btn-link">
                <span>Back to the wedding website</span>
              </a>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <h3 id="dolce-rsvp-title">Confirm Your Attendance!</h3>
            <p className="dolce-modal-desc">
              Please RSVP before {deadlineLabel || "the deadline"}
            </p>
            <form onSubmit={onSubmit} noValidate>
              {loadingExisting ? (
                <p className="dolce-loading-note">Loading your previous response…</p>
              ) : null}
              {error ? (
                <p role="alert" className="dolce-form-error">
                  {error}
                </p>
              ) : null}

              <label className="dolce-field-label" htmlFor="dolce-guestName">
                Your name
              </label>
              <input
                ref={nameRef}
                className="dolce-field-input"
                type="text"
                id="dolce-guestName"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />

              <fieldset className="dolce-field-group">
                <legend className="dolce-field-label">Will you come?</legend>
                {(
                  [
                    { value: "yes", label: "Yes, I will" },
                    { value: "no", label: "Unfortunately, I can’t :(" },
                    { value: "later", label: "I’ll tell you a bit later" },
                  ] as const
                ).map((opt) => (
                  <label key={opt.value} className="dolce-check">
                    <input
                      type="checkbox"
                      name="attend"
                      value={opt.value}
                      checked={attend === opt.value}
                      onChange={() => setAttend(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </fieldset>

              <label className="dolce-field-label" htmlFor="dolce-foodNotes">
                Do you have any food intolerances?
              </label>
              <input
                className="dolce-field-input"
                type="text"
                id="dolce-foodNotes"
                name="food"
                placeholder="Optional"
                value={food}
                onChange={(e) => setFood(e.target.value)}
              />

              <button type="submit" disabled={loading} className="dolce-btn-submit">
                <span>{loading ? "Sending…" : updateToken ? "Update my RSVP" : "Submit"}</span>
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
}

/** The standalone's modal shell (backdrop + card + close button),
 * used by the renderer RSVP section. The /w/[slug]/rsvp page
 * renders DolceVitaRsvpForm directly, without the modal. */
export function DolceVitaRsvpModal({
  site,
  token,
  onClose,
}: {
  site: WeddingSite;
  token?: string;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab") return;
    const card = cardRef.current;
    if (!card) return;
    const focusable = Array.from(
      card.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="dolce-modal" role="dialog" aria-modal="true" aria-labelledby="dolce-rsvp-title">
      <div className="dolce-modal-backdrop" onClick={onClose} />
      <motion.div
        ref={cardRef}
        onKeyDown={trapTab}
        className="dolce-modal-card"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: "ease" }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="dolce-modal-close">
          &times;
        </button>
        <DolceVitaRsvpForm site={site} token={token} onClose={onClose} />
      </motion.div>
    </div>
  );
}
