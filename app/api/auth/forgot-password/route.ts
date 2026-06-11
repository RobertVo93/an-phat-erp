import { NextRequest, NextResponse } from "next/server";
import { env } from "@/constants/env";
import { EmailService } from "@/lib/services/emailService";
import { PasswordResetService } from "@/lib/services/passwordResetService";
import { UserService } from "@/lib/services/user.service";

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
    const { username } = await req.json();
    const normalizedUsername = typeof username === "string" ? username.trim() : "";

    if (!normalizedUsername) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const userService = new UserService();
    const user = await userService.getUserByUsername(normalizedUsername);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Username does not exist" },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "User does not have an email address" },
        { status: 400 }
      );
    }

    const passwordResetService = new PasswordResetService();
    const token = await passwordResetService.createResetToken(user.id);
    const resetUrl = buildResetUrl(req, token);

    const emailService = new EmailService();
    await emailService.sendPasswordResetEmail({
      toEmail: user.email,
      toName: user.fullName || user.username,
      resetUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to request password reset" },
      { status: 500 }
    );
  }
}

function buildResetUrl(req: NextRequest, token: string): string {
  const origin = getPublicOrigin(req);
  const basePath = env.NEXT_PUBLIC_BASE_ZONE.replace(/\/+$/u, "");
  const resetUrl = new URL(`${basePath}/reset-password`, origin);
  resetUrl.searchParams.set("token", token);
  return resetUrl.toString();
}

function getPublicOrigin(req: NextRequest): string {
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    return `${forwardedProto || req.nextUrl.protocol.replace(/:$/u, "")}://${forwardedHost}`;
  }

  return req.nextUrl.origin;
}
