"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json()) as { ok: boolean; slug?: string; error?: string };
      if (res.ok && data.ok && data.slug) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      // Generic message on purpose: never reveal whether a code was
      // invalid, used, revoked, or expired.
      setError(data.error || "Invalid, revoked or expired code");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-semibold">Activate your website</h1>
      <p className="mt-2 text-stone-600">
        Enter the access code from your order confirmation to open your wedding website dashboard.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="access-code" className="block text-sm font-medium">
            Access code
          </label>
          <input
            id="access-code"
            name="code"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="WWS-XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono uppercase tracking-wider focus:border-stone-900 focus:outline-none"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !code.trim()}
          className="rounded-full bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {busy ? "Checking…" : "Activate"}
        </button>
      </form>

      <p className="mt-4 text-sm text-stone-500">
        Too many wrong attempts locks activation for 15 minutes (5 attempts).
      </p>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-medium">Trying the demo?</p>
        <p className="mt-1 text-stone-600">
          The demo code <code className="font-mono font-semibold">WWS-DEMO-2026</code> opens the
          Sarah &amp; James demo site so you can explore the dashboard and editor.
        </p>
        <button
          type="button"
          onClick={() => setCode("WWS-DEMO-2026")}
          className="mt-3 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Use the demo code
        </button>
      </div>

      <p className="mt-8 text-sm text-stone-500">
        Bought a template on Etsy? Your code is in the delivery PDF.{" "}
        <Link href="/" className="font-medium text-stone-900 underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
