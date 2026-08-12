import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { authRepository } from './auth.repository';
import type { RegisterInput, LoginInput, InviteInput } from './auth.dto';

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      password: hashed,
      name: input.name,
    });

    await authRepository.createCompany(user.id, `${input.name}'s Company`);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens };
  }

  async refresh(refreshToken: string) {
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (!storedToken) throw new UnauthorizedError('Invalid refresh token');
    if (storedToken.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (storedToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findUserById(storedToken.userId);
    if (!user) throw new UnauthorizedError('User not found');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    await authRepository.revokeRefreshToken(refreshToken);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (storedToken && !storedToken.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async me(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
  }

  async invite(input: InviteInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      password: hashed,
      name: input.name,
      role: input.role,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const signOptions: jwt.SignOptions = {
      expiresIn: env.jwt.accessExpiresIn as unknown as jwt.SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign({ id: userId, email, role }, env.jwt.accessSecret, signOptions);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresInMs);
    await authRepository.createRefreshToken(refreshToken, userId, expiresAt);

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
