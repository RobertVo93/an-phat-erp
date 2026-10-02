import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { ACCESS_TOKEN_COOKIE, signAccessToken } from "@/lib/auth/jwt";
import {
  NO_STORE_HEADERS,
  buildSessionResponse,
  clearLegacyAccessCookie,
  clearSessionCookies,
  getRefreshTokenFromRequest,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/auth/session-cookies";
import { getAuthRequestGuardError } from "@/lib/utils.request";
import { refreshSessionService } from "@/lib/services/refreshTokenService";
import { RefreshTokenRevokeReason } from "@/types/enums";

function unauthorized(req: NextRequest, code: string, clearCookies: boolean) {
  const res = NextResponse.json({ error: "Unauthorized", code }, { status: 401, headers: NO_STORE_HEADERS });
  if (clearCookies) clearSessionCookies(res, req);
  return res;
}

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh the admin session
 *     description: >
 *       Authenticated by the httpOnly admin_refresh_token cookie (it must work after the access token expired).
 *       Issues a new access token; also rotates the refresh token when it has 7 days or less left.
 *       Requires the X-Admin-Auth: 1 header.
 *     responses:
 *       200:
 *         description: "{ success, user, session: { accessTokenExpiresIn, refreshTokenExpiresIn, rotated? } }"
 *       401:
 *         description: "{ error, code } - the session is over; the client redirects to login"
 *       403:
 *         description: "{ error, code: cross_site } - blocked by the same-origin guard"
 *       500:
 *         description: Transient failure; cookies are left untouched
 */
export async function POST(req: NextRequest) {
  const guardError = getAuthRequestGuardError(req);
  if (guardError) return guardError;

  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) {
    if (req.cookies.get(ACCESS_TOKEN_COOKIE)) {
      console.warn(
        "[api/auth/refresh] Refresh cookie missing while the access cookie is present; check AUTH_COOKIE_SECURE and the base path"
      );
    }
    return unauthorized(req, "missing", true);
  }

  try {
    await ensureDataSource();
    const result = await refreshSessionService(refreshToken);
    if (!result.ok) {
      if (result.code === "reuse_detected") {
        console.warn("[api/auth/refresh] Refresh token reuse detected; family revoked", {
          userId: result.userId,
          familyId: result.familyId,
        });
      }
      // After a logout or a newer login the jar already holds the right cookies; clearing could wipe a new session.
      const keepCookies =
        result.code === "revoked" &&
        (result.revokedReason === RefreshTokenRevokeReason.logout ||
          result.revokedReason === RefreshTokenRevokeReason.superseded);
      return unauthorized(req, result.code, !keepCookies);
    }

    const access = signAccessToken(result.user.id!, result.familyId);
    const res = buildSessionResponse(
      result.user,
      access.expiresInSeconds,
      result.refreshExpiresAt,
      Boolean(result.rotatedToken)
    );
    setAccessTokenCookie(res, req, access.token, access.expiresInSeconds);
    if (result.rotatedToken) {
      setRefreshTokenCookie(res, req, result.rotatedToken.token, result.rotatedToken.expiresAt);
    }
    clearLegacyAccessCookie(res);
    return res;
  } catch (error) {
    console.error("[api/auth/refresh] Failed to refresh session", { error });
    return NextResponse.json({ error: "Failed to refresh session" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
