import documentsRepository from './documents.repository';
import { NotFoundError } from '../../shared/errors';
import { generateCertificatePDF } from '../../shared/pdf';
import { prisma } from '../../config/db';

export class DocumentsService {
  async list(params: { page?: number; limit?: number; employeeId?: string; type?: string }) {
    return documentsRepository.findMany(params);
  }

  async getById(id: string) {
    const doc = await documentsRepository.findById(id);
    if (!doc) throw new NotFoundError('Document');
    return doc;
  }

  async create(data: { employeeId: string; type: string; title: string; content?: string }, createdBy: string) {
    return documentsRepository.create({ ...data, createdBy });
  }

  async delete(id: string) {
    const doc = await documentsRepository.findById(id);
    if (!doc) throw new NotFoundError('Document');
    return documentsRepository.delete(id);
  }

  async generatePDF(documentId: string): Promise<Buffer> {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        employee: { include: { user: { select: { name: true } }, department: true } },
      },
    });
    if (!doc) throw new NotFoundError('Document');

    const emp: any = doc.employee;
    return generateCertificatePDF({
      employeeName: emp?.user?.name || `${emp?.firstName} ${emp?.lastName}` || 'Unknown',
      position: emp?.position || 'N/A',
      department: emp?.department?.name || 'N/A',
      hireDate: emp?.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A',
      companyName: 'HR Portal Inc.',
    });
  }

  async generateCertificate(employeeId: string): Promise<Buffer> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: { select: { name: true } }, department: true },
    });
    if (!employee) throw new NotFoundError('Employee');

    return generateCertificatePDF({
      employeeName: employee.user?.name || `${employee.firstName} ${employee.lastName}`,
      position: employee.position || 'N/A',
      department: employee.department?.name || 'N/A',
      hireDate: employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A',
      companyName: 'HR Portal Inc.',
    });
  }
}

export default new DocumentsService();
