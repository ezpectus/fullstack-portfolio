import { useEffect } from 'react';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

export function useAuthInit() {
  const { isAuthenticated, setUser, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    authApi
      .refresh()
      .then((data) => {
        setAccessToken(data.accessToken);
        return authApi.me();
      })
      .then((user) => setUser(user))
      .catch(() => {
        logout();
      });
  }, [isAuthenticated, setUser, setAccessToken, logout]);
}
