import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import authRepository from './auth.repository';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import type { User, Role } from '@prisma/client';
import type { AuthPayload } from '../../middleware/auth';
import type { InviteInput } from './auth.dto';

export class AuthService {
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await authRepository.createUser({ ...data, password: hashedPassword, role: 'EMPLOYEE' as Role });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account deactivated');

    const valid = await bcrypt.compare(password, user.password);
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
    const token = await authRepository.findRefreshToken(refreshToken);
    if (!token) throw new UnauthorizedError('Invalid refresh token');
    if (token.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (token.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findUserById(token.userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    await authRepository.revokeRefreshToken(refreshToken);
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, avatar: user.avatar };
  }

  async invite(data: InviteInput) {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role as Role,
      phone: data.phone,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private generateAccessToken(user: User): string {
    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN_MS);
    await authRepository.createRefreshToken(token, userId, expiresAt);
    return token;
  }
}

export default new AuthService();
