import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s+\-()]{10,}$/;

        if (!formData.emailOrPhone.trim()) {
            newErrors.emailOrPhone = 'Email or phone is required';
        } else if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
            newErrors.emailOrPhone = 'Please enter a valid email or phone number';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (apiError) setApiError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setApiError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post('/api/auth/login', {
                email_or_phone: formData.emailOrPhone,
                password: formData.password,
            });

            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (error) {
            setApiError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#0d1117' }}>

            {/* ══ LEFT PANEL ══ */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-between py-14 px-12">

                {/* Simulated blurred night-scene background */}
                <div className="absolute inset-0" style={{ background: '#111827' }} />
                {/* Ground-level warm glow (street lights) */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(180,100,20,0.18) 0%, transparent 60%)' }} />
                {/* Left light spot */}
                <div className="absolute bottom-[15%] left-[10%] w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                {/* Right light spot */}
                <div className="absolute bottom-[20%] right-[5%] w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                {/* Top dark-blue sky tone */}
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(15,30,55,0.7) 0%, transparent 100%)' }} />
                {/* Overall blurred glass effect */}
                <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(1px)' }} />

                {/* Center content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center gap-5">
                    <img src="/logo.png" alt="Sheltra" className="w-32 h-32 object-contain mb-2 drop-shadow-2xl" />
                    <h1 className="text-5xl xl:text-6xl font-extrabold text-white tracking-tight">Sheltra</h1>
                    <p className="text-slate-300 text-base max-w-xs leading-relaxed">
                        Beyond Shelter: Mapping Skills to<br />Sustainable Livelihoods
                    </p>
                </div>

                {/* Pagination dots */}
                <div className="relative z-10 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#f97316' }} />
                    <span className="w-5 h-3 rounded-full" style={{ background: '#06b6d4' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#f97316' }} />
                </div>
            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ background: '#0d1117' }}>
                <div className="w-full max-w-xl">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center gap-2 mb-8">
                        <img src="/logo.png" alt="Sheltra" className="w-16 h-16 object-contain drop-shadow-lg" />
                        <span className="text-white font-bold text-2xl">Sheltra</span>
                    </div>

                    {/* Gradient-border card — teal top-left → dark red bottom-right */}
                    <div className="p-[1.5px] rounded-2xl" style={{ background: 'linear-gradient(145deg, #06b6d4 0%, #0891b2 30%, #7c3aed 65%, #991b1b 100%)' }}>
                    <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'linear-gradient(160deg, #0f1f2e 0%, #111827 50%, #1a0f0f 100%)' }}>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                            <p className="text-sm text-gray-400 mt-2">Sign in to continue your journey</p>
                        </div>

                        {/* Success */}
                        {successMessage && (
                            <div className="mb-5 p-3 rounded-xl flex items-start gap-2.5 bg-emerald-500/10 border border-emerald-500/30">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium text-emerald-400">{successMessage}</p>
                            </div>
                        )}

                        {/* Error */}
                        {apiError && (
                            <div className="mb-5 p-3 rounded-xl flex items-start gap-2.5 bg-red-500/10 border border-red-500/30">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium text-red-400">{apiError}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email input — floating label inside container */}
                            <div>
                                <div
                                    className={`flex items-center rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${errors.emailOrPhone ? 'ring-1 ring-red-500' : ''}`}
                                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${errors.emailOrPhone ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                                    onFocusCapture={e => { if (!errors.emailOrPhone) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                                    onBlurCapture={e => { e.currentTarget.style.borderColor = errors.emailOrPhone ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
                                >
                                    <span className="pl-4 flex-shrink-0 text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1 px-3 py-2.5">
                                        <label className="block text-xs font-medium text-gray-400 mb-0.5">Email Address</label>
                                        <input
                                            name="emailOrPhone"
                                            type="text"
                                            value={formData.emailOrPhone}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            disabled={isLoading}
                                            className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>
                                {errors.emailOrPhone && <p className="mt-1.5 text-xs text-red-400">{errors.emailOrPhone}</p>}
                            </div>

                            {/* Password input — floating label inside container */}
                            <div>
                                <div
                                    className={`flex items-center rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${errors.password ? 'ring-1 ring-red-500' : ''}`}
                                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                                    onFocusCapture={e => { if (!errors.password) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                                    onBlurCapture={e => { e.currentTarget.style.borderColor = errors.password ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
                                >
                                    <span className="pl-4 flex-shrink-0 text-gray-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1 px-3 py-2.5">
                                        <label className="block text-xs font-medium text-gray-400 mb-0.5">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>
                                {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                            </div>

                            {/* Forgot password */}
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Sign In button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl font-bold text-white text-base tracking-wide bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(249,115,22,0.35)]"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6 flex items-center">
                            <div className="flex-1 border-t border-white/10" />
                            <span className="mx-3 text-xs text-gray-500">Or continue with</span>
                            <div className="flex-1 border-t border-white/10" />
                        </div>

                        {/* Social buttons */}
                        <div className="space-y-3">
                            {/* Google */}
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </button>

                            {/* GitHub */}
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="white" viewBox="0 0 24 24">
                                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55v-1.92c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.95 10.95 0 012.87-.39c.97.01 1.95.13 2.87.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.13v3.16c0 .3.2.66.79.55C20.22 21.37 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5z" />
                                </svg>
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Sign up */}
                        <p className="mt-7 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                    </div>

                    {/* Back to home */}
                    <div className="mt-5 text-center">
                        <Link to="/" className="inline-flex items-center gap-1.5 text-xs transition-colors" style={{ color: '#475569' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

