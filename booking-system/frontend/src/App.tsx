import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Calendar from './pages/Calendar';
import Services from './pages/Services';
import Providers from './pages/Providers';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import api from './lib/api';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role || 'PROVIDER')) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { loadFromStorage, logout } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setInitialized(true);
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        loadFromStorage(res.data.data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setInitialized(true));
  }, [loadFromStorage, logout]);

  if (!initialized) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="services" element={<ProtectedRoute roles={['ADMIN']}><Services /></ProtectedRoute>} />
          <Route path="providers" element={<ProtectedRoute roles={['ADMIN']}><Providers /></ProtectedRoute>} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<ProtectedRoute roles={['ADMIN']}><Settings /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
