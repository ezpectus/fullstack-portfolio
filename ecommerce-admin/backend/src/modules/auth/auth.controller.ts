import { Request, Response } from 'express';
import { authService } from './auth.service';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from './auth.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AuthRequest } from '../../middleware/auth';
import { env } from '../../config/env';

export const register = [
  validateBody(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      maxAge: env.jwtRefreshExpiryMs,
    });
    res.status(201).json({ data: { user, accessToken: tokens.accessToken } });
  }),
];

export const login = [
  validateBody(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      maxAge: env.jwtRefreshExpiryMs,
    });
    res.json({ data: { user, accessToken: tokens.accessToken } });
  }),
];

export const refresh = [
  validateBody(refreshSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      maxAge: env.jwtRefreshExpiryMs,
    });
    res.json({ data: { accessToken: tokens.accessToken } });
  }),
];

export const logout = [
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ data: { message: 'Logged out' } });
  }),
];

export const me = [
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    res.json({ data: user });
  }),
];
