import dotenv from 'dotenv';
dotenv.config();

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
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
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
  port: optionalInt('PORT', 4000),
  nodeEnv: optional('NODE_ENV', 'development'),
  databaseUrl: required('DATABASE_URL'),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: optional('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
    refreshExpiresInMs: parseDuration(optional('JWT_REFRESH_EXPIRES_IN', '7d')),
  },
  bcryptSaltRounds: optionalInt('BCRYPT_SALT_ROUNDS', 10),
  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(','),
  },
  redis: {
    url: required('REDIS_URL'),
  },
  smtp: {
    host: optional('SMTP_HOST', 'smtp.gmail.com'),
    port: optionalInt('SMTP_PORT', 587),
    user: optional('SMTP_USER', ''),
    pass: optional('SMTP_PASS', ''),
    from: optional('SMTP_FROM', 'noreply@library.com'),
  },
  rateLimit: {
    windowMs: optionalInt('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    maxRequests: optionalInt('RATE_LIMIT_MAX_REQUESTS', 100),
    authWindowMs: optionalInt('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    authMaxRequests: optionalInt('AUTH_RATE_LIMIT_MAX_REQUESTS', 5),
  },
  finePerDay: parseFloat(optional('FINE_PER_DAY', '0.50')),
  loanPeriodDays: optionalInt('LOAN_PERIOD_DAYS', 14),
  maxRenewals: optionalInt('MAX_RENEWALS', 2),
  reservationExpiryDays: optionalInt('RESERVATION_EXPIRY_DAYS', 3),
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
} as const;

export type Env = typeof env;
