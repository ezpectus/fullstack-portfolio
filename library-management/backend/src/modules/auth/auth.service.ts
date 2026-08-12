import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../shared/errors';
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
      role: 'MEMBER',
    });

    if (user.role === 'MEMBER') {
      const cardNumber = `LIB-${Date.now().toString(36).toUpperCase()}`;
      await authRepository.createMember(user.id, cardNumber);
    }

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
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedError('Invalid refresh token');
    if (stored.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');
    if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');

    const user = await authRepository.findUserById(stored.userId);
    if (!user) throw new NotFoundError('User');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    await authRepository.revokeRefreshToken(refreshToken);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new BadRequestError('Refresh token is required');
    const stored = await authRepository.findRefreshToken(refreshToken);
    if (stored && !stored.revokedAt) {
      await authRepository.revokeRefreshToken(refreshToken);
    }
  }

  async me(userId: string) {
    const user = await authRepository.findUserWithMember(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user.id, email: user.email, name: user.name, role: user.role, member: user.member };
  }

  async invite(input: InviteInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      password: hashed,
      name: input.name,
      role: input.role as 'ADMIN' | 'LIBRARIAN' | 'MEMBER',
    });

    if (user.role === 'MEMBER') {
      const cardNumber = `LIB-${Date.now().toString(36).toUpperCase()}`;
      await authRepository.createMember(user.id, cardNumber);
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private async generateTokens(id: string, email: string, role: string) {
    const signOptions: jwt.SignOptions = {
      expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    };
    const accessToken = jwt.sign({ id, email, role }, env.jwt.accessSecret, signOptions);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + env.jwt.refreshExpiresInMs);
    await authRepository.createRefreshToken(refreshToken, id, expiresAt);

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
