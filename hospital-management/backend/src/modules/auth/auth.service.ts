import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import authRepository from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import type { User } from '@prisma/client';

interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  isActive: boolean;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(data: { email: string; password: string; name: string; phone?: string }): Promise<TokenPair & { user: SanitizedUser }> {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await authRepository.createUser({ email: data.email, password: hashedPassword, name: data.name, role: 'PATIENT', phone: data.phone });
    return this.generateTokens(user);
  }

  async login(email: string, password: string): Promise<TokenPair & { user: SanitizedUser }> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account deactivated');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair & { user: SanitizedUser }> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    if (stored.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findUserById(stored.userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    await authRepository.revokeRefreshToken(refreshToken);
    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async me(userId: string): Promise<SanitizedUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new NotFoundError('User');
    return this.sanitizeUser(user);
  }

  async invite(data: { email: string; password: string; name: string; role: string; phone?: string }, invitedBy: string): Promise<SanitizedUser> {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
    const user = await authRepository.createUser({ email: data.email, password: hashedPassword, name: data.name, role: data.role, phone: data.phone });
    return this.sanitizeUser(user);
  }

  private async generateTokens(user: User): Promise<TokenPair & { user: SanitizedUser }> {
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN_MS);
    await authRepository.saveRefreshToken(refreshToken, user.id, expiresAt);
    return { accessToken, refreshToken, user: this.sanitizeUser(user) };
  }

  private sanitizeUser(user: User): SanitizedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    };
  }
}

export default new AuthService();
