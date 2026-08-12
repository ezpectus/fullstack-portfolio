import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

function required<T extends string>(key: string, fallback?: T): T {
  const value = process.env[key] as T | undefined;
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return (value || fallback) as T;
}

function optional<T extends string>(key: string, fallback: T): T {
  return (process.env[key] as T | undefined) || fallback;
}

function optionalInt(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

export const env = {
  port: optionalInt('PORT', 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: required('DATABASE_URL'),
  redisUrl: optional('REDIS_URL', 'redis://localhost:6379'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  jwtAccessExpiry: optional('JWT_ACCESS_EXPIRY', '15m'),
  jwtRefreshExpiry: optional('JWT_REFRESH_EXPIRY', '7d'),
  bcryptSaltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 10),
  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:5173').split(','),
  },
  appUrl: optional('APP_URL', 'http://localhost:5173'),
  shortDomain: optional('SHORT_DOMAIN', 'http://localhost:4000'),
  rateLimitWindowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitMax: optionalInt('RATE_LIMIT_MAX', 100),
  authRateLimitWindowMs: optionalInt('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  authRateLimitMax: optionalInt('AUTH_RATE_LIMIT_MAX', 10),
} as const;

export type Env = typeof env;

export const isProduction = env.nodeEnv === 'production';
export const isDevelopment = env.nodeEnv === 'development';
