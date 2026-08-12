import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import { ToastContainer } from './components/Toast';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Employees = lazy(() => import('./pages/Employees'));
const EmployeeDetail = lazy(() => import('./pages/EmployeeDetail'));
const Departments = lazy(() => import('./pages/Departments'));
const Leave = lazy(() => import('./pages/Leave'));
const Payroll = lazy(() => import('./pages/Payroll'));
const Documents = lazy(() => import('./pages/Documents'));
const Reports = lazy(() => import('./pages/Reports'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const user = useAuthStore((s) => s.user);
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => { initialize(); }, [initialize]);

  return (
    <>
      <ToastContainer />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
        <Route path="employees" element={<Suspense fallback={<LoadingSpinner />}><Employees /></Suspense>} />
        <Route path="employees/:id" element={<Suspense fallback={<LoadingSpinner />}><EmployeeDetail /></Suspense>} />
        <Route path="departments" element={<Suspense fallback={<LoadingSpinner />}><Departments /></Suspense>} />
        <Route path="leave" element={<Suspense fallback={<LoadingSpinner />}><Leave /></Suspense>} />
        <Route path="payroll" element={<RoleRoute roles={['HR_ADMIN']}><Suspense fallback={<LoadingSpinner />}><Payroll /></Suspense></RoleRoute>} />
        <Route path="documents" element={<Suspense fallback={<LoadingSpinner />}><Documents /></Suspense>} />
        <Route path="reports" element={<RoleRoute roles={['HR_ADMIN', 'MANAGER']}><Suspense fallback={<LoadingSpinner />}><Reports /></Suspense></RoleRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
      </Routes>
      </AnimatePresence>
    </>
  );
}
