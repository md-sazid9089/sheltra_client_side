import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';
import { validateJobPosting } from '../utils/profileValidation';

const JOB_TYPES = [
    { value: 'Job', label: 'Job' },
    { value: 'Training', label: 'Training' },
    { value: 'Apprenticeship', label: 'Apprenticeship' },
];

const SKILL_PROFICIENCY_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
];

export default function EmployerJobPosting() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        type: 'Job',
        requiredSkills: [],
        location: '',
        description: '',
        applicationInfo: '',
    });

    const [skillInput, setSkillInput] = useState({
        skillName: '',
        proficiency: 'intermediate',
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

    // Handle skill addition
    const handleAddSkill = () => {
        if (!skillInput.skillName.trim()) {
            return;
        }

        // Check if skill already exists
        if (formData.requiredSkills.some(s => s.skillName.toLowerCase() === skillInput.skillName.toLowerCase())) {
            alert('This skill is already added');
            return;
        }

        setFormData(prev => ({
            ...prev,
            requiredSkills: [
                ...prev.requiredSkills,
                {
                    skillName: skillInput.skillName.trim(),
                    proficiency: skillInput.proficiency,
                },
            ],
        }));

        setSkillInput({
            skillName: '',
            proficiency: 'intermediate',
        });

        // Clear skills error
        if (formErrors.requiredSkills) {
            setFormErrors(prev => ({
                ...prev,
                requiredSkills: '',
            }));
        }
    };

    // Handle skill removal
    const handleRemoveSkill = (skillName) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(s => s.skillName !== skillName),
        }));
    };

    // Handle skill proficiency change
    const handleSkillChange = (skillName, field, value) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.map(skill =>
                skill.skillName === skillName
                    ? { ...skill, [field]: value }
                    : skill
            ),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate form
        const errors = validateJobPosting(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            // Prepare payload
            const payload = {
                ...formData,
                employerId: userInfo?.id,
                employerEmail: userInfo?.email,
                postedDate: new Date().toISOString(),
            };

            // API call: POST /api/employer/jobs
            // const response = await axios.post('/api/employer/jobs', payload);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Job Posting Data:', payload);

            setSuccessMessage(`${formData.type} posted successfully! Redirecting...`);

            // Redirect to employer job postings list after 2 seconds
            setTimeout(() => {
                navigate('/jobs');
            }, 2000);
        } catch (error) {
            console.error('Error creating job posting:', error);
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to create job posting. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Reusable FormInput component
    const FormInput = ({ label, name, type = 'text', required = false, error, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                } focus:outline-none transition-colors`}
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

    // Reusable FormSelect component
    const FormSelect = ({ label, name, required = false, error, options, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                } focus:outline-none transition-colors`}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
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

    // Reusable FormTextarea component
    const FormTextarea = ({ label, name, required = false, error, rows = 4, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                rows={rows}
                className={`w-full px-4 py-2 rounded-lg border-2 ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                } focus:outline-none transition-colors resize-none`}
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Job Posting</h1>
                    <p className="text-gray-600">
                        Post a job, training, or apprenticeship opportunity
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-semibold">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 bg-red-50 border-2 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-semibold">{errorMessage}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <FormInput
                        label="Job Title"
                        name="title"
                        required
                        error={formErrors.title}
                        placeholder="e.g., Software Developer, Marketing Training, Welding Apprenticeship"
                    />

                    {/* Type and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                            label="Posting Type"
                            name="type"
                            required
                            error={formErrors.type}
                            options={JOB_TYPES}
                        />

                        <FormInput
                            label="Location"
                            name="location"
                            required
                            error={formErrors.location}
                            placeholder="e.g., New York, NY or Remote"
                        />
                    </div>

                    {/* Required Skills Section */}
                    <div className="border-2 border-gray-300 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>

                        {/* Add Skill Input */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Add a Skill</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skill Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, Customer Service, Carpentry"
                                        value={skillInput.skillName}
                                        onChange={(e) => setSkillInput(prev => ({
                                            ...prev,
                                            skillName: e.target.value,
                                        }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Required Level<span className="text-red-500">*</span>
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
                            </div>

                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Add Skill
                            </button>
                        </div>

                        {/* Skills List */}
                        {formData.requiredSkills.length > 0 ? (
                            <div className="space-y-3">
                                {formData.requiredSkills.map((skill) => (
                                    <div
                                        key={skill.skillName}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 text-lg">{skill.skillName}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                <span className="font-medium">Required Level:</span>{' '}
                                                {SKILL_PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill.skillName)}
                                            className="text-red-600 hover:text-red-700 font-semibold text-lg px-3 py-1"
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">No skills added yet</p>
                        )}

                        {formErrors.requiredSkills && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path 
                                        fillRule="evenodd" 
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                                {formErrors.requiredSkills}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <FormTextarea
                        label="Description"
                        name="description"
                        required
                        error={formErrors.description}
                        rows={6}
                        placeholder="Provide a detailed description of the position, responsibilities, and what candidates can expect..."
                    />

                    {/* Application/Contact Info */}
                    <FormTextarea
                        label="Application/Contact Information"
                        name="applicationInfo"
                        required
                        error={formErrors.applicationInfo}
                        rows={4}
                        placeholder="How should candidates apply? Include email, phone number, or application portal URL..."
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/jobs')}
                            disabled={isLoading}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                    Creating...
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
                                    Post {formData.type}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
