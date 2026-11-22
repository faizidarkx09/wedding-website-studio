// Client components shared by the admin pages (login form, nav, API buttons,
// template editor, order registration, order actions incl. one-time code display).
// All mutations go through the /api/admin/* routes; pages refresh after success.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EtsyOrder, TemplateMeta } from "@/lib/types";

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
  { href: "/admin/orders", label: "Orders" },
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
          <a href="/w/sarah-and-james" target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            View demo site
          </a>
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
        Active (available for new orders)
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

// --- Register order form --------------------------------------------------

export function RegisterOrderForm({ templates }: { templates: TemplateMeta[] }) {
  const router = useRouter();
  const [etsyOrderId, setEtsyOrderId] = useState("");
  const [etsyListingId, setEtsyListingId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [templateId, setTemplateId] = useState<string>(templates.find((t) => t.active)?.id ?? templates[0]?.id ?? "");
  const [suggested, setSuggested] = useState<TemplateMeta | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function onListingChange(value: string) {
    setEtsyListingId(value);
    const match = templates.find((t) => t.etsyListingId && t.etsyListingId === value.trim()) ?? null;
    setSuggested(match);
    if (match) setTemplateId(match.id);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      const { ok, data } = await postJson("/api/admin/orders", {
        action: "create",
        etsyOrderId: etsyOrderId.trim(),
        etsyListingId: etsyListingId.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        templateId,
      });
      if (!ok) {
        setMessage({ kind: "error", text: typeof data.error === "string" ? data.error : "Could not register the order." });
        return;
      }
      setMessage({ kind: "ok", text: `Order ${etsyOrderId.trim()} registered as pending. Verify it next, then provision the site.` });
      setEtsyOrderId("");
      setEtsyListingId("");
      setCustomerName("");
      setCustomerEmail("");
      setSuggested(null);
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="text-base font-semibold text-stone-900">Register an Etsy order</h2>
      <p className="text-sm text-stone-600">
        Manual workflow: copy the order from Etsy here. The listing ID only <strong>suggests</strong> a template — the
        template you pick below is what the customer gets.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="reg-order-id">Etsy order ID</label>
          <input id="reg-order-id" value={etsyOrderId} onChange={(e) => setEtsyOrderId(e.target.value)} required placeholder="e.g. 1234567890" className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor="reg-listing-id">Etsy listing ID</label>
          <input id="reg-listing-id" value={etsyListingId} onChange={(e) => onListingChange(e.target.value)} required placeholder="e.g. WWS-EDT-001" className={`${input} mt-1`} />
          {suggested ? (
            <p className="mt-1 text-xs text-stone-600">Listing matches template “{suggested.name}” — pre-selected below. You can still change it.</p>
          ) : null}
        </div>
        <div>
          <label className={label} htmlFor="reg-name">Customer name</label>
          <input id="reg-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="e.g. Sarah & James" className={`${input} mt-1`} />
        </div>
        <div>
          <label className={label} htmlFor="reg-email">Customer email</label>
          <input id="reg-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required placeholder="customer@example.com" className={`${input} mt-1`} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="reg-template">Template (authoritative — this is what gets provisioned)</label>
          <select id="reg-template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} required className={`${input} mt-1`}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — ${t.priceUsd} {t.active ? "" : "(inactive)"}
              </option>
            ))}
          </select>
        </div>
      </div>
      {message ? (
        <p role={message.kind === "error" ? "alert" : "status"} className={`rounded-md px-3 py-2 text-sm ${message.kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? "Registering…" : "Register order"}
      </button>
    </form>
  );
}

// --- Order detail actions -------------------------------------------------

export function OrderActions({ order, siteSlug }: { order: EtsyOrder; siteSlug: string | null }) {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function run(action: string, extra: Record<string, unknown> = {}) {
    setError(null);
    setNotice(null);
    setBusyAction(action);
    try {
      const { ok, data } = await postJson("/api/admin/orders", { action, id: order.id, ...extra });
      if (!ok) {
        setError(typeof data.error === "string" ? data.error : "Action failed.");
        return;
      }
      if (action === "provision") {
        if (typeof data.code === "string" && data.code) {
          setCode(data.code);
          setNotice(`Site provisioned: /w/${String(data.siteSlug ?? "")}. The access code below is shown ONCE — copy it now.`);
        } else {
          setNotice("This order was already provisioned. The original code is never shown again — use “Reset access code” to issue a new one.");
        }
      } else if (action === "reset-code") {
        if (typeof data.code === "string" && data.code) {
          setCode(data.code);
          setNotice("New access code issued — shown ONCE. Copy it now.");
        }
      } else if (action === "verify") {
        setNotice("Order verified. You can now provision the site.");
      } else if (action === "deliver") {
        setNotice("Order marked as delivered.");
      } else if (action === "revoke-code") {
        setNotice("Access code revoked. The customer can no longer use it to activate.");
      } else if (action === "flag") {
        setNotice(`Order flagged as ${String(extra.status ?? "")}.`);
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusyAction(null);
    }
  }

  const flagStatuses = (["refunded", "cancelled", "disputed"] as const).filter((s) => s !== order.status);

  return (
    <div className="space-y-4">
      {code ? (
        <div role="status" className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">One-time access code — shown once only</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-stone-900 break-all">{code}</p>
          <p className="mt-1 text-sm text-amber-800">
            The delivery PDF is generated from this code automatically — just download it
            below. The code will <strong>not</strong> be shown again on this page.
          </p>
          <div className="mt-3">
            <CopyButton text={code} />
          </div>
        </div>
      ) : null}
      {notice ? (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {order.status === "pending" ? (
          <button type="button" onClick={() => run("verify")} disabled={busyAction !== null} className={btnPrimary}>
            {busyAction === "verify" ? "Verifying…" : "Verify order"}
          </button>
        ) : null}
        {order.status === "verified" ? (
          <button type="button" onClick={() => run("provision")} disabled={busyAction !== null} className={btnPrimary}>
            {busyAction === "provision" ? "Provisioning…" : "Provision site"}
          </button>
        ) : null}
        {order.status === "provisioned" ? (
          <button type="button" onClick={() => run("deliver")} disabled={busyAction !== null} className={btnPrimary}>
            {busyAction === "deliver" ? "Marking…" : "Mark as delivered"}
          </button>
        ) : null}
        {order.accessCodeId && (order.status === "provisioned" || order.status === "delivered") ? (
          <>
            <button type="button" onClick={() => run("reset-code")} disabled={busyAction !== null} className={btnSecondary}>
              {busyAction === "reset-code" ? "Resetting…" : "Reset access code"}
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm("Revoke this access code? The customer will no longer be able to activate with it.")) void run("revoke-code"); }}
              disabled={busyAction !== null}
              className={btnDanger}
            >
              {busyAction === "revoke-code" ? "Revoking…" : "Revoke access code"}
            </button>
          </>
        ) : null}
        {siteSlug ? (
          <a href={`/w/${siteSlug}`} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            View site
          </a>
        ) : null}
        <a href={`/api/pdf?orderId=${encodeURIComponent(order.id)}`} className={btnSecondary}>
          Download delivery PDF
        </a>
      </div>

      <p className="text-sm text-stone-600">
        Upload this PDF to the Etsy listing as the digital download file, so the buyer
        receives it automatically after purchase. It has the template link and the access code.
      </p>

      {flagStatuses.length > 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-3">
          <p className="text-sm font-medium text-stone-700">Flag this order</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {flagStatuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { if (window.confirm(`Flag this order as ${s}?`)) void run("flag", { status: s }); }}
                disabled={busyAction !== null}
                className={btnDanger}
              >
                Mark {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
