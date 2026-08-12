import { prisma } from '../../config/db';
import crypto from 'crypto';

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function maskApiKey(key: string): string {
  return key.length > 12 ? `${key.slice(0, 8)}...${key.slice(-4)}` : '****';
}

export const apiKeysRepository = {
  findAll: (userId: string) =>
    prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, key: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) => prisma.apiKey.findUnique({ where: { id } }),

  findByKey: (key: string) => prisma.apiKey.findUnique({ where: { key: hashApiKey(key) } }),

  create: (data: { userId: string; name: string; key: string }) =>
    prisma.apiKey.create({ data: { userId: data.userId, name: data.name, key: hashApiKey(data.key) } }),

  updateLastUsed: (id: string) =>
    prisma.apiKey.update({ where: { id }, data: { lastUsedAt: new Date() } }),

  delete: (id: string) => prisma.apiKey.delete({ where: { id } }),
};

export function generateApiKey(): string {
  return `usk_${crypto.randomBytes(24).toString('hex')}`;
}
