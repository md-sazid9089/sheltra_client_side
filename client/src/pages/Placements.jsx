import { useState, useEffect } from 'react';
import PlacementTimeline from '../components/PlacementTimeline';

export default function Placements() {
    const [placements, setPlacements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

    useEffect(() => {
        const fetchPlacements = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call: GET /refugees/placements
                // const response = await fetch('/api/refugees/placements');
                // const data = await response.json();

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockPlacements = [
                    {
                        id: 1,
                        jobTitle: 'Administrative Assistant',
                        company: 'Tech Solutions Inc.',
                        location: 'New York, NY',
                        status: 'active',
                        appliedAt: '2025-01-15',
                        appliedNotes: 'Initial application submitted',
                        shortlistedAt: '2025-01-22',
                        shortlistedNotes: 'Selected for first round interview',
                        offeredAt: '2025-02-05',
                        offeredNotes: 'Job offer received with $32,000 annual salary',
                        activeAt: '2025-02-20',
                        activeNotes: 'Started employment',
                        startDate: '2025-02-20',
                        expectedEndDate: '2025-08-20',
                        salary: '$32,000/year',
                        duration: '6 months',
                    },
                    {
                        id: 2,
                        jobTitle: 'Data Entry Specialist',
                        company: 'Finance Corp',
                        location: 'Boston, MA',
                        status: 'offered',
                        appliedAt: '2025-02-01',
                        appliedNotes: 'Applied through Sheltra platform',
                        shortlistedAt: '2025-02-08',
                        shortlistedNotes: 'Passed initial screening',
                        offeredAt: '2025-02-22',
                        offeredNotes: 'Offer extended - $25,000 for 3-month contract',
                        salary: '$25,000',
                        duration: '3 months',
                    },
                    {
                        id: 3,
                        jobTitle: 'Warehouse Associate',
                        company: 'Logistics Plus',
                        location: 'Chicago, IL',
                        status: 'shortlisted',
                        appliedAt: '2025-02-10',
                        appliedNotes: 'Application submitted',
                        shortlistedAt: '2025-02-18',
                        shortlistedNotes: 'Invited for phone screening next week',
                    },
                    {
                        id: 4,
                        jobTitle: 'Customer Service Representative',
                        company: 'Global Services Ltd.',
                        location: 'Remote',
                        status: 'applied',
                        appliedAt: '2025-02-25',
                        appliedNotes: 'Application pending initial review',
                    },
                    {
                        id: 5,
                        jobTitle: 'Healthcare Assistant',
                        company: 'Community Hospital',
                        location: 'Los Angeles, CA',
                        status: 'completed',
                        appliedAt: '2024-11-10',
                        appliedNotes: 'Initial application',
                        shortlistedAt: '2024-11-20',
                        shortlistedNotes: 'Selected for interview',
                        offeredAt: '2024-12-01',
                        offeredNotes: 'Job offer received',
                        activeAt: '2024-12-10',
                        activeNotes: 'Started position',
                        completedAt: '2025-02-10',
                        completedNotes: 'Contract completed successfully - excellent performance reviews',
                        startDate: '2024-12-10',
                        endDate: '2025-02-10',
                        salary: '$28,000',
                        duration: '2 months',
                    },
                    {
                        id: 6,
                        jobTitle: 'Marketing Coordinator',
                        company: 'Creative Agency Co.',
                        location: 'San Francisco, CA',
                        status: 'dropped',
                        appliedAt: '2025-01-20',
                        appliedNotes: 'Applied for position',
                        shortlistedAt: '2025-02-01',
                        shortlistedNotes: 'Shortlisted for interview',
                        droppedAt: '2025-02-15',
                        droppedNotes: 'Withdrew application - accepted another offer',
                    },
                ];

                setPlacements(mockPlacements);
            } catch (error) {
                console.error('Error fetching placements:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlacements();
    }, []);

    const filteredPlacements = placements.filter(p => {
        if (selectedTab === 'all') return true;
        return p.status === selectedTab;
    });

    const stats = {
        total: placements.length,
        active: placements.filter(p => p.status === 'active').length,
        completed: placements.filter(p => p.status === 'completed').length,
        pending: placements.filter(p => ['applied', 'shortlisted', 'offered'].includes(p.status)).length,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Placement Tracking</h1>
                <p className="text-gray-600">
                    Monitor your employment journey from application to completion
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Placements</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg border border-green-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Active Placements</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-lg border border-emerald-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-lg border border-blue-200 p-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Pending / In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {[
                    { id: 'all', label: 'All Placements', count: stats.total },
                    { id: 'active', label: 'Active', count: stats.active },
                    { id: 'completed', label: 'Completed', count: stats.completed },
                    { id: 'applied', label: 'In Pipeline', count: stats.pending },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                        className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                            selectedTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Placements List */}
            {isLoading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredPlacements.length > 0 ? (
                <div className="space-y-8">
                    {filteredPlacements.map(placement => (
                        <div key={placement.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {placement.jobTitle}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {placement.company} • {placement.location}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        placement.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : placement.status === 'completed'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : placement.status === 'dropped'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {placement.status.charAt(0).toUpperCase() + placement.status.slice(1)}
                                    </span>
                                </div>

                                {/* Details Row */}
                                <div className="flex flex-wrap gap-6 mt-4 text-sm">
                                    {placement.salary && (
                                        <div>
                                            <span className="text-gray-600">Salary: </span>
                                            <span className="font-semibold text-gray-900">
                                                {placement.salary}
                                            </span>
                                        </div>
                                    )}
                                    {placement.duration && (
                                        <div>
                                            <span className="text-gray-600">Duration: </span>
                                            <span className="font-semibold text-gray-900">
                                                {placement.duration}
                                            </span>
                                        </div>
                                    )}
                                    {placement.startDate && (
                                        <div>
                                            <span className="text-gray-600">Start: </span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(placement.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-6">
                                <PlacementTimeline placement={placement} />
                            </div>
                        </div>
                    ))}
                </div>
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
                        No placements found
                    </h3>
                    <p className="text-gray-600">
                        Your placements will appear here once you apply to opportunities
                    </p>
                </div>
            )}
        </div>
    );
}
