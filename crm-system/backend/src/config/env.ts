import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) return fallback;
  return parsed;
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[match[2]];
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: optionalInt('PORT', 4000),
  clientUrl: optional('CLIENT_URL', 'http://localhost:3000'),

  databaseUrl: required('DATABASE_URL'),
  redisUrl: required('REDIS_URL'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
    refreshExpiresInMs: parseDuration(optional('JWT_REFRESH_EXPIRES_IN', '7d')),
  },

  bcrypt: {
    saltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 10),
  },

  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 900000),
    maxRequests: optionalInt('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','),
  },

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
} as const;

export type Env = typeof env;
