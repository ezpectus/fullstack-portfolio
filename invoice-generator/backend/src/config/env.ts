import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

function required(key: string, devFallback?: string): string {
  const value = process.env[key];
  if (value) return value;
  if (!isProduction && devFallback) return devFallback;
  throw new Error(`Missing required env var: ${key}`);
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

function optionalInt(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return fallback;
  return parsed;
}

const isProduction = optional('NODE_ENV', 'development') === 'production';
const isDevelopment = !isProduction;

export const env = {
  port: optionalInt('PORT', 4000),
  nodeEnv: optional('NODE_ENV', 'development'),
  isProduction,
  isDevelopment,
  databaseUrl: optional('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/invoice_generator?schema=public'),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', undefined),
    refreshSecret: required('JWT_REFRESH_SECRET', undefined),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7'),
    refreshExpiresInMs: optionalInt('JWT_REFRESH_EXPIRES_IN', 7) * 24 * 60 * 60 * 1000,
  },
  bcryptSaltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 10),
  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(','),
  },
  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    maxRequests: optionalInt('RATE_LIMIT_MAX', 100),
    authWindowMs: optionalInt('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    authMaxRequests: optionalInt('AUTH_RATE_LIMIT_MAX', 5),
  },
  smtp: {
    host: optional('SMTP_HOST', 'smtp.gmail.com'),
    port: optionalInt('SMTP_PORT', 587),
    user: optional('SMTP_USER', ''),
    pass: optional('SMTP_PASS', ''),
    from: optional('SMTP_FROM', 'noreply@invoicegen.com'),
  },
} as const;

export type Env = typeof env;
