import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';
import Badge from './ui/Badge';

export default function Topbar({ onMenuClick, menuItems = [], sidebarOpen }) {
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

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
            {/* Capsule-style Navbar */}
            <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-glass rounded-full">
                <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    {/* Left: Logo + Mobile Menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg 
                                className={`w-6 h-6 text-gray-700 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4 6h16M4 12h16M4 18h16" 
                                />
                            </svg>
                        </button>

                        {/* Logo */}
                        <div 
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all">
                                S
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent hidden sm:block">
                                Sheltra
                            </span>
                        </div>
                    </div>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {menuItems.slice(0, 5).map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`
                                        px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
                                        ${active 
                                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Notifications + User Menu */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group">
                            <svg className="w-5 h-5 text-gray-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                    {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {userInfo?.name?.split(' ')[0] || 'User'}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-gray-600 transform transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-glass-lg border border-white/20 z-50 overflow-hidden">
                                    {/* User Info */}
                                    <div className="px-4 py-4 bg-gradient-to-br from-primary-50 to-primary-100/50 border-b border-gray-200/50">
                                        <p className="text-sm font-semibold text-gray-900">{userInfo?.name || 'User'}</p>
                                        <p className="text-xs text-gray-600 mt-0.5">{userInfo?.email}</p>
                                        <div className="mt-2">
                                            <Badge variant={userInfo?.role?.toLowerCase() || 'default'} size="sm">
                                                {userInfo?.role || 'User'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <button 
                                            onClick={() => {
                                                navigate('/profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100/80 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            <span>My Profile</span>
                                        </button>
                                        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100/80 flex items-center gap-3 transition-colors">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            <span>Settings</span>
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-gray-200/50 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50/80 flex items-center gap-3 transition-colors font-medium"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 100-2H4V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
