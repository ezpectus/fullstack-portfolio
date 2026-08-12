import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { redis } from '../../config/redis';
import { redirectRateLimiter } from '../../middleware/rateLimit';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateQuery, validateParams } from '../../middleware/validate';
import { redirectService } from './redirect.service';

const router = Router();
const codeParamSchema = z.object({ code: z.string().min(3).max(30).regex(/^[a-zA-Z0-9-_]+$/) });
const passwordQuerySchema = z.object({ password: z.string().optional() });

router.get('/:code', redirectRateLimiter, validateParams(codeParamSchema), validateQuery(passwordQuerySchema), asyncHandler(async (req: Request, res: Response) => {
  const { code } = codeParamSchema.parse(req.params);
  const query = passwordQuerySchema.parse(req.query);
  const password = query.password;

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
