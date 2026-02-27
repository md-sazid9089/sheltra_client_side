import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utils/tokenUtils';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-6">
                    <div className="inline-block bg-red-100 rounded-full p-6">
                        <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-xl text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>

                {userInfo && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Your Role:</strong> <span className="text-gray-900">{userInfo.role || 'User'}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Your Email:</strong> <span className="text-gray-900">{userInfo.email}</span>
                        </p>
                    </div>
                )}

                <div className="flex gap-3 justify-center flex-wrap">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Login as Different User
                    </button>
                </div>
            </div>
        </div>
    );
}
