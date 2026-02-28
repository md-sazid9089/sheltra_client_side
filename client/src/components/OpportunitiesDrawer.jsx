import { useState } from 'react';

export default function OpportunitiesDrawer({ opportunity, onClose, onApply, hasApplied }) {
    const [isApplying, setIsApplying] = useState(false);

    if (!opportunity) return null;

    const handleApplyClick = async () => {
        setIsApplying(true);
        try {
            await onApply(opportunity.id);
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
                    opportunity
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            ></div>

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
                    opportunity ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {opportunity.title}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {opportunity.company}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close drawer"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Key Information Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                LOCATION
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {opportunity.location}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                MATCH SCORE
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                                {opportunity.matchScore}%
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                JOB TYPE
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {opportunity.type}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                SALARY RANGE
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {opportunity.salary}
                            </p>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                CONTRACT DURATION
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {opportunity.duration}
                            </p>
                        </div>

                        <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                APPLICATION DEADLINE
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(opportunity.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Job Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            About this opportunity
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {opportunity.fullDescription}
                        </p>
                    </div>

                    {/* Required Skills */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.requiredSkills.map(skill => (
                                <span
                                    key={skill}
                                    className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Important Dates */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Important Dates
                        </h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Posted:</span>
                            <span className="font-medium text-gray-900">
                                {new Date(opportunity.postedDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Application Deadline:</span>
                            <span className="font-medium text-red-600">
                                {new Date(opportunity.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer - Apply Button */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
                    {hasApplied ? (
                        <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium text-center">
                            ✓ Application Submitted
                        </div>
                    ) : (
                        <button
                            onClick={handleApplyClick}
                            disabled={isApplying}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                                isApplying
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isApplying ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="w-5 h-5 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Apply Now'
                            )}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
