import { prisma } from '../../config/db';

export class SettingsRepository {
  async findAll() {
    const settings = await prisma.businessSettings.findMany();
    return settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string>);
  }

  async findByKey(key: string) {
    return prisma.businessSettings.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string) {
    return prisma.businessSettings.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  async bulkUpsert(settings: { key: string; value: string }[]) {
    await Promise.all(settings.map((s) => this.upsert(s.key, s.value)));
  }

  async delete(key: string) {
    return prisma.businessSettings.delete({ where: { key } });
  }
}

export const settingsRepository = new SettingsRepository();
