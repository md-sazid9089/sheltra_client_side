/**
 * EmptyState – shown when a list or table has no data.
 *
 * Props:
 *   icon         – emoji string OR a React node (SVG, etc.)
 *   title        – heading text
 *   description  – supporting copy
 *   actionLabel  – optional CTA button text
 *   onAction     – callback when CTA is clicked
 */
export default function EmptyState({
    icon = '📭',
    title = 'Nothing here yet',
    description,
    actionLabel,
    onAction,
}) {
    const renderIcon = () => {
        if (typeof icon === 'string') {
            return <span className="text-5xl">{icon}</span>;
        }
        return icon; // Assume React node (SVG etc.)
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4">{renderIcon()}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
