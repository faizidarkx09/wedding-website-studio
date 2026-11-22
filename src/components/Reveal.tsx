"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper for public site sections.
 *
 * Sections start slightly faded and lowered, and ease into place the
 * first time they scroll into view (IntersectionObserver, one shot).
 * Restrained by design: 500ms, no bounce. Reduced motion: content is
 * shown immediately with no transition (handled here and in CSS).
 */
interface RevealProps {
  children: ReactNode;
  /** Extra stagger delay in ms (kept small; 0 by default). */
  delay?: number;
}

export default function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? "reveal-visible" : ""}`}
    >
      {children}
    </div>
  );
}
