/**
 * Skeleton Loading Component for loading states.
 *
 * Variants:
 *   card        – simple block placeholder
 *   list-item   – block with title + subtitle lines
 *   table-row   – row of cells matching a table layout (cols prop sets column count)
 *   detail-card – card with avatar + multiple text lines
 */
export default function SkeletonLoader({ count = 3, variant = 'card', cols = 5 }) {
    if (variant === 'card') {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
                ))}
            </div>
        );
    }

    if (variant === 'list-item') {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'table-row') {
        return (
            <>
                {Array.from({ length: count }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        {Array.from({ length: cols }).map((_, c) => (
                            <td key={c} className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                {c === 0 && <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        );
    }

    if (variant === 'detail-card') {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-gray-200 rounded-lg h-10 animate-pulse" />
    );
}
