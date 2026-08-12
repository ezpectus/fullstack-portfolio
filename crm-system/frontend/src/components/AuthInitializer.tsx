import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useMe } from '@/api/hooks';

export default function AuthInitializer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isError } = useMe();

  useEffect(() => {
    if (isError && isAuthenticated) {
      useAuthStore.getState().logout();
    }
  }, [isError, isAuthenticated]);

  useEffect(() => {
    if (data) {
      useAuthStore.getState().updateUser(data);
    }
  }, [data]);

  return null;
}
