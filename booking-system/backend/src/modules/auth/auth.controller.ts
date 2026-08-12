import { Request, Response } from 'express';
import { authService } from './auth.service';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema, inviteSchema } from './auth.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import { env } from '../../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict' as const,
  maxAge: env.jwt.refreshExpiresInMs,
};

export const register = [
  validateBody(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(201).json({ data: { user, accessToken: tokens.accessToken } });
  }),
];

export const login = [
  validateBody(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.json({ data: { user, accessToken: tokens.accessToken } });
  }),
];

export const refresh = [
  validateBody(refreshSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Refresh token is required' } });
      return;
    }
    const tokens = await authService.refresh(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
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
  asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.userId);
    res.json({ data: user });
  }),
];

export const invite = [
  validateBody(inviteSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.invite(req.body);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(201).json({ data: { user, accessToken: tokens.accessToken } });
  }),
];
