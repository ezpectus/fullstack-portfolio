import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../shared/errors';
import { authService } from './auth.service';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: env.jwt.refreshExpiresInMs,
  });
  res.status(201).json({ user: result.user, accessToken: result.accessToken });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.login(req.body);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: env.jwt.refreshExpiresInMs,
  });
  res.json({ user: result.user, accessToken: result.accessToken });
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh token not provided'));
  }
  const result = await authService.refresh(refreshToken);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: env.jwt.refreshExpiresInMs,
  });
  res.json({ accessToken: result.accessToken });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.me(req.user!.id);
  res.json(user);
});

export const invite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.invite(req.body);
  res.status(201).json(user);
});
