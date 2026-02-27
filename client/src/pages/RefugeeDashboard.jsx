import { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/tokenUtils';
import SkeletonLoader from '../components/SkeletonLoader';

export default function RefugeeDashboard() {
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

    // Summary card component
    const SummaryCard = ({ icon, label, value, status, bgColor }) => (
        <div className={`${bgColor} rounded-lg shadow-md p-6 text-white`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                    {status && (
                        <p className="text-xs mt-2 opacity-75">{status}</p>
                    )}
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {userInfo?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600">Here's your career journey update</p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Profile Status Card */}
                <SummaryCard
                    icon={
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Profile Status"
                    value="75%"
                    status="Complete your profile to boost visibility"
                    bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                />

                {/* Verified Skills Card */}
                <SummaryCard
                    icon={
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Verified Skills"
                    value="5"
                    status="Add more skills to increase opportunities"
                    bgColor="bg-gradient-to-br from-green-500 to-green-600"
                />

                {/* Applications Card */}
                <SummaryCard
                    icon={
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Applications"
                    value="3"
                    status="2 pending, 1 rejected"
                    bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
                />

                {/* Placements Status Card */}
                <SummaryCard
                    icon={
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h2a2 2 0 012 2v3H4V8a2 2 0 012-2zm0 0h4V5h-4v1zm8 8h-4v2h4v-2zm-4-4h4v2H8v-2z" clipRule="evenodd" />
                        </svg>
                    }
                    label="Placements"
                    value="0"
                    status="Start applying to opportunities"
                    bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Recommended Opportunities Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Recommended Opportunities
                    </h2>
                </div>

                <div className="p-6">
                    {isLoadingOpportunities ? (
                        <SkeletonLoader count={4} variant="list-item" />
                    ) : opportunities.length > 0 ? (
                        <div className="space-y-4">
                            {opportunities.map((opportunity) => (
                                <div
                                    key={opportunity.id}
                                    className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200 hover:border-indigo-300"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {opportunity.title}
                                                </h3>
                                                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                    {opportunity.matchScore}% Match
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM14 9h1.946a6.004 6.004 0 00-2.783-4.118C13.617 6.03 13.911 7.454 14 9zM12 9a10.979 10.979 0 00-1.175-4.467c-.341.574-.639 1.243-.84 2.047h2.015zM8 9H5.985c-.201-.804-.499-1.473-.84-2.047C8.5 7.92 8.256 8.435 8 9zM12 5.5a10.99 10.99 0 00-3.848-3.592c1.142 1.049 2.105 2.522 2.882 4.172A3.998 3.998 0 0112 5.5zM8 5.5a3.998 3.998 0 01.966-2.42c.777-1.65 1.74-3.123 2.882-4.172A10.989 10.989 0 008 5.5zM5.304 9.122a5.968 5.968 0 01.946-2.21 3.998 3.998 0 00-.946 2.21zM14.696 9.122c.148-.64.276-1.338.346-2.21a3.998 3.998 0 00-.346 2.21z" clipRule="evenodd" />
                                                    </svg>
                                                    {opportunity.company}
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L9.9 13.95a7 7 0 01-9.9-9.9zM9.5 7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" clipRule="evenodd" />
                                                    </svg>
                                                    {opportunity.location}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 text-sm mb-3">
                                                {opportunity.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {opportunity.requiredSkills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors whitespace-nowrap">
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 text-lg">No opportunities available at the moment</p>
                            <p className="text-gray-500 text-sm mt-1">Check back soon for new positions</p>
                        </div>
                    )}
                </div>

                {/* View All Button */}
                {opportunities.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2">
                            View all opportunities
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM5 9a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zm7 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        Complete Your Profile
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">Add more information to improve your chances</p>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Go to Profile →</button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Add Skills
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">Showcase your abilities to employers</p>
                    <button className="text-green-600 hover:text-green-700 font-semibold text-sm">Verify Skills →</button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Payments & Updates
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">Track your certifications and payments</p>
                    <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">View Details →</button>
                </div>
            </div>
        </div>
    );
}
