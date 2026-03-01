import { useState } from 'react';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateProfileData } from '../utils/profileValidation';
import Button from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/FormComponents';
import Card, { CardSection } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddLanguage = () => {
        if (!languageInput.language.trim()) return;
        if (formData.languages.some(l => l.language === languageInput.language)) {
            return;
        }
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
        if (formData.skills.some(s => s.skillName === skillInput.skillName)) {
            return;
        }
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

            const response = await axios({
                method,
                url,
                data: formData,
            });

            setSuccessMessage(
                isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!'
            );
            setIsEditMode(false);

            if (response.data) {
                setFormData(response.data);
            }

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Failed to save profile. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                subtitle={isEditMode ? 'Edit your profile information' : 'View your profile information'}
                actions={
                    <Button
                        variant={isEditMode ? 'secondary' : 'primary'}
                        size="md"
                        onClick={() => setIsEditMode(!isEditMode)}
                        disabled={isLoading}
                        icon={
                            isEditMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            )
                        }
                    >
                        {isEditMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                }
            />

            {successMessage && (
                <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-success-700 font-medium">{successMessage}</p>
                </div>
            )}

            {errorMessage && (
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-danger-700 font-medium">{errorMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card variant="glass">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-lg">
                            <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.firstName}
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.lastName}
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.email}
                        />
                        <Input
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            error={formErrors.phoneNumber}
                        />
                        <Input
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.dateOfBirth}
                        />
                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.gender}
                            options={[
                                { value: '', label: 'Select gender' },
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                                { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                            ]}
                        />
                    </div>
                </Card>

                {/* Location & Camp Information */}
                <Card variant="glass">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 flex items-center justify-center bg-success-100 rounded-lg">
                            <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Location & Camp Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Current Location"
                            name="currentLocation"
                            value={formData.currentLocation}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.currentLocation}
                        />
                        <Input
                            label="Camp Name"
                            name="campName"
                            value={formData.campName}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            error={formErrors.campName}
                        />
                        <Select
                            label="Nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.nationality}
                            options={[
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
                            ]}
                        />
                        <Select
                            label="Country of Origin"
                            name="countryOfOrigin"
                            value={formData.countryOfOrigin}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            required
                            error={formErrors.countryOfOrigin}
                            options={[
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
                            ]}
                        />
                    </div>
                </Card>

                {/* Languages */}
                <Card variant="glass">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Languages Spoken</h2>
                    </div>

                    {isEditMode && (
                        <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-5 mb-6 border border-primary-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Add a Language</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select
                                    label="Language"
                                    value={languageInput.language}
                                    onChange={(e) => setLanguageInput(prev => ({
                                        ...prev,
                                        language: e.target.value,
                                    }))}
                                    options={[
                                        { value: '', label: 'Select language' },
                                        ...SUPPORTED_LANGUAGES.map(lang => ({ value: lang, label: lang }))
                                    ]}
                                />
                                <Select
                                    label="Proficiency"
                                    value={languageInput.proficiency}
                                    onChange={(e) => setLanguageInput(prev => ({
                                        ...prev,
                                        proficiency: e.target.value,
                                    }))}
                                    options={PROFICIENCY_LEVELS}
                                />
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="md"
                                        fullWidth
                                        onClick={handleAddLanguage}
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.languages.length > 0 ? (
                        <div className="space-y-3">
                            {formData.languages.map((lang) => (
                                <div
                                    key={lang.language}
                                    className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-gray-200 hover:border-primary-300 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                                            <span className="text-lg">🗣️</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{lang.language}</p>
                                            <Badge variant={lang.proficiency}>
                                                {PROFICIENCY_LEVELS.find(l => l.value === lang.proficiency)?.label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {isEditMode && (
                                        <div className="flex items-center gap-3">
                                            <Select
                                                value={lang.proficiency}
                                                onChange={(e) => handleLanguageProficiencyChange(lang.language, e.target.value)}
                                                options={PROFICIENCY_LEVELS}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveLanguage(lang.language)}
                                                icon={
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-gray-600">No languages added yet</p>
                        </div>
                    )}

                    {formErrors.languages && (
                        <p className="text-sm text-danger-600 flex items-center gap-1 mt-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.languages}
                        </p>
                    )}
                </Card>

                {/* Skills */}
                <Card variant="glass">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 flex items-center justify-center bg-warning-100 rounded-lg">
                            <svg className="w-6 h-6 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Professional Skills</h2>
                    </div>

                    {isEditMode && (
                        <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-xl p-5 mb-6 border border-success-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Add a Skill</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    label="Skill Name"
                                    placeholder="e.g., JavaScript, Carpentry"
                                    value={skillInput.skillName}
                                    onChange={(e) => setSkillInput(prev => ({
                                        ...prev,
                                        skillName: e.target.value,
                                    }))}
                                />
                                <Select
                                    label="Proficiency"
                                    value={skillInput.proficiency}
                                    onChange={(e) => setSkillInput(prev => ({
                                        ...prev,
                                        proficiency: e.target.value,
                                    }))}
                                    options={SKILL_PROFICIENCY_LEVELS}
                                />
                                <Input
                                    label="Years of Experience"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder="0"
                                    value={skillInput.yearsOfExperience}
                                    onChange={(e) => setSkillInput(prev => ({
                                        ...prev,
                                        yearsOfExperience: e.target.value,
                                    }))}
                                />
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="success"
                                        size="md"
                                        fullWidth
                                        onClick={handleAddSkill}
                                        icon={
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        }
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.skills.length > 0 ? (
                        <div className="space-y-3">
                            {formData.skills.map((skill) => (
                                <div
                                    key={skill.skillName}
                                    className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-success-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                                                    <span className="text-lg">💼</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-lg">{skill.skillName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={skill.proficiency}>
                                                            {SKILL_PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">•</span>
                                                        <span className="text-sm text-gray-600">
                                                            {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditMode && (
                                            <div className="flex items-center gap-3 ml-4">
                                                <div className="flex flex-col gap-2">
                                                    <Select
                                                        value={skill.proficiency}
                                                        onChange={(e) => handleSkillChange(skill.skillName, 'proficiency', e.target.value)}
                                                        options={SKILL_PROFICIENCY_LEVELS}
                                                    />
                                                    <Input
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
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveSkill(skill.skillName)}
                                                    icon={
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">No skills added yet</p>
                        </div>
                    )}

                    {formErrors.skills && (
                        <p className="text-sm text-danger-600 flex items-center gap-1 mt-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {formErrors.skills}
                        </p>
                    )}
                </Card>

                {/* Save Button */}
                {isEditMode && (
                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            disabled={isLoading}
                            icon={
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L10 12.586 7.707 10.293z" />
                                </svg>
                            }
                        >
                            Save Profile
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={() => setIsEditMode(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
