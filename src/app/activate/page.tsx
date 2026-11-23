"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [partnerA, setPartnerA] = useState("");
  const [partnerB, setPartnerB] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Set when the server says this browser already owns a website:
  // activating would orphan it, so we need an explicit confirmation.
  const [overwriteWarning, setOverwriteWarning] = useState<{ existingSlug: string } | null>(null);

  async function submit(e: React.FormEvent | React.MouseEvent, confirmOverwrite = false) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, partnerA, partnerB, confirmOverwrite }),
      });
      const data = (await res.json()) as { ok: boolean; slug?: string; error?: string; overwritesExisting?: boolean; existingSlug?: string };
      if (res.ok && data.ok && data.slug) {
        setOverwriteWarning(null);
        router.push("/dashboard");
        router.refresh();
        return;
      }
      if (data.overwritesExisting && data.existingSlug) {
        // Do not proceed — show the warning and wait for the buyer to
        // confirm they really want a new site and to lose the old one.
        setOverwriteWarning({ existingSlug: data.existingSlug });
        setError("");
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
        Enter the access code from your delivery PDF. Every template has its own
        code, and every buyer of that template gets the same code — but when you
        activate it, a brand-new private website is created just for you. Your
        changes never touch another buyer&apos;s site.
      </p>

      <form onSubmit={(e) => void submit(e)} className="mt-8 flex flex-col gap-4">
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
            placeholder="WWS-XXXX-2026"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono uppercase tracking-wider focus:border-stone-900 focus:outline-none"
          />
          <p className="mt-1 text-xs text-stone-500">
            In the delivery PDF that came with your Etsy order.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="partner-a" className="block text-sm font-medium">
              Partner A
            </label>
            <input
              id="partner-a"
              name="partnerA"
              type="text"
              autoComplete="off"
              placeholder="Alex"
              value={partnerA}
              onChange={(e) => setPartnerA(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-stone-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="partner-b" className="block text-sm font-medium">
              Partner B
            </label>
            <input
              id="partner-b"
              name="partnerB"
              type="text"
              autoComplete="off"
              placeholder="Jordan"
              value={partnerB}
              onChange={(e) => setPartnerB(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>
        <p className="-mt-2 text-xs text-stone-500">
          Your names create your website — your site address is built from them
          (for example, Alex &amp; Jordan become /w/alex-jordan).
        </p>

        {overwriteWarning ? (
          <div role="alert" className="rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <p className="font-semibold">You already have a website (/w/{overwriteWarning.existingSlug}).</p>
            <p className="mt-1">
              Activating creates a NEW website and you will lose access to the old one — it cannot be recovered
              from this browser afterwards. If that is what you want, confirm below. Otherwise, go back to your
              existing website instead.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={(e) => void submit(e, true)}
                className="rounded-full bg-amber-700 px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {busy ? "Creating…" : "Yes, create a new website — I understand I will lose the old one"}
              </button>
              <Link
                href={`/w/${overwriteWarning.existingSlug}`}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 font-medium"
              >
                Go to my existing website
              </Link>
            </div>
          </div>
        ) : null}

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

      <p className="mt-8 text-sm text-stone-500">
        Bought a template on Etsy? Your code is in the delivery PDF.{" "}
        <Link href="/" className="font-medium text-stone-900 underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
