import {
    TIMELINE_STATUSES,
    STATUS_CONFIG,
    getStatusOrder,
    isTerminalStatus,
} from '../utils/placementConstants';

export default function PlacementTimeline({
    placement,
    application,
    compact = false,
}) {
    // Use placement object if available, otherwise fall back to application
    const data = placement || application;

    if (!data) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No placement data available</p>
            </div>
        );
    }

    // Timeline stages in order
    const stages = [
        TIMELINE_STATUSES.APPLIED,
        TIMELINE_STATUSES.SHORTLISTED,
        TIMELINE_STATUSES.OFFERED,
        TIMELINE_STATUSES.ACTIVE,
        TIMELINE_STATUSES.COMPLETED,
    ];

    // Get current status
    const currentStatus = data.status?.toLowerCase() || TIMELINE_STATUSES.APPLIED;
    const currentStatusOrder = getStatusOrder(currentStatus);

    // Determine if dropped (terminal state)
    const isDropped = currentStatus === TIMELINE_STATUSES.DROPPED;

    // Get timestamp data from placement/application
    const getStageData = (stage) => {
        const key = `${stage}At` || `${stage}Date` || `${stage}Timestamp`;
        return data[key] || null;
    };

    const getStageNotes = (stage) => {
        const key = `${stage}Notes` || `${stage}Notes`;
        return data[key] || null;
    };

    if (compact) {
        // Compact view - single line status
        return (
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            STATUS_CONFIG[currentStatus].badgeColor
                        }`}
                    >
                        {STATUS_CONFIG[currentStatus].icon}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {STATUS_CONFIG[currentStatus].label}
                    </p>
                    {data.updatedAt && (
                        <p className="text-xs text-gray-600">
                            {new Date(data.updatedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Full timeline view
    return (
        <div className="space-y-6">
            {/* Main Timeline */}
            <div className="relative">
                {/* Timeline line background */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200"></div>

                {/* Timeline stages */}
                <div className="space-y-8">
                    {stages.map((stage, index) => {
                        const stageConfig = STATUS_CONFIG[stage];
                        const isCompleted = getStatusOrder(stage) <= currentStatusOrder;
                        const isCurrent = stage === currentStatus;
                        const stageDate = getStageData(stage);
                        const stageNotes = getStageNotes(stage);

                        return (
                            <div key={stage} className="relative pl-20">
                                {/* Timeline dot */}
                                <div
                                    className={`absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                                        isCompleted
                                            ? `${stageConfig.badgeColor} ${stageConfig.textColor}`
                                            : 'bg-gray-100 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-offset-2 ring-indigo-300' : ''}`}
                                >
                                    {stageConfig.icon}
                                </div>

                                {/* Stage content */}
                                <div
                                    className={`rounded-lg p-4 ${
                                        isCurrent
                                            ? `${stageConfig.bgColor} ${stageConfig.borderColor} border-2`
                                            : isCompleted
                                            ? 'bg-gray-50 border border-gray-200'
                                            : 'bg-white border border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4
                                                className={`font-semibold ${
                                                    isCompleted
                                                        ? stageConfig.textColor
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                {stageConfig.label}
                                            </h4>

                                            {stageDate && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {new Date(stageDate).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            )}
                                        </div>

                                        {isCurrent && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageConfig.badgeColor} ${stageConfig.textColor}`}>
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    {/* Stage notes */}
                                    {stageNotes && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-gray-900">Notes: </span>
                                                {stageNotes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Dropped state (if applicable) */}
                    {isDropped && (
                        <div className="relative pl-20">
                            <div className="absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-red-100 text-red-700 ring-4 ring-offset-2 ring-red-300">
                                {STATUS_CONFIG[TIMELINE_STATUSES.DROPPED].icon}
                            </div>

                            <div className="rounded-lg p-4 bg-red-50 border-2 border-red-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-red-700">
                                            {STATUS_CONFIG[TIMELINE_STATUSES.DROPPED].label}
                                        </h4>

                                        {data.droppedAt && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Date(data.droppedAt).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                        Current
                                    </span>
                                </div>

                                {data.droppedNotes && (
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-900">Reason: </span>
                                            {data.droppedNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary footer */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            STATUS_CONFIG[currentStatus].badgeColor
                        }`}
                    >
                        {STATUS_CONFIG[currentStatus].icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                            Current Status: {STATUS_CONFIG[currentStatus].label}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                            {isTerminalStatus(currentStatus)
                                ? 'This placement has reached a terminal status'
                                : 'Awaiting next stage update'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
