import { useEffect, useCallback } from 'react';

/**
 * Reusable accessible Modal component.
 *
 * Props:
 *   isOpen      – whether to render the modal
 *   onClose     – callback to close the modal
 *   title       – header text
 *   subtitle    – optional subheading
 *   children    – body content
 *   footer      – optional footer element (buttons, etc.)
 *   size        – 'sm' | 'md' | 'lg' | 'xl' (default 'lg')
 *   gradient    – optional Tailwind gradient classes for header bg
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = 'lg',
    gradient = 'from-emerald-600 to-teal-600',
}) {
    // Close on Escape key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener('keydown', handleKeyDown);
        // Prevent background scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size] || sizeClasses.lg} max-h-[90vh] flex flex-col overflow-hidden`}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${gradient} px-6 py-4 flex items-center justify-between flex-shrink-0`}>
                    <div>
                        <h2 id="modal-title" className="text-lg font-semibold text-white">
                            {title}
                        </h2>
                        {subtitle && <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        aria-label="Close dialog"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body – scrollable */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>

                {/* Footer (optional) */}
                {footer && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">{footer}</div>
                )}
            </div>
        </div>
    );
}
