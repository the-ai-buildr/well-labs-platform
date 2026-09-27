import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load .env* exactly like Next does, including `${VAR}` expansion.
loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set — run `vercel env pull .env.local`");
}

/**
 * drizzle-kit introspection uses pg_get_constraintdef; on Supabase's transaction
 * pooler (port 6543) that can return null and crash pull with `.replace` on
 * undefined. Prefer session pooler (5432) or direct DB for kit only.
 */
function databaseUrlForDrizzleKit(): string {
  const explicit =
    process.env.DATABASE_URL_DRIZZLE ?? process.env.DATABASE_URL_DRIZZLE_KIT;
  if (explicit) return explicit;

  const url = databaseUrl!;
  try {
    const parsed = new URL(url.replace(/^postgresql:/, "http:"));
    if (
      parsed.port === "6543" &&
      parsed.hostname.includes("pooler.supabase.com")
    ) {
      parsed.port = "5432";
      return `postgresql:${parsed.href.slice("http:".length)}`;
    }
  } catch {
    /* use DATABASE_URL as-is */
  }
  return url;
}

/**
 * Drizzle is used for Studio (`pnpm db:studio`) and typed server queries.
 * `supabase/migrations` stays the source of truth for schema changes: after a
 * migration, update `drizzle/schema.ts` to match. (`pnpm db:pull` emits a
 * broken `users` reference for auth.users with schemaFilter ["public"], so
 * reconcile its output by hand rather than committing it as-is.)
 * Don't use `drizzle-kit push`/`migrate` — they'd bypass Supabase's history.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  schemaFilter: ["public"],
  dbCredentials: { url: databaseUrlForDrizzleKit() },
});
