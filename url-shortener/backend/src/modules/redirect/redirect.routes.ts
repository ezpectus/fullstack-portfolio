import { Router, Request, Response } from 'express';
import { redis } from '../../config/redis';
import { redirectRateLimiter } from '../../middleware/rateLimit';
import { asyncHandler } from '../../middleware/asyncHandler';
import { redirectService } from './redirect.service';

const router = Router();

router.get('/:code', redirectRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const password = req.query.password as string | undefined;

  const result = await redirectService.resolve(code, password);

  if (result.status === 'gone') {
    return res.status(410).json({ error: { code: 'GONE', message: result.message } });
  }
  if (result.status === 'expired') {
    return res.status(410).json({ error: { code: 'EXPIRED', message: result.message } });
  }
  if (result.status === 'password_required') {
    return res.status(401).json({ error: { code: 'PASSWORD_REQUIRED', message: result.message } });
  }
  if (result.status === 'forbidden') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: result.message } });
  }

  const { link, originalUrl } = result;
  await redis.set(`redirect:${code}`, originalUrl, 'EX', 86400);

  const ip = req.ip || req.socket.remoteAddress || null;
  const userAgent = req.headers['user-agent'] || null;
  const referer = req.headers.referer || null;

  await redirectService.trackClick(link.id, ip, userAgent, referer);
  await redis.incr(`clicks:${code}`);

  return res.redirect(302, originalUrl);
}));

export default router;
