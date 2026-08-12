import { z } from 'zod';

export const upsertSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const bulkUpsertSchema = z.object({
  settings: z.array(upsertSettingSchema),
});

export type UpsertSettingInput = z.infer<typeof upsertSettingSchema>;
export type BulkUpsertInput = z.infer<typeof bulkUpsertSchema>;
