export const env = {
  // Base Zone
  NEXT_PUBLIC_BASE_ZONE: process.env.NEXT_PUBLIC_BASE_ZONE || '',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/anphat_erp?sslmode=disable',
  
  // JWT
  // Legacy and no longer used to sign tokens. Kept only so session-config can refuse to reuse its value.
  JWT_SECRET: process.env.JWT_SECRET || '',

  // MailerSend
  MAILERSEND_API_TOKEN: process.env.MAILERSEND_API_TOKEN || '',
  MAILERSEND_EMAIL_API_URL: process.env.MAILERSEND_EMAIL_API_URL || 'https://api.mailersend.com/v1/email',
  MAILERSEND_FROM_EMAIL: process.env.MAILERSEND_FROM_EMAIL || '',
  MAILERSEND_FROM_NAME: process.env.MAILERSEND_FROM_NAME || 'An Phat Admin',
  RESET_EMAIL_RESEND_COOLDOWN_MINUTES: Number(process.env.RESET_EMAIL_RESEND_COOLDOWN_MINUTES || 5),

  // Admin session (access + refresh tokens). Server-only; validated and clamped in lib/auth/session-config.ts
  AUTH_ACCESS_TOKEN_SECRET: process.env.AUTH_ACCESS_TOKEN_SECRET || '',
  AUTH_ACCESS_TOKEN_TTL_SECONDS: Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS || 900),
  AUTH_REFRESH_TOKEN_TTL_SECONDS: Number(process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS || 2592000),
  AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS: Number(process.env.AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS || 604800),
  AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS: Number(process.env.AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS || 60),
  AUTH_COOKIE_SECURE: process.env.AUTH_COOKIE_SECURE || 'auto',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // S3 Configuration
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-1',
  NEXT_PUBLIC_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
  NEXT_PUBLIC_S3_ROOT_PATH: process.env.NEXT_PUBLIC_S3_ROOT_PATH || 'uploads',
  NEXT_PUBLIC_TAX_RATE: Number(process.env.NEXT_PUBLIC_TAX_RATE || 0),
  NEXT_PUBLIC_SYSTEM_PAY_PERIOD_START: process.env.NEXT_PUBLIC_SYSTEM_PAY_PERIOD_START || '2025-01-01',
} as const

// Type for environment variables
export type Env = typeof env
