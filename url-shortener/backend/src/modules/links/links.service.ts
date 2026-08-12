import { linksRepository } from './links.repository';
import { redis } from '../../config/redis';
import { ConflictError, NotFoundError, BadRequestError } from '../../shared/errors';
import bcrypt from 'bcrypt';
import type { UpdateLinkInput } from './links.dto';

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length: number): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

async function generateUniqueCode(length: number): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateCode(length);
    const existing = await linksRepository.findByCode(code);
    if (!existing) return code;
  }
  throw new BadRequestError('Failed to generate unique short code');
}

export class LinksService {
  async create(userId: string, data: { originalUrl: string; alias?: string; expiresAt?: string; password?: string }) {
    if (data.alias) {
      const existing = await linksRepository.findByAlias(data.alias);
      if (existing) throw new ConflictError('Alias already taken');
    }

    const settings = await linksRepository.getSettings(userId);
    const codeLength = settings?.codeLength ?? 6;

    const shortCode = data.alias || await generateUniqueCode(codeLength);

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

    const link = await linksRepository.create({
      originalUrl: data.originalUrl,
      shortCode,
      alias: data.alias || undefined,
      userId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      password: hashedPassword,
    });

    await redis.set(`redirect:${shortCode}`, link.originalUrl, 'EX', 86400);

    return link;
  }

  async list(userId: string, params: { page: number; limit: number; search?: string; status?: string; sort: string; order: string }) {
    const [items, total] = await Promise.all([
      linksRepository.list(userId, params),
      linksRepository.count(userId, { search: params.search, status: params.status }),
    ]);
    return { items, total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) };
  }

  async getById(userId: string, id: string) {
    const link = await linksRepository.findById(id);
    if (!link || link.userId !== userId) throw new NotFoundError('Link');
    return link;
  }

  async update(userId: string, id: string, data: UpdateLinkInput) {
    const link = await this.getById(userId, id);
    if (data.alias && data.alias !== link.alias) {
      const existing = await linksRepository.findByAlias(data.alias);
      if (existing) throw new ConflictError('Alias already taken');
    }
    const updateData: Record<string, unknown> = { ...data };
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    const updated = await linksRepository.update(id, updateData);
    if (updated) await redis.del(`redirect:${updated.shortCode}`);
    return updated;
  }

  async delete(userId: string, id: string) {
    const link = await this.getById(userId, id);
    await redis.del(`redirect:${link.shortCode}`);
    await linksRepository.delete(id);
    return { message: 'Link deleted' };
  }

  async bulkCreate(userId: string, urls: string[]) {
    const results: Array<{ originalUrl: string; shortCode: string; success: boolean; error?: string }> = [];
    for (const url of urls) {
      try {
        const link = await this.create(userId, { originalUrl: url });
        results.push({ originalUrl: url, shortCode: link.shortCode, success: true });
      } catch (err) {
        results.push({ originalUrl: url, shortCode: '', success: false, error: (err as Error).message });
      }
    }
    return results;
  }
}

export const linksService = new LinksService();
