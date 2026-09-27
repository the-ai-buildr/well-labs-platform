import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load .env* exactly like Next does, including `${VAR}` expansion.
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — run `vercel env pull .env.local`");
}

/**
 * Drizzle is used for Studio (`pnpm db:studio`) and typed server queries.
 * `supabase/migrations` stays the source of truth for schema changes: after a
 * migration, run `pnpm db:pull` to refresh `drizzle/schema.ts`.
 * Don't use `drizzle-kit push`/`migrate` — they'd bypass Supabase's history.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  schemaFilter: ["public"],
  dbCredentials: { url: process.env.DATABASE_URL },
});
