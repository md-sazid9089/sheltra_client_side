import { useState, useEffect, useCallback, createContext, useContext } from 'react';

// ── Toast Context ────────────────────────────────────────────────────
const ToastContext = createContext(null);

/**
 * Hook to access the toast notification system.
 * Usage: const toast = useToast();
 *        toast.success('Saved!');
 *        toast.error('Something went wrong');
 *        toast.info('Tip: you can do XYZ');
 */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
    return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────
let toastIdCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((type, message, duration = 5000) => {
        const id = ++toastIdCounter;
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        return id;
    }, []);

    const api = {
        success: (msg, duration) => addToast('success', msg, duration),
        error: (msg, duration) => addToast('error', msg, duration ?? 7000),
        info: (msg, duration) => addToast('info', msg, duration),
        dismiss: removeToast,
        dismissAll: () => setToasts([]),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            {/* Toast container – fixed top-right */}
            <div
                aria-live="polite"
                aria-label="Notifications"
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ── Single Toast ─────────────────────────────────────────────────────
const TOAST_STYLES = {
    success: {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-900',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        ),
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-900',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
            />
        ),
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        iconPath: (
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
            />
        ),
    },
};

function ToastItem({ toast, onDismiss }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(toast.id), 300);
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onDismiss]);

    const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

    return (
        <div
            role="alert"
            className={`pointer-events-auto border rounded-lg shadow-lg p-4 flex items-start gap-3 transition-all duration-300 ${
                style.bg
            } ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} fill="currentColor" viewBox="0 0 20 20">
                {style.iconPath}
            </svg>
            <p className={`text-sm font-medium flex-1 ${style.title}`}>{toast.message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onDismiss(toast.id), 300);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
