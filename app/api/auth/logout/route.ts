import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { NO_STORE_HEADERS, clearSessionCookies, getRefreshTokenFromRequest } from "@/lib/auth/session-cookies";
import { getAuthRequestGuardError } from "@/lib/utils.request";
import { revokeRefreshTokenFamilyService } from "@/lib/services/refreshTokenService";
import { RefreshTokenRevokeReason } from "@/types/enums";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Revoke this browser's session family and clear the session cookies. Requires the X-Admin-Auth: 1 header.
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if logout was successful
 *                   example: true
 */
export async function POST(req: NextRequest) {
  const guardError = getAuthRequestGuardError(req);
  if (guardError) return guardError;

  let revokeFailed = false;
  const refreshToken = getRefreshTokenFromRequest(req);
  if (refreshToken) {
    try {
      await ensureDataSource();
      await revokeRefreshTokenFamilyService(refreshToken, RefreshTokenRevokeReason.logout);
    } catch (error) {
      revokeFailed = true;
      console.error("[api/auth/logout] Failed to revoke the session", { error });
    }
  }

  // Cookies are cleared even when revocation failed.
  const res = revokeFailed
    ? NextResponse.json({ error: "Failed to log out" }, { status: 500, headers: NO_STORE_HEADERS })
    : NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
  clearSessionCookies(res, req);
  return res;
}
