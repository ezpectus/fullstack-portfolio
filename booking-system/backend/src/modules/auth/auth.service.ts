import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import type { RegisterInput, LoginInput, InviteInput } from './auth.dto';
import type { TokenPair, AuthPayload } from '../../shared/types';
import type { User } from '@prisma/client';

type SafeUser = Pick<User, 'id' | 'email' | 'name' | 'role'>;

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: SafeUser; tokens: TokenPair }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(input.password, env.bcrypt.saltRounds);
    const user = await authRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
  }

  async login(input: LoginInput): Promise<{ user: SafeUser; tokens: TokenPair }> {
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
    if (!user) throw new NotFoundError('User');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    await authRepository.revokeRefreshToken(refreshToken);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async invite(input: InviteInput): Promise<{ user: SafeUser; tokens: TokenPair }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashedPassword = await bcrypt.hash(input.password, env.bcrypt.saltRounds);
    const user = await authRepository.createWithRole({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: input.role,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens };
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<TokenPair> {
    const payload: AuthPayload = { userId, email, role };
    const signOptions: jwt.SignOptions = {
      expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, signOptions);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresInMs);

    await authRepository.saveRefreshToken(userId, refreshToken, expiresAt);
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
