import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/api';

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    queryClient.clear();
    logout();
    navigate('/login');
  };
}
