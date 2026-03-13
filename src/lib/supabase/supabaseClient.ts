import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // These console errors will show on both server and client,
  // making it obvious when env vars are missing or misconfigured.
  // eslint-disable-next-line no-console
  console.error(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase is NOT connected."
  );
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "[Supabase] Environment variables not set. Supabase is NOT connected."
    );
  }

  if (typeof window === "undefined") {
    // Server-side: create a new client per invocation (stateless, safe for edge/server).
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // Client-side: reuse a singleton to avoid re-creating the client on every render.
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

