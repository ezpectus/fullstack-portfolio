import { categoryRepository } from './categories.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.dto';

export class CategoryService {
  async getTree() { return categoryRepository.findTree(); }
  async getById(id: string) { return categoryRepository.findById(id); }
  async create(data: CreateCategoryInput) { return categoryRepository.create(data); }
  async update(id: string, data: UpdateCategoryInput) { return categoryRepository.update(id, data); }
  async delete(id: string) { return categoryRepository.delete(id); }
}

export const categoryService = new CategoryService();
