import { getUserInfo } from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function AdminPanel() {
    const userInfo = getUserInfo();
    const navigate = useNavigate();

    const adminCards = [
        {
            title: 'User Management',
            description: 'Manage system users and permissions',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            ),
            gradient: 'from-primary-500 to-primary-600',
            route: '/admin/users',
        },
        {
            title: 'Audit Logs',
            description: 'View system logs and activity',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-success-500 to-success-600',
            route: '/admin/audit-logs',
        },
        {
            title: 'SDG Impact Dashboard',
            description: 'View sustainability and impact metrics',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            ),
            gradient: 'from-warning-500 to-warning-600',
            route: '/admin/impact',
        },
        {
            title: 'System Reports',
            description: 'View system reports and analytics',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
            ),
            gradient: 'from-purple-500 to-purple-600',
            route: '#',
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                subtitle="Manage system settings, users, and view analytics"
            />

            {/* Admin Info Card */}
            {userInfo && (
                <Card variant="glass" className="border-l-4 border-danger-500">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-danger-100 rounded-xl flex-shrink-0">
                            <svg className="w-7 h-7 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Logged in as Administrator</h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-700">
                                    <span className="font-medium">Name:</span> {userInfo.name || 'Admin'}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Email:</span> {userInfo.email}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="font-medium text-gray-700">Role:</span>
                                    <Badge variant="admin">{userInfo.role || 'Admin'}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Admin Control Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminCards.map((card, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-300"
                        onClick={() => card.route !== '#' && navigate(card.route)}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                        <div className="relative">
                            <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg mb-4`}>
                                {card.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                            <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>View</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Warning Box */}
            <Card className="bg-gradient-to-r from-warning-50 to-yellow-50 border-2 border-warning-200">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-warning-100 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-warning-900 mb-1">⚠️ Admin Area</h3>
                        <p className="text-warning-800 text-sm">
                            This area is restricted to users with admin role only. All actions here are logged for security purposes.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card variant="glass">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-1">1,234</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-success-600 mb-1">856</div>
                        <div className="text-sm text-gray-600">Active Refugees</div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-warning-600 mb-1">42</div>
                        <div className="text-sm text-gray-600">Partner NGOs</div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">128</div>
                        <div className="text-sm text-gray-600">Employers</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
