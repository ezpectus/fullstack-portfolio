import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  if (env.isDevelopment) {
    console.log('[Redis] Connected');
  }
});
