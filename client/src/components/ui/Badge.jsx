import { cn } from '@/lib/cn';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  primary: 'bg-cyan-100 text-brand-primary dark:bg-cyan-900/40 dark:text-cyan-300',
  accent: 'bg-teal-100 text-brand-accent dark:bg-teal-900/40 dark:text-teal-300',
  success: 'bg-semantic-success-light text-green-700 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-semantic-warning-light text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  error: 'bg-semantic-error-light text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export function Badge({ children, variant = 'default', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
