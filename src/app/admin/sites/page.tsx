import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { listSites, listTemplates } from "@/lib/store";
import { AdminNav, ApiButton } from "../ui";
import type { WeddingSite } from "@/lib/types";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") redirect("/admin");
}

const STATUS_STYLES: Record<WeddingSite["status"], string> = {
  draft: "bg-stone-200 text-stone-700",
  published: "bg-green-100 text-green-800",
  unpublished: "bg-amber-100 text-amber-800",
  suspended: "bg-red-100 text-red-800",
  archived: "bg-stone-200 text-stone-500",
};

export default async function AdminSitesPage() {
  await requireAdmin();
  const [sites, templates] = await Promise.all([listSites(), listTemplates()]);
  const templateName = (id: string) => templates.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin/sites" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-stone-900">Websites</h1>
        <p className="mt-1 text-sm text-stone-600">
          {sites.length} {sites.length === 1 ? "site" : "sites"} · {sites.filter((s) => s.status === "published").length} published
        </p>

        <section className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <th scope="col" className="px-4 py-3">Slug</th>
                <th scope="col" className="px-4 py-3">Owner</th>
                <th scope="col" className="px-4 py-3">Template</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Wedding date</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-600">No sites yet — provision an order to create one.</td>
                </tr>
              ) : (
                sites.map((s) => (
                  <tr key={s.id} className="border-b border-stone-100 align-top last:border-0">
                    <td className="px-4 py-3">
                      <a href={`/w/${s.slug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-medium text-stone-900 underline">
                        /w/{s.slug}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-stone-900">{s.ownerName}</span>
                      <span className="block text-xs text-stone-500">{s.ownerEmail}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{templateName(s.templateId)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{new Date(s.weddingDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(s.status === "draft" || s.status === "unpublished") ? (
                          <ApiButton endpoint="/api/admin/sites" body={{ action: "set-status", id: s.id, status: "published" }} label="Publish" variant="primary" />
                        ) : null}
                        {s.status === "published" ? (
                          <ApiButton endpoint="/api/admin/sites" body={{ action: "set-status", id: s.id, status: "unpublished" }} label="Unpublish" />
                        ) : null}
                        {s.status !== "suspended" && s.status !== "archived" ? (
                          <ApiButton
                            endpoint="/api/admin/sites"
                            body={{ action: "set-status", id: s.id, status: "suspended" }}
                            label="Suspend"
                            variant="danger"
                            confirmText={`Suspend /w/${s.slug}? It will stop being visible to guests.`}
                          />
                        ) : null}
                        {s.status === "suspended" ? (
                          <ApiButton
                            endpoint="/api/admin/sites"
                            body={{ action: "set-status", id: s.id, status: s.publishedAt ? "published" : "draft" }}
                            label="Reactivate"
                            variant="primary"
                          />
                        ) : null}
                        {s.status !== "archived" ? (
                          <ApiButton
                            endpoint="/api/admin/sites"
                            body={{ action: "set-status", id: s.id, status: "archived" }}
                            label="Archive"
                            variant="danger"
                            confirmText={`Archive /w/${s.slug}?`}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
