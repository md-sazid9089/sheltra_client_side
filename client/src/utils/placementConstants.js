/**
 * Timeline status constants
 */
export const TIMELINE_STATUSES = {
    APPLIED: 'applied',
    SHORTLISTED: 'shortlisted',
    OFFERED: 'offered',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DROPPED: 'dropped',
};

/**
 * Timeline status display configuration
 */
export const STATUS_CONFIG = {
    [TIMELINE_STATUSES.APPLIED]: {
        label: 'Applied',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        badgeColor: 'bg-blue-100',
        icon: '📝',
    },
    [TIMELINE_STATUSES.SHORTLISTED]: {
        label: 'Shortlisted',
        color: 'purple',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-700',
        badgeColor: 'bg-purple-100',
        icon: '✓',
    },
    [TIMELINE_STATUSES.OFFERED]: {
        label: 'Offered',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        badgeColor: 'bg-green-100',
        icon: '🎉',
    },
    [TIMELINE_STATUSES.ACTIVE]: {
        label: 'Active',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
        badgeColor: 'bg-green-100',
        icon: '⚡',
    },
    [TIMELINE_STATUSES.COMPLETED]: {
        label: 'Completed',
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        badgeColor: 'bg-emerald-100',
        icon: '🏆',
    },
    [TIMELINE_STATUSES.DROPPED]: {
        label: 'Dropped',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
        badgeColor: 'bg-red-100',
        icon: '✕',
    },
};

/**
 * Get the order of statuses in the timeline
 */
export const getStatusOrder = (status) => {
    const order = [
        TIMELINE_STATUSES.APPLIED,
        TIMELINE_STATUSES.SHORTLISTED,
        TIMELINE_STATUSES.OFFERED,
        TIMELINE_STATUSES.ACTIVE,
        TIMELINE_STATUSES.COMPLETED,
        TIMELINE_STATUSES.DROPPED,
    ];
    return order.indexOf(status?.toLowerCase());
};

/**
 * Check if a status is terminal (final state)
 */
export const isTerminalStatus = (status) => {
    return [TIMELINE_STATUSES.COMPLETED, TIMELINE_STATUSES.DROPPED].includes(
        status?.toLowerCase()
    );
};
