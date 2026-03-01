/**
 * Modern Button Component
 * Supports: primary, secondary, ghost, destructive variants
 * Loading and disabled states
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className = '',
    onClick,
    type = 'button',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
    
    const variants = {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 focus:ring-primary-500/50',
        secondary: 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-300',
        destructive: 'bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white shadow-lg shadow-danger-500/30 hover:shadow-xl hover:shadow-danger-500/40 focus:ring-danger-500/50',
        success: 'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white shadow-lg shadow-success-500/30 hover:shadow-xl hover:shadow-success-500/40 focus:ring-success-500/50',
    };
    
    const sizes = {
        sm: 'px-4 py-2 text-sm gap-2',
        md: 'px-6 py-2.5 text-base gap-2',
        lg: 'px-8 py-3 text-lg gap-3',
    };
    
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                ${baseStyles}
                ${variants[variant] || variants.primary}
                ${sizes[size] || sizes.md}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
                    <span>{children}</span>
                    {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
                </>
            )}
        </button>
    );
}
