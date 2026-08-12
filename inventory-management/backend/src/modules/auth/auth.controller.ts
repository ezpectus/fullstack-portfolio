import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { isProduction } from '../../config/env';
import { env } from '../../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict' as const,
  maxAge: env.jwt.refreshExpiresInMs,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.register(email, password, name);
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  res.json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Refresh token is required' } });
    return;
  }
  const result = await authService.refresh(refreshToken);
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  res.json(result);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.me(req.user!.userId);
  res.json(result);
});

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.invite(req.body);
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  res.status(201).json(result);
});
