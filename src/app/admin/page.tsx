import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getStats, listAudit, listSites, listTemplates } from "@/lib/store";
import { AdminNav, LoginForm } from "./ui";

export const dynamic = "force-dynamic";

async function adminSession() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  return session && session.role === "admin" ? session : null;
}

export default async function AdminPage() {
  const session = await adminSession();

  // Not signed in → login form (this page IS the login form).
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
        <main className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-stone-900">Wedding Website Studio</h1>
          <p className="mt-1 text-sm text-stone-600">Admin sign-in</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Admin access only. Sessions last 30 days. After 5 failed attempts this IP is locked out for 15 minutes.
          </p>
        </main>
      </div>
    );
  }

  const [stats, audit, sites, templates] = await Promise.all([
    getStats(),
    listAudit(),
    listSites(),
    listTemplates(),
  ]);

  const counts = new Map<string, number>();
  for (const site of sites) counts.set(site.templateId, (counts.get(site.templateId) ?? 0) + 1);
  const popular = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ name: templates.find((t) => t.id === id)?.name ?? id, count }));

  const metrics: { label: string; value: number; href?: string }[] = [
    { label: "Sites published", value: stats.publishedSites, href: "/admin/sites" },
    { label: "Sites draft / unpublished", value: stats.draftSites, href: "/admin/sites" },
    { label: "Sites suspended", value: stats.suspendedSites, href: "/admin/sites" },
    { label: "Total RSVPs", value: stats.totalRsvps },
    { label: "Attending", value: stats.attendingCount },
    { label: "Declined", value: stats.declinedCount },
    { label: "Total attendees", value: stats.totalAttendees },
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-stone-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-stone-600">
          {stats.totalSites} sites · {stats.totalRsvps} RSVPs
        </p>

        <section aria-label="Metrics" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{m.label}</p>
              <p className="mt-1 text-3xl font-semibold text-stone-900">{m.value}</p>
              {m.href ? (
                <a href={m.href} className="mt-1 inline-block text-xs font-medium text-stone-700 underline">
                  View →
                </a>
              ) : null}
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Popular templates</h2>
            {popular.length === 0 ? (
              <p className="mt-2 text-sm text-stone-600">No sites yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {popular.map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-stone-800">{p.name}</span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-medium text-stone-700">
                      {p.count} {p.count === 1 ? "site" : "sites"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <a href="/admin/templates" className="mt-3 inline-block text-sm font-medium text-stone-700 underline">
              Manage templates →
            </a>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Quick links</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/admin/templates" className="text-stone-700 underline">Templates — edit, download the delivery PDF</a></li>
              <li><a href="/admin/sites" className="text-stone-700 underline">Sites — publish, suspend, archive</a></li>
              <li><a href="/admin/settings" className="text-stone-700 underline">Settings — integrations</a></li>
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="text-base font-semibold text-stone-900">Recent activity</h2>
          {audit.length === 0 ? (
            <p className="mt-2 text-sm text-stone-600">No activity yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-stone-100">
              {audit.slice(0, 10).map((a) => (
                <li key={a.id} className="flex flex-wrap items-baseline gap-x-3 py-2 text-sm">
                  <span className="font-medium text-stone-900">{a.action}</span>
                  <span className="text-stone-700">{a.detail}</span>
                  <span className="ml-auto text-xs text-stone-500">
                    {a.actor} · {new Date(a.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
