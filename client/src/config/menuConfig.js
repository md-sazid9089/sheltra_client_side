/**
 * Menu configuration for different user roles
 * Each item includes a `section` key used by the sidebar for group labels.
 */
export const roleMenuConfig = {
    refugee: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home', section: 'Main' },
        { label: 'Opportunities', path: '/opportunities', icon: 'briefcase', section: 'Main' },
        { label: 'Placements', path: '/placements', icon: 'chart', section: 'Main' },
        { label: 'My Sessions', path: '/sessions', icon: 'calendar', section: 'Management' },
        { label: 'Profile', path: '/profile', icon: 'user', section: 'Management' },
        { label: 'Consent', path: '/consent', icon: 'settings', section: 'Settings' },
        { label: 'Settings', path: '/settings', icon: 'settings', section: 'Settings' },
    ],
    ngo: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home', section: 'Main' },
        { label: 'Verifications', path: '/ngo/verifications', icon: 'check', section: 'Main' },
        { label: 'Sessions', path: '/sessions', icon: 'calendar', section: 'Management' },
        { label: 'Participants', path: '/participants', icon: 'users', section: 'Management' },
        { label: 'Reports', path: '/reports', icon: 'document', section: 'Management' },
        { label: 'Settings', path: '/settings', icon: 'settings', section: 'Settings' },
    ],
    employer: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home', section: 'Main' },
        { label: 'Talent Pool', path: '/talent-pool', icon: 'users', section: 'Main' },
        { label: 'Job Postings', path: '/jobs', icon: 'briefcase', section: 'Main' },
        { label: 'Feedback', path: '/feedback', icon: 'star', section: 'Management' },
        { label: 'Candidates', path: '/candidates', icon: 'users', section: 'Management' },
        { label: 'Applications', path: '/applications', icon: 'document', section: 'Management' },
        { label: 'Settings', path: '/settings', icon: 'settings', section: 'Settings' },
    ],
    admin: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home', section: 'Main' },
        { label: 'User Management', path: '/admin/users', icon: 'users', section: 'Management' },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: 'document', section: 'Management' },
        { label: 'Impact Dashboard', path: '/admin/impact', icon: 'chart', section: 'Management' },
        { label: 'Sessions', path: '/admin/sessions', icon: 'calendar', section: 'Management' },
        { label: 'Reports', path: '/admin/reports', icon: 'document', section: 'Management' },
        { label: 'Settings', path: '/admin/settings', icon: 'settings', section: 'Settings' },
    ],
};

/**
 * Gets menu items for a specific role
 */
export const getMenuItemsByRole = (role) => {
    const normalizedRole = role?.toLowerCase() || 'refugee';
    return roleMenuConfig[normalizedRole] || roleMenuConfig.refugee;
};
