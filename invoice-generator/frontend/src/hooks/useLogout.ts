import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/endpoints';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore errors on logout
    }
    logout();
    queryClient.clear();
    navigate('/login');
  };
}
