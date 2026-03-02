import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'refugee',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s+\-()]{10,}$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            const response = await axios.post('/api/auth/register', formData);

            if (response.data.success) {
                setSuccessMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        { value: 'refugee', label: 'Refugee' },
        { value: 'ngo', label: 'NGO' },
        { value: 'employer', label: 'Employer' },
    ];

    /* Reusable input row renderer */
    const renderInput = ({ name, label, type, placeholder, icon, error }) => (
        <div>
            <div
                className={`flex items-center rounded-full overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${error ? 'ring-1 ring-red-500' : ''}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                onFocusCapture={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
            >
                <span className="pl-4 flex-shrink-0 text-gray-500" aria-hidden="true">{icon}</span>
                <div className="flex-1 px-3 py-2.5">
                    <label htmlFor={name} className="block text-xs font-medium text-gray-400 mb-0.5">{label}</label>
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        disabled={isLoading}
                        required
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                        className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>
            {error && <p id={`${name}-error`} className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen flex" style={{ background: '#0d1117' }}>

            {/* ══ LEFT PANEL ══ */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-between py-14 px-12">
                {/* Dark night-scene background */}
                <div className="absolute inset-0" style={{ background: '#111827' }} />
                <div className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(180,100,20,0.18) 0%, transparent 60%)' }} />
                <div className="absolute bottom-[15%] left-[10%] w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-[20%] right-[5%] w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, rgba(15,30,55,0.7) 0%, transparent 100%)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(1px)' }} />

                {/* Centre content */}
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
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto" style={{ background: '#0d1117' }}>
                <div className="w-full max-w-md mx-4">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center gap-2 mb-8">
                        <img src="/logo.png" alt="Sheltra" className="w-16 h-16 object-contain drop-shadow-lg" />
                        <span className="text-white font-bold text-2xl">Sheltra</span>
                    </div>

                    {/* Gradient-border card — teal → dark red */}
                    <div className="p-[1.5px] rounded-2xl" style={{ background: 'linear-gradient(145deg, #06b6d4 0%, #0891b2 30%, #7c3aed 65%, #991b1b 100%)' }}>
                    <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'linear-gradient(160deg, #0f1f2e 0%, #111827 50%, #1a0f0f 100%)' }}>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white">Create Account</h2>
                            <p className="text-sm text-gray-400 mt-2">Join Sheltra and start your journey</p>
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

                        {/* Role selector — pill toggle */}
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Register as</label>
                            <div className="flex gap-2 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {roleOptions.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        aria-pressed={formData.role === role.value}
                                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                                            ${formData.role === role.value
                                                ? 'bg-orange-500 text-white shadow-lg'
                                                : 'bg-white/5 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Full Name */}
                            {renderInput({
                                name: 'name',
                                label: 'Full Name',
                                type: 'text',
                                placeholder: 'John Doe',
                                error: errors.name,
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                ),
                            })}

                            {/* Email */}
                            {renderInput({
                                name: 'email',
                                label: 'Email Address',
                                type: 'email',
                                placeholder: 'your@email.com',
                                error: errors.email,
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ),
                            })}

                            {/* Phone */}
                            {renderInput({
                                name: 'phone',
                                label: 'Phone Number',
                                type: 'tel',
                                placeholder: '+1234567890',
                                error: errors.phone,
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                ),
                            })}

                            {/* Password */}
                            {renderInput({
                                name: 'password',
                                label: 'Password',
                                type: 'password',
                                placeholder: '••••••••',
                                error: errors.password,
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                ),
                            })}

                            {/* Confirm Password */}
                            {renderInput({
                                name: 'confirmPassword',
                                label: 'Confirm Password',
                                type: 'password',
                                placeholder: '••••••••',
                                error: errors.confirmPassword,
                                icon: (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                            })}

                            {/* Terms checkbox */}
                            <div className="flex items-start gap-2 text-sm pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-2 focus:ring-cyan-400 mt-0.5"
                                />
                                <label htmlFor="terms" className="text-gray-400">
                                    I agree to the{' '}
                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">Privacy Policy</a>
                                </label>
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
                                        Creating account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        {/* Sign in link */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </p>
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
        </div>
    );
}
