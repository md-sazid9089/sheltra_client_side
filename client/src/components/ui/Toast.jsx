import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/cn';

const ToastContext = createContext(null);

const toastVariants = {
  success: 'border-semantic-success bg-semantic-success-light dark:bg-green-900/40 text-green-800 dark:text-green-200',
  error: 'border-semantic-error bg-semantic-error-light dark:bg-red-900/40 text-red-800 dark:text-red-200',
  warning: 'border-semantic-warning bg-semantic-warning-light dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
  info: 'border-semantic-info bg-semantic-info-light dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200',
};

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-card border-l-4 shadow-card motion-safe-slide-up',
        toastVariants[toast.variant || 'info']
      )}
      role="alert"
    >
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
