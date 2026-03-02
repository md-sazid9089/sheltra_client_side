/**
 * Modern Badge Component
 * For roles, status, proficiency, etc.
 */
export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 border-gray-200',
        primary: 'bg-primary-100 text-primary-700 border-primary-200',
        success: 'bg-success-100 text-success-700 border-success-200',
        danger: 'bg-danger-100 text-danger-700 border-danger-200',
        warning: 'bg-warning-100 text-warning-700 border-warning-200',
        // Role-specific
        refugee: 'bg-blue-100 text-blue-700 border-blue-200',
        ngo: 'bg-purple-100 text-purple-700 border-purple-200',
        employer: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        admin: 'bg-pink-100 text-pink-700 border-pink-200',
        // Proficiency levels
        beginner: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
        advanced: 'bg-green-100 text-green-700 border-green-200',
        fluent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        // Status
        pending: 'bg-orange-100 text-orange-700 border-orange-200',
        approved: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
        verified: 'bg-teal-100 text-teal-700 border-teal-200',
    };
    
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };
    
    return (
        <span
            className={`
                inline-flex items-center font-semibold rounded-full border
                ${variants[variant] || variants.default}
                ${sizes[size] || sizes.md}
                ${className}
            `}
            {...props}
        >
            {children}
        </span>
    );
}
