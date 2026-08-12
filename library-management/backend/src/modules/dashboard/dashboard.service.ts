import { dashboardRepository } from './dashboard.repository';

export const dashboardService = {
  async getStats() {
    const [totalBooks, totalCopies, activeMembers, activeLoans, overdueLoans, pendingFines, pendingReservations] = await Promise.all([
      dashboardRepository.countBooks(),
      dashboardRepository.countBookCopies(),
      dashboardRepository.countActiveMembers(),
      dashboardRepository.countActiveLoans(),
      dashboardRepository.countOverdueLoans(),
      dashboardRepository.countPendingFines(),
      dashboardRepository.countPendingReservations(),
    ]);

    const totalFineAmount = await dashboardRepository.sumPendingFines();

    const popularBooksRaw = await dashboardRepository.groupPopularBooks(10);

    const popularBooksWithDetails = await Promise.all(
      popularBooksRaw.map(async (item) => {
        const copy = await dashboardRepository.findBookCopyById(item.bookCopyId, { book: true });
        if (!copy?.book) return null;
        return { ...copy.book, loanCount: item._count };
      }),
    );

    const now = new Date();
    const monthlyData: { month: string; loans: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await dashboardRepository.countLoansByRange(monthStart, monthEnd);
      monthlyData.push({ month: monthStart.toLocaleDateString('en-US', { month: 'short' }), loans: count });
    }

    return {
      totalBooks,
      totalCopies,
      activeMembers,
      activeLoans,
      overdueLoans,
      pendingFines,
      pendingReservations,
      monthlyData,
      totalFineAmount: totalFineAmount._sum.amount || 0,
      popularBooks: popularBooksWithDetails.filter((item): item is NonNullable<typeof item> => item !== null),
    };
  },
};
