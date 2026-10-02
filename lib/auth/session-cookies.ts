import { NextRequest, NextResponse } from "next/server";
import { getAdminBasePath } from "@/constants/nav";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/jwt";
import { getSessionConfig } from "@/lib/auth/session-config";
import type { IAuthSessionResponse, ISessionUser, IUser } from "@/types";

export const REFRESH_TOKEN_COOKIE = "admin_refresh_token";
// TODO: stop clearing the pre-refresh-token cookie 30+ days after release.
export const LEGACY_ACCESS_TOKEN_COOKIE = "token";

const REFRESH_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
export const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function getTrimmedBasePath(): string {
  return getAdminBasePath().replace(/\/+$/u, "");
}

// The browser matches Path against the URL it sees (/admin/...), not the one ecom rewrites to.
export function getAccessCookiePath(): string {
  return getTrimmedBasePath() || "/";
}

export function getRefreshCookiePath(): string {
  return `${getTrimmedBasePath()}/api/auth`;
}

export function isSecureRequest(req: NextRequest): boolean {
  const { cookieSecure } = getSessionConfig();
  if (cookieSecure === "true") return true;
  if (cookieSecure === "false") return false;

  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwardedProto) return forwardedProto === "https";
  return req.nextUrl.protocol === "https:";
}

function cookieOptions(req: NextRequest, path: string, maxAge: number) {
  return { httpOnly: true, sameSite: "strict" as const, secure: isSecureRequest(req), path, maxAge };
}

export function setAccessTokenCookie(res: NextResponse, req: NextRequest, token: string, maxAgeSeconds: number): void {
  res.cookies.set(ACCESS_TOKEN_COOKIE, token, cookieOptions(req, getAccessCookiePath(), maxAgeSeconds));
}

export function setRefreshTokenCookie(res: NextResponse, req: NextRequest, token: string, expiresAt: Date): void {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  res.cookies.set(REFRESH_TOKEN_COOKIE, token, cookieOptions(req, getRefreshCookiePath(), maxAge));
}

export function clearLegacyAccessCookie(res: NextResponse): void {
  res.cookies.set(LEGACY_ACCESS_TOKEN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function clearSessionCookies(res: NextResponse, req: NextRequest): void {
  res.cookies.set(ACCESS_TOKEN_COOKIE, "", cookieOptions(req, getAccessCookiePath(), 0));
  res.cookies.set(REFRESH_TOKEN_COOKIE, "", cookieOptions(req, getRefreshCookiePath(), 0));
  clearLegacyAccessCookie(res);
}

export function getRefreshTokenFromRequest(req: NextRequest): string | null {
  const value = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  return value && REFRESH_TOKEN_PATTERN.test(value) ? value : null;
}

export function toSessionUser(user: IUser): ISessionUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    active: user.active,
    lastLogin: user.lastLogin,
  };
}

export function buildSessionResponse(
  user: IUser,
  accessExpiresIn: number,
  refreshExpiresAt: Date,
  rotated?: boolean
): NextResponse<IAuthSessionResponse> {
  const refreshTokenExpiresIn = Math.max(0, Math.floor((refreshExpiresAt.getTime() - Date.now()) / 1000));
  return NextResponse.json<IAuthSessionResponse>(
    {
      success: true,
      user: toSessionUser(user),
      session: { accessTokenExpiresIn: accessExpiresIn, refreshTokenExpiresIn, ...(rotated ? { rotated: true } : {}) },
    },
    { headers: NO_STORE_HEADERS }
  );
}
