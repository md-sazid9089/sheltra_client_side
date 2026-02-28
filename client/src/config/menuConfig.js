/**
 * Menu configuration for different user roles
 */
export const roleMenuConfig = {
    refugee: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home' },
        { label: 'Opportunities', path: '/opportunities', icon: 'briefcase' },
        { label: 'Placements', path: '/placements', icon: 'chart' },
        { label: 'My Sessions', path: '/sessions', icon: 'calendar' },
        { label: 'Profile', path: '/profile', icon: 'user' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    ngo: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home' },
        { label: 'Sessions', path: '/sessions', icon: 'calendar' },
        { label: 'Participants', path: '/participants', icon: 'users' },
        { label: 'Reports', path: '/reports', icon: 'document' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    employer: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home' },
        { label: 'Talent Pool', path: '/talent-pool', icon: 'users' },
        { label: 'Job Postings', path: '/jobs', icon: 'briefcase' },
        { label: 'Candidates', path: '/candidates', icon: 'users' },
        { label: 'Applications', path: '/applications', icon: 'document' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
    ],
    admin: [
        { label: 'Dashboard', path: '/dashboard', icon: 'home' },
        { label: 'User Management', path: '/admin/users', icon: 'users' },
        { label: 'Sessions', path: '/admin/sessions', icon: 'calendar' },
        { label: 'Reports', path: '/admin/reports', icon: 'document' },
        { label: 'Settings', path: '/admin/settings', icon: 'settings' },
    ],
};

/**
 * Gets menu items for a specific role
 */
export const getMenuItemsByRole = (role) => {
    const normalizedRole = role?.toLowerCase() || 'refugee';
    return roleMenuConfig[normalizedRole] || roleMenuConfig.refugee;
};
