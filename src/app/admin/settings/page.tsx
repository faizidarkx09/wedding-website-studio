import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { isLocalStore } from "@/lib/store";
import { supabaseStatus } from "@/lib/supabase";
import { AdminNav } from "../ui";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") redirect("/admin");
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${connected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const status = supabaseStatus();
  const localStore = isLocalStore();
  const customPasswordSet = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin/settings" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-stone-900">Settings &amp; integrations</h1>
        <p className="mt-1 text-sm text-stone-600">Connection status is read from environment variables — nothing here claims a live connection it does not have.</p>

        {localStore ? (
          <div role="alert" className="mt-6 rounded-lg border-2 border-amber-400 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900">Local store mode is ON</p>
            <p className="mt-1 text-sm text-amber-800">
              Supabase is not configured, so the app runs on an in-memory store with no
              demo content. Sites and RSVPs created here are lost when the server
              restarts. Connect Supabase to persist real data.
            </p>
          </div>
        ) : (
          <div role="status" className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              Supabase environment variables are present — but the store is still in-memory until the Supabase
              switch is implemented (see README “Connecting Supabase”). Sites and RSVPs are still lost when the
              server restarts.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-stone-900">Supabase</h2>
              <StatusPill connected={status.supabase} />
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {status.supabase
                ? "Configured (variables present) — but the app still runs on the in-memory store. The Supabase switch is not implemented yet, so no data is read from or written to Supabase."
                : "Not connected. The app runs in local mode on the in-memory store."}
            </p>
            <p className="mt-3 text-sm font-medium text-stone-700">Environment variables needed:</p>
            <ul className="mt-1 space-y-1 text-sm">
              <li><code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li><code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
              <li><code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> <span className="text-stone-500">(server only — never expose it)</span></li>
            </ul>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-stone-900">Etsy API</h2>
              <StatusPill connected={status.etsy} />
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {status.etsy
                ? "Configured. No automatic order sync is used — delivery is by static PDF per template (see the Templates page)."
                : "Not connected — no automatic order sync. Delivery is by static PDF: download each template's delivery PDF from the Templates page and upload it to the Etsy listing as the digital download file. The Etsy listing ID only suggests a template; your chosen template is authoritative."}
            </p>
            <p className="mt-3 text-sm font-medium text-stone-700">Environment variables needed:</p>
            <ul className="mt-1 space-y-1 text-sm">
              <li><code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">ETSY_API_KEY</code></li>
              <li><code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">ETSY_SHOP_ID</code></li>
            </ul>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-stone-900">Delivery</h2>
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                PDF only
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              Delivery is by PDF only: the buyer downloads the delivery PDF from their Etsy
              order (digital download). It has the template link and the access code. There is
              no mail system by design — no delivery emails are sent.
            </p>
            <p className="mt-3 text-sm text-stone-600">
              Upload each template&apos;s delivery PDF (download it from the Templates page) to that template&apos;s
              Etsy listing as the digital download file, so every buyer gets the same PDF and code automatically after purchase.
            </p>
          </section>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Admin password</h2>
            <p className="mt-2 text-sm text-stone-600">
              {customPasswordSet
                ? "A custom admin password is set via the ADMIN_PASSWORD environment variable. The default password does not work."
                : "No ADMIN_PASSWORD is set, so the default password below is active. Set ADMIN_PASSWORD in production and restart the server to change it."}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              To change the password: set <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">ADMIN_PASSWORD</code> in
              the environment and restart. There is no in-app password change — the password is never stored in the database.
            </p>
            {!customPasswordSet ? (
              <div className="mt-3 rounded-md border border-red-300 bg-red-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Default password — change in production</p>
                <p className="mt-1 text-sm text-red-800">
                  Default admin password: <code className="rounded bg-white px-1.5 py-0.5 font-mono font-bold">admin123</code>
                </p>
                <p className="mt-1 text-xs text-red-700">Anyone who knows this password can administer the studio. Set ADMIN_PASSWORD before going live.</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Data &amp; privacy</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
              <li>Access codes are public by design — they ship in the delivery PDF, and are stored in plain text on the template. Only guest passwords are hashed (SHA-256).</li>
              <li>Guest lists and RSVP records are tenant-scoped by site — an admin sees them, a public visitor never does.</li>
              <li>Session cookies are httpOnly and sameSite=lax; the admin session lasts 30 days.</li>
              <li>Service-role keys (Supabase) and API keys (Etsy) are server-side only and are never sent to the browser.</li>
              <li>Editing a master template never changes an existing site — each site keeps the template snapshot from creation time.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
