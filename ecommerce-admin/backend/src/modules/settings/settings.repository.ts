import { prisma } from '../../config/db';

export class SettingsRepository {
  async findAll() {
    return prisma.settings.findMany();
  }

  async findByKey(key: string) {
    return prisma.settings.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string, userId?: string) {
    return prisma.settings.upsert({
      where: { key },
      update: { value, userId },
      create: { key, value, userId },
    });
  }

  async bulkUpsert(settings: { key: string; value: string }[], userId?: string) {
    await prisma.$transaction(
      settings.map((s) =>
        prisma.settings.upsert({
          where: { key: s.key },
          update: { value: s.value, userId },
          create: { key: s.key, value: s.value, userId },
        }),
      ),
    );
    return prisma.settings.findMany();
  }
}

export const settingsRepository = new SettingsRepository();
