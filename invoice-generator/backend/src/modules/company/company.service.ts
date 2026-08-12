import { prisma } from '../../config/db';
import type { Prisma } from '@prisma/client';

type CompanyUpdateData = {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  logo?: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  bankSwift?: string;
  invoicePrefix?: string;
  invoiceStart?: number;
  emailSubject?: string;
  emailBody?: string;
};

export class CompanyService {
  async get(userId: string) {
    let company = await prisma.company.findUnique({ where: { userId } });
    if (!company) {
      company = await prisma.company.create({ data: { userId, name: 'My Company' } });
    }
    return company;
  }

  async update(userId: string, data: CompanyUpdateData) {
    const company = await prisma.company.findUnique({ where: { userId } });
    if (!company) {
      return prisma.company.create({ data: { userId, name: data.name || 'My Company', ...data } as Prisma.CompanyUncheckedCreateInput });
    }
    return prisma.company.update({ where: { userId }, data });
  }
}

export const companyService = new CompanyService();
