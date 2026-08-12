import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  info: 'text-sky-600 bg-sky-50 border-sky-200',
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
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md ${colors[toast.type]} cursor-pointer`}
              onClick={() => removeToast(toast.id)}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
