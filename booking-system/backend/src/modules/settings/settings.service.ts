import { settingsRepository } from './settings.repository';
import { NotFoundError } from '../../shared/errors';

export class SettingsService {
  async getAll() {
    return settingsRepository.findAll();
  }

  async getByKey(key: string) {
    const setting = await settingsRepository.findByKey(key);
    if (!setting) throw new NotFoundError('Setting');
    return setting;
  }

  async update(key: string, value: string) {
    return settingsRepository.upsert(key, value);
  }

  async bulkUpdate(settings: { key: string; value: string }[]) {
    await settingsRepository.bulkUpsert(settings);
    return settingsRepository.findAll();
  }

  async delete(key: string) {
    const setting = await settingsRepository.findByKey(key);
    if (!setting) throw new NotFoundError('Setting');
    return settingsRepository.delete(key);
  }
}

export const settingsService = new SettingsService();
