import { reportsRepository } from './reports.repository';
import type { Prisma } from '@prisma/client';

export const reportsService = {
  async memberActivity(startDate?: string, endDate?: string) {
    const where: Prisma.LoanWhereInput = {};
    if (startDate || endDate) {
      where.borrowedAt = {};
      if (startDate) where.borrowedAt.gte = new Date(startDate);
      if (endDate) where.borrowedAt.lte = new Date(endDate);
    }

    const members = await reportsRepository.loanGroupByMember(where, 20);

    const result = await Promise.all(
      members.map(async (m) => {
        const member = await reportsRepository.findMemberById(m.memberId, { user: true });
        return { member, loanCount: m._count };
      }),
    );

    return result.filter((r) => r.member);
  },

  async popularGenres() {
    const books = await reportsRepository.findAllBooks({ genre: true });
    const genreCount: Record<string, number> = {};
    for (const b of books) {
      if (b.genre) genreCount[b.genre] = (genreCount[b.genre] || 0) + 1;
    }
    return Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  },

  async lostDamagedBooks() {
    const copies = await reportsRepository.findLostDamagedCopies();
    return {
      damaged: copies.filter((c) => c.status === 'DAMAGED').length,
      lost: copies.filter((c) => c.status === 'LOST').length,
      items: copies,
    };
  },

  async exportCsv() {
    const loans = await reportsRepository.findLoansForExport(1000);

    const headers = ['Loan ID', 'Book Title', 'Member Name', 'Borrowed At', 'Due Date', 'Returned At', 'Status'];
    const rows = loans.map((l) => [
      l.id,
      l.bookCopy.book.title,
      l.member.user.name,
      l.borrowedAt.toISOString(),
      l.dueDate.toISOString(),
      l.returnedAt?.toISOString() || '',
      l.status,
    ]);

    return [headers, ...rows].map((r) => r.map((field) => {
      const escaped = String(field).replace(/"/g, '""');
      if (/^[=+\-@]/.test(escaped)) {
        return `"'${escaped}"`;
      }
      return `"${escaped}"`;
    }).join(',')).join('\n');
  },
};
