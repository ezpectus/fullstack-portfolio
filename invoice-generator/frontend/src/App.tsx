import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './store/authStore';
import { useAuthInit } from './hooks/useAuthInit';
import { ErrorBoundary } from './components/ErrorBoundary';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import InvoiceList from './features/invoices/InvoiceList';
import InvoiceDetail from './features/invoices/InvoiceDetail';
import InvoiceCreate from './features/invoices/InvoiceCreate';
import ClientList from './features/clients/ClientList';
import ClientDetail from './features/clients/ClientDetail';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import Templates from './features/templates/Templates';
import Layout from './components/Layout';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && (!user || !roles.includes(user.role))) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit" transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  useAuthInit();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/invoices" element={<PageWrapper><InvoiceList /></PageWrapper>} />
            <Route path="/invoices/new" element={<PageWrapper><ProtectedRoute roles={['OWNER', 'ACCOUNTANT']}><InvoiceCreate /></ProtectedRoute></PageWrapper>} />
            <Route path="/invoices/:id" element={<PageWrapper><InvoiceDetail /></PageWrapper>} />
            <Route path="/clients" element={<PageWrapper><ProtectedRoute roles={['OWNER', 'ACCOUNTANT']}><ClientList /></ProtectedRoute></PageWrapper>} />
            <Route path="/clients/:id" element={<PageWrapper><ProtectedRoute roles={['OWNER', 'ACCOUNTANT']}><ClientDetail /></ProtectedRoute></PageWrapper>} />
            <Route path="/reports" element={<PageWrapper><ProtectedRoute roles={['OWNER', 'ACCOUNTANT']}><Reports /></ProtectedRoute></PageWrapper>} />
            <Route path="/templates" element={<PageWrapper><ProtectedRoute roles={['OWNER', 'ACCOUNTANT']}><Templates /></ProtectedRoute></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><ProtectedRoute roles={['OWNER']}><Settings /></ProtectedRoute></PageWrapper>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
