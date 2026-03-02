import { useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, clearToken } from '../utils/tokenUtils';

/* ── Icon map ── */
const iconMap = {
    home: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    ),
    calendar: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    user: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    ),
    users: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
    ),
    briefcase: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm-2 5a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    document: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
    ),
    chart: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
    ),
    check: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    ),
    star: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    ),
};

/* ── Sidebar component ── */
export default function Sidebar({ isOpen, setIsOpen, menuItems }) {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = getUserInfo();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        clearToken();
        navigate('/login');
    };

    /* Group items by section (preserves order) */
    const sections = [];
    let currentSection = null;
    menuItems.forEach((item) => {
        const sec = item.section || 'Main';
        if (sec !== currentSection) {
            sections.push({ label: sec, items: [] });
            currentSection = sec;
        }
        sections[sections.length - 1].items.push(item);
    });

    /* ── User profile block (reused by desktop & mobile sidebars) ── */
    const UserProfile = ({ showLabels = true }) => (
        <div className="mt-auto border-t border-gray-800 p-4">
            <div className={`flex items-center ${showLabels ? 'gap-3 mb-3' : 'flex-col gap-2 mb-2'}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {showLabels && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userInfo?.name || 'User'}</p>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400">
                            {userInfo?.role || 'user'}
                        </span>
                    </div>
                )}
            </div>
            <button
                onClick={handleLogout}
                title="Logout"
                aria-label="Logout"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/60`}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 100-2H4V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                {showLabels && 'Logout'}
            </button>
        </div>
    );

    return (
        <>
            {/* ═══ DESKTOP SIDEBAR (lg+): w-64, full labels ═══ */}
            <aside
                className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-gray-800 z-30"
                style={{ background: '#0f172a' }}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <img src="/logo.png" alt="Sheltra" className="w-9 h-9 object-contain" />
                    <span className="text-xl font-bold text-white">
                        Shel<span className="text-orange-400">tra</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1" aria-label="Main navigation">
                    {sections.map((sec, idx) => (
                        <div key={sec.label}>
                            <p className={`text-xs text-gray-600 uppercase tracking-wider px-4 mb-2 ${idx === 0 ? 'mt-2' : 'mt-6'}`}>
                                {sec.label}
                            </p>
                            {sec.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                                            active
                                                ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-400'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <span>{iconMap[item.icon] || iconMap.home}</span>
                                        <span className="flex-1 text-left truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <UserProfile showLabels />
            </aside>

            {/* ═══ TABLET SIDEBAR (md–lg): w-16, icon-only ═══ */}
            <aside
                className="hidden md:flex lg:hidden fixed left-0 top-0 h-screen w-16 flex-col items-center border-r border-gray-800 z-30"
                style={{ background: '#0f172a' }}
            >
                {/* Logo icon */}
                <div className="py-5">
                    <img src="/logo.png" alt="Sheltra" className="w-8 h-8 object-contain" />
                </div>

                {/* Nav – icon only */}
                <nav className="flex-1 overflow-y-auto w-full px-2 pb-4 space-y-1" aria-label="Main navigation">
                    {sections.map((sec, idx) => (
                        <div key={sec.label} className={idx > 0 ? 'mt-3 pt-3 border-t border-gray-800' : ''}>
                            {sec.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        title={item.label}
                                        aria-label={item.label}
                                        className={`w-full flex items-center justify-center py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                                            active
                                                ? 'bg-orange-500/10 text-orange-400'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {iconMap[item.icon] || iconMap.home}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <UserProfile showLabels={false} />
            </aside>

            {/* ═══ MOBILE OVERLAY SIDEBAR (<md) ═══ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed left-0 top-0 h-screen w-72 flex flex-col border-r border-gray-800 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ background: '#0f172a' }}
                aria-label="Mobile navigation"
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Sheltra" className="w-9 h-9 object-contain" />
                        <span className="text-xl font-bold text-white">
                            Shel<span className="text-orange-400">tra</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1" aria-label="Main navigation">
                    {sections.map((sec, idx) => (
                        <div key={sec.label}>
                            <p className={`text-xs text-gray-600 uppercase tracking-wider px-4 mb-2 ${idx === 0 ? 'mt-2' : 'mt-6'}`}>
                                {sec.label}
                            </p>
                            {sec.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                                            active
                                                ? 'bg-orange-500/10 text-orange-400 border-r-2 border-orange-400'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <span>{iconMap[item.icon] || iconMap.home}</span>
                                        <span className="flex-1 text-left truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <UserProfile showLabels />
            </aside>
        </>
    );
}
