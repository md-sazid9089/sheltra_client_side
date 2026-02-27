import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Validation logic
    const validateForm = () => {
        const newErrors = {};

        // Validate email or phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s+\-()]{10,}$/;

        if (!formData.emailOrPhone.trim()) {
            newErrors.emailOrPhone = 'Email or phone is required';
        } else if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
            newErrors.emailOrPhone = 'Please enter a valid email or phone number';
        }

        // Validate password
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }

        // Clear API error when user modifies form
        if (apiError) {
            setApiError('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setApiError('');

        // Validate before submission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // POST request to /auth/login
            const response = await axios.post('/api/auth/login', {
                email_or_phone: formData.emailOrPhone,
                password: formData.password,
            });

            // Store token in localStorage
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                setSuccessMessage('Login successful! Redirecting...');

                // Redirect after success (you can replace with useNavigate from react-router-dom)
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        } catch (error) {
            setApiError(
                error.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Sheltra
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Sign in to your account
                        </p>
                    </div>

                    {/* API Error Message */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">{apiError}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email/Phone Field */}
                        <div>
                            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Phone
                            </label>
                            <input
                                id="emailOrPhone"
                                name="emailOrPhone"
                                type="text"
                                value={formData.emailOrPhone}
                                onChange={handleInputChange}
                                placeholder="Enter your email or phone number"
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${errors.emailOrPhone
                                    ? 'border-red-500 bg-red-50 placeholder-red-300'
                                    : 'border-gray-300 bg-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:bg-white'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                            {errors.emailOrPhone && (
                                <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.emailOrPhone}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${errors.password
                                    ? 'border-red-500 bg-red-50 placeholder-red-300'
                                    : 'border-gray-300 bg-gray-50 placeholder-gray-400 focus:border-indigo-500 focus:bg-white'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center h-12"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                        <a
                            href="/forgot-password"
                            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            Forgot password?
                        </a>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <a
                            href="/signup"
                            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            Create an account
                        </a>
                    </div>
                </div>

                {/* Responsive Info */}
                <p className="text-center text-gray-600 text-xs md:text-sm mt-6">
                    Beyond Shelter: Mapping Skills to Sustainable Livelihoods
                </p>
            </div>
        </div>
    );
}
