import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

import { getSupabasePublicEnv } from "./env";

/**
 * Supabase client for Client Components. Uses the publishable key, so every
 * query is subject to RLS as the signed-in user. Prefer fetching on the server
 * through the DAL; use this for realtime subscriptions and browser-only auth
 * flows.
 */
export function createBrowserSupabaseClient() {
  const { url, publishableKey } = getSupabasePublicEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
