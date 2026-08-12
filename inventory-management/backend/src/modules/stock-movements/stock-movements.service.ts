import { stockMovementRepository } from './stock-movements.repository';
import type { CreateMovementInput, MovementPaginationInput } from './stock-movements.dto';

export class StockMovementService {
  async list(params: MovementPaginationInput) { return stockMovementRepository.findMany(params); }
  async create(data: CreateMovementInput, userId: string) { return stockMovementRepository.create(data, userId); }
}

export const stockMovementService = new StockMovementService();
