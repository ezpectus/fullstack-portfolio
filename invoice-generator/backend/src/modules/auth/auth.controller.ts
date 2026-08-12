import { Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { env } from '../../config/env';

const REFRESH_COOKIE = 'refreshToken';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: env.jwt.refreshExpiresInMs,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE);
}

export const register = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({ user: result.user, accessToken: result.accessToken });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.json({ user: result.user, accessToken: result.accessToken });
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
  const result = await authService.refresh(refreshToken);
  setRefreshCookie(res, result.refreshToken);
  res.json({ accessToken: result.accessToken });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
  await authService.logout(refreshToken);
  clearRefreshCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const user = await authService.me(req.user!.id);
  res.json(user);
});
