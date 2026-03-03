import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef(function Input(
  { label, error, id, className, type = 'text', ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'w-full px-4 py-2.5 rounded-input border text-sm transition-colors duration-200',
          'bg-white dark:bg-surface-darkCard',
          'text-text-primary dark:text-text-darkPrimary',
          'placeholder:text-text-muted dark:placeholder:text-text-darkMuted',
          error
            ? 'border-semantic-error focus:ring-semantic-error'
            : 'border-border-light dark:border-border-dark focus:ring-brand-primary',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-surface-darkBase',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-semantic-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
