import { categoriesRepository } from './categories.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta, slugify } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.dto';

export class CategoriesService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { categories, total } = await categoriesRepository.findMany({
      skip,
      limit,
      search: query.search,
      parentId: query.parentId,
    });
    return { data: categories, pagination: buildPaginationMeta(total, page, limit) };
  }

  async tree() {
    return categoriesRepository.findTree();
  }

  async getById(id: string) {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async create(input: CreateCategoryInput) {
    const slug = input.slug || slugify(input.name);
    return categoriesRepository.create({ ...input, slug });
  }

  async update(id: string, input: UpdateCategoryInput) {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new NotFoundError('Category');
    const data = { ...input };
    if (input.name && !input.slug) data.slug = slugify(input.name);
    return categoriesRepository.update(id, data);
  }

  async delete(id: string) {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new NotFoundError('Category');
    await categoriesRepository.delete(id);
  }
}

export const categoriesService = new CategoriesService();
