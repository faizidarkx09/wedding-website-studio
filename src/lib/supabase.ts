// Supabase integration boundary (PRD §7).
// Real PostgREST client (fetch-based, no extra dependency) + honest
// connection status. When NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are absent
// the app runs in local mode on the in-memory store
// (src/lib/store.ts) and never claims a live connection.

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isEtsyConfigured(): boolean {
  return Boolean(process.env.ETSY_API_KEY && process.env.ETSY_SHOP_ID);
}

export function supabaseStatus(): {
  supabase: boolean;
  etsy: boolean;
} {
  return {
    supabase: isSupabaseConfigured(),
    etsy: isEtsyConfigured(),
  };
}

interface SbOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  filter?: string;
}

/** Minimal PostgREST call. Returns null on any failure (caller falls back
 *  to the local store and logs the failure — never a fake success). */
export async function sbCall<T>(table: string, opts: SbOptions = {}): Promise<T | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const qs = opts.filter ? `?${opts.filter}` : "";
    const res = await fetch(`${url}/rest/v1/${table}${qs}`, {
      method: opts.method || "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) {
      console.error(`Supabase ${table} ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Supabase call failed", err);
    return null;
  }
}
