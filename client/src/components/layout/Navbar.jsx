import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { storage } from '@/lib/storage';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function Navbar() {
  const { isAuthenticated, user, logout, role } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

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
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-surface-darkBase/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-primary">
            <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="currentColor" />
              <path d="M20 44V26a12 12 0 0 1 24 0v18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              <circle cx="32" cy="22" r="4" fill="#0D9488" />
            </svg>
            Sheltra
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors">
                  Login
                </Link>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={dashboardPath[role] || '/'}
                  className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-sm font-medium text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors"
                >
                  Settings
                </Link>
                <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20">
                  {role}
                </span>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darkCard transition-colors"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darkCard"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border-light dark:border-border-dark space-y-3 motion-safe-fade-in">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block text-sm font-medium text-text-secondary dark:text-text-darkSecondary" onClick={() => setMobileOpen(false)}>Login</Link>
                <Button size="sm" className="w-full" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Get Started</Button>
              </>
            ) : (
              <>
                <Link to={dashboardPath[role] || '/'} className="block text-sm font-medium text-text-secondary dark:text-text-darkSecondary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/settings" className="block text-sm font-medium text-text-secondary dark:text-text-darkSecondary" onClick={() => setMobileOpen(false)}>Settings</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-sm font-medium text-semantic-error">Logout</button>
              </>
            )}
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-darkSecondary">
              {dark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
