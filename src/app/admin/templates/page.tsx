import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { listTemplates } from "@/lib/store";
import { AdminNav, ApiButton, NewTemplateForm, TemplateEditForm } from "../ui";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") redirect("/admin");
}

export default async function AdminTemplatesPage() {
  await requireAdmin();
  const templates = await listTemplates();

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin/templates" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-stone-900">Templates</h1>
        <p className="mt-1 text-sm text-stone-600">
          Editing a master template never changes an existing customer&apos;s site — each site keeps the template
          snapshot taken when it was created. Each template has one fixed access code: every buyer of that
          template gets the same code, but activating it creates a brand-new site just for that buyer.
        </p>

        <NewTemplateForm />

        {templates.length === 0 ? (
          <div className="mt-6 rounded-lg border border-stone-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-stone-900">No templates yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              The template catalogue is empty. Create a new template with the
              form above — or duplicate an existing one once it exists.
            </p>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {templates.map((t) => (
            <article key={t.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900">
                    {t.name}{" "}
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${t.active ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"}`}>
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </h2>
                  <p className="text-sm text-stone-600">{t.tagline}</p>
                  <p className="mt-1 text-sm text-stone-700">{t.description}</p>
                  <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
                    <span><dt className="inline font-medium">ID: </dt><dd className="inline font-mono">{t.id}</dd></span>
                    <span><dt className="inline font-medium">Listing: </dt><dd className="inline font-mono">{t.etsyListingId ?? "—"}</dd></span>
                    <span><dt className="inline font-medium">Price: </dt><dd className="inline">${t.priceUsd}</dd></span>
                    <span><dt className="inline font-medium">Layout: </dt><dd className="inline">{t.layout}</dd></span>
                  </dl>
                  <div className="mt-2 flex items-center gap-2" aria-label="Palette">
                    {([["bg", t.palette.bg], ["ink", t.palette.ink], ["accent", t.palette.accent], ["soft", t.palette.accentSoft]] as const).map(([name, colour]) => (
                      <span key={name} className="flex items-center gap-1 text-xs text-stone-600">
                        <span className="inline-block h-4 w-4 rounded-full border border-stone-300" style={{ backgroundColor: colour }} />
                        {name} <code className="font-mono">{colour}</code>
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-stone-500">Sections: {t.sections.join(" · ")}</p>
                  <p className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                    <span className="font-medium text-stone-700">Access code: </span>
                    <code className="font-mono font-bold text-stone-900">{t.accessCode}</code>
                    <span className="block text-xs text-stone-500">
                      Same code for every buyer of this template. It is baked into the
                      delivery PDF below — never change it after the PDF is on Etsy.
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`/api/pdf/template?templateId=${encodeURIComponent(t.id)}`}
                  className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100"
                >
                  Download delivery PDF
                </a>
                <ApiButton
                  endpoint="/api/admin/templates"
                  body={{ action: "duplicate", id: t.id }}
                  label="Duplicate"
                  busyLabel="Duplicating…"
                />
                <ApiButton
                  endpoint="/api/admin/templates"
                  body={{ action: "save", template: { ...t, active: !t.active } }}
                  label={t.active ? "Deactivate" : "Activate"}
                  busyLabel="Saving…"
                />
                <ApiButton
                  endpoint="/api/admin/templates"
                  body={{ action: "archive", id: t.id }}
                  label="Archive"
                  busyLabel="Archiving…"
                  variant="danger"
                  confirmText={`Archive “${t.name}”? It will become inactive. Existing sites are unaffected.`}
                  disabled={!t.active}
                />
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Upload this PDF to the Etsy listing as the digital download file — every
                buyer of this template gets this same PDF and code.
              </p>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-stone-700 underline">Edit template</summary>
                <TemplateEditForm template={t} />
              </details>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
