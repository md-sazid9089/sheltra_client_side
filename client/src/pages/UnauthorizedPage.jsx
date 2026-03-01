import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utils/tokenUtils';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-danger-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl shadow-xl shadow-danger-500/30 mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* Main Card */}
                <Card variant="glass" className="shadow-glass-lg text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this resource.
                    </p>

                    {userInfo && (
                        <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-4 mb-6 text-left border border-primary-100">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-semibold text-gray-900">
                                    Current Account
                                </p>
                            </div>
                            <div className="space-y-2 ml-7">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Role:</span>
                                    <Badge variant={userInfo.role?.toLowerCase() || 'default'}>
                                        {userInfo.role || 'User'}
                                    </Badge>
                                </div>
                                {userInfo.email && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Email:</span>
                                        <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                            {userInfo.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6 text-left">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-warning-900 mb-1">What can I do?</p>
                                <ul className="text-sm text-warning-700 space-y-1 list-disc list-inside">
                                    <li>Return to your dashboard</li>
                                    <li>Login with a different account</li>
                                    <li>Contact support if this is an error</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                           onClick={() => navigate('/dashboard')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            }
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            fullWidth
                            onClick={() => navigate('/login')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            }
                        >
                            Login as Different User
                        </Button>
                    </div>
                </Card>

                {/* Help Link */}
                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Need help? Contact support
                    </a>
                </div>
            </div>
        </div>
    );
}
