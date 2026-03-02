import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/FormComponents';
import Card from '../components/ui/Card';

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
        <div className="min-h-screen flex items-center justify-center p-8 bg-linear-to-br from-gray-50 via-white to-gray-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">S</span>
                        </div>
                        <span className="text-3xl font-bold bg-linear-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            Sheltra
                        </span>
                    </div>
                </div>

                {/* Forgot Password Card */}
                <Card variant="glass" className="shadow-xl border border-gray-200/50">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                        <p className="text-gray-600">No worries, we'll send you reset instructions</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-success-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-success-700 font-medium">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-danger-700 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="your@email.com"
                            error={error}
                            required
                            disabled={isLoading}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Send Reset Instructions
                        </Button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1.5 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
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
    );
}
