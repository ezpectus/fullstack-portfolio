import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authRepository } from './auth.repository';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import type { User } from '@prisma/client';

export class AuthService {
  private generateAccessToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiry,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(48).toString('hex');
    const match = env.jwtRefreshExpiry.match(/^(\d+)([smhd])$/);
    const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    const expiresMs = match ? parseInt(match[1], 10) * multipliers[match[2]] : 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresMs);
    await authRepository.createRefreshToken({ token, userId, expiresAt });
    return token;
  }

  async register(data: { email: string; password: string; name: string }) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, env.bcryptSaltRounds);
    const user = await authRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    if (stored.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findById(stored.userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    await authRepository.revokeRefreshToken(refreshToken);
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    await authRepository.revokeRefreshToken(refreshToken);
  }

  async me(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}

export const authService = new AuthService();
