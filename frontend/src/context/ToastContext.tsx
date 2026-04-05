import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles: Record<ToastType, { wrapper: string; icon: ReactNode }> = {
  success: {
    wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  error: {
    wrapper: 'bg-red-50 border-red-200 text-red-700',
    icon: <CircleAlert className="w-5 h-5" />,
  },
  info: {
    wrapper: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    icon: <Info className="w-5 h-5" />,
  },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [{ id, message, type }, ...prev]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 w-[min(92vw,360px)]">
        <AnimatePresence>
          {toasts.map((toast) => {
            const style = toastStyles[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                className={`rounded-2xl border shadow-xl backdrop-blur-md px-4 py-3 flex items-start gap-3 ${style.wrapper}`}
              >
                <div className="shrink-0 mt-0.5">{style.icon}</div>
                <p className="text-sm font-semibold flex-1 leading-relaxed">{toast.message}</p>
                <button
                  onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
                  className="p-1 rounded-lg hover:bg-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastContext must be used within a ToastProvider');
  return context;
};
