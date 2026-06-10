import crypto from "crypto";
import { IsNull } from "typeorm";
import { genSalt, hash } from "bcryptjs";
import { AppDataSource } from "@/lib/database/typeorm";
import { PasswordResetTokenEntity } from "@/lib/database/entities/password-reset-token.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { ensureDataSource } from "@/lib/database/ensureDataSource";

const RESET_TOKEN_EXPIRES_IN_MINUTES = 30;

export class PasswordResetService {
  private passwordResetTokenRepository = AppDataSource.getRepository(PasswordResetTokenEntity);

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

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
