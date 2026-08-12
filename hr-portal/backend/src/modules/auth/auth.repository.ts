import { prisma } from '../../config/db';
import type { Role } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; password: string; name: string; role: Role; phone?: string }) {
    return prisma.user.create({ data });
  }

  async createRefreshToken(token: string, userId: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({ where: { token }, data: { revokedAt: new Date() } });
  }

  async revokeAllUserTokens(userId: string) {
    return prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}

export default new AuthRepository();
