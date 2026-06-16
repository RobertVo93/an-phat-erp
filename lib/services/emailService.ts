import { env } from "@/constants/env";
import type { Language } from "@/types";

type PasswordResetEmailContent = {
  subject: string;
  greeting: string;
  intro: string;
  action: string;
  expiry: string;
};

const passwordResetEmailContent: Record<Language, PasswordResetEmailContent> = {
  en: {
    subject: "Reset your password",
    greeting: "Hello,",
    intro: "We received a request to reset your password.",
    action: "Reset your password",
    expiry: "This link will expire in 30 minutes. If you did not request this, you can ignore this email.",
  },
  vi: {
    subject: "Đặt lại mật khẩu",
    greeting: "Xin chào,",
    intro: "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.",
    action: "Đặt lại mật khẩu",
    expiry: "Liên kết này sẽ hết hạn sau 30 phút. Nếu bạn không yêu cầu, bạn có thể bỏ qua email này.",
  },
};

type SendPasswordResetEmailParams = {
  toEmail: string;
  toName?: string;
  resetUrl: string;
  language: Language;
};

export class EmailService {
  async sendPasswordResetEmail({
    toEmail,
    toName,
    resetUrl,
    language,
  }: SendPasswordResetEmailParams): Promise<void> {
    this.validateMailerSendConfig();

    console.log("[EmailService.sendPasswordResetEmail]-start", {
      toEmail,
      language,
    });

    const content = passwordResetEmailContent[language];
    const response = await fetch(env.MAILERSEND_EMAIL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MAILERSEND_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: env.MAILERSEND_FROM_EMAIL,
          name: env.MAILERSEND_FROM_NAME,
        },
        to: [
          {
            email: toEmail,
            name: toName || toEmail,
          },
        ],
        reply_to: {
          email: env.MAILERSEND_FROM_EMAIL,
          name: env.MAILERSEND_FROM_NAME,
        },
        subject: content.subject,
        html: this.buildPasswordResetHtml(resetUrl, content),
        text: this.buildPasswordResetText(resetUrl, content),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[EmailService.sendPasswordResetEmail]-failed", {
        status: response.status,
        response: errorText,
      });
      throw new Error(`Failed to send password reset email: ${response.status} ${errorText}`);
    }

    console.log("[EmailService.sendPasswordResetEmail]-success", {
      toEmail,
      language,
    });
  }

  private validateMailerSendConfig(): void {
    if (!env.MAILERSEND_API_TOKEN) {
      throw new Error("MAILERSEND_API_TOKEN is required");
    }

    if (!env.MAILERSEND_FROM_EMAIL) {
      throw new Error("MAILERSEND_FROM_EMAIL is required");
    }
  }

  private buildPasswordResetHtml(
    resetUrl: string,
    content: PasswordResetEmailContent
  ): string {
    return `
      <p>${content.greeting}</p>
      <p>${content.intro}</p>
      <p><a href="${resetUrl}">${content.action}</a></p>
      <p>${content.expiry}</p>
    `;
  }

  private buildPasswordResetText(
    resetUrl: string,
    content: PasswordResetEmailContent
  ): string {
    return [
      content.greeting,
      "",
      content.intro,
      `${content.action}: ${resetUrl}`,
      "",
      content.expiry,
    ].join("\n");
  }

}
