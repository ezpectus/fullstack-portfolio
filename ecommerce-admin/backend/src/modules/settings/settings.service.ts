import { settingsRepository } from './settings.repository';
import type { BulkUpsertInput } from './settings.dto';

export class SettingsService {
  async list() {
    return settingsRepository.findAll();
  }

  async getByKey(key: string) {
    return settingsRepository.findByKey(key);
  }

  async upsert(key: string, value: string, userId?: string) {
    return settingsRepository.upsert(key, value, userId);
  }

  async bulkUpsert(input: BulkUpsertInput, userId?: string) {
    return settingsRepository.bulkUpsert(input.settings, userId);
  }
}

export const settingsService = new SettingsService();
