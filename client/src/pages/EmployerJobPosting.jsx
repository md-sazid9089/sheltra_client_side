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

    /* ── handlers (unchanged) ──────────────────────────────────────── */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddSkill = () => {
        if (!skillInput.skillName.trim()) return;
        if (formData.requiredSkills.some(s => s.skillName.toLowerCase() === skillInput.skillName.toLowerCase())) {
            alert('This skill is already added');
            return;
        }
        setFormData(prev => ({
            ...prev,
            requiredSkills: [
                ...prev.requiredSkills,
                { skillName: skillInput.skillName.trim(), proficiency: skillInput.proficiency },
            ],
        }));
        setSkillInput({ skillName: '', proficiency: 'intermediate' });
        if (formErrors.requiredSkills) {
            setFormErrors(prev => ({ ...prev, requiredSkills: '' }));
        }
    };

    const handleRemoveSkill = (skillName) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(s => s.skillName !== skillName),
        }));
    };

    const handleSkillChange = (skillName, field, value) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.map(skill =>
                skill.skillName === skillName ? { ...skill, [field]: value } : skill
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const errors = validateJobPosting(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                employerId: userInfo?.id,
                employerEmail: userInfo?.email,
                postedDate: new Date().toISOString(),
            };

            // API call: POST /api/employer/jobs
            // const response = await axios.post('/api/employer/jobs', payload);

            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccessMessage(`${formData.type} posted successfully! Redirecting...`);

            setTimeout(() => {
                navigate('/jobs');
            }, 2000);
        } catch (error) {
            console.error('Error creating job posting:', error);
            setErrorMessage(
                error.response?.data?.message || 'Failed to create job posting. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* ── reusable dark-themed helpers ──────────────────────────────── */
    const inputCls = (err) =>
        `w-full px-4 py-2.5 rounded-xl text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-0 ${
            err ? 'border border-red-500/70 focus:border-red-400' : 'border border-gray-600/50 focus:border-cyan-400'
        }`;

    const labelCls = 'block text-sm font-medium text-gray-400 mb-1.5';

    const errorEl = (msg) =>
        msg ? (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {msg}
            </p>
        ) : null;

    /* ── proficiency badge colour ──────────────────────────────────── */
    const profBadge = {
        beginner:     'border-yellow-500/60 text-yellow-400',
        intermediate: 'border-cyan-500/60   text-cyan-400',
        advanced:     'border-violet-500/60 text-violet-400',
    };

    /* ── JSX ───────────────────────────────────────────────────────── */
    return (
        <div className="space-y-8">
            {/* ── Header ──────────────────────────────────────────── */}
            <div>
                <h1 className="text-2xl font-bold text-white">Create Job Posting</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Post a job, training, or apprenticeship opportunity
                </p>
            </div>

            {/* ── Notifications ────────────────────────────────────── */}
            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-emerald-500/30"
                     style={{ background: 'rgba(16,185,129,0.08)' }}>
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-emerald-300 font-semibold">{successMessage}</p>
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center gap-3 rounded-xl px-5 py-3 border border-red-500/30"
                     style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-300 font-semibold">{errorMessage}</p>
                </div>
            )}

            {/* ── Form Card ───────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="rounded-2xl border border-gray-700/50 p-6"
                         style={{ background: 'rgba(255,255,255,0.03)' }}>

                    {/* Title */}
                    <div className="mb-6">
                        <label className={labelCls}>
                            Job Title<span className="text-orange-400 ml-0.5">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Software Developer, Marketing Training, Welding Apprenticeship"
                            className={inputCls(formErrors.title)}
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        />
                        {errorEl(formErrors.title)}
                    </div>

                    {/* Type pill toggle + Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Type as pill toggle */}
                        <div>
                            <label className={labelCls}>
                                Posting Type<span className="text-orange-400 ml-0.5">*</span>
                            </label>
                            <div className="flex rounded-full p-1 gap-1 border border-gray-600/50"
                                 style={{ background: 'rgba(255,255,255,0.04)' }}>
                                {JOB_TYPES.map(jt => (
                                    <button
                                        key={jt.value}
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, type: jt.value }));
                                            if (formErrors.type) setFormErrors(prev => ({ ...prev, type: '' }));
                                        }}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                                            formData.type === jt.value
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                    >
                                        {jt.label}
                                    </button>
                                ))}
                            </div>
                            {errorEl(formErrors.type)}
                        </div>

                        {/* Location */}
                        <div>
                            <label className={labelCls}>
                                Location<span className="text-orange-400 ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., New York, NY or Remote"
                                className={inputCls(formErrors.location)}
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            />
                            {errorEl(formErrors.location)}
                        </div>
                    </div>

                    {/* ── Required Skills ──────────────────────────── */}
                    <div className="rounded-xl border border-gray-600/40 p-5 mb-6"
                         style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="text-base font-semibold text-white mb-4">Required Skills</h3>

                        {/* Add skill input */}
                        <div className="rounded-xl border border-gray-600/30 p-4 mb-4"
                             style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Add a Skill</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className={labelCls}>
                                        Skill Name<span className="text-orange-400 ml-0.5">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, Customer Service, Carpentry"
                                        value={skillInput.skillName}
                                        onChange={(e) => setSkillInput(prev => ({ ...prev, skillName: e.target.value }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        className={inputCls(false)}
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Required Level<span className="text-orange-400 ml-0.5">*</span>
                                    </label>
                                    <select
                                        value={skillInput.proficiency}
                                        onChange={(e) => setSkillInput(prev => ({ ...prev, proficiency: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl text-white border border-gray-600/50 focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        {SKILL_PROFICIENCY_LEVELS.map(level => (
                                            <option key={level.value} value={level.value} className="bg-gray-900 text-white">
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="mt-3 flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Skill
                            </button>
                        </div>

                        {/* Skills chips / list */}
                        {formData.requiredSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.requiredSkills.map((skill) => (
                                    <span
                                        key={skill.skillName}
                                        className={`inline-flex items-center gap-2 border rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                            profBadge[skill.proficiency] || 'border-gray-500 text-gray-400'
                                        }`}
                                        style={{ background: 'rgba(255,255,255,0.04)' }}
                                    >
                                        {skill.skillName}
                                        <span className="text-[10px] opacity-60">
                                            ({SKILL_PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label})
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill.skillName)}
                                            className="ml-0.5 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-6">No skills added yet</p>
                        )}

                        {errorEl(formErrors.requiredSkills)}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className={labelCls}>
                            Description<span className="text-orange-400 ml-0.5">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Provide a detailed description of the position, responsibilities, and what candidates can expect..."
                            className={`${inputCls(formErrors.description)} resize-none`}
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        />
                        {errorEl(formErrors.description)}
                    </div>

                    {/* Application / Contact Info */}
                    <div>
                        <label className={labelCls}>
                            Application/Contact Information<span className="text-orange-400 ml-0.5">*</span>
                        </label>
                        <textarea
                            name="applicationInfo"
                            value={formData.applicationInfo}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="How should candidates apply? Include email, phone number, or application portal URL..."
                            className={`${inputCls(formErrors.applicationInfo)} resize-none`}
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        />
                        {errorEl(formErrors.applicationInfo)}
                    </div>
                </section>

                {/* ── Action Buttons ───────────────────────────────── */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-lg shadow-orange-500/20"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating…
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Post {formData.type}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
