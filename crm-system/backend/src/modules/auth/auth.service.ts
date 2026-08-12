import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors';
import type { AuthPayload, TokenPair } from '../../shared/types';
import type { RegisterInput, LoginInput, InviteInput } from './auth.dto';

export class AuthService {
  async register(input: RegisterInput): Promise<TokenPair & { user: { id: string; email: string; name: string; role: string } }> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, env.bcrypt.saltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    return this.generateTokenPair(user);
  }

  async login(input: LoginInput): Promise<TokenPair & { user: { id: string; email: string; name: string; role: string } }> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return this.generateTokenPair(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (stored.revokedAt) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    const user = await authRepository.findUserById(stored.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    await authRepository.revokeRefreshToken(refreshToken);
    const tokens = await this.generateTokenPair(user);
    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async invite(input: InviteInput, invitedBy: string): Promise<{ id: string; email: string; name: string; role: string }> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, env.bcrypt.saltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: input.role,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async getMe(userId: string): Promise<{ id: string; email: string; name: string; role: string; avatar: string | null }> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar };
  }

  private async generateTokenPair(user: { id: string; email: string; name: string; role: string }): Promise<TokenPair & { user: { id: string; email: string; name: string; role: string } }> {
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const signOptions: jwt.SignOptions = {
      expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, signOptions);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresInMs);

    await authRepository.createRefreshToken(refreshToken, user.id, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}

export const authService = new AuthService();
