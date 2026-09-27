/**
 * Resolves Supabase env vars. Supports both the current key names
 * (publishable / secret) and the legacy ones (anon / service_role) that the
 * Vercel Marketplace integration may still inject.
 *
 * `NEXT_PUBLIC_*` vars must be read with literal `process.env.X` access so
 * Next.js can inline them into the browser bundle.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Run \`vercel env pull\` after connecting Supabase to this project.`,
    );
  }
  return value;
}

export function getSupabasePublicEnv() {
  return {
    url: required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    publishableKey: required(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}

/** True once `vercel env pull` has brought in the Supabase project URL + key. */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}
