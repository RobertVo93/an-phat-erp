import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user.service";
import { UserRole } from "@/types/enums";
import { setUserPagePermissions } from "@/lib/services/userPermissionService";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               username:
 *                 type: string
 *                 description: User's display name
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if registration was successful
 *                   example: true
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to register user
 */
export async function POST(req: NextRequest) {
    try {
        const userService = new UserService();
        const { username, fullName, password } = await req.json();

        // Check if user already exists
        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this username already exists" },
                { status: 400 }
            );
        }

        // Create new user
        const user = await userService.createUser({
            fullName,
            password,
            username,
            role: UserRole.staff,
        });

        // Create default permissions for the user
        await setUserPagePermissions(user.id!, [
            { pageId: "home", granted: true },
        ]);

        // Generate JWT token
        const token = signJwt({ userId: user.id });

        // Set cookie and return response
        const res = NextResponse.json({ success: true });

        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            sameSite: "lax"
        });

        return res;
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}