import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { queryClient } from '../main';
import api from '../lib/api';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore errors on logout
    }
    logout();
    queryClient.clear();
    navigate('/login');
  };
}
