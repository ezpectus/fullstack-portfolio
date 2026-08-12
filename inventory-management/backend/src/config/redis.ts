import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.redis.url, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});
