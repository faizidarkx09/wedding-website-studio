import Link from "next/link";
import SiteNav, { SiteFooter } from "@/components/SiteNav";
import { listTemplates } from "@/lib/store";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Buy a template on Etsy",
    text: "Pick a design you love in our Etsy shop and check out as usual. Every template is a one-time purchase.",
  },
  {
    step: "2",
    title: "Get your access code",
    text: "We email you a private access code with your order. It unlocks your own copy of the template — nobody else can use it.",
  },
  {
    step: "3",
    title: "Customise it your way",
    text: "Add your names, story, photos, events, venue and dress code. Change colours and fonts, add a password, set your RSVP deadline.",
  },
  {
    step: "4",
    title: "Publish & share",
    text: "Publish your site and share the link — or print the QR code on your invitations so guests land straight on it.",
  },
  {
    step: "5",
    title: "Collect RSVPs",
    text: "Guests reply online, see the countdown and the schedule, and can update their RSVP later with a private link.",
  },
];

const FAQS = [
  {
    q: "What do I get when I buy a template?",
    a: "A complete wedding website for your wedding: your names and story, a countdown, your schedule of events, a photo gallery, a venue page with a map link, a dress-code note, and an RSVP form. You customise the words and photos — the design is done for you.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No. You pay once on Etsy for the template. There is no subscription and no per-guest charge.",
  },
  {
    q: "Can I keep my site private?",
    a: "Yes. You can protect your site with a password from your invitation, so only guests with the password can see it.",
  },
  {
    q: "What happens after my RSVP deadline?",
    a: "The RSVP form closes automatically and guests see a message that RSVPs are closed. Any responses already sent are kept safe — nothing is lost.",
  },
  {
    q: "Can guests change their RSVP?",
    a: "Yes. After replying, each guest gets a private update link. Using it replaces their earlier response instead of creating a duplicate.",
  },
  {
    q: "Can I see an example first?",
    a: "Yes — the demo site below is a full example built on The Editorial template. It is labelled DEMO and uses sample content, so you can see exactly what your guests would see.",
  },
];

export default async function HomePage() {
  const templates = (await listTemplates()).filter((t) => t.active);

  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Wedding Website Studio
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">
            A beautiful wedding website, without the fuss
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            Buy a template on Etsy, make it yours in minutes, and share one link with everyone
            you love. Countdown, schedule, gallery, venue and RSVPs — all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/templates"
              className="rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Browse templates
            </Link>
            <Link
              href="/w/sarah-and-james"
              className="rounded-full border border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 transition hover:border-stone-900"
            >
              View the demo site
            </Link>
          </div>
          <p className="mt-4 text-xs text-stone-500">
            One-time purchase on Etsy · No monthly fee · Guests RSVP online
          </p>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-stone-600">
              From Etsy purchase to published website in five simple steps.
            </p>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {HOW_IT_WORKS.map((item) => (
                <li
                  key={item.step}
                  className="rounded-2xl border border-stone-200 bg-[#fdfbf7] p-6"
                >
                  <p className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-base font-bold text-white">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-center">
              <Link
                href="/how-it-works"
                className="inline-block rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                See how it works, step by step →
              </Link>
            </p>
          </div>
        </section>

        {/* Template gallery */}
        <section id="templates" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Templates</h2>
          <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-stone-600">
            Five designs, each with its own layout, type and mood. Pick the one that feels like you.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Demo */}
        <section className="bg-stone-900 py-16 text-white sm:py-20">
          <div className="mx-auto w-full max-w-4xl px-5 text-center">
            <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-bold tracking-widest text-stone-900 uppercase">
              Demo
            </span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">See a real example</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone-300">
              Sarah &amp; James&apos;s site is a full demo built on The Editorial template — the
              countdown, the events, the gallery and the RSVP form, exactly as your guests
              would see them. It uses sample content only.
            </p>
            <Link
              href="/w/sarah-and-james"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-stone-900 transition hover:bg-stone-200"
            >
              Visit the demo site →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Questions, answered</h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="rounded-2xl border border-stone-200 bg-white px-6 py-4"
              >
                <summary className="cursor-pointer text-base font-semibold text-stone-900">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-amber-50 p-8 text-center">
            <h3 className="text-xl font-bold">Already bought a template?</h3>
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
