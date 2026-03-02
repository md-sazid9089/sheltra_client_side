/**
 * Modern Card Component
 * Standard and glassmorphism variants
 */
export default function Card({
    children,
    variant = 'standard',
    padding = 'md',
    className = '',
    hover = false,
    onClick,
    ...props
}) {
    const variants = {
        standard: 'bg-white border border-gray-200 shadow-md',
        glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-glass',
    };
    
    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    
    return (
        <div
            onClick={onClick}
            className={`
                rounded-2xl transition-all duration-200
                ${variants[variant] || variants.standard}
                ${paddings[padding] || paddings.md}
                ${hover ? 'hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 cursor-pointer' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * Card Header Component
 */
export function CardHeader({ title, subtitle, actions, className = '' }) {
    return (
        <div className={`flex items-start justify-between mb-6 ${className}`}>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

/**
 * Card Section Component
 */
export function CardSection({ title, children, className = '' }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {title && <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h4>}
            {children}
        </div>
    );
}
