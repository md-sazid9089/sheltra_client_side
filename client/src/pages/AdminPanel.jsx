import { useNavigate } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';

export default function AdminPanel() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md border-b-4 border-red-600">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
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
            </div>
        </div>
    );
}
