import { useState, useEffect, useMemo } from 'react';

const ACTION_OPTIONS = [
    'user.login',
    'user.logout',
    'user.register',
    'user.suspended',
    'user.reactivated',
    'user.deleted',
    'user.role_changed',
    'profile.created',
    'profile.updated',
    'skill.added',
    'skill.verified',
    'skill.rejected',
    'job.posted',
    'job.updated',
    'job.closed',
    'placement.created',
    'placement.completed',
    'verification.approved',
    'verification.rejected',
    'admin.settings_changed',
];

const MOCK_AUDIT_LOGS = [
    {
        id: '1',
        timestamp: '2026-03-02T14:32:10Z',
        actor: { id: '6', name: 'Admin User', email: 'admin@sheltra.org' },
        role: 'admin',
        action: 'user.suspended',
        target: { type: 'User', id: '7' },
        metadata: { reason: 'Policy violation', previousStatus: 'active' },
    },
    {
        id: '2',
        timestamp: '2026-03-02T13:15:45Z',
        actor: { id: '10', name: 'NGO Support Team', email: 'info@ngosupport.org' },
        role: 'ngo',
        action: 'skill.verified',
        target: { type: 'Skill', id: '42' },
        metadata: { skillName: 'Carpentry', refugeeId: '1', verificationMethod: 'interview' },
    },
    {
        id: '3',
        timestamp: '2026-03-02T12:05:30Z',
        actor: { id: '1', name: 'Amina Hassan', email: 'amina@sheltra.org' },
        role: 'refugee',
        action: 'profile.updated',
        target: { type: 'Profile', id: '1' },
        metadata: { fieldsUpdated: ['bio', 'skills', 'availability'] },
    },
    {
        id: '4',
        timestamp: '2026-03-02T11:48:20Z',
        actor: { id: '2', name: 'Tech Solutions Inc', email: 'hr@techsolutions.com' },
        role: 'employer',
        action: 'job.posted',
        target: { type: 'Job', id: '15' },
        metadata: { title: 'Frontend Developer', location: 'Remote', salary: '$40k-$60k' },
    },
    {
        id: '5',
        timestamp: '2026-03-02T10:22:00Z',
        actor: { id: '3', name: 'Mohammad Karim', email: 'mohammad@sheltra.org' },
        role: 'refugee',
        action: 'user.login',
        target: { type: 'Session', id: 'sess_abc123' },
        metadata: { ip: '192.168.1.100', userAgent: 'Chrome/120' },
    },
    {
        id: '6',
        timestamp: '2026-03-01T16:40:55Z',
        actor: { id: '6', name: 'Admin User', email: 'admin@sheltra.org' },
        role: 'admin',
        action: 'user.role_changed',
        target: { type: 'User', id: '10' },
        metadata: { previousRole: 'refugee', newRole: 'ngo' },
    },
    {
        id: '7',
        timestamp: '2026-03-01T15:10:12Z',
        actor: { id: '10', name: 'NGO Support Team', email: 'info@ngosupport.org' },
        role: 'ngo',
        action: 'verification.approved',
        target: { type: 'Verification', id: '28' },
        metadata: { refugeeName: 'Fatima Ali', documentsReviewed: 3 },
    },
    {
        id: '8',
        timestamp: '2026-03-01T14:05:33Z',
        actor: { id: '8', name: 'Finance Corp', email: 'admin@financecorp.com' },
        role: 'employer',
        action: 'job.closed',
        target: { type: 'Job', id: '12' },
        metadata: { title: 'Accountant', reason: 'Position filled', applicants: 8 },
    },
    {
        id: '9',
        timestamp: '2026-03-01T09:30:00Z',
        actor: { id: '6', name: 'Admin User', email: 'admin@sheltra.org' },
        role: 'admin',
        action: 'admin.settings_changed',
        target: { type: 'Settings', id: 'global' },
        metadata: { setting: 'max_login_attempts', oldValue: 5, newValue: 3 },
    },
    {
        id: '10',
        timestamp: '2026-02-28T17:20:44Z',
        actor: { id: '5', name: 'Fatima Ali', email: 'fatima@sheltra.org' },
        role: 'refugee',
        action: 'skill.added',
        target: { type: 'Skill', id: '55' },
        metadata: { skillName: 'Tailoring', proficiency: 'Advanced' },
    },
    {
        id: '11',
        timestamp: '2026-02-28T15:45:10Z',
        actor: { id: '10', name: 'NGO Support Team', email: 'info@ngosupport.org' },
        role: 'ngo',
        action: 'verification.rejected',
        target: { type: 'Verification', id: '29' },
        metadata: { refugeeName: 'Hassan Omar', reason: 'Insufficient evidence' },
    },
    {
        id: '12',
        timestamp: '2026-02-28T13:00:05Z',
        actor: { id: '12', name: 'Logistics Plus', email: 'careers@logisticsplus.com' },
        role: 'employer',
        action: 'placement.created',
        target: { type: 'Placement', id: '9' },
        metadata: { refugeeId: '9', jobTitle: 'Warehouse Assistant', startDate: '2026-03-15' },
    },
    {
        id: '13',
        timestamp: '2026-02-27T11:12:30Z',
        actor: { id: '6', name: 'Admin User', email: 'admin@sheltra.org' },
        role: 'admin',
        action: 'user.deleted',
        target: { type: 'User', id: '99' },
        metadata: { deletedUserEmail: 'spam@fake.com', reason: 'Fraudulent account' },
    },
    {
        id: '14',
        timestamp: '2026-02-27T09:05:00Z',
        actor: { id: '11', name: 'Ahmed Ibrahim', email: 'ahmed@sheltra.org' },
        role: 'refugee',
        action: 'profile.created',
        target: { type: 'Profile', id: '11' },
        metadata: { nationality: 'Syrian', camp: 'Camp A' },
    },
    {
        id: '15',
        timestamp: '2026-02-26T16:30:22Z',
        actor: { id: '6', name: 'Admin User', email: 'admin@sheltra.org' },
        role: 'admin',
        action: 'user.reactivated',
        target: { type: 'User', id: '4' },
        metadata: { previousStatus: 'suspended', reason: 'Appeal approved' },
    },
];

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);

    const itemsPerPage = 10;

    // Fetch audit logs
    useEffect(() => {
        const fetchAuditLogs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Replace with actual API call: GET /api/admin/audit-logs
                // const token = getToken();
                // const response = await fetch('/api/admin/audit-logs', {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                // if (!response.ok) throw new Error('Failed to fetch audit logs');
                // const data = await response.json();
                // setLogs(data.logs);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1200));
                setLogs(MOCK_AUDIT_LOGS);
            } catch (err) {
                console.error('Error fetching audit logs:', err);
                setError('Failed to load audit logs. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuditLogs();
    }, []);

    // Filter and search
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch =
                !searchQuery ||
                log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.actor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.target.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesAction = !actionFilter || log.action === actionFilter;

            const logDate = new Date(log.timestamp);
            const matchesDateFrom = !dateFrom || logDate >= new Date(dateFrom);
            const matchesDateTo =
                !dateTo || logDate <= new Date(dateTo + 'T23:59:59Z');

            return matchesSearch && matchesAction && matchesDateFrom && matchesDateTo;
        });
    }, [logs, searchQuery, actionFilter, dateFrom, dateTo]);

    // Pagination
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLogs, currentPage]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const clearFilters = () => {
        setSearchQuery('');
        setActionFilter('');
        setDateFrom('');
        setDateTo('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchQuery || actionFilter || dateFrom || dateTo;

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
            case 'administrator':
                return 'bg-purple-100 text-purple-700';
            case 'employer':
                return 'bg-blue-100 text-blue-700';
            case 'refugee':
                return 'bg-green-100 text-green-700';
            case 'ngo':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getActionBadgeColor = (action) => {
        if (action.includes('deleted') || action.includes('suspended') || action.includes('rejected')) {
            return 'bg-red-50 text-red-700 border border-red-200';
        }
        if (action.includes('created') || action.includes('approved') || action.includes('verified') || action.includes('reactivated')) {
            return 'bg-green-50 text-green-700 border border-green-200';
        }
        if (action.includes('updated') || action.includes('changed') || action.includes('closed')) {
            return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
        }
        if (action.includes('login') || action.includes('logout') || action.includes('register')) {
            return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        }
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    };

    const formatTimestamp = (ts) => {
        const date = new Date(ts);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const toggleRowExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Stats
    const stats = {
        total: logs.length,
        today: logs.filter(l => {
            const d = new Date(l.timestamp);
            const now = new Date();
            return d.toDateString() === now.toDateString();
        }).length,
        adminActions: logs.filter(l => l.role === 'admin').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Audit Logs</h1>
                <p className="text-gray-600">
                    View and search all system activity and user actions
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Events</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg border border-indigo-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Today</p>
                    <p className="text-3xl font-bold text-indigo-600">{stats.today}</p>
                </div>
                <div className="bg-white rounded-lg border border-purple-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Admin Actions</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.adminActions}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by actor name, email, ID, or target ID..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Action / Event
                        </label>
                        <select
                            value={actionFilter}
                            onChange={(e) => {
                                setActionFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="">All Actions</option>
                            {ACTION_OPTIONS.map(action => (
                                <option key={action} value={action}>
                                    {action}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => {
                                setDateTo(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    Showing {paginatedLogs.length} of {filteredLogs.length} events
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-red-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">{error}</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg border border-gray-200 h-16 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Table */}
            {!isLoading && !error && paginatedLogs.length > 0 && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-8" />
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                            Timestamp
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                            Actor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                            Action
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                                            Target
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedLogs.map(log => (
                                        <>
                                            <tr
                                                key={log.id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => toggleRowExpand(log.id)}
                                            >
                                                {/* Expand/Collapse */}
                                                <td className="px-4 py-4">
                                                    <svg
                                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                                            expandedRow === log.id ? 'rotate-90' : ''
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </td>

                                                {/* Timestamp */}
                                                <td className="px-4 py-4">
                                                    <p className="text-sm text-gray-700 whitespace-nowrap">
                                                        {formatTimestamp(log.timestamp)}
                                                    </p>
                                                </td>

                                                {/* Actor */}
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {log.actor.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {log.actor.email}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                                                            log.role
                                                        )}`}
                                                    >
                                                        {log.role}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-medium ${getActionBadgeColor(
                                                            log.action
                                                        )}`}
                                                    >
                                                        {log.action}
                                                    </span>
                                                </td>

                                                {/* Target */}
                                                <td className="px-4 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-medium">{log.target.type}</span>
                                                        <span className="text-gray-400 mx-1">#</span>
                                                        <span className="font-mono text-xs">{log.target.id}</span>
                                                    </p>
                                                </td>
                                            </tr>

                                            {/* Expanded Metadata Row */}
                                            {expandedRow === log.id && (
                                                <tr key={`${log.id}-meta`}>
                                                    <td colSpan={6} className="px-4 py-4 bg-gray-50">
                                                        <div className="ml-8">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                                Details / Metadata
                                                            </p>
                                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                                                                    <div>
                                                                        <dt className="text-xs font-medium text-gray-500">
                                                                            Actor ID
                                                                        </dt>
                                                                        <dd className="text-sm text-gray-900 font-mono">
                                                                            {log.actor.id}
                                                                        </dd>
                                                                    </div>
                                                                    {Object.entries(log.metadata).map(
                                                                        ([key, value]) => (
                                                                            <div key={key}>
                                                                                <dt className="text-xs font-medium text-gray-500">
                                                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                                                                </dt>
                                                                                <dd className="text-sm text-gray-900 break-all">
                                                                                    {Array.isArray(value)
                                                                                        ? value.join(', ')
                                                                                        : String(value)}
                                                                                </dd>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </dl>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoading && !error && paginatedLogs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
                    <p className="text-gray-600">
                        {hasActiveFilters
                            ? 'Try adjusting your search or filter criteria'
                            : 'No activity has been recorded yet'}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
