import { env } from '../../config/env';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import { authRepository } from './auth.repository';
import type { User } from '@prisma/client';
import type { AuthPayload, TokenPair } from '../../shared/types';
import type { InviteInput } from './auth.dto';

interface AuthResult extends TokenPair {
  user: { id: string; email: string; name: string; role: string };
}

export class AuthService {
  async register(email: string, password: string, name: string): Promise<AuthResult> {
    const existing = await authRepository.findUserByEmail(email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await bcrypt.hash(password, env.bcrypt.saltRounds);
    const user = await authRepository.createUser({ email, password: hashed, name, role: 'STAFF' });

    const tokens = await this.generateTokenPair(user);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const tokens = await this.generateTokenPair(user);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    if (stored.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findUserById(stored.userId);
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive');

    await authRepository.revokeRefreshToken(refreshToken);
    const tokens = await this.generateTokenPair(user);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async invite(input: InviteInput): Promise<AuthResult> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await bcrypt.hash(input.password, env.bcrypt.saltRounds);
    const role = input.role ?? 'STAFF';
    const user = await authRepository.createUser({ email: input.email, password: hashed, name: input.name, role });

    const tokens = await this.generateTokenPair(user);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(
      payload,
      env.jwt.accessSecret,
      { expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'] },
    );
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresInMs);
    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
