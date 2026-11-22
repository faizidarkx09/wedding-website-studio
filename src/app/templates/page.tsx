import Link from "next/link";
import type { Metadata } from "next";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import TemplateCover from "@/components/TemplateCover";
import { listTemplates } from "@/lib/store";

export const metadata: Metadata = {
  title: "Templates — Wedding Website Studio",
  description:
    "Wedding website templates. Open any template for a live preview.",
};

export default async function TemplatesPage() {
  const templates = (await listTemplates()).filter((t) => t.active);

  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-10 text-center sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Templates
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">
            Templates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Each template has its own layout, type and palette — not just a colour swap.
            New templates are on the way — check back soon.
          </p>
        </section>

        {templates.length === 0 ? (
          <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-20">
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <h2 className="text-2xl font-bold">New templates coming soon</h2>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-stone-600">
                There are no templates listed right now. The first new designs will
                appear here soon — each with a live preview you can open before you buy.
              </p>
              <Link
                href="/how-it-works"
                className="mt-6 inline-block rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                See how it works →
              </Link>
            </div>
          </section>
        ) : (
        <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <article
                key={t.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <TemplateCover template={t} />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-stone-600">{t.description}</p>
                  <div className="mt-4 flex items-center gap-2" aria-label="Template colours">
                    {[t.palette.bg, t.palette.ink, t.palette.accent, t.palette.accentSoft].map(
                      (colour) => (
                        <span
                          key={colour}
                          className="h-6 w-6 rounded-full border border-stone-300"
                          style={{ backgroundColor: colour }}
                          title={colour}
                        />
                      ),
                    )}
                  </div>
                  <p className="mt-4 text-sm text-stone-600">
                    <span className="text-xl font-bold text-stone-900">${t.priceUsd}</span> one-time
                    {t.etsyListingId ? (
                      <span className="ml-3 text-xs">Etsy listing {t.etsyListingId}</span>
                    ) : null}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-stone-500">{t.layout}</p>
                  <Link
                    href={`/templates/${t.id}`}
                    className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-stone-700"
                  >
                    See live preview
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        )}

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-20">
          <div className="rounded-2xl bg-amber-50 p-8 text-center">
            <h2 className="text-xl font-bold">Already bought a template?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              Your access code is in the delivery PDF that came with your Etsy order — the
              same PDF and code every buyer of that template gets. Activate it with your
              names and a brand-new website is created just for you.
            </p>
            <Link
              href="/activate"
              className="mt-5 inline-block rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Activate my access code
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
