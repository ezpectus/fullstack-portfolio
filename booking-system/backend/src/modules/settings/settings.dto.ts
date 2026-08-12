import { z } from 'zod';

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.string(),
  })),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
export type BulkUpdateSettingsInput = z.infer<typeof bulkUpdateSettingsSchema>;
