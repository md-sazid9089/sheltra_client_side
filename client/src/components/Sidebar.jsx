import { useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';

const iconComponents = {
    home: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    ),
    calendar: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    user: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    ),
    users: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM16.35 13.2A6 6 0 009 13a6 6 0 006.35.2zM9 17a4 4 0 1008 0H9z" />
        </svg>
    ),
    briefcase: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h2a2 2 0 012 2v3H4V8a2 2 0 012-2zm0 0h8V5H6v1zM4 11h12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" clipRule="evenodd" />
        </svg>
    ),
    document: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
    ),
};

export default function Sidebar({ isOpen, setIsOpen, menuItems }) {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay with blur */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar - Slide-in Panel */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl 
                    border-r border-gray-200/50 shadow-2xl z-50 lg:hidden
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header with Logo and Close */}
                    <div className="px-6 py-6 border-b border-gray-200/50 bg-gradient-to-br from-primary-50 to-primary-100/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    S
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                                    Sheltra
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/80 rounded-full transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {userInfo?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                    {userInfo?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                        {menuItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all
                                        ${active
                                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                                            : 'text-gray-700 hover:bg-gray-100/80'
                                        }
                                    `}
                                >
                                    <span className={active ? 'text-white' : 'text-gray-400'}>
                                        {iconComponents[item.icon] || iconComponents.home}
                                    </span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {active && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="px-4 py-6 border-t border-gray-200/50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-danger-50 hover:bg-danger-100 text-danger-600 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 100-2H4V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
