import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'text-green-500 border-green-500/30 bg-green-500/10',
  error: 'text-red-500 border-red-500/30 bg-red-500/10',
  info: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${colors[toast.type]}`}
            >
              <Icon size={18} />
              <p className="text-sm font-medium">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
