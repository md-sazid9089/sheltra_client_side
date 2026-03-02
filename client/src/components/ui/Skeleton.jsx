import { cn } from '@/lib/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-card',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

Skeleton.Text = function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
            i === lines - 1 && 'w-2/3'
          )}
        />
      ))}
    </div>
  );
};

Skeleton.Card = function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        'bg-surface-card dark:bg-surface-darkCard rounded-card border border-border-light dark:border-border-dark p-6 space-y-4',
        className
      )}
    >
      <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
      </div>
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );
};
