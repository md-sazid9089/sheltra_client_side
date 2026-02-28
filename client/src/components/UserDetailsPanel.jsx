import { useState } from 'react';

export default function UserDetailsPanel({ user, isOpen, onClose, onUpdateStatus }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [notification, setNotification] = useState(null);

    if (!user) return null;

    const handleStatusToggle = async () => {
        setIsUpdating(true);
        try {
            // API stub: PATCH /admin/users/:id/status
            // await fetch(`/api/admin/users/${user.id}/status`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ suspended: !user.suspended }),
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            if (onUpdateStatus) {
                onUpdateStatus(user.id, !user.suspended);
            }

            setNotification({
                type: 'success',
                message: `User ${!user.suspended ? 'suspended' : 'reactivated'} successfully`,
            });
            setTimeout(() => setNotification(null), 2000);
        } catch (error) {
            console.error('Error updating user status:', error);
            setNotification({
                type: 'error',
                message: 'Failed to update user status',
            });
        } finally {
            setIsUpdating(false);
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

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-30 ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            ></div>

            {/* Panel */}
            <div
                className={`fixed right-0 top-0 h-full max-w-2xl w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Notification */}
                    {notification && (
                        <div
                            className={`p-4 rounded-lg ${
                                notification.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    {/* User Avatar and Basic Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </h3>
                            <p className="text-gray-600">{user.email}</p>
                            <span
                                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                                    user.role
                                )}`}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Account Status
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {user.suspended
                                        ? 'This account is currently suspended'
                                        : 'This account is active'}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    user.suspended
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {user.suspended ? 'Suspended' : 'Active'}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Account Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Account Information</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    USER ID
                                </p>
                                <p className="text-sm font-mono text-gray-900 break-all">
                                    {user.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    ROLE
                                </p>
                                <p className="text-sm text-gray-900 capitalize">
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    JOINED
                                </p>
                                <p className="text-sm text-gray-900">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    LAST UPDATE
                                </p>
                                <p className="text-sm text-gray-900">
                                    {new Date(user.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Contact Information</h4>

                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                EMAIL
                            </p>
                            <p className="text-sm text-gray-900 break-all">
                                {user.email}
                            </p>
                        </div>

                        {user.phoneNumber && (
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    PHONE
                                </p>
                                <p className="text-sm text-gray-900">
                                    {user.phoneNumber}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Additional Details */}
                    {user.role === 'refugee' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Refugee Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                        CAMP
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {user.camp || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                        NATIONALITY
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {user.nationality || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === 'employer' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Employer Information</h4>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    COMPANY
                                </p>
                                <p className="text-sm text-gray-900">
                                    {user.company || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
                    <button
                        onClick={handleStatusToggle}
                        disabled={isUpdating}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-all ${
                            user.suspended
                                ? isUpdating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                : isUpdating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                    >
                        {isUpdating ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Updating...
                            </span>
                        ) : user.suspended ? (
                            'Reactivate User'
                        ) : (
                            'Suspend User'
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
