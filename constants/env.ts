export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/anphat_erp?sslmode=disable',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'adsfpqwergadfnpg_UmYuKibaZf20ljli123asdfgoihjnqbOInkjHUne',
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // S3 Configuration
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-1',
  NEXT_PUBLIC_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
  NEXT_PUBLIC_S3_ROOT_PATH: process.env.NEXT_PUBLIC_S3_ROOT_PATH || 'uploads',
} as const

// Type for environment variables
export type Env = typeof env
