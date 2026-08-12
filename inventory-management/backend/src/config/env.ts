import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function optionalInt(key: string, fallback: number): number {
  return parseInt(process.env[key] ?? String(fallback), 10);
}

export const env = {
  port: optionalInt('PORT', 4000),
  nodeEnv: optional('NODE_ENV', 'development'),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/inventory_management?schema=public'),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7'),
    refreshExpiresInMs: optionalInt('JWT_REFRESH_EXPIRES_IN', 7) * 24 * 60 * 60 * 1000,
  },
  bcrypt: {
    saltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 10),
  },
  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','),
  },
  redis: {
    url: optional('REDIS_URL', 'redis://localhost:6379'),
  },
  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    maxRequests: optionalInt('RATE_LIMIT_MAX', 100),
    authWindowMs: optionalInt('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    authMaxRequests: optionalInt('AUTH_RATE_LIMIT_MAX', 5),
  },
} as const;

export type Env = typeof env;

export const isProduction = env.nodeEnv === 'production';
export const isDevelopment = env.nodeEnv === 'development';
