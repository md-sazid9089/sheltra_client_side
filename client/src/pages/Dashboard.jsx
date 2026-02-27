import { useNavigate } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';

export default function Dashboard() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Sheltra Dashboard</h1>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Dashboard</h2>
                        {userInfo && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                                <p className="text-gray-700 mb-2">
                                    <strong>Name:</strong> {userInfo.name || 'N/A'}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Email:</strong> {userInfo.email || 'N/A'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Role:</strong>{' '}
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {userInfo.role || 'User'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Sessions</h3>
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-blue-100 text-sm mt-2">Active sessions</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Participants</h3>
                            <p className="text-3xl font-bold">0</p>
                            <p className="text-green-100 text-sm mt-2">Total participants</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">Attendance</h3>
                            <p className="text-3xl font-bold">0%</p>
                            <p className="text-purple-100 text-sm mt-2">Overall rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
