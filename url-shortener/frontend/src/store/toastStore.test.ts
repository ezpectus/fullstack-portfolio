import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore } from '../store/toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('should start with empty toasts', () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('should add a toast', () => {
    useToastStore.getState().addToast('success', 'Test message');
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Test message');
  });

  it('should remove a toast by id', () => {
    useToastStore.getState().addToast('error', 'Error message');
    const toasts = useToastStore.getState().toasts;
    const id = toasts[0].id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
