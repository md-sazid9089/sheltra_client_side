import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const STEPS = [
    { label: 'Company Info' },
    { label: 'Vetting' },
    { label: 'Agreement' },
    { label: 'Complete' },
];

export default function EmployerOnboarding() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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
            setCurrentStep(3); // go to Complete step
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to save company profile. Please try again.'
            );
            setIsLoading(false);
        }
    };

    /* ── Step validation for Next ── */
    const canAdvance = () => {
        if (currentStep === 0) {
            return formData.companyName && formData.companyWebsite && formData.industry && formData.companySize && formData.location;
        }
        if (currentStep === 1) {
            return formData.description.trim().length > 0;
        }
        if (currentStep === 2) {
            return agreedToTerms;
        }
        return false;
    };

    const handleNext = () => {
        if (currentStep < 2) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    /* ── Reusable text input renderer ── */
    const renderInput = ({ name, label, type = 'text', placeholder, icon, error }) => (
        <div>
            <div
                className={`flex items-center rounded-full overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${error ? 'ring-1 ring-red-500' : ''}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                onFocusCapture={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
            >
                {icon && <span className="pl-4 flex-shrink-0 text-gray-500" aria-hidden="true">{icon}</span>}
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
                        aria-invalid={!!error}
                        className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
        </div>
    );

    /* ── Reusable select renderer ── */
    const renderSelect = ({ name, label, options, placeholder, error }) => (
        <div>
            <div
                className={`flex items-center rounded-full overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${error ? 'ring-1 ring-red-500' : ''}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                onFocusCapture={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
            >
                <div className="flex-1 px-4 py-2.5">
                    <label htmlFor={name} className="block text-xs font-medium text-gray-400 mb-0.5">{label}</label>
                    <select
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        aria-invalid={!!error}
                        className="w-full text-sm text-white bg-transparent outline-none appearance-none cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                    >
                        <option value="" className="bg-slate-800">{placeholder}</option>
                        {options.map(opt => (
                            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value} className="bg-slate-800">
                                {typeof opt === 'string' ? opt : opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Dropdown arrow */}
                <span className="pr-4 text-gray-500 pointer-events-none" aria-hidden="true">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
        </div>
    );

    /* ── Reusable textarea renderer ── */
    const renderTextarea = ({ name, label, placeholder, error }) => (
        <div>
            <div
                className={`rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-1 focus-within:ring-cyan-400/60 ${error ? 'ring-1 ring-red-500' : ''}`}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'}` }}
                onFocusCapture={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.7)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)'; }}
            >
                <div className="px-4 py-3">
                    <label htmlFor={name} className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                    <textarea
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        disabled={isLoading}
                        aria-invalid={!!error}
                        rows={5}
                        className="w-full text-sm text-white placeholder-gray-600 outline-none bg-transparent resize-none min-h-[120px]"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
        </div>
    );

    /* ══════════ STEP INDICATOR ══════════ */
    const StepIndicator = () => (
        <div className="mb-8">
            {/* Desktop / tablet — horizontal */}
            <div className="hidden sm:flex items-center justify-between">
                {STEPS.map((step, idx) => {
                    const completed = idx < currentStep;
                    const active = idx === currentStep;
                    return (
                        <div key={step.label} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    completed ? 'bg-orange-500 text-white' :
                                    active ? 'border-2 border-orange-500 text-orange-400' :
                                    'border-2 border-gray-600 text-gray-500'
                                }`}>
                                    {completed ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    ) : idx + 1}
                                </div>
                                <span className={`mt-2 text-xs font-medium whitespace-nowrap ${active ? 'text-white' : completed ? 'text-orange-400' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 mt-[-18px] rounded-full transition-colors duration-300 ${idx < currentStep ? 'bg-orange-500' : 'bg-gray-700'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Mobile — vertical */}
            <div className="sm:hidden space-y-3">
                {STEPS.map((step, idx) => {
                    const completed = idx < currentStep;
                    const active = idx === currentStep;
                    return (
                        <div key={step.label} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                completed ? 'bg-orange-500 text-white' :
                                active ? 'border-2 border-orange-500 text-orange-400' :
                                'border-2 border-gray-600 text-gray-500'
                            }`}>
                                {completed ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                ) : idx + 1}
                            </div>
                            <span className={`text-sm font-medium ${active ? 'text-white' : completed ? 'text-orange-400' : 'text-gray-500'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    /* ══════════ RENDER ══════════ */
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#0f172a' }}>

            {/* ── Standalone navbar ── */}
            <nav className="w-full px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Sheltra" className="w-8 h-8 object-contain" />
                    <span className="text-lg font-bold text-white">Shel<span className="text-orange-400">tra</span></span>
                </Link>
                <a href="mailto:support@sheltra.org" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    Need help?
                </a>
            </nav>

            {/* ── Main content — centred wizard card ── */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl mx-4">

                    {/* Gradient-border card */}
                    <div className="p-[1.5px] rounded-2xl" style={{ background: 'linear-gradient(145deg, #06b6d4 0%, #0891b2 30%, #7c3aed 65%, #991b1b 100%)' }}>
                    <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'linear-gradient(160deg, #0f1f2e 0%, #111827 50%, #1a0f0f 100%)' }}>

                        {/* Step indicator */}
                        <StepIndicator />

                        {/* Error banner */}
                        {errorMessage && (
                            <div className="mb-5 p-3 rounded-xl flex items-start gap-2.5 bg-red-500/10 border border-red-500/30">
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium text-red-400">{errorMessage}</p>
                            </div>
                        )}

                        {/* ═══ STEP 0: Company Info ═══ */}
                        {currentStep === 0 && (
                            <div className="space-y-5">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Company Information</h2>
                                    <p className="text-sm text-gray-400 mt-1">Tell us about your company</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {renderInput({
                                        name: 'companyName',
                                        label: 'Company Name',
                                        placeholder: 'e.g., Acme Corporation',
                                        error: formErrors.companyName,
                                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                                    })}
                                    {renderInput({
                                        name: 'companyWebsite',
                                        label: 'Company Website',
                                        type: 'url',
                                        placeholder: 'https://www.example.com',
                                        error: formErrors.companyWebsite,
                                        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
                                    })}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {renderSelect({
                                        name: 'industry',
                                        label: 'Industry',
                                        options: INDUSTRIES,
                                        placeholder: 'Select your industry',
                                        error: formErrors.industry,
                                    })}
                                    {renderSelect({
                                        name: 'companySize',
                                        label: 'Company Size',
                                        options: COMPANY_SIZES,
                                        placeholder: 'Select company size',
                                        error: formErrors.companySize,
                                    })}
                                </div>

                                {renderInput({
                                    name: 'location',
                                    label: 'Location',
                                    placeholder: 'e.g., New York, NY, USA',
                                    error: formErrors.location,
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                                })}
                            </div>
                        )}

                        {/* ═══ STEP 1: Vetting (Company Description) ═══ */}
                        {currentStep === 1 && (
                            <div className="space-y-5">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Company Vetting</h2>
                                    <p className="text-sm text-gray-400 mt-1">Provide details to help us vet your company</p>
                                </div>

                                {renderTextarea({
                                    name: 'description',
                                    label: 'Company Description',
                                    placeholder: 'Tell us about your company, your mission, and what makes you unique...',
                                    error: formErrors.description,
                                })}
                            </div>
                        )}

                        {/* ═══ STEP 2: Agreement ═══ */}
                        {currentStep === 2 && (
                            <div className="space-y-5">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Employer Agreement</h2>
                                    <p className="text-sm text-gray-400 mt-1">Please review and accept the terms</p>
                                </div>

                                {/* Agreement text box */}
                                <div className="rounded-xl p-4 text-sm text-gray-300 leading-relaxed space-y-3 max-h-60 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <p>By completing this onboarding process you agree to the following:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                                        <li>You will provide accurate and truthful information about your company.</li>
                                        <li>You agree to abide by Sheltra's fair employment practices and non-discrimination policies.</li>
                                        <li>You consent to a background vetting process for employer eligibility.</li>
                                        <li>You acknowledge that all candidate data is confidential and must be handled per the Sheltra Privacy Policy.</li>
                                        <li>You agree to the Sheltra Terms of Service and Employer Code of Conduct.</li>
                                    </ul>
                                </div>

                                <div className="flex items-start gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/5 text-orange-500 focus:ring-2 focus:ring-cyan-400"
                                    />
                                    <label htmlFor="agreeTerms" className="text-sm text-gray-400">
                                        I have read and agree to the{' '}
                                        <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">Employer Code of Conduct</a>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 3: Complete (Success) ═══ */}
                        {currentStep === 3 && (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Onboarding Complete!</h2>
                                <p className="text-sm text-gray-400 mb-8">Your company profile is under review. We'll notify you once it's approved.</p>
                                <button
                                    onClick={() => navigate('/talent-pool')}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white text-base bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 transition-all duration-200 shadow-[0_4px_24px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400/60"
                                >
                                    Go to Dashboard
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            </div>
                        )}

                        {/* ═══ Navigation buttons (hidden on completion step) ═══ */}
                        {currentStep < 3 && (
                            <div className="flex items-center justify-between pt-8 mt-6 border-t border-gray-700/50">
                                {currentStep > 0 ? (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-2.5 rounded-full border border-gray-600 text-gray-400 text-sm font-medium hover:border-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                                    >
                                        Back
                                    </button>
                                ) : <div />}

                                {currentStep < 2 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!canAdvance()}
                                        className="px-8 py-2.5 rounded-full font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400/60"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={!canAdvance() || isLoading}
                                        className="px-8 py-2.5 rounded-full font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400/60 flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : 'Complete Onboarding'}
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

