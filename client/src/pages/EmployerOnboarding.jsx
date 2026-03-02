import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateCompanyProfile } from '../utils/profileValidation';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/FormComponents';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const errors = validateCompanyProfile(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccessMessage('Company profile created successfully! Redirecting...');
            setTimeout(() => navigate('/talent-pool'), 2000);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to save company profile. Please try again.'
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-warning-500/10 to-primary-500/10 rounded-3xl blur-3xl -z-10"></div>
                <Card variant="glass" className="shadow-lg border border-warning-200/20">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Company Profile</h1>
                    <p className="text-gray-600">Tell us about your company to help us match you with the right talent</p>
                </Card>
            </div>

            {successMessage && (
                <Card className="bg-success-50 border-2 border-success-200">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-success-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="font-semibold text-success-900">{successMessage}</p>
                    </div>
                </Card>
            )}

            {errorMessage && (
                <Card className="bg-danger-50 border-2 border-danger-200">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-danger-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="font-semibold text-danger-900">{errorMessage}</p>
                    </div>
                </Card>
            )}

            <Card variant="glass" className="shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Company Name"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            error={formErrors.companyName}
                            placeholder="e.g., Acme Corporation"
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Company Website"
                            name="companyWebsite"
                            type="url"
                            value={formData.companyWebsite}
                            onChange={handleInputChange}
                            error={formErrors.companyWebsite}
                            placeholder="https://www.example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            error={formErrors.industry}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Select your industry</option>
                            {INDUSTRIES.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </Select>
                        <Select
                            label="Company Size"
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            error={formErrors.companySize}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Select company size</option>
                            {COMPANY_SIZES.map(size => (
                                <option key={size.value} value={size.value}>{size.label}</option>
                            ))}
                        </Select>
                    </div>

                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        error={formErrors.location}
                        placeholder="e.g., New York, NY, USA"
                        required
                        disabled={isLoading}
                    />

                    <Textarea
                        label="Company Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        error={formErrors.description}
                        placeholder="Tell us about your company, your mission, and what makes you unique..."
                        rows={4}
                        required
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Complete Onboarding
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

