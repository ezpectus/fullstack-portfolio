export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'MEMBER';
  member?: Member;
}

export interface Member {
  id: string;
  userId: string;
  cardNumber: string;
  phone?: string;
  address?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  joinedAt: string;
  loans?: Loan[];
  fines?: Fine[];
  _count?: { loans: number; fines: number };
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string;
  publisher?: string;
  publishYear?: number;
  genre?: string;
  description?: string;
  coverUrl?: string;
  categoryId?: string;
  category?: Category;
  copies?: BookCopy[];
  createdAt: string;
  updatedAt: string;
}

export interface BookCopy {
  id: string;
  bookId: string;
  book?: Book;
  code: string;
  status: 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED';
  condition: string;
  acquiredAt: string;
}

export interface Loan {
  id: string;
  bookCopyId: string;
  bookCopy?: BookCopy;
  memberId: string;
  member?: Member & { user?: User };
  librarianId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  renewals: number;
  fine?: Fine;
}

export interface Reservation {
  id: string;
  memberId: string;
  member?: Member & { user?: User };
  bookId: string;
  book?: Book;
  bookCopyId?: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  reservedAt: string;
  fulfilledAt?: string;
  expiresAt?: string;
}

export interface Fine {
  id: string;
  loanId: string;
  loan?: Loan;
  memberId: string;
  member?: Member & { user?: User };
  amount: number;
  status: 'PENDING' | 'PAID' | 'WAIVED';
  reason: string;
  paidAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalCopies: number;
  activeMembers: number;
  activeLoans: number;
  overdueLoans: number;
  pendingReservations: number;
  pendingFines: number;
  totalFineAmount: number;
  monthlyData: { month: string; loans: number }[];
  popularBooks: (Book & { loanCount: number })[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface BookInput {
  isbn: string;
  title: string;
  authors: string;
  publisher?: string;
  publishYear?: number;
  genre?: string;
  description?: string;
  coverUrl?: string;
  categoryId?: string;
}

export interface BookCopyInput {
  bookId: string;
  code: string;
  status?: 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'LOST' | 'DAMAGED';
  condition?: string;
}

export interface MemberInput {
  phone?: string;
  address?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
}
