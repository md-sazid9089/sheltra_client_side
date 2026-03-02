import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { storage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function Navbar() {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    storage.setTheme(next);
    setDark(!dark);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardPath = {
    refugee: '/refugee/dashboard',
    ngo: '/ngo/dashboard',
    employer: '/employer/dashboard',
    admin: '/admin/dashboard',
  };

  return (
    /* Outer wrapper — fixed, full-width, provides the horizontal padding */
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      {/* Capsule pill */}
      <nav
        className={cn(
          'pointer-events-auto mx-auto max-w-5xl rounded-full transition-all duration-300',
          scrolled
            ? 'bg-white/12 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/20'
            : 'bg-white/6 backdrop-blur-sm border border-white/12',
        )}
      >
        <div className="flex items-center justify-between h-14 px-5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="#3B82F6" />
              <path d="M20 44V26a12 12 0 0 1 24 0v18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              <circle cx="32" cy="22" r="4" fill="#0D9488" />
            </svg>
            Sheltra
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="ml-1 px-5 py-1.5 text-sm font-semibold rounded-full bg-white text-slate-900 hover:bg-white/90 transition-all shadow-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath[role] || '/'}
                  className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  Settings
                </Link>
                <span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-teal-500/20 border border-teal-400/25 text-teal-300">
                  {role}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  Logout
                </button>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-4.5 h-4.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown — opens below the capsule */}
        {mobileOpen && (
          <div className="md:hidden mx-2 mb-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-4 space-y-2 motion-safe-fade-in">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block text-sm font-medium text-white/80 hover:text-white py-2 px-3 rounded-xl hover:bg-white/10 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <button
                  className="w-full text-left text-sm font-semibold text-slate-900 bg-white hover:bg-white/90 py-2 px-3 rounded-xl transition-all"
                  onClick={() => { navigate('/register'); setMobileOpen(false); }}
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <Link to={dashboardPath[role] || '/'} className="block text-sm font-medium text-white/80 hover:text-white py-2 px-3 rounded-xl hover:bg-white/10 transition-all" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/settings" className="block text-sm font-medium text-white/80 hover:text-white py-2 px-3 rounded-xl hover:bg-white/10 transition-all" onClick={() => setMobileOpen(false)}>Settings</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left text-sm font-medium text-red-400 hover:text-red-300 py-2 px-3 rounded-xl hover:bg-white/10 transition-all">Logout</button>
              </>
            )}
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-white/70 hover:text-white py-2 px-3 rounded-xl hover:bg-white/10 transition-all w-full">
              {dark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
