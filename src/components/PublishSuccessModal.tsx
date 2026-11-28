"use client";

import { useEffect, useRef, useState } from "react";
import InvitationCard from "@/components/InvitationCard";
import { downloadInvitationCard } from "@/lib/invitation-card-download";
import type { WeddingSite } from "@/lib/types";

interface PublishSuccessModalProps {
  open: boolean;
  site: WeddingSite;
  onClose: () => void;
}

const FALLBACK_PALETTE = { bg: "#FFFFFF", ink: "#1C1917", accent: "#292524", accentSoft: "#F5F5F4" };

export default function PublishSuccessModal({ open, site, onClose }: PublishSuccessModalProps) {
  const [guestUrl, setGuestUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardBusy, setCardBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const palette = site.templateSnapshot?.palette ?? FALLBACK_PALETTE;
  const qrBase = `/api/qr?slug=${encodeURIComponent(site.slug)}&theme=${encodeURIComponent(site.templateId)}`;

  // The absolute guest URL is built client-side only — never rendered on the server.
  useEffect(() => {
    if (open) setGuestUrl(`${window.location.origin}/w/${site.slug}`);
  }, [open, site.slug]);

  // Esc closes the modal (listener attached only while it is open).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Clear the copy timer when the modal unmounts.
  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function copyGuestLink() {
    const url = guestUrl || `/w/${site.slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback for browsers without async clipboard access.
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        return;
      }
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadCard() {
    if (!cardRef.current) return;
    setCardError("");
    setCardBusy(true);
    try {
      await downloadInvitationCard(cardRef.current, `invitation-${site.slug}.png`);
    } catch {
      setCardError("Could not download the invitation card. Please try again.");
    } finally {
      setCardBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your website is live"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
        style={{ backgroundColor: palette.bg, color: palette.ink }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Your website is live!</h2>
            <p className="mt-1 text-sm opacity-80">
              Share the link below with your guests, or send them the QR code and invitation card.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-stone-300 px-3 py-1 text-sm font-medium hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          {/* Guest link */}
          <section aria-label="Guest link">
            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">Guest link</h3>
            <div className="mt-2 flex min-w-0 items-stretch gap-2">
              <input
                type="text"
                readOnly
                value={guestUrl || `/w/${site.slug}`}
                aria-label="Guest website link"
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800"
              />
              <button
                type="button"
                onClick={() => void copyGuestLink()}
                className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: palette.accent }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </section>

          {/* Themed QR code */}
          <section aria-label="QR code">
            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">QR code</h3>
            <div className="mt-2 flex flex-col items-center gap-3 rounded-xl p-4" style={{ backgroundColor: palette.accentSoft }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${qrBase}&format=png`}
                alt={`QR code linking to ${site.slug} wedding website`}
                width={192}
                height={192}
                className="h-48 w-48 rounded-lg bg-white"
              />
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
                <a href={`${qrBase}&format=png`} download={`qr-${site.slug}.png`} className="underline">
                  Download PNG
                </a>
                <a href={`${qrBase}&format=svg`} download={`qr-${site.slug}.svg`} className="underline">
                  Download SVG
                </a>
              </div>
            </div>
          </section>

          {/* Invitation card */}
          <section aria-label="Invitation card">
            <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">Invitation card</h3>
            <div ref={cardRef} className="mt-2 min-w-0 overflow-hidden rounded-xl">
              <InvitationCard site={site} />
            </div>
            <button
              type="button"
              onClick={() => void handleDownloadCard()}
              disabled={cardBusy}
              className="mt-3 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 disabled:opacity-50"
            >
              {cardBusy ? "Preparing…" : "Download invitation card (PNG)"}
            </button>
            {cardError ? (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {cardError}
              </p>
            ) : null}
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-stone-200 pt-4 sm:flex-row">
            <a
              href={`/w/${site.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-center text-sm font-medium text-white"
              style={{ backgroundColor: palette.accent }}
            >
              View website
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
