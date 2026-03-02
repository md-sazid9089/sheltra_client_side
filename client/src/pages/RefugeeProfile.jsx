import { useState } from 'react';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateProfileData } from '../utils/profileValidation';

const SUPPORTED_LANGUAGES = [
    'English', 'Spanish', 'French', 'Arabic', 'Mandarin', 'Hindi',
    'Portuguese', 'Bengali', 'Russian', 'Japanese', 'German', 'Swahili',
    'Amharic', 'Tigrinya', 'Somali',
];

const PROFICIENCY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'fluent', label: 'Fluent' },
];

const SKILL_PROFICIENCY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

/* ── proficiency badge colour map ─────────────────────────────────── */
const profBadge = {
    beginner:     'border-yellow-500/60 text-yellow-400',
    intermediate: 'border-cyan-500/60   text-cyan-400',
    advanced:     'border-violet-500/60 text-violet-400',
    fluent:       'border-emerald-500/60 text-emerald-400',
};

export default function RefugeeProfile() {
    const userInfo = getUserInfo();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: userInfo?.name?.split(' ')[0] || '',
        lastName: userInfo?.name?.split(' ').slice(1).join(' ') || '',
        email: userInfo?.email || '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        currentLocation: '',
        campName: '',
        nationality: '',
        countryOfOrigin: '',
        languages: [],
        skills: [],
    });

    const [languageInput, setLanguageInput] = useState({
        language: '',
        proficiency: 'intermediate',
    });

    const [skillInput, setSkillInput] = useState({
        skillName: '',
        proficiency: 'intermediate',
        yearsOfExperience: '',
    });

    /* ── handlers (unchanged) ──────────────────────────────────────── */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddLanguage = () => {
        if (!languageInput.language.trim()) return;
        if (formData.languages.some(l => l.language === languageInput.language)) return;
        setFormData(prev => ({
            ...prev,
            languages: [...prev.languages, { ...languageInput }],
        }));
        setLanguageInput({ language: '', proficiency: 'intermediate' });
    };

    const handleRemoveLanguage = (language) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(l => l.language !== language),
        }));
    };

    const handleLanguageProficiencyChange = (language, proficiency) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.map(l =>
                l.language === language ? { ...l, proficiency } : l
            ),
        }));
    };

    const handleAddSkill = () => {
        if (!skillInput.skillName.trim()) return;
        if (formData.skills.some(s => s.skillName === skillInput.skillName)) return;
        const yearsOfExperience = parseFloat(skillInput.yearsOfExperience) || 0;
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { ...skillInput, yearsOfExperience }],
        }));
        setSkillInput({ skillName: '', proficiency: 'intermediate', yearsOfExperience: '' });
    };

    const handleRemoveSkill = (skillName) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s.skillName !== skillName),
        }));
    };

    const handleSkillChange = (skillName, field, value) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.map(s =>
                s.skillName === skillName ? { ...s, [field]: value } : s
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const errors = validateProfileData(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = '/api/refugees/profile';

            const response = await axios({ method, url, data: formData });

            setSuccessMessage(
                isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!'
            );
            setIsEditMode(false);

            if (response.data) setFormData(response.data);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Failed to save profile. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ── reusable dark-themed input ────────────────────────────────── */
    const renderInput = (label, name, type = 'text', opts = {}) => {
        const { required, disabled, error, ...rest } = opts;
        return (
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    {label}
                    {required && <span className="text-orange-400 ml-0.5">*</span>}
                </label>
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-500 transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${error
                            ? 'border border-red-500/70 focus:border-red-400'
                            : 'border border-gray-600/50 focus:border-cyan-400'}
                        focus:outline-none focus:ring-0`}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    {...rest}
                />
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
        );
    };

    const renderSelect = (label, name, options, opts = {}) => {
        const { required, disabled, error } = opts;
        return (
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    {label}
                    {required && <span className="text-orange-400 ml-0.5">*</span>}
                </label>
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 rounded-xl text-white transition-colors appearance-none
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${error
                            ? 'border border-red-500/70 focus:border-red-400'
                            : 'border border-gray-600/50 focus:border-cyan-400'}
                        focus:outline-none focus:ring-0`}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                    {options.map(o => (
                        <option key={o.value} value={o.value} className="bg-gray-900 text-white">
                            {o.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
        );
    };

    /* ── JSX ───────────────────────────────────────────────────────── */
    return (
        <div className="space-y-8">
            {/* ── Profile Header ───────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* avatar */}
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f97316, #7c3aed)' }}
                    >
                        {(formData.firstName?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Profile</h1>
                        <p className="text-gray-400 text-sm mt-0.5">
                            {isEditMode ? 'Edit your profile information' : 'View your profile information'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all
                        ${isEditMode
                            ? 'border border-gray-600 text-gray-300 hover:border-gray-400'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}
                >
                    {isEditMode ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            {/* ── Notifications ────────────────────────────────────── */}
            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-emerald-500/30"
                     style={{ background: 'rgba(16,185,129,0.08)' }}>
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-emerald-300 font-medium">{successMessage}</p>
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-red-500/30"
                     style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-300 font-medium">{errorMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Basic Information Card ───────────────────────── */}
                <section className="rounded-2xl border border-gray-700/50 p-6"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'rgba(249,115,22,0.15)' }}>
                            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {renderInput('First Name', 'firstName', 'text', { required: true, disabled: !isEditMode, error: formErrors.firstName })}
                        {renderInput('Last Name', 'lastName', 'text', { required: true, disabled: !isEditMode, error: formErrors.lastName })}
                        {renderInput('Email Address', 'email', 'email', { required: true, disabled: !isEditMode, error: formErrors.email })}
                        {renderInput('Phone Number', 'phoneNumber', 'tel', { disabled: !isEditMode, error: formErrors.phoneNumber })}
                        {renderInput('Date of Birth', 'dateOfBirth', 'date', { required: true, disabled: !isEditMode, error: formErrors.dateOfBirth })}
                        {renderSelect('Gender', 'gender', [
                            { value: '', label: 'Select gender' },
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' },
                            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                        ], { required: true, disabled: !isEditMode, error: formErrors.gender })}
                    </div>
                </section>

                {/* ── Location & Camp Card ─────────────────────────── */}
                <section className="rounded-2xl border border-gray-700/50 p-6"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'rgba(6,182,212,0.15)' }}>
                            <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Location & Camp Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {renderInput('Current Location', 'currentLocation', 'text', { required: true, disabled: !isEditMode, error: formErrors.currentLocation })}
                        {renderInput('Camp Name', 'campName', 'text', { disabled: !isEditMode, error: formErrors.campName })}
                        {renderSelect('Nationality', 'nationality', [
                            { value: '', label: 'Select nationality' },
                            { value: 'syrian', label: 'Syrian' },
                            { value: 'sudanese', label: 'Sudanese' },
                            { value: 'somali', label: 'Somali' },
                            { value: 'afghan', label: 'Afghan' },
                            { value: 'iraqi', label: 'Iraqi' },
                            { value: 'eritrean', label: 'Eritrean' },
                            { value: 'ethiopian', label: 'Ethiopian' },
                            { value: 'congolese', label: 'Congolese' },
                            { value: 'other', label: 'Other' },
                        ], { required: true, disabled: !isEditMode, error: formErrors.nationality })}
                        {renderSelect('Country of Origin', 'countryOfOrigin', [
                            { value: '', label: 'Select country' },
                            { value: 'syria', label: 'Syria' },
                            { value: 'sudan', label: 'Sudan' },
                            { value: 'somalia', label: 'Somalia' },
                            { value: 'afghanistan', label: 'Afghanistan' },
                            { value: 'iraq', label: 'Iraq' },
                            { value: 'eritrea', label: 'Eritrea' },
                            { value: 'ethiopia', label: 'Ethiopia' },
                            { value: 'congo', label: 'Democratic Republic of Congo' },
                            { value: 'other', label: 'Other' },
                        ], { required: true, disabled: !isEditMode, error: formErrors.countryOfOrigin })}
                    </div>
                </section>

                {/* ── Languages Card ───────────────────────────────── */}
                <section className="rounded-2xl border border-gray-700/50 p-6"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'rgba(139,92,246,0.15)' }}>
                            <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Languages Spoken</h2>
                    </div>

                    {/* Add language row */}
                    {isEditMode && (
                        <div className="rounded-xl border border-gray-600/40 p-5 mb-6"
                             style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <h3 className="text-sm font-semibold text-gray-300 mb-4">Add a Language</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Language</label>
                                    <select
                                        value={languageInput.language}
                                        onChange={(e) => setLanguageInput(prev => ({ ...prev, language: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <option value="" className="bg-gray-900 text-white">Select language</option>
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <option key={lang} value={lang} className="bg-gray-900 text-white">{lang}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Proficiency</label>
                                    <select
                                        value={languageInput.proficiency}
                                        onChange={(e) => setLanguageInput(prev => ({ ...prev, proficiency: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        {PROFICIENCY_LEVELS.map(l => (
                                            <option key={l.value} value={l.value} className="bg-gray-900 text-white">{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleAddLanguage}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Language list */}
                    {formData.languages.length > 0 ? (
                        <div className="space-y-3">
                            {formData.languages.map((lang) => (
                                <div key={lang.language}
                                     className="rounded-xl border border-gray-700/50 p-4 flex items-center justify-between transition-colors hover:border-gray-600"
                                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                             style={{ background: 'rgba(139,92,246,0.12)' }}>
                                            <span className="text-base">🗣️</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{lang.language}</p>
                                            <span className={`inline-block text-xs font-medium border rounded-full px-2.5 py-0.5 mt-1 ${profBadge[lang.proficiency] || 'border-gray-500 text-gray-400'}`}>
                                                {PROFICIENCY_LEVELS.find(l => l.value === lang.proficiency)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {isEditMode && (
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={lang.proficiency}
                                                onChange={(e) => handleLanguageProficiencyChange(lang.language, e.target.value)}
                                                className="px-3 py-1.5 rounded-lg text-sm text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none appearance-none"
                                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                            >
                                                {PROFICIENCY_LEVELS.map(l => (
                                                    <option key={l.value} value={l.value} className="bg-gray-900">{l.label}</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={() => handleRemoveLanguage(lang.language)}
                                                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3"
                                 style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No languages added yet</p>
                        </div>
                    )}

                    {formErrors.languages && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-3">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.languages}
                        </p>
                    )}
                </section>

                {/* ── Skills Card ──────────────────────────────────── */}
                <section className="rounded-2xl border border-gray-700/50 p-6"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'rgba(234,179,8,0.12)' }}>
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Professional Skills</h2>
                    </div>

                    {/* Add skill row */}
                    {isEditMode && (
                        <div className="rounded-xl border border-gray-600/40 p-5 mb-6"
                             style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <h3 className="text-sm font-semibold text-gray-300 mb-4">Add a Skill</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Skill Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, Carpentry"
                                        value={skillInput.skillName}
                                        onChange={(e) => setSkillInput(prev => ({ ...prev, skillName: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-500 border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Proficiency</label>
                                    <select
                                        value={skillInput.proficiency}
                                        onChange={(e) => setSkillInput(prev => ({ ...prev, proficiency: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        {SKILL_PROFICIENCY_LEVELS.map(l => (
                                            <option key={l.value} value={l.value} className="bg-gray-900">{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Years of Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="0"
                                        value={skillInput.yearsOfExperience}
                                        onChange={(e) => setSkillInput(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-500 border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Skill list */}
                    {formData.skills.length > 0 ? (
                        <div className="space-y-3">
                            {formData.skills.map((skill) => (
                                <div key={skill.skillName}
                                     className="rounded-xl border border-gray-700/50 p-4 transition-colors hover:border-gray-600"
                                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                                 style={{ background: 'rgba(234,179,8,0.10)' }}>
                                                <span className="text-base">💼</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-lg">{skill.skillName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-block text-xs font-medium border rounded-full px-2.5 py-0.5 ${profBadge[skill.proficiency] || 'border-gray-500 text-gray-400'}`}>
                                                        {SKILL_PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label}
                                                    </span>
                                                    <span className="text-gray-600">·</span>
                                                    <span className="text-sm text-gray-400">
                                                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditMode && (
                                            <div className="flex items-center gap-3 ml-4">
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={skill.proficiency}
                                                        onChange={(e) => handleSkillChange(skill.skillName, 'proficiency', e.target.value)}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none appearance-none"
                                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                                    >
                                                        {SKILL_PROFICIENCY_LEVELS.map(l => (
                                                            <option key={l.value} value={l.value} className="bg-gray-900">{l.label}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={skill.yearsOfExperience}
                                                        onChange={(e) => {
                                                            const years = parseFloat(e.target.value);
                                                            if (!isNaN(years) && years >= 0)
                                                                handleSkillChange(skill.skillName, 'yearsOfExperience', years);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg text-sm text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none"
                                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                                    />
                                                </div>
                                                <button type="button" onClick={() => handleRemoveSkill(skill.skillName)}
                                                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3"
                                 style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <svg className="w-7 h-7 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">No skills added yet</p>
                        </div>
                    )}

                    {formErrors.skills && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-3">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.skills}
                        </p>
                    )}
                </section>

                {/* ── Save / Cancel Buttons ────────────────────────── */}
                {isEditMode && (
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-lg shadow-orange-500/20"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586 7.707 10.293z" />
                                    </svg>
                                    Save Profile
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
                            className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:border-gray-400 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
