import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-darkCard border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-bold text-xl text-brand-primary">
              Sheltra
            </Link>
            <p className="mt-3 text-sm text-text-secondary dark:text-text-darkSecondary">
              Dignified pathways from displacement to employment through verified skills, ethical AI, and trusted partnerships.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors">Create Skill Profile</Link></li>
              <li><Link to="/register" className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors">Partner as NGO</Link></li>
              <li><Link to="/register" className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary transition-colors">Post Opportunities</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">Documentation</span></li>
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">Privacy Policy</span></li>
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">Terms of Service</span></li>
            </ul>
          </div>

          {/* Impact */}
          <div>
            <h4 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-3">Impact</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">SDG Alignment</span></li>
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">Annual Report</span></li>
              <li><span className="text-sm text-text-secondary dark:text-text-darkSecondary">Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted dark:text-text-darkMuted">
            © {new Date().getFullYear()} Sheltra. From displacement to dignified employment.
          </p>
          <p className="text-xs text-text-muted dark:text-text-darkMuted">
            Aligned with UN SDG 8 &amp; SDG 10
          </p>
        </div>
      </div>
    </footer>
  );
}
