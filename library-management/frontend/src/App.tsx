import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { pageTransition } from './components/animations/MotionComponents';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import BookList from './features/books/BookList';
import BookDetail from './features/books/BookDetail';
import BookForm from './features/books/BookForm';
import BookCopies from './features/book-copies/BookCopies';
import MemberList from './features/members/MemberList';
import MemberDetail from './features/members/MemberDetail';
import LoanList from './features/loans/LoanList';
import ReservationList from './features/reservations/ReservationList';
import FineList from './features/fines/FineList';
import Reports from './features/reports/Reports';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && (!user || !roles.includes(user.role))) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-serif text-amber-600">404</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Page not found</p>
      <a href="/" className="btn-primary mt-4">Go Home</a>
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const { loadFromStorage } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      loadFromStorage();
    }
  }, [loadFromStorage]);

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="books" element={<PageWrapper><BookList /></PageWrapper>} />
            <Route path="books/:id" element={<PageWrapper><BookDetail /></PageWrapper>} />
            <Route path="books/new" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BookForm /></ProtectedRoute></PageWrapper>} />
            <Route path="books/:id/edit" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BookForm /></ProtectedRoute></PageWrapper>} />
            <Route path="book-copies" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BookCopies /></ProtectedRoute></PageWrapper>} />
            <Route path="members" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><MemberList /></ProtectedRoute></PageWrapper>} />
            <Route path="members/:id" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><MemberDetail /></ProtectedRoute></PageWrapper>} />
            <Route path="loans" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><LoanList /></ProtectedRoute></PageWrapper>} />
            <Route path="reservations" element={<PageWrapper><ReservationList /></PageWrapper>} />
            <Route path="fines" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><FineList /></ProtectedRoute></PageWrapper>} />
            <Route path="reports" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><Reports /></ProtectedRoute></PageWrapper>} />
          </Route>
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
