import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../shared/errors';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ data: result, message: 'User registered successfully' });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      maxAge: env.jwt.refreshExpiresInMs,
    });

    res.json({
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
      message: 'Login successful',
    });
  });

  refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken ?? req.body.refreshToken;
    if (!refreshToken) {
      next(new UnauthorizedError('Refresh token not provided'));
      return;
    }

    const tokens = await authService.refresh(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
      maxAge: env.jwt.refreshExpiresInMs,
    });

    res.json({ data: { accessToken: tokens.accessToken } });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.userId);
    res.json({ data: user });
  });

  invite = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.invite(req.body, req.user!.userId);
    res.status(201).json({ data: result, message: 'User invited successfully' });
  });
}

export const authController = new AuthController();
