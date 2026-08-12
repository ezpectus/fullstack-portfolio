import { promoCodesRepository } from './promo-codes.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { CreatePromoInput, UpdatePromoInput } from './promo-codes.dto';

export class PromoCodesService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { codes, total } = await promoCodesRepository.findMany({
      skip,
      limit,
      search: query.search,
      isActive: query.status,
    });
    return { data: codes, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const code = await promoCodesRepository.findById(id);
    if (!code) throw new NotFoundError('Promo code');
    return code;
  }

  async create(input: CreatePromoInput) {
    const data: any = { ...input };
    if (input.expiresAt) data.expiresAt = new Date(input.expiresAt);
    return promoCodesRepository.create(data);
  }

  async update(id: string, input: UpdatePromoInput) {
    const code = await promoCodesRepository.findById(id);
    if (!code) throw new NotFoundError('Promo code');
    const data: any = { ...input };
    if (input.expiresAt) data.expiresAt = new Date(input.expiresAt);
    return promoCodesRepository.update(id, data);
  }

  async delete(id: string) {
    const code = await promoCodesRepository.findById(id);
    if (!code) throw new NotFoundError('Promo code');
    await promoCodesRepository.delete(id);
  }
}

export const promoCodesService = new PromoCodesService();
