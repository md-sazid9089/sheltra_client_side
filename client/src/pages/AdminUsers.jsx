import { useState, useEffect, useMemo } from 'react';
import UserActionsDropdown from '../components/UserActionsDropdown';
import UserDetailsPanel from '../components/UserDetailsPanel';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState(null);

    const itemsPerPage = 10;

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call: GET /admin/users
                // const response = await fetch('/api/admin/users');
                // const data = await response.json();

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockUsers = [
                    {
                        id: '1',
                        name: 'Amina Hassan',
                        email: 'amina@sheltra.org',
                        role: 'refugee',
                        suspended: false,
                        camp: 'Camp A',
                        nationality: 'Syrian',
                        createdAt: '2025-01-10',
                        updatedAt: '2025-02-25',
                    },
                    {
                        id: '2',
                        name: 'Tech Solutions Inc',
                        email: 'hr@techsolutions.com',
                        role: 'employer',
                        suspended: false,
                        company: 'Tech Solutions Inc.',
                        createdAt: '2025-01-05',
                        updatedAt: '2025-02-20',
                    },
                    {
                        id: '3',
                        name: 'Mohammad Karim',
                        email: 'mohammad@sheltra.org',
                        role: 'refugee',
                        suspended: false,
                        camp: 'Camp B',
                        nationality: 'Palestinian',
                        createdAt: '2024-12-20',
                        updatedAt: '2025-02-25',
                    },
                    {
                        id: '4',
                        name: 'Global Services Ltd',
                        email: 'recruitment@globalservices.com',
                        role: 'employer',
                        suspended: true,
                        company: 'Global Services Ltd.',
                        createdAt: '2025-01-15',
                        updatedAt: '2025-02-15',
                    },
                    {
                        id: '5',
                        name: 'Fatima Ali',
                        email: 'fatima@sheltra.org',
                        role: 'refugee',
                        suspended: false,
                        camp: 'Camp A',
                        nationality: 'Somali',
                        createdAt: '2024-11-30',
                        updatedAt: '2025-02-24',
                    },
                    {
                        id: '6',
                        name: 'Admin User',
                        email: 'admin@sheltra.org',
                        role: 'admin',
                        suspended: false,
                        createdAt: '2024-01-01',
                        updatedAt: '2025-02-25',
                    },
                    {
                        id: '7',
                        name: 'Hassan Omar',
                        email: 'hassan@sheltra.org',
                        role: 'refugee',
                        suspended: true,
                        camp: 'Camp C',
                        nationality: 'Sudanese',
                        createdAt: '2025-02-01',
                        updatedAt: '2025-02-10',
                    },
                    {
                        id: '8',
                        name: 'Finance Corp',
                        email: 'admin@financecorp.com',
                        role: 'employer',
                        suspended: false,
                        company: 'Finance Corp',
                        createdAt: '2025-01-20',
                        updatedAt: '2025-02-23',
                    },
                    {
                        id: '9',
                        name: 'Layla Mahmoud',
                        email: 'layla@sheltra.org',
                        role: 'refugee',
                        suspended: false,
                        camp: 'Camp B',
                        nationality: 'Lebanese',
                        createdAt: '2025-02-05',
                        updatedAt: '2025-02-25',
                    },
                    {
                        id: '10',
                        name: 'NGO Support Team',
                        email: 'info@ngosupport.org',
                        role: 'ngo',
                        suspended: false,
                        createdAt: '2025-01-12',
                        updatedAt: '2025-02-22',
                    },
                    {
                        id: '11',
                        name: 'Ahmed Ibrahim',
                        email: 'ahmed@sheltra.org',
                        role: 'refugee',
                        suspended: false,
                        camp: 'Camp A',
                        nationality: 'Syrian',
                        createdAt: '2025-02-08',
                        updatedAt: '2025-02-25',
                    },
                    {
                        id: '12',
                        name: 'Logistics Plus',
                        email: 'careers@logisticsplus.com',
                        role: 'employer',
                        suspended: false,
                        company: 'Logistics Plus',
                        createdAt: '2025-01-25',
                        updatedAt: '2025-02-24',
                    },
                ];

                setUsers(mockUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter and search users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = !roleFilter || user.role === roleFilter;

            const matchesStatus =
                !statusFilter ||
                (statusFilter === 'active' && !user.suspended) ||
                (statusFilter === 'suspended' && user.suspended);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    // Pagination
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Handle status toggle
    const handleStatusToggle = async (userId, newSuspendedStatus) => {
        try {
            // API stub: PATCH /admin/users/:id/status
            // await fetch(`/api/admin/users/${userId}/status`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ suspended: newSuspendedStatus }),
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 600));

            setUsers(prev =>
                prev.map(u =>
                    u.id === userId ? { ...u, suspended: newSuspendedStatus } : u
                )
            );

            // Update selected user if it's the one being updated
            if (selectedUser?.id === userId) {
                setSelectedUser({
                    ...selectedUser,
                    suspended: newSuspendedStatus,
                });
            }

            setNotification({
                type: 'success',
                message: `User ${newSuspendedStatus ? 'suspended' : 'reactivated'} successfully`,
            });
            setTimeout(() => setNotification(null), 2000);
        } catch (error) {
            console.error('Error updating user status:', error);
            setNotification({
                type: 'error',
                message: 'Failed to update user status',
            });
            setTimeout(() => setNotification(null), 2000);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // API stub: DELETE /admin/users/:id
                // await fetch(`/api/admin/users/${userId}`, {
                //     method: 'DELETE',
                // });

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 600));

                setUsers(prev => prev.filter(u => u.id !== userId));
                if (isDetailsPanelOpen) {
                    setIsDetailsPanelOpen(false);
                }

                setNotification({
                    type: 'success',
                    message: 'User deleted successfully',
                });
                setTimeout(() => setNotification(null), 2000);
            } catch (error) {
                console.error('Error deleting user:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to delete user',
                });
                setTimeout(() => setNotification(null), 2000);
            }
        }
    };

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

    const stats = {
        total: users.length,
        active: users.filter(u => !u.suspended).length,
        suspended: users.filter(u => u.suspended).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600">
                    Manage platform users, view details, and control access
                </p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`p-4 rounded-lg text-white animate-in fade-in ${
                        notification.type === 'success'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Active Users</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-lg border border-red-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Suspended Users</p>
                    <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Users
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
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="employer">Employer</option>
                        <option value="refugee">Refugee</option>
                        <option value="ngo">NGO</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    {(searchQuery || roleFilter || statusFilter) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setRoleFilter('');
                                setStatusFilter('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    Showing {paginatedUsers.length} of {filteredUsers.length} users
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 h-96 animate-pulse"></div>
            ) : paginatedUsers.length > 0 ? (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                            user.suspended
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-green-100 text-green-700'
                                                        }`}
                                                    >
                                                        {user.suspended ? 'Suspended' : 'Active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <UserActionsDropdown
                                                    user={user}
                                                    onEdit={(u) => {
                                                        setSelectedUser(u);
                                                        setIsDetailsPanelOpen(true);
                                                    }}
                                                    onSuspend={handleStatusToggle}
                                                    onDelete={handleDeleteUser}
                                                />
                                            </td>
                                        </tr>
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

                                {/* Page numbers */}
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        page => (
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
                                        )
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage(prev => Math.min(totalPages, prev + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* No Results */
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
                            d="M17 20h5v-2a3 3 0 00-5.856-1.488M15 6a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 006-6V9a6 6 0 00-6-6H6a6 6 0 00-6 6v5a6 6 0 006 6z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            )}

            {/* User Details Panel */}
            <UserDetailsPanel
                user={selectedUser}
                isOpen={isDetailsPanelOpen}
                onClose={() => {
                    setIsDetailsPanelOpen(false);
                    setSelectedUser(null);
                }}
                onUpdateStatus={handleStatusToggle}
            />
        </div>
    );
}
