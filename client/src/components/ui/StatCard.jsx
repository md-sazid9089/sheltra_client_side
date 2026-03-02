import { cn } from '@/lib/cn';

export function StatCard({ label, value, icon, trend, trendLabel, className }) {
  const isPositive = trend === 'up';

  return (
    <div
      className={cn(
        'fancy-card rounded-card p-5 hover-lift motion-safe-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm mb-1" style={{ color: 'hsl(0,0%,70%)' }}>
            {label}
          </p>
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
          {trendLabel && (
            <p className={cn('text-xs mt-1 font-medium', isPositive ? 'text-semantic-success' : 'text-semantic-error')}>
              {isPositive ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-white/10 text-cyan-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
