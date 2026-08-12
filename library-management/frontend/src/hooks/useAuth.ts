import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await authApi.login(data);
      setAuth(res.user, res.accessToken);
      return res;
    },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      return authApi.register(data);
    },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', 'Registration failed');
      console.error('Register error:', error);
    },
  });
};

export const useCurrentUser = () => {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    enabled: !!accessToken && isAuthenticated,
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
};
