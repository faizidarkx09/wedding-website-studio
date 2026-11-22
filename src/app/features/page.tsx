import Link from "next/link";
import type { Metadata } from "next";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Features — Wedding Website Studio",
  description:
    "Everything your wedding website does: countdown, RSVP, gallery, events, QR code, guest list, guest password and five designs. Each feature has its own page.",
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-10 text-center sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Features
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">
            Everything your wedding website does
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Eight features, one website. Open any feature to see what it is, how it works,
            who sees it — and try it live on the demo site.
          </p>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:pb-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <article
                key={feature.slug}
                className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-base font-bold text-white">
                  {i + 1}
                </p>
                <h2 className="mt-4 text-xl font-bold">{feature.title}</h2>
                <p className="mt-1 text-sm font-medium text-amber-800">{feature.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
                  {feature.intro}
                </p>
                <Link
                  href={`/features/${feature.slug}`}
                  className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  About {feature.title} →
                </Link>
              </article>
            ))}
            <article className="flex flex-col justify-center rounded-2xl bg-stone-900 p-6 text-white">
              <h2 className="text-xl font-bold">Not sure where to start?</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">
                See how the whole thing fits together — from buying a template on Etsy to
                collecting RSVPs — in five steps.
              </p>
              <Link
                href="/how-it-works"
                className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-center text-sm font-bold text-stone-900 transition hover:bg-stone-200"
              >
                How it works →
              </Link>
            </article>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 pb-16 text-center">
          <p className="text-sm leading-relaxed text-stone-500">
            This site is running in demo mode: the store is built in, and Supabase and
            Etsy are not connected yet. There is no mail system — delivery is the PDF
            that comes with the Etsy order. Every template has its own access code;
            activating it creates a brand-new private website just for you.
            Everything you see — templates, demo site, RSVP —
            works with the demo data.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
