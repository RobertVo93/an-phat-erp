import { NextRequest, NextResponse } from "next/server";
import { AUTH_REQUEST_HEADER, AUTH_REQUEST_HEADER_VALUE } from "@/lib/auth/auth-request";

export function getPublicOrigin(req: NextRequest): string {
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    return `${forwardedProto || req.nextUrl.protocol.replace(/:$/u, "")}://${forwardedHost}`;
  }

  return req.nextUrl.origin;
}

// Guard for login, refresh and logout only (ecom calls forgot/reset-password without it).
// Blocks login CSRF, forced logout, and cross-site posts whose 401 would clear the session cookies.
export function getAuthRequestGuardError(req: NextRequest): NextResponse | null {
  const fetchSite = req.headers.get("sec-fetch-site");
  const marker = req.headers.get(AUTH_REQUEST_HEADER);
  if ((fetchSite && fetchSite !== "same-origin") || marker !== AUTH_REQUEST_HEADER_VALUE) {
    console.warn("[auth-guard] Blocked auth request", {
      path: req.nextUrl.pathname,
      secFetchSite: fetchSite,
      hasAuthHeader: Boolean(marker),
    });
    return NextResponse.json(
      { error: "Forbidden", code: "cross_site" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }
  return null;
}
