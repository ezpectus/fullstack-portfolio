import { prisma } from '../../config/db';
import type { User, RefreshToken } from '@prisma/client';

export class AuthRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; password: string; name: string; role?: 'admin' | 'user' }): Promise<User> {
    return prisma.user.create({ data: { ...data, role: data.role || 'user' } });
  }

  findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  createRefreshToken(data: { token: string; userId: string; expiresAt: Date }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({ where: { token }, data: { revokedAt: new Date() } });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}

export const authRepository = new AuthRepository();
