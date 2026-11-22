import Link from "next/link";
import type { Metadata } from "next";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import { listTemplates } from "@/lib/store";

export const metadata: Metadata = {
  title: "Templates — Wedding Website Studio",
  description:
    "Five wedding website templates: The Editorial, The Romance, The Modern, The Countryside and The Classic. Open any template for a live preview.",
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
            Five designs, each with its own mood
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Each template has its own layout, type and palette — not just a colour swap.
            Open one to see it live with demo content.
          </p>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <article
                key={t.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-36 w-full" style={{ backgroundColor: t.palette.bg }}>
                  <div className="flex h-full flex-col items-start justify-between p-5">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ backgroundColor: t.palette.accentSoft, color: t.palette.ink }}
                    >
                      {t.tagline}
                    </span>
                    <p className={`text-2xl font-bold ${t.fontClass}`} style={{ color: t.palette.ink }}>
                      {t.name}
                    </p>
                  </div>
                </div>
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

          <div className="mt-12 rounded-2xl bg-amber-50 p-8 text-center">
            <h2 className="text-xl font-bold">Already bought a template?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
              Your access code is in your Etsy order email. Activate it to claim your website
              and start customising.
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
