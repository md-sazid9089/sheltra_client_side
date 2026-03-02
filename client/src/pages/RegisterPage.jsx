import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/FormComponents';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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
        { value: 'refugee', label: 'Refugee', icon: '👤', color: 'primary' },
        { value: 'ngo', label: 'NGO', icon: '🤝', color: 'success' },
        { value: 'employer', label: 'Employer', icon: '💼', color: 'warning' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-success-600 via-success-700 to-success-800 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 -left-20 w-96 h-96 bg-success-500/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute top-40 -right-20 w-96 h-96 bg-success-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-success-600/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white w-full">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="text-2xl font-bold">S</span>
                        </div>
                        <span className="text-3xl font-bold">Sheltra</span>
                    </div>

                    <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                        Start Your
                        <span className="block bg-gradient-to-r from-white to-success-100 bg-clip-text text-transparent">
                            Journey Today
                        </span>
                    </h1>

                    <p className="text-xl text-success-100 mb-12 max-w-md leading-relaxed">
                        Join thousands already building sustainable livelihoods. Create your account and unlock opportunities.
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-4 max-w-md">
                        {[
                            { icon: '✨', text: 'Free to join and use' },
                            { icon: '🔒', text: 'Secure and confidential' },
                            { icon: '🌍', text: 'Global opportunities' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-white/90">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-xl">
                                    {item.icon}
                                </div>
                                <span className="text-lg">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-success-600 to-success-700 rounded-xl shadow-lg flex items-center justify-center">
                                <span className="text-xl font-bold text-white">S</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                                Sheltra
                            </span>
                        </div>
                    </div>

                    {/* Registration Card */}
                    <Card variant="glass" className="shadow-xl border border-gray-200/50">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-600">Join Sheltra and start your journey</p>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-success-700 font-medium">{successMessage}</p>
                            </div>
                        )}

                        {/* API Error */}
                        {apiError && (
                            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-danger-700 font-medium">{apiError}</p>
                            </div>
                        )}

                        {/* Register As - Role Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Register as
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {roleOptions.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                        className={`
                                            relative p-4 rounded-xl border-2 transition-all duration-200
                                            ${formData.role === role.value
                                                ? `border-${role.color}-500 bg-${role.color}-50 ring-2 ring-${role.color}-200`
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <div className="text-2xl mb-2">{role.icon}</div>
                                        <div className={`text-sm font-semibold ${formData.role === role.value ? `text-${role.color}-700` : 'text-gray-700'}`}>
                                            {role.label}
                                        </div>
                                        {formData.role === role.value && (
                                            <div className="absolute top-2 right-2">
                                                <svg className={`w-5 h-5 text-${role.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                error={errors.name}
                                required
                                disabled={isLoading}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                error={errors.email}
                                required
                                disabled={isLoading}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1234567890"
                                error={errors.phone}
                                required
                                disabled={isLoading}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                error={errors.password}
                                required
                                disabled={isLoading}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                error={errors.confirmPassword}
                                required
                                disabled={isLoading}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />

                            <div className="flex items-start gap-2 text-sm pt-2">
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    required
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 mt-0.5" 
                                />
                                <label htmlFor="terms" className="text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Create Account
                            </Button>
                        </form>

                        {/* Sign In Link */}
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </Card>

                    {/* Footer Links */}
                    <div className="mt-8 text-center space-y-3">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                            <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
                            <span>•</span>
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                        </div>
                        <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1.5 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
