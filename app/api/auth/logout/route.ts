import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Clear user's authentication token and log them out
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
export async function POST() {
  // Clear the token cookie by setting it to empty and expired
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", { httpOnly: true, path: "/", expires: new Date(0) });
  return res;
}