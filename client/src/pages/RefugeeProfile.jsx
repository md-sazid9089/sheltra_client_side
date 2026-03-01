import { useState } from 'react';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateProfileData } from '../utils/profileValidation';

const SUPPORTED_LANGUAGES = [
    'English',
    'Spanish',
    'French',
    'Arabic',
    'Mandarin',
    'Hindi',
    'Portuguese',
    'Bengali',
    'Russian',
    'Japanese',
    'German',
    'Swahili',
    'Amharic',
    'Tigrinya',
    'Somali',
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

export default function RefugeeProfile() {
    const userInfo = getUserInfo();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        // Basic Info
        firstName: userInfo?.name?.split(' ')[0] || '',
        lastName: userInfo?.name?.split(' ').slice(1).join(' ') || '',
        email: userInfo?.email || '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',

        // Location/Camp
        currentLocation: '',
        campName: '',
        nationality: '',
        countryOfOrigin: '',

        // Languages
        languages: [],

        // Skills
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

    // Handle basic input change
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

    // Handle language addition
    const handleAddLanguage = () => {
        if (!languageInput.language.trim()) {
            return;
        }

        // Check if language already exists
        if (formData.languages.some(l => l.language === languageInput.language)) {
            alert('This language is already added');
            return;
        }

        setFormData(prev => ({
            ...prev,
            languages: [
                ...prev.languages,
                {
                    language: languageInput.language,
                    proficiency: languageInput.proficiency,
                },
            ],
        }));

        setLanguageInput({
            language: '',
            proficiency: 'intermediate',
        });

        // Clear languages error
        if (formErrors.languages) {
            setFormErrors(prev => ({
                ...prev,
                languages: '',
            }));
        }
    };

    // Handle language removal
    const handleRemoveLanguage = (language) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(l => l.language !== language),
        }));
    };

    // Handle language proficiency change
    const handleLanguageProficiencyChange = (language, newProficiency) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.map(l =>
                l.language === language ? { ...l, proficiency: newProficiency } : l
            ),
        }));
    };

    // Handle skill addition
    const handleAddSkill = () => {
        if (!skillInput.skillName.trim()) {
            return;
        }

        // Validate years of experience
        const years = parseFloat(skillInput.yearsOfExperience);
        if (isNaN(years) || years < 0) {
            alert('Please enter valid years of experience (0 or more)');
            return;
        }

        // Check if skill already exists
        if (formData.skills.some(s => s.skillName.toLowerCase() === skillInput.skillName.toLowerCase())) {
            alert('This skill is already added');
            return;
        }

        setFormData(prev => ({
            ...prev,
            skills: [
                ...prev.skills,
                {
                    skillName: skillInput.skillName.trim(),
                    proficiency: skillInput.proficiency,
                    yearsOfExperience: parseFloat(skillInput.yearsOfExperience),
                },
            ],
        }));

        setSkillInput({
            skillName: '',
            proficiency: 'intermediate',
            yearsOfExperience: '',
        });

        // Clear skills error
        if (formErrors.skills) {
            setFormErrors(prev => ({
                ...prev,
                skills: '',
            }));
        }
    };

    // Handle skill removal
    const handleRemoveSkill = (skillName) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s.skillName !== skillName),
        }));
    };

    // Handle skill field change
    const handleSkillChange = (skillName, field, value) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.map(s =>
                s.skillName === skillName ? { ...s, [field]: value } : s
            ),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form
        const errors = validateProfileData(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = '/api/refugees/profile';

            const response = await axios({
                method,
                url,
                data: formData,
            });

            setSuccessMessage(
                isEditMode
                    ? 'Profile updated successfully!'
                    : 'Profile created successfully!'
            );

            // Switch to view mode
            setIsEditMode(false);

            // Optional: Update form with response data
            if (response.data) {
                setFormData(response.data);
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to save profile. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Form section component
    const FormSection = ({ title, children, icon }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center gap-3">
                {icon && <span className="text-white text-xl">{icon}</span>}
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    // Form input component
    const FormInput = ({ label, name, type = 'text', required = false, error, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-indigo-500'
                    }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    // Form select component
    const FormSelect = ({ label, name, options, required = false, error, ...props }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:border-indigo-500'
                    }`}
                {...props}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">
                        {isEditMode ? 'Edit your profile information' : 'View your profile information'}
                    </p>
                </div>
                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-green-900">{successMessage}</h3>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-red-900">{errorMessage}</h3>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-0">
                {/* Basic Information Section */}
                <FormSection
                    title="Basic Information"
                    icon="👤"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="First Name"
                            name="firstName"
                            required
                            error={formErrors.firstName}
                        />
                        <FormInput
                            label="Last Name"
                            name="lastName"
                            required
                            error={formErrors.lastName}
                        />
                        <FormInput
                            label="Email Address"
                            name="email"
                            type="email"
                            required
                            error={formErrors.email}
                        />
                        <FormInput
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            error={formErrors.phoneNumber}
                        />
                        <FormInput
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            required
                            error={formErrors.dateOfBirth}
                        />
                        <FormSelect
                            label="Gender"
                            name="gender"
                            required
                            error={formErrors.gender}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                                { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                            ]}
                        />
                    </div>
                </FormSection>

                {/* Location and Camp Section */}
                <FormSection
                    title="Location & Camp Information"
                    icon="📍"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Current Location"
                            name="currentLocation"
                            required
                            error={formErrors.currentLocation}
                            placeholder="City, Country"
                        />
                        <FormInput
                            label="Camp Name"
                            name="campName"
                            error={formErrors.campName}
                            placeholder="If applicable"
                        />
                        <FormSelect
                            label="Nationality"
                            name="nationality"
                            required
                            error={formErrors.nationality}
                            options={[
                                { value: 'syrian', label: 'Syrian' },
                                { value: 'sudanese', label: 'Sudanese' },
                                { value: 'somali', label: 'Somali' },
                                { value: 'afghan', label: 'Afghan' },
                                { value: 'iraqi', label: 'Iraqi' },
                                { value: 'eritrean', label: 'Eritrean' },
                                { value: 'ethiopian', label: 'Ethiopian' },
                                { value: 'congolese', label: 'Congolese' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                        <FormSelect
                            label="Country of Origin"
                            name="countryOfOrigin"
                            required
                            error={formErrors.countryOfOrigin}
                            options={[
                                { value: 'syria', label: 'Syria' },
                                { value: 'sudan', label: 'Sudan' },
                                { value: 'somalia', label: 'Somalia' },
                                { value: 'afghanistan', label: 'Afghanistan' },
                                { value: 'iraq', label: 'Iraq' },
                                { value: 'eritrea', label: 'Eritrea' },
                                { value: 'ethiopia', label: 'Ethiopia' },
                                { value: 'congo', label: 'Democratic Republic of Congo' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                    </div>
                </FormSection>

                {/* Languages Section */}
                <FormSection
                    title="Languages Spoken"
                    icon="🗣️"
                >
                    <div className="space-y-6">
                        {/* Add Language */}
                        {isEditMode && (
                            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Add a Language</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Language
                                        </label>
                                        <select
                                            value={languageInput.language}
                                            onChange={(e) => setLanguageInput(prev => ({
                                                ...prev,
                                                language: e.target.value,
                                            }))}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        >
                                            <option value="">Select language</option>
                                            {SUPPORTED_LANGUAGES.map(lang => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Proficiency
                                        </label>
                                        <select
                                            value={languageInput.proficiency}
                                            onChange={(e) => setLanguageInput(prev => ({
                                                ...prev,
                                                proficiency: e.target.value,
                                            }))}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        >
                                            {PROFICIENCY_LEVELS.map(level => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddLanguage}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors self-end"
                                    >
                                        Add Language
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Languages List */}
                        {formData.languages.length > 0 ? (
                            <div className="space-y-3">
                                {formData.languages.map((lang) => (
                                    <div
                                        key={lang.language}
                                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{lang.language}</p>
                                                <p className="text-sm text-gray-600">
                                                    {PROFICIENCY_LEVELS.find(l => l.value === lang.proficiency)?.label}
                                                </p>
                                            </div>
                                        </div>

                                        {isEditMode && (
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={lang.proficiency}
                                                    onChange={(e) => handleLanguageProficiencyChange(lang.language, e.target.value)}
                                                    className="px-3 py-1 rounded border-2 border-gray-300 text-sm focus:border-indigo-500 focus:outline-none"
                                                >
                                                    {PROFICIENCY_LEVELS.map(level => (
                                                        <option key={level.value} value={level.value}>
                                                            {level.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveLanguage(lang.language)}
                                                    className="text-red-600 hover:text-red-700 font-semibold"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">No languages added yet</p>
                        )}

                        {formErrors.languages && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.languages}
                            </p>
                        )}
                    </div>
                </FormSection>

                {/* Skills Section */}
                <FormSection
                    title="Professional Skills"
                    icon="💼"
                >
                    <div className="space-y-6">
                        {/* Add Skill */}
                        {isEditMode && (
                            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Add a Skill</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Skill Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., JavaScript, Carpentry"
                                            value={skillInput.skillName}
                                            onChange={(e) => setSkillInput(prev => ({
                                                ...prev,
                                                skillName: e.target.value,
                                            }))}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Proficiency<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={skillInput.proficiency}
                                            onChange={(e) => setSkillInput(prev => ({
                                                ...prev,
                                                proficiency: e.target.value,
                                            }))}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        >
                                            {SKILL_PROFICIENCY_LEVELS.map(level => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Years of Experience<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder="e.g., 2.5"
                                            value={skillInput.yearsOfExperience}
                                            onChange={(e) => setSkillInput(prev => ({
                                                ...prev,
                                                yearsOfExperience: e.target.value,
                                            }))}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors self-end"
                                    >
                                        Add Skill
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Skills List */}
                        {formData.skills.length > 0 ? (
                            <div className="space-y-3">
                                {formData.skills.map((skill) => (
                                    <div
                                        key={skill.skillName}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 text-lg">{skill.skillName}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Proficiency:</span>{' '}
                                                        {SKILL_PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Experience:</span>{' '}
                                                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                                    </p>
                                                </div>
                                            </div>

                                            {isEditMode && (
                                                <div className="flex items-center gap-3 ml-4">
                                                    <div className="flex flex-col gap-2">
                                                        <select
                                                            value={skill.proficiency}
                                                            onChange={(e) => handleSkillChange(skill.skillName, 'proficiency', e.target.value)}
                                                            className="px-3 py-1 rounded border-2 border-gray-300 text-sm focus:border-indigo-500 focus:outline-none"
                                                        >
                                                            {SKILL_PROFICIENCY_LEVELS.map(level => (
                                                                <option key={level.value} value={level.value}>
                                                                    {level.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.5"
                                                            value={skill.yearsOfExperience}
                                                            onChange={(e) => {
                                                                const years = parseFloat(e.target.value);
                                                                if (!isNaN(years) && years >= 0) {
                                                                    handleSkillChange(skill.skillName, 'yearsOfExperience', years);
                                                                }
                                                            }}
                                                            className="px-3 py-1 rounded border-2 border-gray-300 text-sm focus:border-indigo-500 focus:outline-none w-20"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill.skillName)}
                                                        className="text-red-600 hover:text-red-700 font-semibold text-lg"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">No skills added yet</p>
                        )}

                        {formErrors.skills && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.skills}
                            </p>
                        )}
                    </div>
                </FormSection>

                {/* Save Button */}
                {isEditMode && (
                    <div className="flex items-center gap-3 mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586 7.707 10.293z" />
                                    </svg>
                                    Save Profile
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
