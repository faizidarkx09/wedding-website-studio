"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper for public site sections.
 *
 * Sections start slightly faded and lowered, and ease into place the
 * first time they scroll into view (IntersectionObserver, one shot).
 * Restrained by design: 500ms, no bounce. Reduced motion: content is
 * shown immediately with no transition (handled here and in CSS).
 *
 * The hidden state is applied only once JS has run (jsReady): the
 * server-rendered markup — and any no-JS render — has no `.reveal`
 * class, so content is never stuck invisible with JS disabled.
 */
interface RevealProps {
  children: ReactNode;
}

export default function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [jsReady, setJsReady] = useState(false);

  useEffect(() => {
    setJsReady(true);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={jsReady ? `reveal ${visible ? "reveal-visible" : ""}` : undefined}>
      {children}
    </div>
  );
}
