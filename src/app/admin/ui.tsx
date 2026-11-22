// Client components shared by the admin pages (login form, nav, API buttons,
// template editor). All mutations go through the /api/admin/* routes; pages
// refresh after success.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TemplateMeta } from "@/lib/types";

const btn =
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnPrimary = `${btn} bg-stone-900 text-white hover:bg-stone-700`;
const btnSecondary = `${btn} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;
const btnDanger = `${btn} border border-red-300 bg-white text-red-700 hover:bg-red-50`;
const input =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none";
const label = "block text-sm font-medium text-stone-700";

async function postJson(endpoint: string, body: unknown): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }
  return { ok: res.ok, status: res.status, data };
}

// --- Navigation -----------------------------------------------------------

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/sites", label: "Sites" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ current }: { current?: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <a href="/admin" className="text-base font-semibold text-stone-900">
          Wedding Website Studio <span className="font-normal text-stone-500">— Admin</span>
        </a>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Admin">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={current === l.href ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                current === l.href ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={logout} disabled={loggingOut} className={btnSecondary}>
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </header>
  );
}

// --- Login ----------------------------------------------------------------

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { ok, data } = await postJson("/api/admin/login", { password });
      if (!ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed.");
        return;
      }
      setPassword("");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="admin-password" className={label}>
          Admin password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`${input} mt-1`}
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy || password.length === 0} className={`${btnPrimary} w-full py-2.5`}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

// --- Generic API button ---------------------------------------------------

export function ApiButton({
  endpoint,
  body,
  label,
  busyLabel,
  confirmText,
  variant = "secondary",
  disabled = false,
  onSuccess,
}: {
  endpoint: string;
  body: unknown;
  label: string;
  busyLabel?: string;
  confirmText?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onSuccess?: (data: Record<string, unknown>) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (confirmText && !window.confirm(confirmText)) return;
    setError(null);
    setBusy(true);
    try {
      const { ok, data } = await postJson(endpoint, body);
      if (!ok) {
        setError(typeof data.error === "string" ? data.error : "Action failed.");
        return;
      }
      if (onSuccess) onSuccess(data);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  const cls = variant === "primary" ? btnPrimary : variant === "danger" ? btnDanger : btnSecondary;
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={run} disabled={busy || disabled} className={cls} title={error ?? undefined}>
        {busy ? busyLabel ?? "Working…" : label}
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </span>
  );
}

// --- Copy button ----------------------------------------------------------

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }
  return (
    <button type="button" onClick={copy} className={btnSecondary}>
      {copied ? "Copied ✓" : "Copy code"}
    </button>
  );
}

// --- Template editor ------------------------------------------------------

export function TemplateEditForm({ template }: { template: TemplateMeta }) {
  const router = useRouter();
  const [name, setName] = useState(template.name);
  const [tagline, setTagline] = useState(template.tagline);
  const [description, setDescription] = useState(template.description);
  const [priceUsd, setPriceUsd] = useState(String(template.priceUsd));
  const [etsyListingId, setEtsyListingId] = useState(template.etsyListingId ?? "");
  const [bg, setBg] = useState(template.palette.bg);
  const [ink, setInk] = useState(template.palette.ink);
  const [accent, setAccent] = useState(template.palette.accent);
  const [accentSoft, setAccentSoft] = useState(template.palette.accentSoft);
  const [layout, setLayout] = useState(template.layout);
  const [fontClass, setFontClass] = useState(template.fontClass);
  const [heroImage, setHeroImage] = useState(template.heroImage ?? "");
  const [sections, setSections] = useState(template.sections.join(", "));
  const [active, setActive] = useState(template.active);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const price = Number(priceUsd);
    if (!name.trim() || !Number.isFinite(price) || price < 0) {
      setMessage({ kind: "error", text: "Name is required and price must be a number ≥ 0." });
      return;
    }
    const updated: TemplateMeta = {
      ...template,
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      priceUsd: price,
      etsyListingId: etsyListingId.trim() || null,
      active,
      palette: { bg: bg.trim(), ink: ink.trim(), accent: accent.trim(), accentSoft: accentSoft.trim() },
      layout: layout.trim(),
      fontClass: fontClass.trim(),
      sections: sections.split(",").map((s) => s.trim()).filter(Boolean),
    };
    // Optional hero image (e.g. /images/themes/<id>.jpg). Blank removes it.
    if (heroImage.trim()) updated.heroImage = heroImage.trim();
    else delete updated.heroImage;
    setBusy(true);
    try {
      const { ok, data } = await postJson("/api/admin/templates", { action: "save", template: updated });
      if (!ok) {
        setMessage({ kind: "error", text: typeof data.error === "string" ? data.error : "Save failed." });
        return;
      }
      setMessage({ kind: "ok", text: "Template saved. Existing customer sites are unaffected (they keep their snapshot)." });
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-3 border-t border-stone-200 pt-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`name-${template.id}`}>Name</label>
          <input id={`name-${template.id}`} value={name} onChange={(e) => setName(e.target.value)} required className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`tagline-${template.id}`}>Tagline</label>
          <input id={`tagline-${template.id}`} value={tagline} onChange={(e) => setTagline(e.target.value)} className={`${input} mt-1`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`desc-${template.id}`}>Description</label>
          <textarea id={`desc-${template.id}`} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`price-${template.id}`}>Price (USD)</label>
          <input id={`price-${template.id}`} type="number" min="0" step="1" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} required className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`listing-${template.id}`}>Etsy listing ID</label>
          <input id={`listing-${template.id}`} value={etsyListingId} onChange={(e) => setEtsyListingId(e.target.value)} placeholder="e.g. WWS-EDT-001" className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`layout-${template.id}`}>Layout</label>
          <input id={`layout-${template.id}`} value={layout} onChange={(e) => setLayout(e.target.value)} className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`font-${template.id}`}>Font class</label>
          <input id={`font-${template.id}`} value={fontClass} onChange={(e) => setFontClass(e.target.value)} className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor={`hero-${template.id}`}>Hero image URL</label>
          <input id={`hero-${template.id}`} value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="/images/themes/<id>.jpg" className={`${input} mt-1`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`sections-${template.id}`}>Sections (comma-separated)</label>
          <input id={`sections-${template.id}`} value={sections} onChange={(e) => setSections(e.target.value)} className={`${input} mt-1`} />
        </div>
      </div>
      <fieldset>
        <legend className={label}>Palette</legend>
        <div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Background", bg, setBg],
              ["Ink", ink, setInk],
              ["Accent", accent, setAccent],
              ["Accent soft", accentSoft, setAccentSoft],
            ] as const
          ).map(([labelText, value, setValue]) => (
            <div key={labelText}>
              <label className="block text-xs font-medium text-stone-600">{labelText}</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"} onChange={(e) => setValue(e.target.value)} className="h-9 w-10 cursor-pointer rounded border border-stone-300 bg-white p-0.5" aria-label={`${labelText} colour picker`} />
                <input value={value} onChange={(e) => setValue(e.target.value)} className={input} aria-label={`${labelText} hex value`} />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4" />
        Active (available for new buyers)
      </label>
      {message ? (
        <p role={message.kind === "error" ? "alert" : "status"} className={`rounded-md px-3 py-2 text-sm ${message.kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? "Saving…" : "Save template"}
      </button>
    </form>
  );
}

// --- New template ---------------------------------------------------------

function randomAccessCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
  return `WWS-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

/**
 * Create a blank template: id (slug) + name + a generated fixed access
 * code. Defaults are a sensible starting point (single-column layout,
 * full section set, inactive) — the admin then edits the details with the
 * Edit form. The access code is baked into the delivery PDF, so it must
 * never change after the PDF is on Etsy.
 */
export function NewTemplateForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState(randomAccessCode);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const slug = id.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setMessage({ kind: "error", text: "ID must be a lowercase slug, e.g. champagne-elegance." });
      return;
    }
    if (!name.trim() || !accessCode.trim()) {
      setMessage({ kind: "error", text: "Name and access code are required." });
      return;
    }
    const template: TemplateMeta = {
      id: slug,
      name: name.trim(),
      tagline: "",
      description: "",
      priceUsd: 49,
      etsyListingId: null,
      active: false,
      accessCode: accessCode.trim(),
      palette: { bg: "#fdfbf7", ink: "#1c1917", accent: "#8a6d3b", accentSoft: "#f5efe4" },
      fontClass: "font-editorial",
      layout: "",
      composition: "classic",
      sections: ["hero", "invitation", "countdown", "story", "events", "details", "gallery", "faq", "rsvp"],
    };
    setBusy(true);
    try {
      const { ok, data } = await postJson("/api/admin/templates", { action: "save", template });
      if (!ok) {
        setMessage({ kind: "error", text: typeof data.error === "string" ? data.error : "Save failed." });
        return;
      }
      setMessage({ kind: "ok", text: `Template “${template.name}” created. Edit its details below, then activate it.` });
      setId("");
      setName("");
      setAccessCode(randomAccessCode());
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-stone-900">New template</h2>
      <p className="mt-1 text-sm text-stone-600">
        Creates a blank template with a fixed access code. Fill in the design
        details with the Edit form afterwards.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="new-template-id">Template ID (slug)</label>
          <input id="new-template-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. champagne-elegance" required className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor="new-template-name">Name</label>
          <input id="new-template-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Champagne Elegance" required className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor="new-template-code">Access code</label>
          <div className="mt-1 flex gap-2">
            <input id="new-template-code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required className={`${input} min-w-0 flex-1 font-mono`} />
            <button type="button" onClick={() => setAccessCode(randomAccessCode())} className={btnSecondary}>
              Regenerate
            </button>
          </div>
        </div>
      </div>
      {message ? (
        <p role={message.kind === "error" ? "alert" : "status"} className={`mt-3 rounded-md px-3 py-2 text-sm ${message.kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={`${btnPrimary} mt-3`}>
        {busy ? "Creating…" : "Create template"}
      </button>
    </form>
  );
}

