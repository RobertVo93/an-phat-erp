import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { UserSchema } from "../user.schema";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { toPublicUser } from "@/lib/auth/public-user";
import { getAdminSessionDenial } from "@/lib/auth/session-policy";
import { revokeUserRefreshTokensService } from "@/lib/services/refreshTokenService";
import { RefreshTokenRevokeReason, UserRole } from "@/types/enums";

interface IUserRouteContext {
  params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update user details by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *               active:
 *                 type: boolean
 *               lastLogin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                 active:
 *                   type: boolean
 *                 lastLogin:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(req: NextRequest, { params }: IUserRouteContext) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const userService = new UserService();

    // Only an active super admin may change accounts (role, active flag, email, username).
    const caller = await userService.getUserById(user.userId);
    if (!caller || caller.active === false || caller.role !== UserRole.super_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parse = UserSchema.safeParse(await req.json());
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    const { id } = await params;
    const existing = await userService.getUserById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updatedUser = await userService.updateUser(id, parse.data);
    if (!updatedUser) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Deactivated or moved to a non-staff role: end their admin sessions now instead of at the next refresh.
    const denial = getAdminSessionDenial(updatedUser);
    if (denial) {
      await revokeUserRefreshTokensService(id, RefreshTokenRevokeReason[denial]);
    }

    return NextResponse.json(toPublicUser(updatedUser));
  } catch (error) {
    console.error("[api/users/[id]] Failed to update user", { error });
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: IUserRouteContext) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const userService = new UserService();
    const { id } = await params;
    const found = await userService.getUserById(id, ["permissions"]);
    if (!found) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(toPublicUser(found));
  } catch (error) {
    console.error("[api/users/[id]] Failed to load user", { error });
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
