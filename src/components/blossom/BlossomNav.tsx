// BLOSSOM & OUD navigation — transparent over the hero (ivory text), switching
// to ivory + backdrop blur once the page scrolls. Mobile gets a
// full-screen overlay with staggered links. Links only point at sections
// that will actually render on this site.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BLOSSOM, coupleNames, initials, rsvpHref, willRenderSection } from "./tokens";
import MusicToggle from "./MusicToggle";

const NAV_ITEMS: { key: string; label: string; href: string }[] = [
  { key: "story", label: "Our Story", href: "#story" },
  { key: "events", label: "Events", href: "#events" },
  { key: "venue", label: "Venue", href: "#venue" },
  { key: "dress-code", label: "Dress Code", href: "#dress-code" },
  { key: "gallery", label: "Gallery", href: "#gallery" },
  { key: "rsvp", label: "RSVP", href: "#rsvp" },
];

export default function BlossomNav({ site }: { site: WeddingSite }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const items = NAV_ITEMS.filter((item) => willRenderSection(site, item.key));
  const dark = !scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b bg-[#F8F5EF]/95 backdrop-blur-sm" : "border-b border-transparent bg-transparent"
        }`}
        style={scrolled ? { borderColor: BLOSSOM.blush } : undefined}
      >
        <nav
          aria-label="Wedding website"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
        >
          <a
            href="#top"
            className={`flex min-h-11 min-w-11 items-center gap-2.5 text-sm font-semibold tracking-[0.2em] uppercase ${
              dark ? "text-white" : ""
            }`}
            style={dark ? undefined : { color: BLOSSOM.oud }}
            aria-label={`${coupleNames(site)} — back to top`}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold"
              style={
                dark
                  ? { borderColor: "rgba(255,255,255,0.6)", color: "#FFFFFF" }
                  : { borderColor: BLOSSOM.gold, color: BLOSSOM.gold }
              }
            >
              {initials(site)}
            </span>
            <span className="hidden sm:inline">Blossom & Oud</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`rounded-full px-3.5 py-2.5 text-[13px] font-semibold tracking-[0.12em] uppercase transition hover:opacity-70 ${
                  dark ? "text-white" : ""
                }`}
                style={dark ? undefined : { color: BLOSSOM.oud }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <MusicToggle site={site} dark={dark} />
            <Link
              href={rsvpHref(site)}
              className={`hidden min-h-11 items-center rounded-full px-5 text-[13px] font-bold tracking-[0.12em] uppercase transition hover:opacity-85 sm:inline-flex ${
                dark ? "bg-white text-[#3E2A20]" : "text-white"
              }`}
              style={dark ? undefined : { backgroundColor: BLOSSOM.oud }}
            >
              RSVP
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden ${
                dark ? "border-white/50 text-white" : ""
              }`}
              style={
                dark
                  ? { outlineColor: "#FFFFFF" }
                  : { color: BLOSSOM.oud, borderColor: BLOSSOM.rose, outlineColor: BLOSSOM.gold }
              }
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col px-6 py-5"
            style={{ backgroundColor: BLOSSOM.ivory, color: BLOSSOM.oud }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold" style={{ borderColor: BLOSSOM.gold, color: BLOSSOM.gold }} aria-hidden="true">
                {initials(site)}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: BLOSSOM.rose, color: BLOSSOM.oud, outlineColor: BLOSSOM.gold }}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile menu" className="flex flex-1 flex-col items-center justify-center gap-2">
              {items.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-blossom py-3 text-4xl font-medium"
                  style={{ color: BLOSSOM.oud }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.08 + i * 0.07 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.08 + items.length * 0.07 }}
                className="mt-6"
              >
                <Link
                  href={rsvpHref(site)}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center rounded-full px-8 text-sm font-bold tracking-[0.12em] text-white uppercase"
                  style={{ backgroundColor: BLOSSOM.oud }}
                >
                  RSVP
                </Link>
              </motion.div>
            </nav>
            <p className="text-center text-xs tracking-[0.25em] uppercase opacity-60">
              {coupleNames(site)}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
