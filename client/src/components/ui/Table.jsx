import { cn } from '@/lib/cn';

export function Table({ columns, data, className, onRowClick }) {
  return (
    <div className={cn('overflow-x-auto rounded-card border border-border-light dark:border-border-dark', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-surface-darkBase border-b border-border-light dark:border-border-dark">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold text-text-secondary dark:text-text-darkSecondary whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-text-muted dark:text-text-darkMuted"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border-light dark:border-border-dark last:border-0',
                  'hover:bg-gray-50 dark:hover:bg-surface-darkBase transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-text-primary dark:text-text-darkPrimary whitespace-nowrap"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
