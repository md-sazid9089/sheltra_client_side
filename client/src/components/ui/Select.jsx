import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Select = forwardRef(function Select(
  { label, error, id, options = [], placeholder, className, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1.5">
      <style>{`
        select option {
          background-color: white;
          color: #111827;
          padding: 8px 4px;
        }
        select option:checked {
          background-color: #3b82f6;
          color: white;
        }
        @media (prefers-color-scheme: dark) {
          select option {
            background-color: #1f2937;
            color: #f3f4f6;
          }
          select option:checked {
            background-color: #3b82f6;
            color: white;
          }
        }
      `}</style>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? 'true' : undefined}
        className={cn(
          'w-full px-4 py-2.5 rounded-input border text-sm transition-colors duration-200 appearance-none',
          'bg-gray-50 dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100',
          error
            ? 'border-semantic-error focus:ring-semantic-error'
            : 'border-border-light dark:border-border-dark focus:ring-brand-primary',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-surface-darkBase',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-semantic-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
