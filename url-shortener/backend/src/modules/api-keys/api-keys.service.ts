import { apiKeysRepository, generateApiKey, maskApiKey } from './api-keys.repository';
import { NotFoundError } from '../../shared/errors';

export const apiKeysService = {
  list: async (userId: string) => {
    const keys = await apiKeysRepository.findAll(userId);
    return keys.map((k) => ({
      id: k.id,
      name: k.name,
      key: maskApiKey(k.key),
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
    }));
  },

  create: async (userId: string, name: string) => {
    const key = generateApiKey();
    const apiKey = await apiKeysRepository.create({ userId, name, key });
    return { id: apiKey.id, name: apiKey.name, key, lastUsedAt: apiKey.lastUsedAt, createdAt: apiKey.createdAt };
  },

  delete: async (userId: string, id: string) => {
    const apiKey = await apiKeysRepository.findById(id);
    if (!apiKey || apiKey.userId !== userId) throw new NotFoundError('API key');
    await apiKeysRepository.delete(id);
    return { message: 'API key deleted' };
  },
};
