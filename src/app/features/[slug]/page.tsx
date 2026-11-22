import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import { FEATURES, getFeature } from "@/lib/features";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return { title: "Feature not found — Wedding Website Studio" };
  return {
    title: `${feature.title} — Wedding Website Studio`,
    description: feature.intro,
  };
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const index = FEATURES.findIndex((f) => f.slug === slug);
  const prev = index > 0 ? FEATURES[index - 1] : null;
  const next = index < FEATURES.length - 1 ? FEATURES[index + 1] : null;

  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-5 pt-12 pb-8 sm:pt-16">
          <Link href="/features" className="text-sm font-medium text-stone-500 hover:text-stone-900">
            ← All features
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Feature {index + 1} of {FEATURES.length}
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{feature.title}</h1>
          <p className="mt-3 text-lg font-medium text-amber-800">{feature.tagline}</p>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{feature.intro}</p>
        </section>

        <section className="mx-auto w-full max-w-3xl px-5 pb-10">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">What it is</h2>
            <p className="mt-3 leading-relaxed text-stone-700">{feature.whatItIs}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">How it works</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-stone-700">
              {feature.howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold">Who sees it</h2>
            <p className="mt-3 leading-relaxed text-stone-700">{feature.whoSeesIt}</p>
          </div>

          <div className="mt-6 rounded-2xl bg-amber-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold">Try it</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {feature.tryIt.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full bg-stone-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        <nav
          aria-label="More features"
          className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-5 pb-16 sm:flex-row sm:justify-between"
        >
          {prev ? (
            <Link
              href={`/features/${prev.slug}`}
              className="rounded-full border border-stone-300 bg-white px-6 py-3 text-center text-sm font-semibold text-stone-900 transition hover:border-stone-900"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/features/${next.slug}`}
              className="rounded-full border border-stone-300 bg-white px-6 py-3 text-center text-sm font-semibold text-stone-900 transition hover:border-stone-900"
            >
              {next.title} →
            </Link>
          ) : (
            <Link
              href="/how-it-works"
              className="rounded-full bg-stone-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              How it works →
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
