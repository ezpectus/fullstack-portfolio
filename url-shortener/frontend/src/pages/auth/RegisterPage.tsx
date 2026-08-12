import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../../api/hooks';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { PageTransition, MotionButton } from '../../components/animations/MotionComponents';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Zap, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const { mutate, isPending } = useRegister();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { email, password, name },
      {
        onSuccess: (data) => {
          setAuth({ token: data.accessToken, refreshToken: data.refreshToken, user: data.user });
          addToast('success', 'Account created!');
          navigate('/dashboard');
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Registration failed';
          addToast('error', message);
        },
      },
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card neon-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center shadow-neon">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl gradient-text">Create Account</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Get started with URL shortening</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="At least 8 characters"
                    required
                  />
                </div>
              </div>
              <MotionButton
                type="submit"
                disabled={isPending}
                className="w-full h-10 rounded-md bg-gradient-purple text-white font-medium shadow-neon disabled:opacity-50"
              >
                {isPending ? 'Creating account...' : 'Create Account'}
              </MotionButton>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
