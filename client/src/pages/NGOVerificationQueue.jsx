import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, handleApiError } from '../api';
import SkeletonLoader from '../components/SkeletonLoader';
import SkillVerificationModal from '../components/SkillVerificationModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/FormComponents';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function NGOVerificationQueue() {
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRefugee, setSelectedRefugee] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    // Fetch pending verifications
    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const fetchPendingVerifications = async () => {
        setIsLoading(true);
        try {
            // ── Real API call (uses centralized apiClient with auth & error normalisation) ──
            // const response = await apiClient.get('/ngo/verifications/pending');
            // setPendingVerifications(response.data);

            // ── Mock data (remove when backend is ready) ──
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
            // Centralized error handling — surfaces user-friendly toasts for
            // 401 (redirect to login), 403 (redirect to /unauthorized), and network errors
            handleApiError(error, toast, { navigate });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenVerificationModal = (refugee) => {
        setSelectedRefugee(refugee);
        setShowVerificationModal(true);
    };

    const handleVerificationComplete = (refugeeId, summary) => {
        // Remove verified refugee from the list
        setPendingVerifications(prev =>
            prev.filter(r => r.refugeeId !== refugeeId)
        );

        // Create success message with summary if provided
        const message = summary
            ? `Verification complete! ${summary.approved} skill(s) approved, ${summary.rejected} skill(s) rejected.`
            : 'Skills verification submitted successfully!';

        toast.success(message);

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
            <PageHeader
                title="Skill Verification Queue"
                subtitle="Review and verify refugee skills to help them access opportunities"
                actions={
                    <Button
                        variant="primary"
                        size="md"
                        onClick={fetchPendingVerifications}
                        disabled={isLoading}
                        icon={
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        Refresh
                    </Button>
                }
            />

            <Card variant="glass">
                <Input
                    placeholder="Search by name, ID, or camp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                    helperText={`Showing ${filteredVerifications.length} of ${pendingVerifications.length} pending verification${pendingVerifications.length !== 1 ? 's' : ''}`}
                />
            </Card>

            {isLoading ? (
                <Card variant="glass" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Refugee Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Pending Skills</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Submitted</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <SkeletonLoader variant="table-row" count={4} cols={5} />
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : filteredVerifications.length > 0 ? (
                <Card variant="glass" className="overflow-hidden shadow-glass-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
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
                                                                <Badge variant={skill.proficiency}>
                                                                    {skill.proficiency}
                                                                </Badge>
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
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleOpenVerificationModal(refugee)}
                                                icon={
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                }
                                            >
                                                Verify Skills
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <Card variant="glass">
                    <EmptyState
                        icon={
                            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        title="No Pending Verifications"
                        description={
                            searchQuery
                                ? 'No results match your search criteria'
                                : 'All skills have been verified! Check back later for new submissions.'
                        }
                    />
                </Card>
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
