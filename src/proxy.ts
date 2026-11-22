// Proxy (Next 16 middleware convention) — first-pass gate only (edge runtime, no node:crypto here).
// It checks cookie PRESENCE + payload expiry only. Full HMAC verification
// with verifySession() happens in every admin page and API route server-side,
// so a forged cookie that passes this format check is still rejected there.
import { NextRequest, NextResponse } from "next/server";

/** True when the token looks like `base64url(payload).sig` and its `exp`
 *  (decoded from the payload, unverified) is still in the future. */
function cookieLooksValid(token: string | undefined): boolean {
  if (!token) return false;
  const [body] = token.split(".");
  if (!body) return false;
  try {
    const normalized = body.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin itself is the login form — everything below it needs an admin cookie.
  if (pathname.startsWith("/admin/")) {
    if (!cookieLooksValid(request.cookies.get("wws_admin")?.value)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Customer area needs a customer cookie; full verification is server-side.
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/editor" || pathname.startsWith("/editor/")) {
    if (!cookieLooksValid(request.cookies.get("wws_customer")?.value)) {
      return NextResponse.redirect(new URL("/activate", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/editor/:path*"],
};
