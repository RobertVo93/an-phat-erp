export const env = {
  // Base Zone
  NEXT_PUBLIC_BASE_ZONE: process.env.NEXT_PUBLIC_BASE_ZONE || '',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/anphat_erp?sslmode=disable',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'adsfpqwergadfnpg_UmYuKibaZf20ljli123asdfgoihjnqbOInkjHUne',

  // MailerSend
  MAILERSEND_API_TOKEN: process.env.MAILERSEND_API_TOKEN || '',
  MAILERSEND_EMAIL_API_URL: process.env.MAILERSEND_EMAIL_API_URL || 'https://api.mailersend.com/v1/email',
  MAILERSEND_FROM_EMAIL: process.env.MAILERSEND_FROM_EMAIL || '',
  MAILERSEND_FROM_NAME: process.env.MAILERSEND_FROM_NAME || 'An Phat Admin',
  
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
