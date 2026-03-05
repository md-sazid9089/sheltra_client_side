import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { storage } from '@/lib/storage';
import { cn } from '@/lib/cn';
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Footer } from './Footer';

// ── Nav link definitions ──────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/refugee/dashboard',    label: 'Dashboard',     end: true },
  { to: '/refugee/opportunities', label: 'Opportunities' },
  { to: '/refugee/blogs',         label: 'Blogs' },
  { to: '/refugee/cv-rating',     label: 'CV Rating (AI)' },
];

// ── NavLinkItem ───────────────────────────────────────────────────────────────
function NavLinkItem({ to, label, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
          isActive
            ? 'bg-white/15 text-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )
      }
    >
      {label}
    </NavLink>
  );
}

// ── UserMenuDropdown ──────────────────────────────────────────────────────────
function UserMenuDropdown({ user, onLogout, onSettings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0 select-none">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-slate-200 leading-tight max-w-[120px] truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500 leading-tight capitalize">Refugee</p>
        </div>
        <FaChevronDown className={cn('w-3 h-3 text-slate-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/40 py-1 z-50 motion-safe-fade-in">
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <Link
            to="/refugee/profile"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/6 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </Link>
          <button
            onClick={() => { onSettings(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/6 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/8 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ── MobileDrawer ──────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, user, onLogout, onSettings, dark, onToggleTheme }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Close on Escape
  useEffect(() => {
    function handler(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-slate-950 border-r border-white/8 shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="14" fill="#06B6D4" />
              <path d="M20 44V26a12 12 0 0 1 24 0v18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              <circle cx="32" cy="22" r="4" fill="#0D9488" />
            </svg>
            <span className="font-bold text-lg text-white">Sheltra</span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              Refugee
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* User summary */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.to} {...link} onClick={onClose} />
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-4 py-4 border-t border-white/8 space-y-2">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            {dark ? <FaSun className="w-4 h-4 text-amber-400" /> : <FaMoon className="w-4 h-4 text-slate-400" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link
            to="/refugee/profile"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </Link>
          <button
            onClick={() => { onSettings(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/8 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

// ── RefugeeNavbar ─────────────────────────────────────────────────────────────
function RefugeeNavbar({ dark, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSettings = () => navigate('/settings');

  return (
    <>
      {/* Outer wrapper — fixed, full-width, provides the floating gap */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
        <header
          className={cn(
            'pointer-events-auto mx-auto max-w-5xl rounded-full transition-all duration-300',
            scrolled
              ? 'bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-lg shadow-black/30'
              : 'bg-white/6 backdrop-blur-sm border border-white/12'
          )}
        >
        <div className="flex items-center justify-between h-14 px-5">

            {/* ── Left: Brand ── */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <FaBars className="w-4 h-4" />
              </button>

              {/* Logo */}
              <NavLink to="/refugee/dashboard" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition-opacity">
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="14" fill="#06B6D4" />
                  <path d="M20 44V26a12 12 0 0 1 24 0v18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="32" cy="22" r="4" fill="#0D9488" />
                </svg>
                <span className="hidden sm:inline">Sheltra</span>
              </NavLink>

              {/* Role badge */}
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/12 text-cyan-400 border border-cyan-500/20">
                Refugee Portal
              </span>
            </div>

            {/* ── Center: Desktop nav links ── */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <NavLinkItem key={link.to} {...link} />
              ))}
            </nav>

            {/* ── Right: actions + user ── */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Theme toggle */}
              <button
                onClick={onToggleTheme}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {dark ? <FaSun className="w-4 h-4 text-amber-400" /> : <FaMoon className="w-4 h-4" />}
              </button>

              {/* Separator */}
              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" aria-hidden="true" />

              {/* User dropdown */}
              <UserMenuDropdown user={user} onLogout={handleLogout} onSettings={handleSettings} />
            </div>

          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={handleLogout}
        onSettings={handleSettings}
        dark={dark}
        onToggleTheme={onToggleTheme}
      />
    </>
  );
}

// ── RefugeeLayout (exported) ──────────────────────────────────────────────────
export function RefugeeLayout() {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    storage.setTheme(next);
    setDark(!dark);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <RefugeeNavbar dark={dark} onToggleTheme={toggleTheme} />

      {/* Page content — pt accounts for fixed floating navbar + gap */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
