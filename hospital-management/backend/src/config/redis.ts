import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

export async function acquireLock(key: string, ttl: number = 10): Promise<boolean> {
  const result = await redis.set(key, 'locked', 'EX', ttl, 'NX');
  return result === 'OK';
}

export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
