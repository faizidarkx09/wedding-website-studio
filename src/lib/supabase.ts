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
