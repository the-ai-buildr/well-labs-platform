import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database.types";

import { getSupabasePublicEnv, isSupabaseConfigured } from "./env";

/**
 * Refreshes the Supabase auth session and syncs the refreshed cookies onto
 * both the request (for downstream Server Components) and the response (for
 * the browser).
 *
 * This is an optimistic layer only. Authorization is enforced in the DAL
 * (`src/server/dal`) and by RLS in Postgres.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Let the app keep running locally until `vercel env pull` has been run.
  if (process.env.NODE_ENV !== "production" && !isSupabaseConfigured()) {
    return response;
  }

  const { url, publishableKey } = getSupabasePublicEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        // Prevents CDNs from caching a response that carries auth cookies.
        Object.entries(headers).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  // Don't put code between client creation and getClaims(): this call is what
  // triggers the token refresh.
  await supabase.auth.getClaims();

  return response;
}
