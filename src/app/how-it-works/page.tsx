import Link from "next/link";
import type { Metadata } from "next";
import SiteNav, { SiteFooter } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "How it works — Wedding Website Studio",
  description:
    "From buying a template on Etsy to collecting RSVPs: five steps to your published wedding website.",
};

const STEPS = [
  {
    step: "1",
    title: "Buy a template on Etsy",
    text: "Pick a design you love in our Etsy shop and check out as usual. Every template is a one-time purchase — no monthly fee, no per-guest charge.",
    links: [{ href: "/templates", label: "Browse the templates" }],
  },
  {
    step: "2",
    title: "Get your delivery PDF",
    text: "After purchase you get a delivery PDF with your Etsy order. It has your template link and a private access code — it unlocks your own copy of the template, nobody else can use it, and it can only be used once.",
    links: [{ href: "/activate", label: "Activate an access code" }],
  },
  {
    step: "3",
    title: "Customise it your way",
    text: "Add your names, story, photos, events, venue and dress code. Change colours and fonts, add a guest password, set your RSVP deadline and countdown style.",
    links: [
      { href: "/editor", label: "Open the editor" },
      { href: "/features/design", label: "About the designs" },
    ],
  },
  {
    step: "4",
    title: "Publish & share",
    text: "Publish your site and share the link — or print the QR code on your invitations so guests land straight on it. Your site lives at a short address like /w/your-names.",
    links: [
      { href: "/dashboard", label: "Publish from the dashboard" },
      { href: "/features/qr-code", label: "About the QR code" },
    ],
  },
  {
    step: "5",
    title: "Collect RSVPs",
    text: "Guests reply online, see the countdown and the schedule, and can update their RSVP later with a private link. You watch the guest list grow on your dashboard.",
    links: [
      { href: "/w/sarah-and-james/rsvp", label: "Try the RSVP form" },
      { href: "/features/rsvp", label: "About RSVP" },
      { href: "/features/guest-list", label: "About the guest list" },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#fdfbf7] text-stone-900">
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-5 pt-16 pb-10 text-center sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            How it works
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
            From Etsy purchase to published website in five steps
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
            No design skills, no monthly fee. Each step below links to the real page
            where it happens.
          </p>
        </section>

        <section className="mx-auto w-full max-w-3xl px-5 pb-16">
          <ol className="space-y-6">
            {STEPS.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <p className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-lg font-bold text-white">
                    {item.step}
                  </p>
                  <div>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="mt-2 leading-relaxed text-stone-600">{item.text}</p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      {item.links.map((link) => (
                        <Link
                          key={link.href + link.label}
                          href={link.href}
                          className="rounded-full bg-stone-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-stone-700"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl bg-stone-900 p-8 text-center text-white">
            <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-bold tracking-widest text-stone-900 uppercase">
              Demo
            </span>
            <h2 className="mt-4 text-2xl font-bold">See the finished result first</h2>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-stone-300">
              Sarah &amp; James&apos;s site is a full demo — countdown, events, gallery and
              RSVP form, exactly as your guests would see them.
            </p>
            <Link
              href="/w/sarah-and-james"
              className="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-stone-900 transition hover:bg-stone-200"
            >
              Visit the demo site →
            </Link>
          </div>

          <p className="mt-8 text-center text-sm leading-relaxed text-stone-500">
            Demo mode: this site runs on a built-in demo store, and Supabase and Etsy
            are not connected yet. There is no mail system — delivery is the PDF that
            comes with the Etsy order. To try activation here, use the demo access code{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono">
              WWS-DEMO-2026
            </code>{" "}
            on the activate page.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
