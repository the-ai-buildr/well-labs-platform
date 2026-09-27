import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Data Access Layer: every server-side read goes through `src/server/dal/*`
 * so authorization lives in one place. Wrapped in `cache` so multiple calls
 * in a single render share one round trip.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

/** Use at the top of any page/action that needs a signed-in user. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
