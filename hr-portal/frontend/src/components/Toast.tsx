import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

let toastCallback: ((toast: Omit<ToastItem, 'id'>) => void) | null = null;

export function toast(type: ToastType, message: string) {
  if (toastCallback) toastCallback({ type, message });
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastCallback = (toast) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => remove(id), 4000);
    };
    return () => { toastCallback = null; };
  }, [remove]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />,
  };

  const colors = {
    success: 'var(--color-success)',
    error: 'var(--color-danger)',
    info: 'var(--color-primary)',
    warning: 'var(--color-warning)',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-[300px]"
            style={{ backgroundColor: 'var(--color-surface)', borderLeft: `4px solid ${colors[t.type]}` }}
          >
            <span style={{ color: colors[t.type] }}>{icons[t.type]}</span>
            <p className="flex-1 text-sm" style={{ color: 'var(--color-text)' }}>{t.message}</p>
            <button onClick={() => remove(t.id)} style={{ color: 'var(--color-text-muted)' }}>
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
