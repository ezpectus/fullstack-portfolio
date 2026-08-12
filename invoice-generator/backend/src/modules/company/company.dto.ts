import { z } from 'zod';

export const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
  taxId: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankSwift: z.string().optional(),
  invoicePrefix: z.string().optional(),
  invoiceStart: z.number().int().min(1).optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
