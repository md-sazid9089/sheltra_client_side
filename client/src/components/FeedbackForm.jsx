import { useState } from 'react';

export default function FeedbackForm({
    placementId,
    applicationId,
    candidateName,
    jobTitle,
    onSubmitSuccess,
    onCancel,
}) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // API stub: POST /employer/feedback
            // const response = await fetch('/api/employer/feedback', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         placementId,
            //         applicationId,
            //         rating,
            //         comment,
            //     }),
            // });
            // if (!response.ok) throw new Error('Failed to submit feedback');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1200));

            setSubmitted(true);
            if (onSubmitSuccess) {
                setTimeout(() => onSubmitSuccess(), 1500);
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
                    <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Feedback Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                    Thank you for your valuable feedback. This helps us improve our services.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">Rating:</span> {rating} / 5 ⭐
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold text-gray-900">Your feedback:</span> "{comment}"
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Candidate Info */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Candidate:</span> {candidateName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-gray-900">Position:</span> {jobTitle}
                </p>
            </div>

            {/* Rating Section */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                    How would you rate this candidate?
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            disabled={isLoading}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 disabled:cursor-not-allowed ${
                                star <= (hoverRating || rating)
                                    ? 'bg-yellow-100 text-yellow-500 scale-110'
                                    : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                    {rating > 0 ? (
                        <span className="font-semibold text-gray-900">
                            {rating} out of 5 stars
                            {rating === 5 && ' - Excellent!'}
                            {rating === 4 && ' - Very Good'}
                            {rating === 3 && ' - Good'}
                            {rating === 2 && ' - Fair'}
                            {rating === 1 && ' - Needs Improvement'}
                        </span>
                    ) : (
                        <span className="text-gray-500">Select a rating...</span>
                    )}
                </div>
            </div>

            {/* Comment Section */}
            <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Feedback
                </label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (error) setError('');
                    }}
                    disabled={isLoading}
                    placeholder="Please share your detailed feedback about the candidate's performance, strengths, and areas for improvement..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Minimum 10 characters required
                    </p>
                    <p className="text-xs text-gray-500">
                        {comment.length} / 500 characters
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">
                        ⚠️ {error}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all ${
                        isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="w-4 h-4 animate-spin"
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
                        'Submit Feedback'
                    )}
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700">
                    <span className="font-semibold">Note:</span> Your feedback is important and will help us improve our placement services. Please be constructive and specific in your comments.
                </p>
            </div>
        </form>
    );
}
