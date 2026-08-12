import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from './store/auth';
import { pageVariants } from './components/animations/MotionComponents';
import api from './lib/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import StockMovements from './pages/StockMovements';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import Layout from './components/layout/Layout';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const { loadFromStorage, logout } = useAuthStore();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    api.post('/auth/refresh', {}, { withCredentials: true })
      .then((res) => {
        api.get('/auth/me')
          .then((meRes) => {
            loadFromStorage(meRes.data, res.data.accessToken);
          })
          .catch(() => {
            logout();
          });
      })
      .catch(() => {
        logout();
      })
      .finally(() => setBootstrapped(true));
  }, [loadFromStorage, logout]);

  if (!bootstrapped) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="products" element={<PageWrapper><Products /></PageWrapper>} />
          <Route path="products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
          <Route path="categories" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'MANAGER']}><Categories /></ProtectedRoute></PageWrapper>} />
          <Route path="warehouses" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'MANAGER']}><Warehouses /></ProtectedRoute></PageWrapper>} />
          <Route path="stock-movements" element={<PageWrapper><StockMovements /></PageWrapper>} />
          <Route path="suppliers" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'MANAGER']}><Suppliers /></ProtectedRoute></PageWrapper>} />
          <Route path="purchase-orders" element={<PageWrapper><ProtectedRoute roles={['ADMIN', 'MANAGER']}><PurchaseOrders /></ProtectedRoute></PageWrapper>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
