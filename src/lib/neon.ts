// Minimal Neon client — SQL over HTTP, no extra dependency.
// The app talks to the ClipForge Neon Postgres database through Neon's
// /sql endpoint (POST https://<host>/sql, header Neon-Connection-String).
// Direct TCP to Neon times out from this environment, so the HTTP endpoint
// is the only route; it also means no persistent connection pool — every
// query is one HTTPS call. Free-tier compute may be suspended after idle;
// the first query after idle can take 5-10s to wake, so the timeout is
// generous (60s).
//
// DATABASE_URL is server-side only (never NEXT_PUBLIC_*). It is read at
// call time so the store switch in src/lib/store.ts reacts to the env
// without a restart in long-lived dev servers.

export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function neonConfig(): { host: string; connectionString: string } | null {
  const cs = process.env.DATABASE_URL;
  if (!cs) return null;
  const m = /^postgres(?:ql)?:\/\/[^@]+@([^:/]+)(?::\d+)?\/[^?]+/.exec(cs);
  if (!m) return null;
  return { host: m[1], connectionString: cs };
}

/**
 * Run one SQL statement against Neon and return its rows (objects keyed
 * by column name). Parameters use $1, $2 … placeholders. Throws a plain
 * Error with the HTTP status and the server's message on failure — the
 * connection string itself is never included in the error.
 */
export async function neonQuery<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  const cfg = neonConfig();
  if (!cfg) {
    throw new Error("DATABASE_URL is not set — Neon is not configured.");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`https://${cfg.host}/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": cfg.connectionString,
      },
      body: JSON.stringify({ query, params }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Neon query failed (HTTP ${res.status}): ${text.slice(0, 300)}`,
      );
    }
    const json = (await res.json()) as { rows?: unknown[] };
    return (json.rows ?? []) as T[];
  } finally {
    clearTimeout(timer);
  }
}
