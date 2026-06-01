/**
 * DIAGNOSTIC ROUTE — /api/debug-checkout
 * Tests the full checkout pipeline and surfaces exactly what's failing.
 * REMOVE BEFORE PRODUCTION DEPLOYMENT.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check NextAuth session
  const session = await getServerSession(authOptions);
  results.session_exists = !!session;
  results.session_user_email = (session?.user?.email) ?? null;
  // @ts-ignore
  results.access_token_present = !!(session?.accessToken);
  // @ts-ignore
  results.access_token_preview = session?.accessToken
    // @ts-ignore
    ? String(session.accessToken).substring(0, 40) + "..."
    : null;

  // 2. Check backend reachability
  const wpBase = process.env.NEXT_PUBLIC_WP_URL || "https://api.tracknit.com";
  try {
    const ping = await fetch(`${wpBase}/wp-json/tracknit/v1/taxonomies`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    results.backend_reachable = ping.ok;
    results.backend_status = ping.status;
    results.backend_url = `${wpBase}/wp-json/tracknit/v1/taxonomies`;
  } catch (err: unknown) {
    results.backend_reachable = false;
    results.backend_error = String(err);
    results.backend_url = wpBase;
  }

  // 3. Test checkout endpoint (without auth — expect 401, NOT 404)
  try {
    const checkoutProbe = await fetch(
      `${wpBase}/wp-json/tracknit/v1/checkout/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_tier: "basic",
          billing_period: "monthly",
          country_code: "US",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );
    results.checkout_endpoint_exists = checkoutProbe.status !== 404;
    results.checkout_no_auth_status = checkoutProbe.status; // Should be 401
    const body = await checkoutProbe.text();
    results.checkout_no_auth_body = body.substring(0, 300);
  } catch (err: unknown) {
    results.checkout_endpoint_exists = false;
    results.checkout_endpoint_error = String(err);
  }

  // 4. Test checkout endpoint WITH auth token (if we have one)
  // @ts-ignore
  const token = session?.accessToken;
  if (token) {
    try {
      const checkoutAuth = await fetch(
        `${wpBase}/wp-json/tracknit/v1/checkout/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_tier: "basic",
            billing_period: "monthly",
            country_code: "US",
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        }
      );
      results.checkout_with_auth_status = checkoutAuth.status;
      const body = await checkoutAuth.text();
      results.checkout_with_auth_body = body.substring(0, 500);
    } catch (err: unknown) {
      results.checkout_with_auth_error = String(err);
    }
  } else {
    results.checkout_with_auth_status = "SKIPPED — no access token in session";
  }

  return NextResponse.json(results, { status: 200 });
}
