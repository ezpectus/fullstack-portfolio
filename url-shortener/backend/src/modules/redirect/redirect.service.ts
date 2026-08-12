import { redirectRepository } from './redirect.repository';
import { redis } from '../../config/redis';
import { NotFoundError } from '../../shared/errors';
import bcrypt from 'bcrypt';

function parseDevice(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function parseBrowser(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  return 'other';
}

export class RedirectService {
  async resolve(code: string, password?: string) {
    const link = await redirectRepository.findByCode(code);

    if (!link) {
      throw new NotFoundError('Short link');
    }

    if (link.status === 'disabled') {
      return { status: 'gone' as const, message: 'This link has been disabled' };
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      await redis.del(`redirect:${code}`);
      return { status: 'expired' as const, message: 'This link has expired' };
    }

    if (link.password) {
      if (!password) {
        return { status: 'password_required' as const, message: 'This link requires a password' };
      }
      const valid = await bcrypt.compare(password, link.password);
      if (!valid) {
        return { status: 'forbidden' as const, message: 'Invalid password' };
      }
    }

    return { status: 'ok' as const, link, originalUrl: link.originalUrl };
  }

  async trackClick(linkId: string, ip: string | null, userAgent: string | null, referer: string | null) {
    await redirectRepository.createClick({
      shortLinkId: linkId,
      ip,
      userAgent,
      referer,
      device: parseDevice(userAgent || undefined),
      browser: parseBrowser(userAgent || undefined),
    });
  }
}

export const redirectService = new RedirectService();
