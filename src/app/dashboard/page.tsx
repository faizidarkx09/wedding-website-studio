"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import type { RsvpResponse, WeddingSite } from "@/lib/types";

interface GuestCounts {
  total: number;
  attending: number;
  declined: number;
  attendees: number;
}

type Filter = "all" | "attending" | "declined";
type Sort = "date-desc" | "date-asc" | "name-asc" | "name-desc";

/** Date only, in the site's timezone when one is given (browser-local
 * formatting can shift the day near midnight in other timezones). */
function fmtDate(iso: string | null, timeZone?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "long", day: "numeric" }).format(d);
    } catch {
      // Unknown/invalid timezone — fall through to browser-local.
    }
  }
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [counts, setCounts] = useState<GuestCounts>({ total: 0, attending: 0, declined: 0, attendees: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("date-desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [publishBusy, setPublishBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const siteRes = await fetch("/api/sites/save");
      if (siteRes.status === 401) {
        router.replace("/activate");
        return;
      }
      const siteData = (await siteRes.json()) as { ok: boolean; site?: WeddingSite; error?: string };
      if (!siteRes.ok || !siteData.site) {
        setError(siteData.error || "Could not load your website.");
        setLoading(false);
        return;
      }
      setSite(siteData.site);
      try {
        const gRes = await fetch(`/api/guests?siteId=${encodeURIComponent(siteData.site.id)}`);
        const gData = (await gRes.json()) as { ok: boolean; rsvps?: RsvpResponse[]; counts?: GuestCounts; error?: string };
        if (gRes.ok && gData.rsvps && gData.counts) {
          setRsvps(gData.rsvps);
          setCounts(gData.counts);
        } else {
          setNotice("Could not load RSVP responses — showing 0 for now. Try reloading the page.");
        }
      } catch {
        setNotice("Could not load RSVP responses — showing 0 for now. Check your connection and try reloading the page.");
      }
      setLoading(false);
    } catch {
      setError("Could not load your dashboard — check your connection and try again.");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  // Keep the counts fresh without a manual reload. The dashboard is
  // often left open while a guest RSVPs on the public site (or while
  // activation happens in another tab), and client-side navigation can
  // reuse a cached page — re-fetch whenever the tab becomes visible
  // again so RSVP counts and status never sit stale.
  useEffect(() => {
    const onFocus = () => void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const visibleRsvps = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = rsvps.filter((r) => {
      if (filter === "attending" && !r.attending) return false;
      if (filter === "declined" && r.attending) return false;
      if (q && !`${r.guestName} ${r.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "date-desc") sorted.sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
    if (sort === "date-asc") sorted.sort((a, b) => +new Date(a.submittedAt) - +new Date(b.submittedAt));
    if (sort === "name-asc") sorted.sort((a, b) => a.guestName.localeCompare(b.guestName));
    if (sort === "name-desc") sorted.sort((a, b) => b.guestName.localeCompare(a.guestName));
    return sorted;
  }, [rsvps, search, filter, sort]);

  async function togglePublish() {
    if (!site) return;
    // A suspended/archived site can only be restored by an admin.
    if (site.status === "suspended" || site.status === "archived") {
      setNotice("This website was suspended or archived. Only an admin can restore it.");
      return;
    }
    setPublishBusy(true);
    setNotice("");
    const next = site.status === "published" ? "unpublished" : "published";
    try {
      const res = await fetch("/api/sites/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: site.id, status: next }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not change publishing status");
      setSite({ ...site, status: next });
      setNotice(next === "published" ? "Your website is now published." : "Your website is now unpublished.");
      // Re-fetch so the overview (countdown, RSVP counts, deadline)
      // reflects the just-published state instead of the pre-publish one.
      void load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not change publishing status");
    } finally {
      setPublishBusy(false);
    }
  }

  async function deleteRsvp(id: string, name: string) {
    if (!site) return;
    if (!window.confirm(`Delete the RSVP from ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/guests?id=${encodeURIComponent(id)}&siteId=${encodeURIComponent(site.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      const remaining = rsvps.filter((r) => r.id !== id);
      setRsvps(remaining);
      const attendingList = remaining.filter((r) => r.attending);
      setCounts({
        total: remaining.length,
        attending: attendingList.length,
        declined: remaining.length - attendingList.length,
        attendees: attendingList.reduce((s, r) => s + r.guestCount, 0),
      });
    } catch {
      setNotice("Could not delete that response. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!site) return;
    setPwBusy(true);
    setPwMessage("");
    try {
      const res = await fetch("/api/sites/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: site.id, password: newPassword }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not set the password");
      setSite({ ...site, settings: { ...site.settings, passwordEnabled: true } });
      setNewPassword("");
      setPwMessage("Guest password saved. Your site is now password-protected.");
    } catch (err) {
      setPwMessage(err instanceof Error ? err.message : "Could not set the password");
    } finally {
      setPwBusy(false);
    }
  }

  async function disablePassword() {
    if (!site) return;
    setPwBusy(true);
    setPwMessage("");
    try {
      const res = await fetch("/api/sites/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: site.id, disable: true }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not remove the password");
      setSite({ ...site, settings: { ...site.settings, passwordEnabled: false, passwordHash: null } });
      setPwMessage("Guest password removed. Your site is open to anyone with the link.");
    } catch (err) {
      setPwMessage(err instanceof Error ? err.message : "Could not remove the password");
    } finally {
      setPwBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <p className="text-stone-600">Loading your dashboard…</p>
      </main>
    );
  }

  if (error || !site) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error || "Could not load your website."}
        </p>
        <Link href="/activate" className="mt-4 inline-block font-medium underline">
          Go to activation
        </Link>
      </main>
    );
  }

  const publicUrl = `/w/${site.slug}`;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            {site.content.partnerA} &amp; {site.content.partnerB}
          </h1>
          <p className="mt-1 text-stone-600">
            {site.templateSnapshot.name} ·{" "}
            <Link href={publicUrl} className="font-medium text-stone-900 underline" target="_blank" rel="noopener noreferrer">
              View your website
            </Link>
          </p>
        </div>
        <Link
          href="/editor"
          className="rounded-full bg-stone-900 px-5 py-2.5 font-medium text-white"
        >
          Open editor
        </Link>
      </div>

      {notice ? (
        <p role="status" className="mt-4 rounded-lg bg-stone-100 px-3 py-2 text-sm">
          {notice}
        </p>
      ) : null}

      {/* Overview */}
      <section aria-label="Overview" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Publishing status</p>
          <p className="mt-1 text-xl font-semibold capitalize">{site.status}</p>
          {site.status === "suspended" || site.status === "archived" ? (
            <p className="mt-2 text-sm text-amber-700">Only an admin can restore this website.</p>
          ) : (
            <button
              type="button"
              onClick={togglePublish}
              disabled={publishBusy}
              className="mt-3 rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium disabled:opacity-50"
            >
              {publishBusy ? "Working…" : site.status === "published" ? "Unpublish" : "Publish"}
            </button>
          )}
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Wedding countdown</p>
          <div className="mt-1">
            <Countdown date={site.weddingDate} timezone={site.timezone} style={site.settings.countdownStyle} size="compact" />
          </div>
          <p className="mt-2 text-sm text-stone-600">{fmtDate(site.weddingDate, site.timezone)}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">RSVP responses</p>
          <p className="mt-1 text-xl font-semibold">
            {counts.total} {counts.total === 1 ? "response" : "responses"}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            {counts.attendees} {counts.attendees === 1 ? "guest" : "guests"} attending in total
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Attending / Declined</p>
          <p className="mt-1 text-xl font-semibold">
            {counts.attending} / {counts.declined}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            RSVP deadline: {site.settings.rsvpDeadline ? fmtDate(site.settings.rsvpDeadline, site.timezone) : "not set"}
          </p>
        </div>
      </section>

      {/* Guest management */}
      <section aria-label="Guest management" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Guest list &amp; RSVPs</h2>
          <a
            href={`/api/csv?siteId=${encodeURIComponent(site.id)}`}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium"
          >
            Export CSV
          </a>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="min-w-48 flex-1">
            <label htmlFor="guest-search" className="sr-only">
              Search guests
            </label>
            <input
              id="guest-search"
              type="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-stone-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="guest-filter" className="sr-only">
              Filter responses
            </label>
            <select
              id="guest-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2"
            >
              <option value="all">All responses</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div>
            <label htmlFor="guest-sort" className="sr-only">
              Sort responses
            </label>
            <select
              id="guest-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>
        </div>

        {visibleRsvps.length === 0 ? (
          <p className="mt-6 rounded-xl border border-stone-200 bg-white p-4 text-stone-600">
            No RSVP responses match. Share your website link and responses will appear here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Guest</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Attending</th>
                  <th scope="col" className="px-4 py-3 font-medium">Guests</th>
                  <th scope="col" className="px-4 py-3 font-medium">Submitted</th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRsvps.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{r.guestName}</td>
                    <td className="px-4 py-3 text-stone-600">{r.email || "—"}</td>
                    <td className="px-4 py-3">{r.attending ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">{r.attending ? r.guestCount : 0}</td>
                    <td className="px-4 py-3 text-stone-600">{fmtDate(r.submittedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteRsvp(r.id, r.guestName)}
                        disabled={deletingId === r.id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-700 disabled:opacity-50"
                      >
                        {deletingId === r.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* QR code */}
        <section aria-label="QR code" className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Share with a QR code</h2>
          <p className="mt-1 text-sm text-stone-600">
            Print this on your invitations — guests scan it to open your website.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr?slug=${encodeURIComponent(site.slug)}&format=svg`}
            alt={`QR code linking to ${site.content.partnerA} and ${site.content.partnerB}'s wedding website`}
            className="mt-4 h-48 w-48 border border-stone-200 bg-white"
          />
          <div className="mt-4 flex gap-3">
            <a
              href={`/api/qr?slug=${encodeURIComponent(site.slug)}&format=png`}
              download
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium"
            >
              Download PNG
            </a>
            <a
              href={`/api/qr?slug=${encodeURIComponent(site.slug)}&format=svg`}
              download
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium"
            >
              Download SVG
            </a>
          </div>
        </section>

        {/* Website settings */}
        <section aria-label="Website settings" className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-semibold">Website settings</h2>
          <p className="mt-1 text-sm text-stone-600">
            Status: <span className="font-medium capitalize text-stone-900">{site.status}</span> ·{" "}
            <Link href="/editor" className="font-medium underline">
              Edit website
            </Link>
          </p>
          {site.status === "suspended" || site.status === "archived" ? (
            <p className="mt-3 text-sm text-amber-700">
              This website was {site.status}. Publishing is disabled — only an admin can restore it.
            </p>
          ) : (
            <button
              type="button"
              onClick={togglePublish}
              disabled={publishBusy}
              className="mt-3 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {publishBusy ? "Working…" : site.status === "published" ? "Unpublish website" : "Publish website"}
            </button>
          )}

          <h3 className="mt-6 font-medium">Guest password</h3>
          <p className="mt-1 text-sm text-stone-600">
            {site.settings.passwordEnabled
              ? "Password protection is on — guests must enter the password to view your site."
              : "Password protection is off — anyone with the link can view your site."}
          </p>
          <form onSubmit={savePassword} className="mt-3 flex flex-col gap-2">
            <label htmlFor="guest-password" className="text-sm font-medium">
              {site.settings.passwordEnabled ? "Change guest password" : "Set a guest password"}
            </label>
            <div className="flex gap-2">
              <input
                id="guest-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 4 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 focus:border-stone-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={pwBusy || newPassword.length < 4}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {pwBusy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
          {site.settings.passwordEnabled ? (
            <button
              type="button"
              onClick={disablePassword}
              disabled={pwBusy}
              className="mt-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Remove password protection
            </button>
          ) : null}
          {pwMessage ? (
            <p role="status" className="mt-2 text-sm text-stone-600">
              {pwMessage}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
