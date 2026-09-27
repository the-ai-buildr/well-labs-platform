import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

import { getSupabasePublicEnv } from "./env";

/**
 * Privileged client that BYPASSES RLS. Only use for trusted server work that
 * has no end-user context (webhooks, cron jobs, back-office tasks), and always
 * scope queries explicitly. Never expose results without an authorization
 * check of your own.
 */
export function createAdminSupabaseClient() {
  const { url } = getSupabasePublicEnv();
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error(
      "Missing environment variable SUPABASE_SECRET_KEY. Run `vercel env pull` after connecting Supabase to this project.",
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
