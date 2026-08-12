import { useToastStore } from '../../store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-4 shadow-lg min-w-[300px]',
              toast.type === 'success' && 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
              toast.type === 'error' && 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
              toast.type === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
            )}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
            <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
