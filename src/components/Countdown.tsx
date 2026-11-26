"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  /** ISO datetime of the wedding. */
  date: string;
  /** IANA timezone the wedding date is displayed in. Defaults to UTC. */
  timezone?: string;
  style?: "classic" | "minimal" | "bold";
  postMessage?: string;
  /** Compact sizing for tight cards (e.g. the dashboard overview). */
  size?: "default" | "compact";
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diffParts(targetMs: number, nowMs: number): Parts {
  const total = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
    done: total <= 0,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Countdown({ date, timezone = "UTC", style = "classic", postMessage, size = "default" }: CountdownProps) {
  const compact = size === "compact";
  const targetMs = Date.parse(date);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = diffParts(targetMs, now);

  // The countdown length is absolute (target instant minus now); the
  // timezone governs how the wedding date itself is displayed to guests.
  let formattedDate = date;
  try {
    formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(targetMs));
  } catch {
    formattedDate = new Date(targetMs).toLocaleString("en-US");
  }

  if (parts.done) {
    return (
      <div className="text-center" role="timer" aria-label="Countdown finished">
        <p className="text-lg font-medium">
          {postMessage ?? "Just married! Thank you for celebrating with us."}
        </p>
        <p className={`mt-1 opacity-70 ${compact ? "text-xs" : "text-sm"}`}>{formattedDate}</p>
      </div>
    );
  }

  const units: Array<{ value: number; label: string }> = [
    { value: parts.days, label: "Days" },
    { value: parts.hours, label: "Hours" },
    { value: parts.minutes, label: "Minutes" },
    { value: parts.seconds, label: "Seconds" },
  ];

  if (style === "minimal") {
    return (
      <div className="text-center" role="timer" aria-label="Countdown to the wedding">
        <p className={`${compact ? "text-lg" : "text-2xl sm:text-3xl"} font-light tracking-wide tabular-nums`} aria-live="off">
          {parts.days}d : {pad(parts.hours)}h : {pad(parts.minutes)}m : {pad(parts.seconds)}s
        </p>
        <p className={`mt-2 opacity-70 ${compact ? "text-xs" : "text-sm"}`}>{formattedDate}</p>
      </div>
    );
  }

  if (style === "bold") {
    return (
      <div className="text-center" role="timer" aria-label="Countdown to the wedding">
        <div className={`flex items-stretch justify-center ${compact ? "gap-1.5" : "gap-2 sm:gap-4"}`}>
          {units.map((u) => (
            <div
              key={u.label}
              className={`rounded-none border-2 border-current ${compact ? "min-w-12 px-2 py-2" : "min-w-16 px-3 py-3 sm:min-w-24 sm:px-4"}`}
            >
              <div className={`${compact ? "text-2xl" : "text-4xl sm:text-6xl"} font-black tabular-nums`}>
                {u.label === "Days" ? u.value : pad(u.value)}
              </div>
              <div className={`mt-1 font-bold uppercase tracking-[0.25em] ${compact ? "text-[10px]" : "text-[11px] sm:text-xs"}`}>
                {u.label}
              </div>
            </div>
          ))}
        </div>
        <p className={`mt-3 font-semibold uppercase tracking-widest opacity-80 ${compact ? "text-xs" : "text-sm"}`}>
          {formattedDate}
        </p>
      </div>
    );
  }

  // classic
  return (
    <div className="text-center" role="timer" aria-label="Countdown to the wedding">
      <div className={`flex flex-wrap items-start justify-center ${compact ? "gap-1.5" : "gap-3 sm:gap-6"}`}>
        {units.map((u) => (
          <div key={u.label} className={compact ? "min-w-11" : "min-w-16 sm:min-w-20"}>
            <div className={`rounded-lg border tabular-nums ${compact ? "px-1 py-2 text-xl" : "px-2 py-3 text-3xl sm:text-5xl"}`}>
              {u.label === "Days" ? u.value : pad(u.value)}
            </div>
            <div className={`mt-2 uppercase tracking-[0.2em] opacity-70 ${compact ? "text-[10px]" : "text-[11px] sm:text-xs"}`}>
              {u.label}
            </div>
          </div>
        ))}
      </div>
      <p className={`italic opacity-75 ${compact ? "mt-2 text-xs" : "mt-4 text-sm"}`}>{formattedDate}</p>
    </div>
  );
}
