import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../utils/tokenUtils';
import SkeletonLoader from '../components/SkeletonLoader';
import Button from '../components/ui/Button';
import Card, { CardSection } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function RefugeeDashboard() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [opportunities, setOpportunities] = useState([]);
    const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);

    // Mock data - replace with API call
    useEffect(() => {
        const fetchOpportunities = async () => {
            setIsLoadingOpportunities(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockOpportunities = [
                    {
                        id: 1,
                        title: 'Entry-Level Administrative Assistant',
                        company: 'Tech Solutions Inc.',
                        location: 'New York, NY',
                        matchScore: 92,
                        description: 'Looking for a detail-oriented individual to support our growing team.',
                        requiredSkills: ['Communication', 'Organization'],
                    },
                    {
                        id: 2,
                        title: 'Customer Service Representative',
                        company: 'Global Services Ltd.',
                        location: 'Remote',
                        matchScore: 88,
                        description: 'Join our customer success team and help clients worldwide.',
                        requiredSkills: ['Communication', 'Problem Solving'],
                    },
                    {
                        id: 3,
                        title: 'Data Entry Specialist',
                        company: 'Finance Corp',
                        location: 'Boston, MA',
                        matchScore: 85,
                        description: 'Accurate data entry professional needed for growing financial team.',
                        requiredSkills: ['Attention to Detail', 'Computer Skills'],
                    },
                    {
                        id: 4,
                        title: 'Warehouse Associate',
                        company: 'Logistics Plus',
                        location: 'Chicago, IL',
                        matchScore: 78,
                        description: 'Energetic team member to join our logistics operations.',
                        requiredSkills: ['Physical Stamina', 'Teamwork'],
                    },
                ];

                setOpportunities(mockOpportunities);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setIsLoadingOpportunities(false);
            }
        };

        fetchOpportunities();
    }, []);

    // Summary card component with glassmorphism
    const SummaryCard = ({ icon, label, value, status, gradient }) => (
        <Card variant="glass" className="relative overflow-hidden group hover:shadow-glass-lg transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
                    {status && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {status}
                        </p>
                    )}
                </div>
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {userInfo?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600 text-lg">Here's your career journey update</p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Profile Status"
                    value="75%"
                    status="Complete your profile to boost visibility"
                    gradient="from-primary-500 to-primary-600"
                />

                <SummaryCard
                    icon={
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Verified Skills"
                    value="5"
                    status="Add more skills to increase opportunities"
                    gradient="from-success-500 to-success-600"
                />

                <SummaryCard
                    icon={
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Applications"
                    value="3"
                    status="2 pending, 1 rejected"
                    gradient="from-purple-500 to-purple-600"
                />

                <SummaryCard
                    icon={
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                    }
                    label="Placements"
                    value="0"
                    status="Start applying to opportunities"
                    gradient="from-warning-500 to-warning-600"
                />
            </div>

            {/* Recommended Opportunities Section */}
            <Card variant="glass" className="overflow-hidden shadow-glass-lg">
                <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Recommended Opportunities
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">Curated opportunities based on your profile</p>
                </div>

                <CardSection className="p-6">
                    {isLoadingOpportunities ? (
                        <SkeletonLoader count={4} variant="list-item" />
                    ) : opportunities.length > 0 ? (
                        <div className="space-y-4">
                            {opportunities.map((opportunity) => (
                                <Card
                                    key={opportunity.id}
                                    className="border-2 border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Title and Match Score */}
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {opportunity.title}
                                                </h3>
                                                <Badge variant="primary" className="flex-shrink-0">
                                                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {opportunity.matchScore}% Match
                                                </Badge>
                                            </div>

                                            {/* Company and Location */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-medium text-gray-900">{opportunity.company}</span>
                                                </div>
                                                <span className="text-gray-300">•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {opportunity.location}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-700 leading-relaxed">
                                                {opportunity.description}
                                            </p>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-2">
                                                {opportunity.requiredSkills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200"
                                                    >
                                                        <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Apply Button */}
                                        <div className="flex-shrink-0 lg:self-start">
                                            <Button
                                                variant="primary"
                                                size="md"
                                                fullWidth
                                                className="lg:w-auto lg:min-w-[140px]"
                                                icon={
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                }
                                                iconPosition="right"
                                            >
                                                Apply Now
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-900 text-lg font-semibold mb-1">No opportunities available</p>
                            <p className="text-gray-500 text-sm">Check back soon for new positions matching your profile</p>
                        </div>
                    )}
                </CardSection>

                {/* View All Button */}
                {opportunities.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/opportunities')}
                            icon={
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            }
                            iconPosition="right"
                        >
                            View all opportunities
                        </Button>
                    </div>
                )}
            </Card>

            {/* Quick Actions Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Complete Profile Card */}
                    <Card className="border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-lg flex-shrink-0">
                                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                                <p className="text-gray-600 text-sm mb-3">Add more information to improve your chances</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/profile')}
                                    icon={
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    Go to Profile
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Add Skills Card */}
                    <Card className="border-l-4 border-success-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-success-100 rounded-lg flex-shrink-0">
                                <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Skills</h3>
                                <p className="text-gray-600 text-sm mb-3">Showcase your abilities to employers</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/profile')}
                                    icon={
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    Verify Skills
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Payments & Updates Card */}
                    <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg flex-shrink-0">
                                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Payments & Updates</h3>
                                <p className="text-gray-600 text-sm mb-3">Track your certifications and payments</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/placements')}
                                    icon={
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
