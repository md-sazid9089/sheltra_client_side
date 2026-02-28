import FeedbackForm from './FeedbackForm';

export default function FeedbackModal({
    isOpen,
    placement,
    onClose,
    onSubmitSuccess,
}) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Share Your Feedback
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Help us improve our placement services
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close modal"
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
                    <div className="p-6">
                        <FeedbackForm
                            placementId={placement?.id}
                            applicationId={placement?.applicationId}
                            candidateName={placement?.candidateName || 'Candidate'}
                            jobTitle={placement?.jobTitle || 'Position'}
                            onSubmitSuccess={() => {
                                onClose();
                                if (onSubmitSuccess) onSubmitSuccess();
                            }}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
