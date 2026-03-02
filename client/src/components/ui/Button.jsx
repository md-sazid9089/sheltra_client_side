import { cn } from '@/lib/cn';

const variants = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primary-hover focus-ring',
  secondary:
    'bg-white text-brand-primary border border-brand-primary hover:bg-blue-50 dark:bg-surface-darkCard dark:text-brand-accent dark:border-brand-accent dark:hover:bg-surface-darkBase focus-ring',
  accent:
    'bg-brand-accent text-white hover:bg-brand-accent-hover focus-ring',
  amber:
    'bg-brand-amber text-white hover:bg-brand-amber-hover focus-ring',
  ghost:
    'bg-transparent text-text-secondary hover:bg-gray-100 dark:text-text-darkSecondary dark:hover:bg-surface-darkCard focus-ring',
  danger:
    'bg-semantic-error text-white hover:bg-red-600 focus-ring',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-colors duration-200 hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
