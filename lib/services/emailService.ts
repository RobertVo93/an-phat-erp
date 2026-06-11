import { env } from "@/constants/env";

const MAILERSEND_EMAIL_API_URL = "https://api.mailersend.com/v1/email";

type SendPasswordResetEmailParams = {
  toEmail: string;
  toName?: string;
  resetUrl: string;
};

export class EmailService {
  async sendPasswordResetEmail({
    toEmail,
    toName,
    resetUrl,
  }: SendPasswordResetEmailParams): Promise<void> {
    this.validateMailerSendConfig();

    const subject = "Reset your password";
    const response = await fetch(MAILERSEND_EMAIL_API_URL, {
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
        subject,
        html: this.buildPasswordResetHtml(resetUrl),
        text: this.buildPasswordResetText(resetUrl),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send password reset email: ${response.status} ${errorText}`);
    }
  }

  private validateMailerSendConfig(): void {
    if (!env.MAILERSEND_API_TOKEN) {
      throw new Error("MAILERSEND_API_TOKEN is required");
    }

    if (!env.MAILERSEND_FROM_EMAIL) {
      throw new Error("MAILERSEND_FROM_EMAIL is required");
    }
  }

  private buildPasswordResetHtml(resetUrl: string): string {
    return `
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link will expire in 30 minutes. If you did not request this, you can ignore this email.</p>
    `;
  }

  private buildPasswordResetText(resetUrl: string): string {
    return [
      "Hello,",
      "",
      "We received a request to reset your password.",
      `Reset your password: ${resetUrl}`,
      "",
      "This link will expire in 30 minutes. If you did not request this, you can ignore this email.",
    ].join("\n");
  }
}
