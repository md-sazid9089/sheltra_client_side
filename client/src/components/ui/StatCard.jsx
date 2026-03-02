import { cn } from '@/lib/cn';

export function StatCard({ label, value, icon, trend, trendLabel, className }) {
  const isPositive = trend === 'up';

  return (
    <div
      className={cn(
        'bg-surface-card dark:bg-surface-darkCard rounded-card border border-border-light dark:border-border-dark shadow-card p-5 hover-lift motion-safe-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
            {value}
          </p>
          {trendLabel && (
            <p className={cn('text-xs mt-1 font-medium', isPositive ? 'text-semantic-success' : 'text-semantic-error')}>
              {isPositive ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-brand-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
