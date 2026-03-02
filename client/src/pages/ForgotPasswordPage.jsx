import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setSuccessMessage('Password reset instructions have been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0d1117' }}>
            <div className="w-full max-w-md mx-4">

                {/* Gradient-border card — teal → dark red */}
                <div className="p-[1.5px] rounded-2xl" style={{ background: 'linear-gradient(145deg, #06b6d4 0%, #0891b2 30%, #7c3aed 65%, #991b1b 100%)' }}>
                <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'linear-gradient(160deg, #0f1f2e 0%, #111827 50%, #1a0f0f 100%)' }}>

                    {successMessage ? (
                        /* ══ SUCCESS STATE ══ */
                        <div className="text-center py-4">
                            {/* Green check icon */}
                            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                            <p className="text-sm text-gray-400 mb-6">{successMessage}</p>

                            {/* Back to login */}
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* ══ FORM STATE ══ */
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                {/* Lock icon — orange accent */}
                                <div className="w-14 h-14 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto">
                                    <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mt-4">Forgot Password?</h2>
                                <p className="text-sm text-gray-400 mt-2">Enter your email and we'll send you a reset link</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-5 p-3 rounded-xl flex items-start gap-2.5 bg-red-500/10 border border-red-500/30">
                                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm font-medium text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email input */}
                                <div>
                                    <div
                                        className={`flex items-center rounded-full overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${error ? 'ring-1 ring-red-500' : ''}`}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                                        onFocusCapture={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                                        onBlurCapture={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
                                    >
                                        <span className="pl-4 flex-shrink-0 text-gray-500" aria-hidden="true">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <div className="flex-1 px-3 py-2.5">
                                            <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-0.5">Email Address</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (error) setError('');
                                                }}
                                                placeholder="your@email.com"
                                                disabled={isLoading}
                                                required
                                                aria-invalid={!!error}
                                                aria-describedby={error ? 'email-error' : undefined}
                                                className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent"
                                                style={{ colorScheme: 'dark' }}
                                            />
                                        </div>
                                    </div>
                                    {error && <p id="email-error" className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-full font-bold text-white text-base tracking-wide bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400/60"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : 'Send Reset Link'}
                                </button>
                            </form>

                            {/* Back to login link */}
                            <p className="mt-6 text-center text-sm text-gray-500">
                                Remember your password?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                                >
                                    Back to Login
                                </Link>
                            </p>
                        </>
                    )}
                </div>
                </div>

                {/* Back to home */}
                <div className="mt-5 text-center">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-xs transition-colors" style={{ color: '#475569' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
