import { getUserInfo } from '../utils/tokenUtils';

export default function AdminPanel() {
    const userInfo = getUserInfo();

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Controls</h2>
                {userInfo && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-gray-700 mb-2">
                            <strong>Logged in as:</strong> {userInfo.name || 'Admin'}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Email:</strong> {userInfo.email}
                        </p>
                        <p className="text-gray-700">
                            <strong>Role:</strong>{' '}
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {userInfo.role || 'Admin'}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Admin Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="text-xl font-bold mb-2">User Management</h3>
                    <p className="text-red-100 text-sm">Manage system users and permissions</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="text-xl font-bold mb-2">System Settings</h3>
                    <p className="text-orange-100 text-sm">Configure system-wide settings</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="text-xl font-bold mb-2">Reports</h3>
                    <p className="text-yellow-100 text-sm">View system reports and analytics</p>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="text-xl font-bold mb-2">Logs</h3>
                    <p className="text-pink-100 text-sm">View system logs and activity</p>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Admin Area</h3>
                <p className="text-yellow-800">
                    This area is restricted to users with admin role only. All actions here are logged for security purposes.
                </p>
            </div>
        </div>
    );
}
