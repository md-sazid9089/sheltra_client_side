import { cn } from '@/lib/cn';

export function StatCard({ label, value, icon, trend, trendLabel, className }) {
  const isPositive = trend === 'up';

  return (
    <div
      className={cn(
        'fancy-card rounded-card p-5 hover-lift motion-safe-fade-in shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm mb-1 font-semibold" style={{ color: 'hsl(0,0%,75%)' }}>
            {label}
          </p>
          <p className="text-3xl font-black text-white">
            {value}
          </p>
          {trendLabel && (
            <p className={cn('text-xs mt-2 font-bold', isPositive ? 'text-green-300' : 'text-red-300')}>
              {isPositive ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-cyan-500/15 text-cyan-200 shadow-md">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
