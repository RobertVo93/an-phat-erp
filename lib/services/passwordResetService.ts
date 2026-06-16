import crypto from "crypto";
import { IsNull, MoreThan } from "typeorm";
import { genSalt, hash } from "bcryptjs";
import { env } from "@/constants/env";
import { AppDataSource } from "@/lib/database/typeorm";
import { PasswordResetTokenEntity } from "@/lib/database/entities/password-reset-token.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { EmailService } from "@/lib/services/emailService";
import { UserService } from "@/lib/services/user.service";
import type { Language } from "@/types/language";

const RESET_TOKEN_EXPIRES_IN_MINUTES = 30;
const DEFAULT_LANGUAGE: Language = "vi";

export type PasswordResetRequestStatus = "sent" | "already_sent";

export class PasswordResetRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "PasswordResetRequestError";
  }
}

export class PasswordResetService {
  private passwordResetTokenRepository = AppDataSource.getRepository(PasswordResetTokenEntity);

  async requestPasswordReset(
    username: string,
    publicOrigin: string,
    language: unknown,
    resetPath?: unknown
  ): Promise<PasswordResetRequestStatus> {
    const normalizedUsername = username.trim();
    console.log("[PasswordResetService.requestPasswordReset]-start", {
      username: normalizedUsername,
      language,
    });

    if (!normalizedUsername) {
      throw new PasswordResetRequestError("Username is required", 400);
    }

    const userService = new UserService();
    const user = await userService.getUserByUsername(normalizedUsername);

    if (!user?.id) {
      console.log("[PasswordResetService.requestPasswordReset]-user-not-found", {
        username: normalizedUsername,
      });
      throw new PasswordResetRequestError("Username does not exist", 404);
    }

    if (!user.email) {
      console.log("[PasswordResetService.requestPasswordReset]-missing-email", {
        userId: user.id,
      });
      throw new PasswordResetRequestError("User does not have an email address", 400);
    }

    const recentResetToken = await this.getRecentResetToken(user.id);
    if (recentResetToken) {
      console.log("[PasswordResetService.requestPasswordReset]-already-sent", {
        userId: user.id,
        cooldownMinutes: env.RESET_EMAIL_RESEND_COOLDOWN_MINUTES,
      });
      return "already_sent";
    }

    const token = await this.createResetToken(user.id);
    const resetUrl = this.buildResetUrl(publicOrigin, token, resetPath);
    const emailService = new EmailService();
    const emailLanguage = this.getEmailLanguage(language);

    console.log("[PasswordResetService.requestPasswordReset]-sending-email", {
      userId: user.id,
      language: emailLanguage,
    });

    await emailService.sendPasswordResetEmail({
      toEmail: user.email,
      toName: user.fullName || user.username,
      resetUrl,
      language: emailLanguage,
    });

    console.log("[PasswordResetService.requestPasswordReset]-sent", {
      userId: user.id,
    });

    return "sent";
  }

  async createResetToken(userId: string): Promise<string> {
    await ensureDataSource();

    await this.deleteUserTokens(userId);

    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);

    const resetToken = this.passwordResetTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });

    await this.passwordResetTokenRepository.save(resetToken);
    return token;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    await ensureDataSource();

    return AppDataSource.transaction(async (manager) => {
      const resetTokenRepository = manager.getRepository(PasswordResetTokenEntity);
      const userRepository = manager.getRepository(UserEntity);

      const resetToken = await resetTokenRepository.findOne({
        where: {
          tokenHash: this.hashToken(token),
          usedAt: IsNull(),
        },
      });

      if (!resetToken || resetToken.expiresAt.getTime() < Date.now()) {
        return false;
      }

      const salt = await genSalt(10);
      const updateResult = await userRepository.update(resetToken.userId, {
        password: await hash(password, salt),
        passwordSalt: salt,
      });

      if (!updateResult.affected) {
        return false;
      }

      await resetTokenRepository.delete(resetToken.id);

      return true;
    });
  }

  async validateResetToken(token: string): Promise<boolean> {
    await ensureDataSource();

    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        tokenHash: this.hashToken(token),
        usedAt: IsNull(),
      },
    });

    return Boolean(resetToken && resetToken.expiresAt.getTime() > Date.now());
  }

  private async deleteUserTokens(userId: string): Promise<void> {
    await this.passwordResetTokenRepository.delete({ userId });
  }

  private async getRecentResetToken(userId: string): Promise<PasswordResetTokenEntity | null> {
    await ensureDataSource();
    const cooldownStartedAt = new Date(
      Date.now() - env.RESET_EMAIL_RESEND_COOLDOWN_MINUTES * 60 * 1000
    );

    return await this.passwordResetTokenRepository.findOne({
      where: {
        userId,
        usedAt: IsNull(),
        createdAt: MoreThan(cooldownStartedAt),
      },
    });
  }

  private buildResetUrl(publicOrigin: string, token: string, resetPath?: unknown): string {
    const requestedResetPath = this.getSafeResetPath(resetPath);
    const defaultBasePath = env.NEXT_PUBLIC_BASE_ZONE.replace(/\/+$/u, "");
    const path = requestedResetPath || `${defaultBasePath}/reset-password`;
    const resetUrl = new URL(path, publicOrigin);
    resetUrl.searchParams.set("token", token);
    return resetUrl.toString();
  }

  private getSafeResetPath(resetPath: unknown): string | null {
    if (typeof resetPath !== "string") {
      return null;
    }

    const normalizedPath = resetPath.trim();
    if (!normalizedPath.startsWith("/") || normalizedPath.startsWith("//")) {
      return null;
    }

    return normalizedPath;
  }

  private getEmailLanguage(language: unknown): Language {
    return language === "en" || language === "vi" ? language : DEFAULT_LANGUAGE;
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
