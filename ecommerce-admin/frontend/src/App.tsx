import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/themeStore';
import { PageTransition } from './components/animations/MotionComponents';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Customers from './pages/Customers';
import PromoCodes from './pages/PromoCodes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);
  const location = useLocation();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="categories" element={<PageTransition><Categories /></PageTransition>} />
          <Route path="orders" element={<PageTransition><Orders /></PageTransition>} />
          <Route path="orders/:id" element={<PageTransition><OrderDetail /></PageTransition>} />
          <Route path="customers" element={<PageTransition><Customers /></PageTransition>} />
          <Route path="promo-codes" element={<PageTransition><PromoCodes /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><Analytics /></PageTransition>} />
          <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
