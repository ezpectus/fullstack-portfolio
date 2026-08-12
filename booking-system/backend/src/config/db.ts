import { PrismaClient } from '@prisma/client';
import { env } from './env';

const prisma = new PrismaClient({
  log: env.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});

export { prisma };
