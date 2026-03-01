import { useState } from 'react';
import axios from 'axios';

export default function SkillVerificationModal({ refugee, onClose, onVerificationComplete }) {
    const [verificationData, setVerificationData] = useState(
        refugee.pendingSkills.map(skill => ({
            ...skill,
            verified: false,
            verificationNotes: '',
        }))
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleToggleVerification = (index) => {
        setVerificationData(prev =>
            prev.map((skill, idx) =>
                idx === index ? { ...skill, verified: !skill.verified } : skill
            )
        );
    };

    const handleNotesChange = (index, notes) => {
        setVerificationData(prev =>
            prev.map((skill, idx) =>
                idx === index ? { ...skill, verificationNotes: notes } : skill
            )
        );
    };

    const handleVerifyAll = () => {
        setVerificationData(prev =>
            prev.map(skill => ({ ...skill, verified: true }))
        );
    };

    const handleSubmitVerification = async () => {
        // Check if at least one skill is verified
        const hasVerifiedSkills = verificationData.some(skill => skill.verified);
        
        if (!hasVerifiedSkills) {
            setError('Please verify at least one skill before submitting');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Replace with actual API call: POST /api/ngo/verify/:refugeeId
            // const response = await axios.post(`/api/ngo/verify/${refugee.refugeeId}`, {
            //     skills: verificationData,
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Call success callback
            onVerificationComplete(refugee.refugeeId);
        } catch (err) {
            console.error('Error submitting verification:', err);
            setError('Failed to submit verification. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProficiencyBadgeColor = (proficiency) => {
        switch (proficiency) {
            case 'beginner':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'intermediate':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'advanced':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const verifiedCount = verificationData.filter(s => s.verified).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Skill Verification</h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            {refugee.refugeeName} ({refugee.refugeeId})
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-white hover:bg-indigo-800 rounded-full p-2 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Refugee Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-900">{refugee.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold text-gray-900">{refugee.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Camp</p>
                                <p className="font-semibold text-gray-900">{refugee.camp}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-red-900 font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Verification Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-900">
                                Verification Progress: {verifiedCount} of {verificationData.length} skills
                            </p>
                            <button
                                onClick={handleVerifyAll}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                Verify All
                            </button>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(verifiedCount / verificationData.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">Skills to Verify</h3>
                        {verificationData.map((skill, index) => (
                            <div
                                key={index}
                                className={`border-2 rounded-lg p-4 transition-all ${
                                    skill.verified
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 bg-white'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-1">
                                        <button
                                            onClick={() => handleToggleVerification(index)}
                                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                                skill.verified
                                                    ? 'bg-green-600 border-green-600'
                                                    : 'bg-white border-gray-300 hover:border-indigo-500'
                                            }`}
                                        >
                                            {skill.verified && (
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Skill Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-gray-900 text-lg">
                                                {skill.skillName}
                                            </h4>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getProficiencyBadgeColor(
                                                    skill.proficiency
                                                )}`}
                                            >
                                                {skill.proficiency.charAt(0).toUpperCase() +
                                                    skill.proficiency.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            <span className="font-medium">Years of Experience:</span>{' '}
                                            {skill.yearsOfExperience}{' '}
                                            {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                        </p>

                                        {/* Verification Notes */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Verification Notes (Optional)
                                            </label>
                                            <textarea
                                                value={skill.verificationNotes}
                                                onChange={(e) =>
                                                    handleNotesChange(index, e.target.value)
                                                }
                                                placeholder="Add any notes about this skill verification..."
                                                rows={2}
                                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-900 font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitVerification}
                        disabled={isSubmitting || verifiedCount === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? (
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
                                Submitting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Submit Verification
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
