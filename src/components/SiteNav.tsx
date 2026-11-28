"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/admin", label: "Admin" },
  { href: "/activate", label: "Activate" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#fdfbf7]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-5">
        <Link href="/" className="shrink-0 whitespace-nowrap text-base font-bold tracking-tight text-stone-900 sm:text-lg">
          Wedding Website <span className="text-amber-700">Studio</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-700 transition hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/templates"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            Browse templates
          </Link>
        </nav>
        <button
          type="button"
          className="shrink-0 whitespace-nowrap rounded-lg border border-stone-300 px-2.5 py-2 text-sm font-semibold text-stone-800 sm:px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close ✕" : "Menu ☰"}
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-stone-200 bg-[#fdfbf7] px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-stone-800 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/templates"
                className="mt-2 block rounded-full bg-stone-900 px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Browse templates
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-stone-900">
            Wedding Website <span className="text-amber-700">Studio</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-600">
            Beautiful wedding websites with RSVP, countdown and gallery — bought once on Etsy,
            customised by you, published for your guests.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-stone-700 hover:text-stone-950">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Good to know</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-600">
            <li>One purchase, one website — yours to keep.</li>
            <li>Every template has its own access code — activating it creates your own private site.</li>
            <li>Guests RSVP with a link they can update later.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Wedding Website Studio. Made for couples, not for fuss.
      </div>
    </footer>
  );
}
