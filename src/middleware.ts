import { NextRequest, NextResponse } from "next/server";

/**
 * Simple password protection for the entire app.
 * Set AUTH_PASSWORD env var to enable. Leave empty to disable.
 * Webhook API is excluded (uses its own API key auth).
 */
export function middleware(req: NextRequest) {
  const password = process.env.AUTH_PASSWORD;
  if (!password) return NextResponse.next();

  // Webhook API uses its own auth
  if (req.nextUrl.pathname.startsWith("/api/webhook/")) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = req.cookies.get("workmate_auth");
  if (authCookie?.value === password) {
    return NextResponse.next();
  }

  // Login page bypass
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname === "/api/auth") {
    return NextResponse.next();
  }

  // Redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
