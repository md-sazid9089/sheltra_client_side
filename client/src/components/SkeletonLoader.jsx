/**
 * Skeleton Loading Component for loading states
 */
export default function SkeletonLoader({ count = 3, variant = 'card' }) {
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

    return (
        <div className="bg-gray-200 rounded-lg h-10 animate-pulse" />
    );
}
