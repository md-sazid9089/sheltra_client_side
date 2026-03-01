import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateCompanyProfile } from '../utils/profileValidation';

const INDUSTRIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Construction',
    'Transportation',
    'Agriculture',
    'Real Estate',
    'Media & Entertainment',
    'Non-Profit',
    'Government',
    'Other',
];

const COMPANY_SIZES = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1,000 employees' },
    { value: '1001-5000', label: '1,001-5,000 employees' },
    { value: '5001+', label: '5,001+ employees' },
];

export default function EmployerOnboarding() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        companyName: '',
        companyWebsite: '',
        industry: '',
        companySize: '',
        location: '',
        description: '',
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form
        const errors = validateCompanyProfile(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            // API call: POST /api/employer/profile
            // const response = await axios.post('/api/employer/profile', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Company Profile Data:', formData);

            setSuccessMessage('Company profile created successfully! Redirecting...');

            // Redirect to employer dashboard (talent pool) after 2 seconds
            setTimeout(() => {
                navigate('/talent-pool');
            }, 2000);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to save company profile. Please try again.'
            );
            setIsLoading(false);
        }
    };

    // Form input component
    const FormInput = ({ label, name, type = 'text', required = false, error, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-indigo-500'
                }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    // Form select component
    const FormSelect = ({ label, name, options, required = false, error, placeholder, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-indigo-500'
                }`}
                {...props}
            >
                <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
                {options.map((option) => (
                    <option 
                        key={typeof option === 'string' ? option : option.value} 
                        value={typeof option === 'string' ? option : option.value}
                    >
                        {typeof option === 'string' ? option : option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    // Form textarea component
    const FormTextarea = ({ label, name, required = false, error, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-indigo-500'
                }`}
                rows={4}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome to Sheltra! 🎉
                    </h1>
                    <p className="text-xl text-gray-600">
                        Let's set up your company profile to get started
                    </p>
                    {userInfo && (
                        <p className="text-gray-500 mt-2">
                            Logged in as: <span className="font-semibold">{userInfo.email}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-green-900">{successMessage}</h3>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-900">{errorMessage}</h3>
                            </div>
                        </div>
                    )}

                    {/* Company Information Section */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Company Information
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Company Name"
                                    name="companyName"
                                    required
                                    error={formErrors.companyName}
                                    placeholder="e.g., Acme Corporation"
                                />
                                <FormInput
                                    label="Company Website"
                                    name="companyWebsite"
                                    type="url"
                                    required
                                    error={formErrors.companyWebsite}
                                    placeholder="https://www.example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSelect
                                    label="Industry"
                                    name="industry"
                                    required
                                    error={formErrors.industry}
                                    options={INDUSTRIES}
                                    placeholder="Select your industry"
                                />
                                <FormSelect
                                    label="Company Size"
                                    name="companySize"
                                    required
                                    error={formErrors.companySize}
                                    options={COMPANY_SIZES}
                                    placeholder="Select company size"
                                />
                            </div>

                            <FormInput
                                label="Location"
                                name="location"
                                required
                                error={formErrors.location}
                                placeholder="e.g., New York, NY, USA"
                            />

                            <FormTextarea
                                label="Company Description"
                                name="description"
                                required
                                error={formErrors.description}
                                placeholder="Tell us about your company, your mission, and what makes you unique..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-12 rounded-lg transition-colors flex items-center gap-2 text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
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
                                    Creating Profile...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Complete Setup
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        By completing this form, you agree to our{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
