import { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';
import SkillVerificationModal from '../components/SkillVerificationModal';

export default function NGOVerificationQueue() {
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRefugee, setSelectedRefugee] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Fetch pending verifications
    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const fetchPendingVerifications = async () => {
        setIsLoading(true);
        try {
            // Replace with actual API call: GET /api/ngo/verifications/pending
            // const response = await axios.get('/api/ngo/verifications/pending');
            // setPendingVerifications(response.data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock data
            const mockData = [
                {
                    refugeeId: 'REF-2024-001',
                    refugeeName: 'Amina Hassan',
                    email: 'amina@example.com',
                    camp: 'Camp A',
                    phoneNumber: '+1234567890',
                    submittedAt: '2025-02-28',
                    pendingSkills: [
                        {
                            skillName: 'JavaScript',
                            proficiency: 'intermediate',
                            yearsOfExperience: 3,
                            verified: false,
                        },
                        {
                            skillName: 'Python',
                            proficiency: 'advanced',
                            yearsOfExperience: 5,
                            verified: false,
                        },
                        {
                            skillName: 'Data Analysis',
                            proficiency: 'intermediate',
                            yearsOfExperience: 2.5,
                            verified: false,
                        },
                    ],
                },
                {
                    refugeeId: 'REF-2024-002',
                    refugeeName: 'Mohammad Karim',
                    email: 'mohammad@example.com',
                    camp: 'Camp B',
                    phoneNumber: '+1234567891',
                    submittedAt: '2025-02-27',
                    pendingSkills: [
                        {
                            skillName: 'Project Management',
                            proficiency: 'advanced',
                            yearsOfExperience: 7,
                            verified: false,
                        },
                        {
                            skillName: 'Communication',
                            proficiency: 'advanced',
                            yearsOfExperience: 8,
                            verified: false,
                        },
                    ],
                },
                {
                    refugeeId: 'REF-2024-003',
                    refugeeName: 'Fatima Ali',
                    email: 'fatima@example.com',
                    camp: 'Camp A',
                    phoneNumber: '+1234567892',
                    submittedAt: '2025-02-26',
                    pendingSkills: [
                        {
                            skillName: 'Teaching',
                            proficiency: 'advanced',
                            yearsOfExperience: 10,
                            verified: false,
                        },
                        {
                            skillName: 'English',
                            proficiency: 'advanced',
                            yearsOfExperience: 15,
                            verified: false,
                        },
                        {
                            skillName: 'Tutoring',
                            proficiency: 'intermediate',
                            yearsOfExperience: 6,
                            verified: false,
                        },
                    ],
                },
                {
                    refugeeId: 'REF-2024-004',
                    refugeeName: 'Ahmed Ibrahim',
                    email: 'ahmed@example.com',
                    camp: 'Camp C',
                    phoneNumber: '+1234567893',
                    submittedAt: '2025-02-25',
                    pendingSkills: [
                        {
                            skillName: 'Electrical Work',
                            proficiency: 'advanced',
                            yearsOfExperience: 12,
                            verified: false,
                        },
                        {
                            skillName: 'Plumbing',
                            proficiency: 'intermediate',
                            yearsOfExperience: 5,
                            verified: false,
                        },
                    ],
                },
                {
                    refugeeId: 'REF-2024-005',
                    refugeeName: 'Zahra Anwar',
                    email: 'zahra@example.com',
                    camp: 'Camp B',
                    phoneNumber: '+1234567894',
                    submittedAt: '2025-02-24',
                    pendingSkills: [
                        {
                            skillName: 'Accounting',
                            proficiency: 'intermediate',
                            yearsOfExperience: 4,
                            verified: false,
                        },
                        {
                            skillName: 'Excel',
                            proficiency: 'advanced',
                            yearsOfExperience: 5,
                            verified: false,
                        },
                        {
                            skillName: 'Financial Reporting',
                            proficiency: 'intermediate',
                            yearsOfExperience: 3,
                            verified: false,
                        },
                    ],
                },
            ];

            setPendingVerifications(mockData);
        } catch (error) {
            console.error('Error fetching pending verifications:', error);
            setNotification({
                type: 'error',
                message: 'Failed to load pending verifications. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenVerificationModal = (refugee) => {
        setSelectedRefugee(refugee);
        setShowVerificationModal(true);
    };

    const handleVerificationComplete = (refugeeId) => {
        // Remove verified refugee from the list
        setPendingVerifications(prev =>
            prev.filter(r => r.refugeeId !== refugeeId)
        );

        setNotification({
            type: 'success',
            message: 'Skills verified successfully!',
        });

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);

        setShowVerificationModal(false);
        setSelectedRefugee(null);
    };

    // Filter by search query
    const filteredVerifications = pendingVerifications.filter(refugee =>
        refugee.refugeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refugee.refugeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        refugee.camp.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getProficiencyBadgeColor = (proficiency) => {
        switch (proficiency) {
            case 'beginner':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'intermediate':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'advanced':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Skill Verification Queue</h1>
                    <p className="text-gray-600 mt-2">
                        Review and verify refugee skills to help them access opportunities
                    </p>
                </div>
                <button
                    onClick={fetchPendingVerifications}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Notification */}
            {notification && (
                <div
                    className={`rounded-lg p-4 flex items-start gap-3 ${
                        notification.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                    }`}
                >
                    <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        {notification.type === 'success' ? (
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        )}
                    </svg>
                    <div>
                        <h3
                            className={`font-semibold ${
                                notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                            }`}
                        >
                            {notification.message}
                        </h3>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name, ID, or camp..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <div className="text-sm text-gray-600 mt-3">
                    Showing {filteredVerifications.length} of {pendingVerifications.length} pending
                    verification{pendingVerifications.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonLoader key={i} height="200px" />
                    ))}
                </div>
            ) : filteredVerifications.length > 0 ? (
                /* Verification Queue Table */
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Refugee Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Pending Skills</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredVerifications.map((refugee) => (
                                    <tr
                                        key={refugee.refugeeId}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Refugee Info */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">
                                                    {refugee.refugeeName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    ID: {refugee.refugeeId}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Camp: {refugee.camp}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="text-gray-900">{refugee.email}</p>
                                                <p className="text-gray-600">{refugee.phoneNumber}</p>
                                            </div>
                                        </td>

                                        {/* Pending Skills Summary */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {refugee.pendingSkills.length} skill
                                                    {refugee.pendingSkills.length !== 1 ? 's' : ''} pending
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {refugee.pendingSkills.slice(0, 3).map((skill, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col gap-1"
                                                        >
                                                            <span className="text-xs font-medium text-gray-900">
                                                                {skill.skillName}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getProficiencyBadgeColor(
                                                                        skill.proficiency
                                                                    )}`}
                                                                >
                                                                    {skill.proficiency}
                                                                </span>
                                                                <span className="text-xs text-gray-600">
                                                                    {skill.yearsOfExperience}y
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {refugee.pendingSkills.length > 3 && (
                                                        <span className="text-xs text-gray-600 font-medium self-center">
                                                            +{refugee.pendingSkills.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Submitted Date */}
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">
                                                {new Date(refugee.submittedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleOpenVerificationModal(refugee)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                Verify Skills
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
                        No Pending Verifications
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery
                            ? 'No results match your search criteria'
                            : 'All skills have been verified! Check back later for new submissions.'}
                    </p>
                </div>
            )}

            {/* Verification Modal */}
            {showVerificationModal && selectedRefugee && (
                <SkillVerificationModal
                    refugee={selectedRefugee}
                    onClose={() => {
                        setShowVerificationModal(false);
                        setSelectedRefugee(null);
                    }}
                    onVerificationComplete={handleVerificationComplete}
                />
            )}
        </div>
    );
}
