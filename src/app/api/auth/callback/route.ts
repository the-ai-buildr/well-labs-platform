import { type NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * PKCE callback for OAuth sign-in, magic links and email confirmation.
 * Set this URL as a Redirect URL in Supabase → Authentication → URL Configuration.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // Only allow same-origin relative redirects (`//host` and `/\host` are external).
  const safeNext = /^\/(?![\/\\])/.test(next) ? next : "/";

  // Behind a proxy (e.g. Vercel with a custom domain) `origin` can be the
  // internal host rather than the one the user visited.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const baseUrl =
    process.env.NODE_ENV !== "development" && forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${baseUrl}${safeNext}`);
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback`);
}
