import { Role } from '@prisma/client';
import { prisma } from '../../config/db';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findUserWithMember(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { member: true } });
  }

  async createUser(data: { email: string; password: string; name: string; role: Role }) {
    return prisma.user.create({ data });
  }

  async createMember(userId: string, cardNumber: string) {
    return prisma.member.create({ data: { userId, cardNumber } });
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
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export const authRepository = new AuthRepository();
