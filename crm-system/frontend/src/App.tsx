import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/layout/Layout';
import { PageTransition } from '@/components/animations/MotionComponents';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CustomersPage from '@/pages/CustomersPage';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
import DealsPage from '@/pages/DealsPage';
import NotesPage from '@/pages/NotesPage';
import SettingsPage from '@/pages/SettingsPage';
import ExportPage from '@/pages/ExportPage';
import UsersPage from '@/pages/UsersPage';
import NotFoundPage from '@/pages/NotFoundPage';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageTransition><DashboardPage /></PageTransition>} />
          <Route path="customers" element={<PageTransition><CustomersPage /></PageTransition>} />
          <Route path="customers/:id" element={<PageTransition><CustomerDetailPage /></PageTransition>} />
          <Route path="deals" element={<PageTransition><DealsPage /></PageTransition>} />
          <Route path="notes" element={<PageTransition><NotesPage /></PageTransition>} />
          <Route path="export" element={<PageTransition><ProtectedRoute roles={['admin', 'manager']}><ExportPage /></ProtectedRoute></PageTransition>} />
          <Route path="users" element={<PageTransition><ProtectedRoute roles={['admin']}><UsersPage /></ProtectedRoute></PageTransition>} />
          <Route path="settings" element={<PageTransition><SettingsPage /></PageTransition>} />
        </Route>
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
