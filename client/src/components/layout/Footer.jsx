import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaCheckCircle } from 'react-icons/fa';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      setSubscriptionStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setSubscriptionStatus('error');
      return;
    }

    // Success state
    setSubscriptionStatus('success');
    setErrorMessage('');
    setEmail('');

    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setSubscriptionStatus(null);
    }, 5000);
  };

  return (
    <footer className="bg-white dark:bg-surface-darkCard border-t border-border-light dark:border-border-dark">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col justify-start">
            <Link to="/" className="font-bold text-2xl text-brand-primary mb-4 inline-block w-fit">
              Sheltra
            </Link>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed mb-6">
              Dignified pathways from displacement to employment through verified skills, ethical AI, and trusted partnerships.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-4 items-center">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-lg text-text-primary dark:text-text-darkPrimary mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary dark:text-text-darkSecondary hover:text-brand-primary dark:hover:text-brand-primary transition-colors font-medium"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter Subscription */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-lg text-text-primary dark:text-text-darkPrimary mb-3">
              Stay Updated
            </h4>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-5">
              Subscribe to our newsletter for updates on opportunities and impact stories.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscriptionStatus(null);
                    setErrorMessage('');
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter subscription"
                  className={`w-full px-4 py-3 rounded-lg border transition-all text-sm ${subscriptionStatus === 'error'
                      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500 dark:border-red-500'
                      : 'border-border-light dark:border-border-dark focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    } bg-white dark:bg-surface-darkBase text-text-primary dark:text-text-darkPrimary placeholder-text-muted dark:placeholder-text-darkMuted focus:outline-none`}
                />
              </div>

              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="px-4 py-3 bg-brand-primary text-white rounded-lg font-medium text-sm hover:bg-brand-primary/90 active:scale-95 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-surface-darkCard"
              >
                Subscribe
              </button>

              {/* Success Message */}
              {subscriptionStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <FaCheckCircle className="text-green-600 dark:text-green-400" size={18} />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Thank you for subscribing!
                  </span>
                </div>
              )}

              {/* Error Message */}
              {subscriptionStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-darkBase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted dark:text-text-darkMuted text-center sm:text-left">
              © {new Date().getFullYear()} Sheltra. From displacement to dignified employment.
            </p>
            <p className="text-xs text-text-muted dark:text-text-darkMuted">
              Aligned with UN SDG 8 &amp; SDG 10
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
