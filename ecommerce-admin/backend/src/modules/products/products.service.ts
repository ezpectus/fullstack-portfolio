import { productsRepository } from './products.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta, slugify } from '../../shared/utils';
import { prisma } from '../../config/db';
import type { RequestQuery } from '../../shared/types';
import type { CreateProductInput, UpdateProductInput } from './products.dto';

export class ProductsService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { products, total } = await productsRepository.findMany({
      skip,
      limit,
      search: query.search,
      status: query.status,
      categoryId: query.categoryId,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
    });
    return { data: products, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const product = await productsRepository.findById(id);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async create(input: CreateProductInput, userId: string) {
    const existing = await prisma.product.findUnique({ where: { sku: input.sku } });
    if (existing) throw new ConflictError('SKU already exists');

    const slug = input.slug || slugify(input.name);
    return productsRepository.create({
      ...input,
      slug,
      userId,
      variants: input.variants ? { create: input.variants } : undefined,
      images: input.images ? { create: input.images } : undefined,
    });
  }

  async update(id: string, input: UpdateProductInput) {
    const product = await productsRepository.findById(id);
    if (!product) throw new NotFoundError('Product');

    const data: any = { ...input };
    if (input.name && !input.slug) data.slug = slugify(input.name);
    if (input.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      data.variants = { create: input.variants };
    }
    if (input.images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      data.images = { create: input.images };
    }
    return productsRepository.update(id, data);
  }

  async delete(id: string) {
    const product = await productsRepository.findById(id);
    if (!product) throw new NotFoundError('Product');
    await productsRepository.delete(id);
  }
}

export const productsService = new ProductsService();
