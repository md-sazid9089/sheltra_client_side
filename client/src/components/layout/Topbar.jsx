import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';

export function Topbar({ onChatOpen }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-darkCard/80 backdrop-blur-md border-b border-border-dark flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-text-darkPrimary capitalize">
          {role} Portal
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Chat button */}
        {onChatOpen && (
          <button
            onClick={onChatOpen}
            className="p-2 rounded-lg hover:bg-surface-darkBase transition-colors"
            aria-label="Open chat"
            title="Open live chat"
          >
            <svg className="w-5 h-5 text-text-darkSecondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </button>
        )}
        <Link to="/settings" className="p-2 rounded-lg hover:bg-surface-darkBase transition-colors" aria-label="Settings">
          <svg className="w-5 h-5 text-text-darkSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </Link>
        <div className="flex items-center gap-2 pl-3 border-l border-border-dark">
          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || role?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-darkPrimary">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-text-darkMuted capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-surface-darkBase transition-colors text-text-darkSecondary"
          aria-label="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
}
