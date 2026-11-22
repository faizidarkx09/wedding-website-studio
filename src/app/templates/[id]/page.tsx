import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import SiteRenderer from "@/components/SiteRenderer";
import { previewSiteForTemplate } from "@/lib/preview";
import { getTemplateById } from "@/lib/store";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero — names, date & photo",
  countdown: "Countdown to the day",
  story: "Our story",
  events: "Events — ceremony, reception & more",
  venue: "Venue & map",
  gallery: "Photo gallery",
  "dress-code": "Dress code",
  rsvp: "RSVP form",
};

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await getTemplateById(id);
  if (!template || !template.active) notFound();

  const previewSite = previewSiteForTemplate(template);

  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        {/* Facts */}
        <section className="mx-auto w-full max-w-6xl px-5 pt-12 pb-8 sm:pt-16">
          <Link href="/templates" className="text-sm font-medium text-stone-500 hover:text-stone-900">
            ← All templates
          </Link>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                {template.tagline}
              </p>
              <h1 className={`mt-3 text-4xl font-bold sm:text-5xl ${template.fontClass}`}>
                {template.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-stone-600">{template.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Template colours">
                {[
                  { label: "Background", value: template.palette.bg },
                  { label: "Ink", value: template.palette.ink },
                  { label: "Accent", value: template.palette.accent },
                  { label: "Accent soft", value: template.palette.accentSoft },
                ].map((swatch) => (
                  <span key={swatch.label} className="flex items-center gap-2 rounded-full border border-stone-300 bg-white py-1 pr-3 pl-1 text-xs font-medium">
                    <span
                      className="h-5 w-5 rounded-full border border-stone-300"
                      style={{ backgroundColor: swatch.value }}
                    />
                    {swatch.label} {swatch.value}
                  </span>
                ))}
              </div>
            </div>
            <dl className="w-full shrink-0 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:w-80">
              <div className="flex justify-between gap-4">
                <dt className="text-sm text-stone-500">Price</dt>
                <dd className="text-lg font-bold">${template.priceUsd} one-time</dd>
              </div>
              <div className="mt-3 flex justify-between gap-4 border-t border-stone-100 pt-3">
                <dt className="text-sm text-stone-500">Etsy listing</dt>
                <dd className="font-mono text-sm font-semibold">{template.etsyListingId ?? "—"}</dd>
              </div>
              <div className="mt-3 flex justify-between gap-4 border-t border-stone-100 pt-3">
                <dt className="text-sm text-stone-500">Layout</dt>
                <dd className="text-right text-sm font-medium">{template.layout}</dd>
              </div>
              <div className="mt-3 border-t border-stone-100 pt-3">
                <dt className="text-sm text-stone-500">Sections included</dt>
                <dd className="mt-2">
                  <ul className="space-y-1.5 text-sm">
                    {template.sections.map((section) => (
                      <li key={section}>✓ {SECTION_LABELS[section] ?? section}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* How to buy */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-10">
          <div className="rounded-2xl bg-amber-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold">How to buy on Etsy</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-stone-700">
              <li>
                Find the <strong>{template.name}</strong> listing on Etsy
                {template.etsyListingId ? (
                  <span>
                    {" "}(listing <code className="rounded bg-amber-100 px-1.5 py-0.5">{template.etsyListingId}</code>)
                  </span>
                ) : null}{" "}
                and complete your purchase.
              </li>
              <li>Download the delivery PDF from your Etsy order — it has your template link and your private access code.</li>
              <li>
                <Link href="/activate" className="font-semibold text-amber-800 underline">
                  Activate your code
                </Link>{" "}
                with your names — a brand-new website is created just for you — then
                customise your names, story, photos and events.
              </li>
              <li>Publish, share the link or QR code, and watch the RSVPs come in.</li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-stone-700">
              Every template has its own access code. Everyone who buys this template
              gets the same PDF and the same code — but activating it creates a
              brand-new private website just for you. Your changes never touch another
              buyer&apos;s site.
            </p>
            <p className="mt-4 text-xs text-stone-500">
              The preview below uses placeholder content so you can see the design
              in full — your own site will carry your words and photos.
            </p>
          </div>
        </section>

        {/* Live preview */}
        <section aria-label={`Live preview of ${template.name}`} className="border-t border-stone-200">
          <SiteRenderer site={previewSite} preview />
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-12 text-center">
          <Link
            href="/activate"
            className="inline-block rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-900"
          >
            Activate your code →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
