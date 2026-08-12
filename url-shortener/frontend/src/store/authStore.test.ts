import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('authStore', () => {
  it('should start with null token and user', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('should set auth data', () => {
    useAuthStore.getState().setAuth({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'user' },
    });
    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.user?.email).toBe('test@test.com');
    expect(state.isAuthenticated()).toBe(true);
  });

  it('should logout and clear state', () => {
    useAuthStore.getState().setAuth({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: { id: '1', email: 'test@test.com', name: 'Test', role: 'user' },
    });
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });
});
