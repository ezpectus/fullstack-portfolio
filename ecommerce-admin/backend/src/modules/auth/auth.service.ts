import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import type { RegisterInput, LoginInput } from './auth.dto';
import type { TokenPair } from '../../shared/types';
import type { User, Role } from '@prisma/client';

interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: SanitizedUser; tokens: TokenPair }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: 'STAFF' as Role,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
  }

  async login(input: LoginInput): Promise<{ user: SanitizedUser; tokens: TokenPair }> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await authRepository.findById(stored.userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    await authRepository.revokeRefreshToken(refreshToken);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string): Promise<SanitizedUser> {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<TokenPair> {
    const accessToken = jwt.sign({ id: userId, email, role }, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiry,
    } as jwt.SignOptions);
    const refreshToken = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date(Date.now() + env.jwtRefreshExpiryMs);

    await authRepository.saveRefreshToken(userId, refreshToken, expiresAt);
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
