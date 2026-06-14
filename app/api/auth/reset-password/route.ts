import { NextRequest, NextResponse } from "next/server";
import { PasswordResetService } from "@/lib/services/passwordResetService";

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password
 *     description: Reset a user's password using a valid reset token.
 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const normalizedToken = typeof token === "string" ? token.trim() : "";

    if (!normalizedToken) {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const passwordResetService = new PasswordResetService();
    const success = await passwordResetService.resetPassword(normalizedToken, password);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
