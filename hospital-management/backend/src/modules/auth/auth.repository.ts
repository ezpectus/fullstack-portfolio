import { prisma } from '../../config/db';
import type { User, RefreshToken } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; password: string; name: string; role: string; phone?: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  async saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({ where: { token }, data: { revokedAt: new Date() } });
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

export default new AuthRepository();
