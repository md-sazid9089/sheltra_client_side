import { useState, useEffect } from 'react';
import FeedbackModal from '../components/FeedbackModal';

export default function EmployerFeedback() {
    const [placements, setPlacements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [givenFeedback, setGivenFeedback] = useState(new Set());
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchPlacements = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call: GET /employer/placements
                // const response = await fetch('/api/employer/placements');
                // const data = await response.json();

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockPlacements = [
                    {
                        id: 1,
                        candidateName: 'Amina Hassan',
                        email: 'amina@example.com',
                        jobTitle: 'Administrative Assistant',
                        department: 'Operations',
                        startDate: '2025-02-20',
                        status: 'active',
                        performanceRating: null,
                        feedbackSubmitted: false,
                    },
                    {
                        id: 2,
                        candidateName: 'Mohammad Karim',
                        email: 'mohammad@example.com',
                        jobTitle: 'Project Manager',
                        department: 'Project Management',
                        startDate: '2025-02-15',
                        status: 'active',
                        performanceRating: 5,
                        feedbackSubmitted: true,
                        feedbackDate: '2025-02-25',
                    },
                    {
                        id: 3,
                        candidateName: 'Fatima Ali',
                        email: 'fatima@example.com',
                        jobTitle: 'Data Analyst',
                        department: 'Analytics',
                        startDate: '2025-01-20',
                        status: 'active',
                        performanceRating: 4,
                        feedbackSubmitted: true,
                        feedbackDate: '2025-02-20',
                    },
                    {
                        id: 4,
                        candidateName: 'Hassan Omar',
                        email: 'hassan@example.com',
                        jobTitle: 'Customer Support Specialist',
                        department: 'Support',
                        startDate: '2024-12-10',
                        status: 'completed',
                        performanceRating: 3,
                        feedbackSubmitted: true,
                        feedbackDate: '2025-02-10',
                        endDate: '2025-02-10',
                    },
                    {
                        id: 5,
                        candidateName: 'Layla Mahmoud',
                        email: 'layla@example.com',
                        jobTitle: 'Systems Administrator',
                        department: 'IT',
                        startDate: '2025-02-01',
                        status: 'active',
                        performanceRating: null,
                        feedbackSubmitted: false,
                    },
                ];

                setPlacements(mockPlacements);

                // Track which placements have feedback
                const feedbackSubmitted = new Set(
                    mockPlacements
                        .filter(p => p.feedbackSubmitted)
                        .map(p => p.id)
                );
                setGivenFeedback(feedbackSubmitted);
            } catch (error) {
                console.error('Error fetching placements:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlacements();
    }, []);

    const handleFeedbackClick = (placement) => {
        setSelectedPlacement(placement);
        setShowFeedbackModal(true);
    };

    const handleFeedbackSuccess = () => {
        setGivenFeedback(prev => new Set([...prev, selectedPlacement.id]));
        setNotification({
            type: 'success',
            message: `Feedback for ${selectedPlacement.candidateName} submitted successfully!`,
        });
        setTimeout(() => setNotification(null), 3000);
    };

    const activeplacements = placements.filter(p => p.status === 'active');
    const completedPlacements = placements.filter(p => p.status === 'completed');
    const pendingFeedback = placements.filter(p => p.feedbackSubmitted === false);

    const getRatingStars = (rating) => {
        if (!rating) return 'Not rated';
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Placement Feedback
                </h1>
                <p className="text-gray-600">
                    Provide feedback on your hired candidates to help improve future placements
                </p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg text-white animate-in fade-in slide-in-from-bottom-5 ${
                        notification.type === 'success'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                    }`}
                >
                    {notification.message}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Placements</p>
                    <p className="text-3xl font-bold text-gray-900">{placements.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Active Placements</p>
                    <p className="text-3xl font-bold text-blue-600">{activeplacements.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-orange-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Pending Feedback</p>
                    <p className="text-3xl font-bold text-orange-600">{pendingFeedback.length}</p>
                </div>
            </div>

            {/* Feedback Section */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
                    ))}
                </div>
            ) : placements.length > 0 ? (
                <>
                    {/* Pending Feedback Section */}
                    {pendingFeedback.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Awaiting Your Feedback
                                </h2>
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    {pendingFeedback.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {pendingFeedback.map(placement => (
                                    <div
                                        key={placement.id}
                                        className="bg-white rounded-lg border-2 border-orange-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {placement.candidateName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {placement.jobTitle} • {placement.department}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Started: {new Date(placement.startDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleFeedbackClick(placement)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                >
                                                    Give Feedback
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Placements Section */}
                    {activeplacements.filter(p => p.feedbackSubmitted).length > 0 && (
                        <div className="space-y-4 pt-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Active Placements with Feedback
                            </h2>
                            <div className="space-y-4">
                                {activeplacements
                                    .filter(p => p.feedbackSubmitted)
                                    .map(placement => (
                                        <div
                                            key={placement.id}
                                            className="bg-white rounded-lg border border-gray-200 p-6"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {placement.candidateName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {placement.jobTitle} • {placement.department}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                                                        <p className="text-2xl">
                                                            {getRatingStars(placement.performanceRating)}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {placement.performanceRating}/5
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs text-gray-500">
                                                    Feedback submitted on{' '}
                                                    {new Date(placement.feedbackDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Placements Section */}
                    {completedPlacements.length > 0 && (
                        <div className="space-y-4 pt-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Completed Placements
                            </h2>
                            <div className="space-y-4">
                                {completedPlacements.map(placement => (
                                    <div
                                        key={placement.id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 opacity-75"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {placement.candidateName}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {placement.jobTitle} •{' '}
                                                    {new Date(placement.startDate).toLocaleDateString()} to{' '}
                                                    {new Date(placement.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {placement.feedbackSubmitted && (
                                                <div className="text-right">
                                                    <div className="inline-block bg-gray-100 border border-gray-200 rounded-lg px-4 py-2">
                                                        <p className="text-2xl">
                                                            {getRatingStars(placement.performanceRating)}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            Final Rating
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* No Results */
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No placements yet
                    </h3>
                    <p className="text-gray-600">
                        Placements will appear here once you hire candidates
                    </p>
                </div>
            )}

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={showFeedbackModal}
                placement={selectedPlacement}
                onClose={() => setShowFeedbackModal(false)}
                onSubmitSuccess={handleFeedbackSuccess}
            />
        </div>
    );
}
