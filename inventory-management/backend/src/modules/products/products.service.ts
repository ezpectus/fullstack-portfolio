import { productRepository } from './products.repository';
import type { CreateProductInput, UpdateProductInput, ProductPaginationInput } from './products.dto';

export class ProductService {
  async list(params: ProductPaginationInput) {
    return productRepository.findMany(params);
  }

  async getById(id: string) {
    return productRepository.findById(id);
  }

  async create(data: CreateProductInput) {
    return productRepository.create(data);
  }

  async update(id: string, data: UpdateProductInput) {
    return productRepository.update(id, data);
  }

  async delete(id: string) {
    return productRepository.delete(id);
  }

  async getStockLevels(id: string) {
    return productRepository.getStockLevels(id);
  }
}

export const productService = new ProductService();
