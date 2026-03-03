import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Textarea = forwardRef(function Textarea(
  { label, error, id, className, rows = 4, ...props },
  ref
) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'w-full px-4 py-2.5 rounded-input border text-sm transition-colors duration-200 resize-y',
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
        <p className="text-xs text-semantic-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
