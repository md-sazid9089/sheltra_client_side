import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/FormComponents';
import Card from '../components/ui/Card';

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
        <div className="min-h-screen flex">
            {/* Left Section - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute top-40 -right-20 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
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
                        Welcome Back to
                        <span className="block bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                            Your Future
                        </span>
                    </h1>

                    <p className="text-xl text-primary-100 mb-12 max-w-md leading-relaxed">
                        Beyond Shelter: Mapping Skills to Sustainable Livelihoods. Empowering refugees with opportunities.
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-4 max-w-md">
                        {[
                            { icon: '🎯', text: 'Match your skills with opportunities' },
                            { icon: '🤝', text: 'Connect with verified employers' },
                            { icon: '📈', text: 'Build sustainable livelihoods' },
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

            {/* Right Section - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg flex items-center justify-center">
                                <span className="text-xl font-bold text-white">S</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                                Sheltra
                            </span>
                        </div>
                    </div>

                    {/* Login Card */}
                    <Card variant="glass" className="shadow-xl border border-gray-200/50">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to continue to your account</p>
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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email or Phone"
                            name="emailOrPhone"
                            type="text"
                            value={formData.emailOrPhone}
                            onChange={handleInputChange}
                            placeholder="your@email.com or +1234567890"
                            error={errors.emailOrPhone}
                            required
                            disabled={isLoading}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer" 
                                />
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" size="md" fullWidth>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </Button>
                        <Button variant="secondary" size="md" fullWidth>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </Card>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Sheltra. All rights reserved.
                    </p>
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
