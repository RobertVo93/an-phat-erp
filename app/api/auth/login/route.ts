import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user.service";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user with email and password
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
    try {
        const userService = new UserService();
        const { email, password } = await req.json();
        const user = await userService.verifyUser(email, password);
        if (!user) {
            return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
        }
        const token = signJwt({ userId: user.id });
        const res = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                active: user.active,
                lastLogin: user.lastLogin,
            }
        });
        res.cookies.set("token", token, { httpOnly: true, path: "/", sameSite: "lax" });
        return res;
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
} 