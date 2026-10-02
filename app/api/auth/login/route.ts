import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { signAccessToken } from "@/lib/auth/jwt";
import { getAdminSessionDenial } from "@/lib/auth/session-policy";
import {
    NO_STORE_HEADERS,
    buildSessionResponse,
    clearLegacyAccessCookie,
    getRefreshTokenFromRequest,
    setAccessTokenCookie,
    setRefreshTokenCookie,
} from "@/lib/auth/session-cookies";
import { getAuthRequestGuardError } from "@/lib/utils.request";
import { UserService } from "@/lib/services/user.service";
import {
    cleanupExpiredRefreshTokensService,
    createRefreshTokenService,
    revokeRefreshTokenFamilyService,
} from "@/lib/services/refreshTokenService";
import { RefreshTokenRevokeReason } from "@/types/enums";
import { LoginSchema } from "../auth.schema";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: "Authenticate a staff user. Sets the admin_access_token and admin_refresh_token httpOnly cookies. Requires the X-Admin-Auth: 1 header."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest) {
    const guardError = getAuthRequestGuardError(req);
    if (guardError) return guardError;

    try {
        const parse = LoginSchema.safeParse(await req.json().catch(() => null));
        if (!parse.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parse.error.errors },
                { status: 400, headers: NO_STORE_HEADERS }
            );
        }

        await ensureDataSource();
        const userService = new UserService();
        const user = await userService.verifyUser(parse.data.username, parse.data.password);
        if (!user?.id) {
            return NextResponse.json(
                { error: "Email or password is incorrect" },
                { status: 401, headers: NO_STORE_HEADERS }
            );
        }
        // Checked after the password so the 403 does not reveal which usernames exist.
        if (getAdminSessionDenial(user)) {
            return NextResponse.json(
                { error: "Account is not allowed to sign in", code: "account_not_allowed" },
                { status: 403, headers: NO_STORE_HEADERS }
            );
        }

        // A browser that logs in again ends its previous session family.
        const previousRefreshToken = getRefreshTokenFromRequest(req);
        if (previousRefreshToken) {
            try {
                await revokeRefreshTokenFamilyService(previousRefreshToken, RefreshTokenRevokeReason.superseded);
            } catch (error) {
                console.error("[api/auth/login] Failed to revoke the previous session", { error });
            }
        }

        // Sign first so a missing secret fails before any refresh row is written.
        const familyId = crypto.randomUUID();
        const access = signAccessToken(user.id, familyId);
        const refreshToken = await createRefreshTokenService({ userId: user.id, passwordHash: user.password, familyId });

        const res = buildSessionResponse(user, access.expiresInSeconds, refreshToken.expiresAt);
        await userService.updateLastLogin(user.id);
        setAccessTokenCookie(res, req, access.token, access.expiresInSeconds);
        setRefreshTokenCookie(res, req, refreshToken.token, refreshToken.expiresAt);
        clearLegacyAccessCookie(res);

        cleanupExpiredRefreshTokensService().catch((error) => {
            console.error("[api/auth/login] Failed to clean up expired refresh tokens", { error });
        });
        return res;
    } catch (error) {
        console.error("[api/auth/login] Failed to login", { error });
        return NextResponse.json({ error: "Failed to login" }, { status: 500, headers: NO_STORE_HEADERS });
    }
}
