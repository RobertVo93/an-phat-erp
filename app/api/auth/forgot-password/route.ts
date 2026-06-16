import { NextRequest, NextResponse } from "next/server";
import {
  PasswordResetRequestError,
  PasswordResetService,
} from "@/lib/services/passwordResetService";
import { getPublicOrigin } from "@/lib/utils.request";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     description: Create a password reset token for a username and send the reset URL by email.
 */
export async function POST(req: NextRequest) {
  try {
    const { username, language, resetPath } = await req.json();
    const passwordResetService = new PasswordResetService();

    const status = await passwordResetService.requestPasswordReset(
      typeof username === "string" ? username : "",
      getPublicOrigin(req),
      language,
      resetPath
    );

    return NextResponse.json({ success: true, status });
  } catch (error) {
    if (error instanceof PasswordResetRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to request password reset" },
      { status: 500 }
    );
  }
}
