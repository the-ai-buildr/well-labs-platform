import "server-only";

import { getToken } from "@vercel/connect";

const MANAGEMENT_API = "https://api.supabase.com/v1";

function connector() {
  const uid = process.env.SUPABASE_CONNECT_CONNECTOR;
  if (!uid) {
    throw new Error(
      "SUPABASE_CONNECT_CONNECTOR is not set — run `vercel connect create` for the Supabase OAuth app first",
    );
  }
  return uid;
}

/**
 * OAuth token for the Supabase Management API / MCP server, issued by Vercel
 * Connect. This is platform-level access (projects, branches, SQL, logs) —
 * NOT for app data reads, which go through `src/server/dal` + RLS.
 *
 * Pass `userId` to act on behalf of an end user who has granted consent;
 * omit it to act as the app itself.
 */
export function getSupabaseManagementToken(userId?: string) {
  return getToken(connector(), {
    subject: userId ? { type: "user", id: userId } : { type: "app" },
  });
}

/** Thin fetch wrapper for https://api.supabase.com/v1. */
export async function supabaseManagementFetch<T>(
  path: string,
  init: RequestInit & { userId?: string } = {},
): Promise<T> {
  const { userId, headers, ...rest } = init;
  const token = await getSupabaseManagementToken(userId);

  const res = await fetch(`${MANAGEMENT_API}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Supabase Management API ${res.status}: ${await res.text()}`,
    );
  }
  return res.json() as Promise<T>;
}
