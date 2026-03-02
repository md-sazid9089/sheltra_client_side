import { cn } from '@/lib/cn';

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="mb-4 text-text-muted dark:text-text-darkMuted">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
