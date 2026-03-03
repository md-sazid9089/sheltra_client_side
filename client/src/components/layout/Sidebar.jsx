import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';

export function Sidebar({ links }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-surface-darkCard border-r border-border-light dark:border-border-dark min-h-[calc(100vh-4rem)] p-4 custom-scrollbar">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <svg className="w-8 h-8 text-brand-primary" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="currentColor" />
          <path d="M20 44V26a12 12 0 0 1 24 0v18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="22" r="4" fill="#0D9488" />
        </svg>
        <span className="font-bold text-lg text-brand-primary">Sheltra</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20'
                  : 'text-text-secondary dark:text-text-darkSecondary hover:bg-gray-100 dark:hover:bg-surface-darkBase'
              )
            }
          >
            {link.icon && <span className="w-5 h-5">{link.icon}</span>}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
