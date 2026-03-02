import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';

export default function Topbar({ onMenuClick, menuItems = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = getUserInfo();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    // Derive page title from current path
    const pageTitle =
        menuItems.find((item) => location.pathname === item.path)?.label || 'Dashboard';

    return (
        <header
            className="sticky top-0 z-40 h-16 border-b border-gray-800 flex items-center justify-between px-6"
            style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}
        >
            {/* Left */}
            <div className="flex items-center gap-4">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    aria-label="Toggle navigation menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Page title */}
                <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button
                    className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    aria-label="Notifications"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Orange dot indicator */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-slate-900" />
                </button>

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                        aria-label="User menu"
                        aria-expanded={showUserMenu}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white font-semibold text-sm">
                            {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-300 hidden sm:block">
                            {userInfo?.name?.split(' ')[0] || 'User'}
                        </span>
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {showUserMenu && (
                        <div
                            className="absolute right-0 mt-2 w-60 rounded-xl overflow-hidden shadow-xl border border-gray-700/50 z-50"
                            style={{ background: '#1e293b' }}
                        >
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-gray-700/50">
                                <p className="text-sm font-semibold text-white">{userInfo?.name || 'User'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{userInfo?.email}</p>
                                <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400">
                                    {userInfo?.role || 'user'}
                                </span>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    My Profile
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    Settings
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-700/50 py-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors font-medium"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 100-2H4V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
