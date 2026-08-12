import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useToastStore } from '../store/toastStore';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const [email, setEmail] = useState('admin@ecommerce.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.data.user, data.data.accessToken);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ShopHub Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your admin panel</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="admin@ecommerce.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 rounded-lg bg-secondary p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo Credentials:</p>
            <p>Admin: admin@ecommerce.com / admin123</p>
            <p>Manager: manager@ecommerce.com / manager123</p>
            <p>Staff: staff@ecommerce.com / staff123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
