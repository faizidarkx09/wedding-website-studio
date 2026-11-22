"use client";

import { useState } from "react";

interface PasswordGateProps {
  slug: string;
}

/**
 * Password gate for guest sites with password protection enabled.
 * POSTs { slug, password } to /api/guest-password; on { ok: true } the API
 * sets the guest cookie and we reload so the server can render the site.
 */
export default function PasswordGate({ slug }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/guest-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });
      const data: unknown = await res.json().catch(() => null);
      const ok =
        data !== null && typeof data === "object" && (data as { ok?: unknown }).ok === true;
      if (ok) {
        window.location.reload();
        return;
      }
      const message =
        data !== null && typeof data === "object" && typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : "That password did not work. Please try again.";
      setError(message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Private wedding website
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-900">This site is password protected</h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        The couple have protected this website. Please enter the password from your invitation
        to continue.
      </p>
      <form onSubmit={onSubmit} className="mt-8 w-full text-left">
        <label htmlFor="guest-password" className="block text-sm font-semibold text-stone-800">
          Password
        </label>
        <input
          id="guest-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
          className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-stone-900 focus:outline-none"
        />
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Enter site"}
        </button>
      </form>
    </main>
  );
}
