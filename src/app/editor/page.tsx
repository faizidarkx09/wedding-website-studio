"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteRenderer from "@/components/SiteRenderer";
import type { DetailBlock, DetailKind, FaqItem, GalleryImage, RsvpQuestion, SiteEvent, WeddingSite } from "@/lib/types";

type Tab = "details" | "events" | "gallery" | "invitation" | "details-blocks" | "faq" | "design" | "settings";
type PreviewWidth = "desktop" | "tablet" | "mobile";
type SaveStatus = "idle" | "saving" | "saved" | "failed";

const TABS: { id: Tab; label: string }[] = [
  { id: "details", label: "Couple" },
  { id: "events", label: "Events" },
  { id: "gallery", label: "Gallery" },
  { id: "invitation", label: "Invitation" },
  { id: "details-blocks", label: "Details" },
  { id: "faq", label: "FAQ" },
  { id: "design", label: "Design" },
  { id: "settings", label: "Settings" },
];

const DETAIL_KINDS: { id: DetailKind; label: string }[] = [
  { id: "venue", label: "Venue" },
  { id: "travel", label: "Travel" },
  { id: "accommodation", label: "Accommodation" },
  { id: "dress", label: "Dress code" },
  { id: "parking", label: "Parking" },
  { id: "accessibility", label: "Accessibility" },
  { id: "registry", label: "Gift registry" },
  { id: "notes", label: "Guest notes" },
];

const HEADING_FONTS = [
  "Georgia, serif",
  "Palatino Linotype, Palatino, Georgia, serif",
  "Times New Roman, Times, Georgia, serif",
  "Helvetica Neue, Arial, sans-serif",
  "Trebuchet MS, Segoe UI, sans-serif",
];

const BODY_FONTS = [
  "system-ui, sans-serif",
  "Georgia, serif",
  "Helvetica Neue, Arial, sans-serif",
  "Trebuchet MS, Segoe UI, sans-serif",
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Australia/Sydney",
];

function uid(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** ISO datetime → value for <input type="datetime-local">. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** ISO datetime → YYYY-MM-DD calendar date in the given IANA timezone
 * (not UTC — `slice(0, 10)` on an ISO string gives the UTC date, which
 * can be a day off for the couple). */
function dateInTimezone(iso: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

/** True when the value is a real IANA timezone name. */
function isKnownTimezone(value: string): boolean {
  if (!value) return false;
  try {
    return Intl.supportedValuesOf("timeZone").includes(value);
  } catch {
    return false;
  }
}

/** Gallery / hero image URL check: http(s) only — javascript: and data:
 * URLs are rejected (a data: URL in an <img src> can run scripts in some
 * contexts, and javascript: is never a photo). */
function isSafeImageUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-stone-900 focus:outline-none";
const labelCls = "block text-sm font-medium";

export default function EditorPage() {
  const router = useRouter();
  const [site, setSite] = useState<WeddingSite | null>(null); // last saved version
  const [draft, setDraft] = useState<WeddingSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("details");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("desktop");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<string>("");
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");

  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [newQuestionLabel, setNewQuestionLabel] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<"text" | "choice">("text");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");
  const [newDetailKind, setNewDetailKind] = useState<DetailKind>("venue");
  const [newDetailTitle, setNewDetailTitle] = useState("");
  const [newDetailBody, setNewDetailBody] = useState("");
  const [newDetailLinkLabel, setNewDetailLinkLabel] = useState("");
  const [newDetailLinkUrl, setNewDetailLinkUrl] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);
  const [tzError, setTzError] = useState("");
  const [galleryUrlError, setGalleryUrlError] = useState("");
  const [heroUploadBusy, setHeroUploadBusy] = useState(false);

  const loadedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef<WeddingSite | null>(null);
  draftRef.current = draft;

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/sites/save");
      if (res.status === 401) {
        router.replace("/activate");
        return;
      }
      const data = (await res.json()) as { ok: boolean; site?: WeddingSite; error?: string };
      if (!res.ok || !data.site) {
        setError(data.error || "Could not load your website.");
        setLoading(false);
        return;
      }
      setSite(data.site);
      setDraft(data.site);
      loadedRef.current = true;
      setLoading(false);
    } catch {
      setError("Could not load your website — check your connection and try again.");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Save the current draft. Returns true on success, false on failure. */
  const saveNow = useCallback(async (): Promise<boolean> => {
    const current = draftRef.current;
    if (!current) return false;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    setSaveError("");
    try {
      const res = await fetch("/api/sites/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: current }),
      });
      const data = (await res.json()) as { ok: boolean; updatedAt?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      setSite(current);
      setSaveStatus("saved");
      setSavedAt(new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      return true;
    } catch (e) {
      setSaveStatus("failed");
      setSaveError(e instanceof Error ? e.message : "Save failed");
      return false;
    }
  }, []);

  // Auto-save: debounce 800ms after any draft change (not on initial load).
  useEffect(() => {
    if (!loadedRef.current || !draft) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(() => {
      void saveNow();
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [draft, saveNow]);

  function updateDraft(mutator: (d: WeddingSite) => WeddingSite) {
    setDraft((prev) => (prev ? mutator(structuredClone(prev)) : prev));
  }

  async function togglePublish() {
    if (!draft) return;
    // A suspended/archived site can only be restored by an admin.
    if (draft.status === "suspended" || draft.status === "archived") {
      setNotice("This website was suspended or archived. Only an admin can restore it.");
      return;
    }
    // Publish/unpublish always uses the last saved version — and never
    // proceeds when the pre-publish save fails.
    if (saveStatus === "saving" || saveStatus === "idle" || saveStatus === "failed") {
      const saved = await saveNow();
      if (!saved) {
        setNotice("Could not save your changes — publishing cancelled. Please fix the save error and try again.");
        return;
      }
    }
    setPublishBusy(true);
    setNotice("");
    const next = draft.status === "published" ? "unpublished" : "published";
    try {
      const res = await fetch("/api/sites/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: draft.id, status: next }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not change publishing status");
      updateDraft((d) => ({ ...d, status: next }));
      setSite((s) => (s ? { ...s, status: next } : s));
      setNotice(next === "published" ? "Your website is now published." : "Your website is now unpublished.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not change publishing status");
    } finally {
      setPublishBusy(false);
    }
  }

  async function uploadFile(file: File) {
    if (!draft) return;
    setUploadBusy(true);
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("siteId", draft.id);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || "Upload failed");
      // Captions default to empty — the file name is not a caption.
      const image: GalleryImage = { id: uid("g"), url: data.url, caption: "" };
      updateDraft((d) => ({ ...d, gallery: [...d.gallery, image] }));
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadBusy(false);
    }
  }

  /** Upload a file as the site's hero image (same /api/upload endpoint). */
  async function uploadHeroImage(file: File) {
    if (!draft) return;
    setHeroUploadBusy(true);
    setNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("siteId", draft.id);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || "Upload failed");
      updateDraft((d) => ({ ...d, content: { ...d.content, heroImage: data.url as string } }));
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setHeroUploadBusy(false);
    }
  }

  async function saveGuestPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setPwBusy(true);
    setPwMessage("");
    try {
      const res = await fetch("/api/sites/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: draft.id, password: guestPassword }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not set the password");
      updateDraft((d) => ({ ...d, settings: { ...d.settings, passwordEnabled: true } }));
      setGuestPassword("");
      setPwMessage("Guest password saved. Your site is now password-protected.");
    } catch (err) {
      setPwMessage(err instanceof Error ? err.message : "Could not set the password");
    } finally {
      setPwBusy(false);
    }
  }

  async function disableGuestPassword() {
    if (!draft) return;
    setPwBusy(true);
    setPwMessage("");
    try {
      const res = await fetch("/api/sites/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: draft.id, disable: true }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not remove the password");
      updateDraft((d) => ({ ...d, settings: { ...d.settings, passwordEnabled: false, passwordHash: null } }));
      setPwMessage("Guest password removed.");
    } catch (err) {
      setPwMessage(err instanceof Error ? err.message : "Could not remove the password");
    } finally {
      setPwBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12">
        <p className="text-stone-600">Loading your editor…</p>
      </main>
    );
  }

  if (error || !draft || !site) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12">
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error || "Could not load your website."}
        </p>
        <Link href="/activate" className="mt-4 inline-block font-medium underline">
          Go to activation
        </Link>
      </main>
    );
  }

  const previewStyle: React.CSSProperties =
    previewWidth === "desktop"
      ? { width: "100%" }
      : { width: previewWidth === "tablet" ? 768 : 390, maxWidth: "100%" };

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? `✓ Saved ${savedAt}`
        : saveStatus === "failed"
          ? "Save failed — retry"
          : "Not saved yet";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {draft.content.partnerA} &amp; {draft.content.partnerB}
          </h1>
          <p className="text-sm text-stone-600">
            <Link href="/dashboard" className="font-medium underline">
              ← Dashboard
            </Link>{" "}
            · {draft.templateSnapshot.name} ·{" "}
            <span className="capitalize">{draft.status}</span> ·{" "}
            <Link href={`/w/${draft.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium underline">
              View live site
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p role="status" className="text-sm text-stone-600" aria-live="polite">
            {saveLabel}
            {saveStatus === "failed" && saveError ? ` — ${saveError}` : ""}
          </p>
          <button
            type="button"
            onClick={() => void saveNow()}
            disabled={saveStatus === "saving"}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => void togglePublish()}
            disabled={publishBusy || draft.status === "suspended" || draft.status === "archived"}
            title={
              draft.status === "suspended" || draft.status === "archived"
                ? "This website was suspended or archived — only an admin can restore it."
                : undefined
            }
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {publishBusy ? "Working…" : draft.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
      {draft.status === "suspended" || draft.status === "archived" ? (
        <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          This website was {draft.status}. Publishing is disabled — only an admin can restore it.
        </p>
      ) : null}

      {notice ? (
        <p role="status" className="mt-3 rounded-lg bg-stone-100 px-3 py-2 text-sm">
          {notice}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Settings panel */}
        <section aria-label="Editor settings" className="w-full shrink-0 lg:w-[420px]">
          <div role="tablist" aria-label="Editor sections" className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  tab === t.id ? "bg-stone-900 text-white" : "border border-stone-300 bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
            {tab === "details" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="partner-a" className={labelCls}>Partner A</label>
                    <input id="partner-a" value={draft.content.partnerA} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, partnerA: e.target.value } }))} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="partner-b" className={labelCls}>Partner B</label>
                    <input id="partner-b" value={draft.content.partnerB} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, partnerB: e.target.value } }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subtitle" className={labelCls}>Subtitle</label>
                  <input id="subtitle" value={draft.content.subtitle} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, subtitle: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="welcome" className={labelCls}>Welcome message</label>
                  <textarea id="welcome" rows={3} value={draft.content.welcome} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, welcome: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="story" className={labelCls}>Our story</label>
                  <textarea id="story" rows={5} value={draft.content.story} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, story: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="hero-image" className={labelCls}>Hero image</label>
                  <input id="hero-image" type="url" placeholder="https://…" value={draft.content.heroImage} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, heroImage: e.target.value } }))} className={inputCls} />
                  <p className="mt-1 text-xs text-stone-500">Shown at the top of your site. Paste an image URL, or upload one below.</p>
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={heroUploadBusy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadHeroImage(file);
                      e.target.value = "";
                    }}
                    className="mt-2 block w-full text-sm"
                  />
                  <p className="mt-1 text-xs text-stone-500">{heroUploadBusy ? "Uploading…" : "JPG, PNG or WebP, up to 5 MB."}</p>
                </div>
                <div>
                  <label htmlFor="dress-code" className={labelCls}>Dress code</label>
                  <input id="dress-code" value={draft.content.dressCode} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, dressCode: e.target.value } }))} className={inputCls} />
                  <p className="mt-1 text-xs text-stone-500">Shown in the Dress code section of your site.</p>
                </div>
                <div>
                  <label htmlFor="venue-name" className={labelCls}>Venue name</label>
                  <input id="venue-name" value={draft.content.venueName} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, venueName: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="venue-address" className={labelCls}>Venue address</label>
                  <input id="venue-address" value={draft.content.venueAddress} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, venueAddress: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="map-link" className={labelCls}>Map link</label>
                  <input id="map-link" type="url" placeholder="https://maps.google.com/…" value={draft.content.mapLink} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, mapLink: e.target.value } }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="wedding-date" className={labelCls}>Wedding date &amp; time</label>
                  <input
                    id="wedding-date"
                    type="datetime-local"
                    value={toLocalInput(draft.weddingDate)}
                    onChange={(e) => {
                      const iso = fromLocalInput(e.target.value);
                      if (iso) updateDraft((d) => ({ ...d, weddingDate: iso }));
                    }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="timezone" className={labelCls}>Timezone</label>
                  <input
                    id="timezone"
                    list="tz-list"
                    value={draft.timezone}
                    onChange={(e) => {
                      setTzError("");
                      // Top-level site.timezone is the single source of
                      // truth — settings.timezone is not read anywhere.
                      updateDraft((d) => ({ ...d, timezone: e.target.value }));
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && !isKnownTimezone(value)) {
                        setTzError(`“${value}” is not a known timezone — pick one from the list.`);
                        // Revert to the last saved timezone.
                        updateDraft((d) => ({ ...d, timezone: site.timezone }));
                      } else {
                        setTzError("");
                      }
                    }}
                    className={inputCls}
                  />
                  <datalist id="tz-list">
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz} />
                    ))}
                  </datalist>
                  {tzError ? <p role="alert" className="mt-1 text-xs text-red-700">{tzError}</p> : null}
                </div>
              </div>
            )}

            {tab === "events" && (
              <div className="flex flex-col gap-4">
                {draft.events.length === 0 ? (
                  <p className="text-sm text-stone-600">No events yet. Add your ceremony, reception, or brunch below.</p>
                ) : null}
                {draft.events.map((ev, i) => (
                  <fieldset key={ev.id} className="rounded-lg border border-stone-200 p-3">
                    <legend className="px-1 text-sm font-medium">Event {i + 1}</legend>
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>
                        Name
                        <input value={ev.name} onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, name: e.target.value } : x)) }))} className={inputCls} />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={labelCls}>
                          Date
                          <input type="date" value={ev.date} onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, date: e.target.value } : x)) }))} className={inputCls} />
                        </label>
                        <label className={labelCls}>
                          Time
                          <input value={ev.time} placeholder="4:00 PM" onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, time: e.target.value } : x)) }))} className={inputCls} />
                        </label>
                      </div>
                      <label className={labelCls}>
                        Venue
                        <input value={ev.venue} onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, venue: e.target.value } : x)) }))} className={inputCls} />
                      </label>
                      <label className={labelCls}>
                        Address
                        <input value={ev.address} onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, address: e.target.value } : x)) }))} className={inputCls} />
                      </label>
                      <label className={labelCls}>
                        Description
                        <textarea rows={2} value={ev.description} onChange={(e) => updateDraft((d) => ({ ...d, events: d.events.map((x) => (x.id === ev.id ? { ...x, description: e.target.value } : x)) }))} className={inputCls} />
                      </label>
                      <button
                        type="button"
                        onClick={() => updateDraft((d) => ({ ...d, events: d.events.filter((x) => x.id !== ev.id) }))}
                        className="self-start rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                      >
                        Delete event
                      </button>
                    </div>
                  </fieldset>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const ev: SiteEvent = { id: uid("ev"), name: "New event", date: dateInTimezone(draft.weddingDate, draft.timezone), time: "4:00 PM", venue: "", address: "", description: "" };
                    updateDraft((d) => ({ ...d, events: [...d.events, ev] }));
                  }}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Add event
                </button>
              </div>
            )}

            {tab === "gallery" && (
              <div className="flex flex-col gap-4">
                {draft.gallery.length === 0 ? (
                  <p className="text-sm text-stone-600">No photos yet. Add one by URL or upload a file (JPG, PNG or WebP, up to 5 MB).</p>
                ) : null}
                {draft.gallery.map((img, i) => (
                  <div key={img.id} className="flex gap-3 rounded-lg border border-stone-200 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption || "Gallery photo"} className="h-16 w-16 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <label htmlFor={`caption-${img.id}`} className={labelCls}>Caption</label>
                      <input
                        id={`caption-${img.id}`}
                        value={img.caption}
                        onChange={(e) => updateDraft((d) => ({ ...d, gallery: d.gallery.map((x) => (x.id === img.id ? { ...x, caption: e.target.value } : x)) }))}
                        className={inputCls}
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => updateDraft((d) => {
                            const list = [...d.gallery];
                            [list[i - 1], list[i]] = [list[i], list[i - 1]];
                            return { ...d, gallery: list };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↑ Move up
                        </button>
                        <button
                          type="button"
                          disabled={i === draft.gallery.length - 1}
                          onClick={() => updateDraft((d) => {
                            const list = [...d.gallery];
                            [list[i], list[i + 1]] = [list[i + 1], list[i]];
                            return { ...d, gallery: list };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↓ Move down
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft((d) => ({ ...d, gallery: d.gallery.filter((x) => x.id !== img.id) }))}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                        >
                          Delete photo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <label htmlFor="new-image-url" className={labelCls}>Add by URL</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      id="new-image-url"
                      type="url"
                      placeholder="https://…"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className={`${inputCls} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      disabled={!newImageUrl.trim()}
                      onClick={() => {
                        if (!isSafeImageUrl(newImageUrl)) {
                          setGalleryUrlError("Enter a valid http(s) image URL — javascript: and data: links are not allowed.");
                          return;
                        }
                        setGalleryUrlError("");
                        const image: GalleryImage = { id: uid("g"), url: newImageUrl.trim(), caption: "" };
                        updateDraft((d) => ({ ...d, gallery: [...d.gallery, image] }));
                        setNewImageUrl("");
                      }}
                      className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  {galleryUrlError ? <p role="alert" className="mt-1 text-xs text-red-700">{galleryUrlError}</p> : null}
                </div>
                <div>
                  <label htmlFor="gallery-upload" className={labelCls}>Upload a photo</label>
                  <input
                    id="gallery-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadBusy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadFile(file);
                      e.target.value = "";
                    }}
                    className="mt-1 block w-full text-sm"
                  />
                  <p className="mt-1 text-xs text-stone-500">{uploadBusy ? "Uploading…" : "JPG, PNG or WebP, up to 5 MB. Stored as a data URL in local mode."}</p>
                </div>
              </div>
            )}

            {tab === "invitation" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="invitation-text" className={labelCls}>Invitation text</label>
                  <textarea
                    id="invitation-text"
                    rows={5}
                    value={draft.content.invitationText ?? ""}
                    onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, invitationText: e.target.value } }))}
                    className={inputCls}
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    Shown in the Invitation section, in your theme&apos;s stationery panel.
                  </p>
                </div>
                <div>
                  <label htmlFor="footer-message" className={labelCls}>Footer message</label>
                  <textarea
                    id="footer-message"
                    rows={2}
                    value={draft.content.footerMessage}
                    onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, footerMessage: e.target.value } }))}
                    className={inputCls}
                  />
                  <p className="mt-1 text-xs text-stone-500">Shown at the bottom of your site.</p>
                </div>
                <div>
                  <label htmlFor="post-wedding-message" className={labelCls}>Post-wedding message</label>
                  <textarea
                    id="post-wedding-message"
                    rows={2}
                    value={draft.content.postWeddingMessage}
                    onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, postWeddingMessage: e.target.value } }))}
                    className={inputCls}
                  />
                  <p className="mt-1 text-xs text-stone-500">Shown to guests after the wedding date has passed.</p>
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Show these sections</legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {(
                      [
                        ["showInvitation", "Invitation"],
                        ["showDetails", "Details blocks"],
                        ["showFaq", "FAQ"],
                      ] as const
                    ).map(([key, labelText]) => (
                      <label key={key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.settings[key] ?? true}
                          onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, [key]: e.target.checked } }))}
                        />
                        {labelText}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {tab === "details-blocks" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-stone-600">
                  Details blocks appear in the Details section of your site. Hidden or empty
                  blocks are never shown to guests.
                </p>
                {(draft.content.details ?? []).length === 0 ? (
                  <p className="text-sm text-stone-600">No details blocks yet. Add one below.</p>
                ) : null}
                {(draft.content.details ?? []).map((block, i) => (
                  <fieldset key={block.id} className="rounded-lg border border-stone-200 p-3">
                    <legend className="px-1 text-sm font-medium">
                      {DETAIL_KINDS.find((k) => k.id === block.kind)?.label ?? "Details"} {i + 1}
                    </legend>
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>
                        Kind
                        <select
                          value={block.kind}
                          onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, kind: e.target.value as DetailKind } : x)) } }))}
                          className={inputCls}
                        >
                          {DETAIL_KINDS.map((k) => (
                            <option key={k.id} value={k.id}>{k.label}</option>
                          ))}
                        </select>
                      </label>
                      <label className={labelCls}>
                        Title
                        <input value={block.title} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, title: e.target.value } : x)) } }))} className={inputCls} />
                      </label>
                      <label className={labelCls}>
                        Text
                        <textarea rows={3} value={block.body} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, body: e.target.value } : x)) } }))} className={inputCls} />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className={labelCls}>
                          Link label
                          <input value={block.linkLabel ?? ""} placeholder="e.g. View registry" onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, linkLabel: e.target.value } : x)) } }))} className={inputCls} />
                        </label>
                        <label className={labelCls}>
                          Link URL
                          <input type="url" value={block.linkUrl ?? ""} placeholder="https://…" onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, linkUrl: e.target.value } : x)) } }))} className={inputCls} />
                        </label>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={block.hidden}
                          onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).map((x) => (x.id === block.id ? { ...x, hidden: e.target.checked } : x)) } }))}
                        />
                        Hidden from guests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => updateDraft((d) => {
                            const list = [...(d.content.details ?? [])];
                            [list[i - 1], list[i]] = [list[i], list[i - 1]];
                            return { ...d, content: { ...d.content, details: list } };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↑ Move up
                        </button>
                        <button
                          type="button"
                          disabled={i === (draft.content.details ?? []).length - 1}
                          onClick={() => updateDraft((d) => {
                            const list = [...(d.content.details ?? [])];
                            [list[i], list[i + 1]] = [list[i + 1], list[i]];
                            return { ...d, content: { ...d.content, details: list } };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↓ Move down
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft((d) => ({ ...d, content: { ...d.content, details: (d.content.details ?? []).filter((x) => x.id !== block.id) } }))}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                        >
                          Delete block
                        </button>
                      </div>
                    </div>
                  </fieldset>
                ))}
                <fieldset className="rounded-lg border border-dashed border-stone-300 p-3">
                  <legend className="px-1 text-sm font-medium">Add a details block</legend>
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>
                      Kind
                      <select value={newDetailKind} onChange={(e) => setNewDetailKind(e.target.value as DetailKind)} className={inputCls}>
                        {DETAIL_KINDS.map((k) => (
                          <option key={k.id} value={k.id}>{k.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className={labelCls}>
                      Title
                      <input value={newDetailTitle} onChange={(e) => setNewDetailTitle(e.target.value)} placeholder="e.g. Where to stay" className={inputCls} />
                    </label>
                    <label className={labelCls}>
                      Text
                      <textarea rows={3} value={newDetailBody} onChange={(e) => setNewDetailBody(e.target.value)} className={inputCls} />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={labelCls}>
                        Link label
                        <input value={newDetailLinkLabel} onChange={(e) => setNewDetailLinkLabel(e.target.value)} placeholder="Optional" className={inputCls} />
                      </label>
                      <label className={labelCls}>
                        Link URL
                        <input type="url" value={newDetailLinkUrl} onChange={(e) => setNewDetailLinkUrl(e.target.value)} placeholder="https://…" className={inputCls} />
                      </label>
                    </div>
                    <button
                      type="button"
                      disabled={!newDetailTitle.trim() && !newDetailBody.trim()}
                      onClick={() => {
                        const block: DetailBlock = {
                          id: uid("d"),
                          kind: newDetailKind,
                          title: newDetailTitle.trim(),
                          body: newDetailBody.trim(),
                          linkLabel: newDetailLinkLabel.trim() || undefined,
                          linkUrl: newDetailLinkUrl.trim() || undefined,
                          hidden: false,
                        };
                        updateDraft((d) => ({ ...d, content: { ...d.content, details: [...(d.content.details ?? []), block] } }));
                        setNewDetailTitle("");
                        setNewDetailBody("");
                        setNewDetailLinkLabel("");
                        setNewDetailLinkUrl("");
                      }}
                      className="self-start rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Add block
                    </button>
                  </div>
                </fieldset>
              </div>
            )}

            {tab === "faq" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-stone-600">
                  Questions appear in the FAQ accordion on your site. Guests see them in
                  this order.
                </p>
                {(draft.content.faqs ?? []).length === 0 ? (
                  <p className="text-sm text-stone-600">No questions yet. Add your first one below.</p>
                ) : null}
                {(draft.content.faqs ?? []).map((faq, i) => (
                  <fieldset key={faq.id} className="rounded-lg border border-stone-200 p-3">
                    <legend className="px-1 text-sm font-medium">Question {i + 1}</legend>
                    <div className="flex flex-col gap-2">
                      <label className={labelCls}>
                        Question
                        <input value={faq.question} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, faqs: (d.content.faqs ?? []).map((x) => (x.id === faq.id ? { ...x, question: e.target.value } : x)) } }))} className={inputCls} />
                      </label>
                      <label className={labelCls}>
                        Answer
                        <textarea rows={3} value={faq.answer} onChange={(e) => updateDraft((d) => ({ ...d, content: { ...d.content, faqs: (d.content.faqs ?? []).map((x) => (x.id === faq.id ? { ...x, answer: e.target.value } : x)) } }))} className={inputCls} />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => updateDraft((d) => {
                            const list = [...(d.content.faqs ?? [])];
                            [list[i - 1], list[i]] = [list[i], list[i - 1]];
                            return { ...d, content: { ...d.content, faqs: list } };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↑ Move up
                        </button>
                        <button
                          type="button"
                          disabled={i === (draft.content.faqs ?? []).length - 1}
                          onClick={() => updateDraft((d) => {
                            const list = [...(d.content.faqs ?? [])];
                            [list[i], list[i + 1]] = [list[i + 1], list[i]];
                            return { ...d, content: { ...d.content, faqs: list } };
                          })}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium disabled:opacity-50"
                        >
                          ↓ Move down
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraft((d) => ({ ...d, content: { ...d.content, faqs: (d.content.faqs ?? []).filter((x) => x.id !== faq.id) } }))}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                        >
                          Delete question
                        </button>
                      </div>
                    </div>
                  </fieldset>
                ))}
                <fieldset className="rounded-lg border border-dashed border-stone-300 p-3">
                  <legend className="px-1 text-sm font-medium">Add a question</legend>
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>
                      Question
                      <input value={newFaqQuestion} onChange={(e) => setNewFaqQuestion(e.target.value)} placeholder="e.g. Can I bring a plus-one?" className={inputCls} />
                    </label>
                    <label className={labelCls}>
                      Answer
                      <textarea rows={3} value={newFaqAnswer} onChange={(e) => setNewFaqAnswer(e.target.value)} className={inputCls} />
                    </label>
                    <button
                      type="button"
                      disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                      onClick={() => {
                        const item: FaqItem = { id: uid("faq"), question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() };
                        updateDraft((d) => ({ ...d, content: { ...d.content, faqs: [...(d.content.faqs ?? []), item] } }));
                        setNewFaqQuestion("");
                        setNewFaqAnswer("");
                      }}
                      className="self-start rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Add question
                    </button>
                  </div>
                </fieldset>
              </div>
            )}

            {tab === "design" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="color-primary" className={labelCls}>Primary</label>
                    <input id="color-primary" type="color" value={draft.design.primary} onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, primary: e.target.value } }))} className="mt-1 h-10 w-full rounded border border-stone-300 bg-white" />
                    <p className="mt-1 font-mono text-xs text-stone-500">{draft.design.primary}</p>
                  </div>
                  <div>
                    <label htmlFor="color-accent" className={labelCls}>Accent</label>
                    <input id="color-accent" type="color" value={draft.design.accent} onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, accent: e.target.value } }))} className="mt-1 h-10 w-full rounded border border-stone-300 bg-white" />
                    <p className="mt-1 font-mono text-xs text-stone-500">{draft.design.accent}</p>
                  </div>
                  <div>
                    <label htmlFor="color-bg" className={labelCls}>Background</label>
                    <input id="color-bg" type="color" value={draft.design.background} onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, background: e.target.value } }))} className="mt-1 h-10 w-full rounded border border-stone-300 bg-white" />
                    <p className="mt-1 font-mono text-xs text-stone-500">{draft.design.background}</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="heading-font" className={labelCls}>Heading font</label>
                  <select id="heading-font" value={draft.design.headingFont} onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, headingFont: e.target.value } }))} className={inputCls}>
                    {HEADING_FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="body-font" className={labelCls}>Body font</label>
                  <select id="body-font" value={draft.design.bodyFont} onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, bodyFont: e.target.value } }))} className={inputCls}>
                    {BODY_FONTS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="gallery-layout" className={labelCls}>Gallery layout</label>
                  <select
                    id="gallery-layout"
                    value={draft.design.galleryLayout}
                    onChange={(e) => updateDraft((d) => ({ ...d, design: { ...d.design, galleryLayout: e.target.value as WeddingSite["design"]["galleryLayout"] } }))}
                    className={inputCls}
                  >
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="flex flex-col gap-4">
                <fieldset>
                  <legend className="text-sm font-medium">Sections to show</legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {(
                      [
                        ["showStory", "Our story"],
                        ["showGallery", "Gallery"],
                        ["showEvents", "Events"],
                        ["showDressCode", "Dress code"],
                        ["showCountdown", "Countdown"],
                        ["showInvitation", "Invitation"],
                        ["showDetails", "Details blocks"],
                        ["showFaq", "FAQ"],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={draft.settings[key] ?? true}
                          onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, [key]: e.target.checked } }))}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label htmlFor="countdown-style" className={labelCls}>Countdown style</label>
                  <select
                    id="countdown-style"
                    value={draft.settings.countdownStyle}
                    onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, countdownStyle: e.target.value as WeddingSite["settings"]["countdownStyle"] } }))}
                    className={inputCls}
                  >
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.settings.countdownEnabled}
                    onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, countdownEnabled: e.target.checked } }))}
                  />
                  Countdown enabled
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.settings.rsvpEnabled}
                    onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, rsvpEnabled: e.target.checked } }))}
                  />
                  RSVP enabled
                </label>
                <div>
                  <label htmlFor="rsvp-deadline" className={labelCls}>RSVP deadline</label>
                  <input
                    id="rsvp-deadline"
                    type="datetime-local"
                    value={toLocalInput(draft.settings.rsvpDeadline)}
                    onChange={(e) => updateDraft((d) => ({ ...d, settings: { ...d.settings, rsvpDeadline: fromLocalInput(e.target.value) } }))}
                    className={inputCls}
                  />
                  <p className="mt-1 text-xs text-stone-500">Dates and times use the timezone set on the Couple tab.</p>
                </div>

                <div className="rounded-lg border border-stone-200 p-3">
                  <h3 className="text-sm font-medium">Guest password</h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {draft.settings.passwordEnabled
                      ? "Password protection is on."
                      : "Password protection is off."}
                  </p>
                  <form onSubmit={saveGuestPassword} className="mt-2 flex gap-2">
                    <label htmlFor="editor-guest-password" className="sr-only">New guest password</label>
                    <input
                      id="editor-guest-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="New password (min 4 characters)"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      className={`${inputCls} min-w-0 flex-1`}
                    />
                    <button type="submit" disabled={pwBusy || guestPassword.length < 4} className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                      {pwBusy ? "Saving…" : "Set"}
                    </button>
                  </form>
                  {draft.settings.passwordEnabled ? (
                    <button type="button" onClick={() => void disableGuestPassword()} disabled={pwBusy} className="mt-2 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                      Remove password protection
                    </button>
                  ) : null}
                  {pwMessage ? <p role="status" className="mt-2 text-sm text-stone-600">{pwMessage}</p> : null}
                </div>

                <div>
                  <h3 className="text-sm font-medium">Custom RSVP questions</h3>
                  {draft.customQuestions.length === 0 ? (
                    <p className="mt-1 text-sm text-stone-600">No extra questions. Guests will only be asked the standard RSVP details.</p>
                  ) : (
                    <ul className="mt-2 flex flex-col gap-2">
                      {draft.customQuestions.map((q: RsvpQuestion) => (
                        <li key={q.id} className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm">
                          <span>
                            {q.label} <span className="text-stone-500">({q.type}{q.required ? ", required" : ""})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => updateDraft((d) => ({ ...d, customQuestions: d.customQuestions.filter((x) => x.id !== q.id) }))}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex flex-col gap-2">
                    <label htmlFor="new-question-label" className={labelCls}>New question</label>
                    <input id="new-question-label" placeholder="e.g. What song should we play?" value={newQuestionLabel} onChange={(e) => setNewQuestionLabel(e.target.value)} className={inputCls} />
                    <div className="flex gap-2">
                      <label htmlFor="new-question-type" className="sr-only">Question type</label>
                      <select id="new-question-type" value={newQuestionType} onChange={(e) => setNewQuestionType(e.target.value as "text" | "choice")} className={inputCls}>
                        <option value="text">Free text</option>
                        <option value="choice">Multiple choice</option>
                      </select>
                    </div>
                    {newQuestionType === "choice" ? (
                      <div>
                        <label htmlFor="new-question-options" className={labelCls}>Options (one per line)</label>
                        <textarea id="new-question-options" rows={3} value={newQuestionOptions} onChange={(e) => setNewQuestionOptions(e.target.value)} className={inputCls} />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      disabled={!newQuestionLabel.trim() || (newQuestionType === "choice" && newQuestionOptions.split("\n").map((s) => s.trim()).filter(Boolean).length < 2)}
                      onClick={() => {
                        const q: RsvpQuestion = {
                          id: uid("q"),
                          label: newQuestionLabel.trim(),
                          type: newQuestionType,
                          required: false,
                          ...(newQuestionType === "choice"
                            ? { options: newQuestionOptions.split("\n").map((s) => s.trim()).filter(Boolean) }
                            : {}),
                        };
                        updateDraft((d) => ({ ...d, customQuestions: [...d.customQuestions, q] }));
                        setNewQuestionLabel("");
                        setNewQuestionOptions("");
                      }}
                      className="self-start rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Add question
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Live preview */}
        <section aria-label="Live preview" className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Preview:</span>
            {(
              [
                ["desktop", "Desktop"],
                ["tablet", "Tablet (768px)"],
                ["mobile", "Mobile (390px)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={previewWidth === id}
                onClick={() => setPreviewWidth(id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  previewWidth === id ? "bg-stone-900 text-white" : "border border-stone-300 bg-white"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto text-xs text-stone-500">Preview shows unsaved changes; publishing uses the last saved version.</span>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-stone-100 p-3">
            <div style={previewStyle} className="mx-auto overflow-hidden rounded-lg bg-white shadow-sm">
              <SiteRenderer site={draft} preview />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
