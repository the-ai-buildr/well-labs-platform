import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../drizzle/schema";

/**
 * Drizzle over DATABASE_URL connects as the `postgres` role, which BYPASSES
 * Row Level Security — same trust level as `createAdminSupabaseClient`.
 * Use it for trusted server work (reports, jobs, webhooks) and always scope
 * user data explicitly. User-facing reads go through `src/server/dal`.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — run `vercel env pull .env.local`",
    );
  }
  // Supabase's transaction pooler (port 6543) doesn't support prepared statements.
  return drizzle(postgres(url, { prepare: false }), { schema });
}

// Reuse one pool per server instance (and across dev hot reloads).
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof createDb>;
};

export function getDb() {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}
