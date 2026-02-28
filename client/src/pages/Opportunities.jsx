import { useState, useEffect } from 'react';
import OpportunitiesDrawer from '../components/OpportunitiesDrawer';

export default function Opportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDrawer, setSelectedDrawer] = useState(null);
    const [applications, setApplications] = useState(new Set());
    const [notification, setNotification] = useState(null);

    // Fetch opportunities from API
    useEffect(() => {
        const fetchOpportunities = async () => {
            setIsLoading(true);
            try {
                // Replace with actual API call: GET /refugees/opportunities
                // const response = await fetch('/api/refugees/opportunities');
                // const data = await response.json();

                // Mock data for now
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockOpportunities = [
                    {
                        id: 1,
                        title: 'Entry-Level Administrative Assistant',
                        company: 'Tech Solutions Inc.',
                        location: 'New York, NY',
                        type: 'Full-time',
                        matchScore: 92,
                        description: 'Looking for a detail-oriented individual to support our growing team. Responsibilities include scheduling, document management, and client communication.',
                        fullDescription: 'Tech Solutions Inc. is seeking an enthusiastic entry-level administrative assistant to join our vibrant team. You will support our sales and operations departments with scheduling, document management, and client communication. This is an excellent opportunity to launch your career in a fast-paced, supportive environment.',
                        requiredSkills: ['Communication', 'Organization', 'Microsoft Office'],
                        salary: '$28,000 - $35,000',
                        duration: '6 - 12 months',
                        postedDate: '2025-02-20',
                        deadline: '2025-03-20',
                    },
                    {
                        id: 2,
                        title: 'Customer Service Representative',
                        company: 'Global Services Ltd.',
                        location: 'Remote',
                        type: 'Full-time',
                        matchScore: 88,
                        description: 'Join our customer success team and help clients worldwide. Provide exceptional service and support.',
                        fullDescription: 'Global Services Ltd. is expanding our customer support team. We are looking for passionate individuals to provide exceptional service across multiple channels including phone, email, and chat. You will be trained extensively and supported by a dedicated team.',
                        requiredSkills: ['Communication', 'Problem Solving', 'Patience'],
                        salary: '$25,000 - $32,000',
                        duration: '12 months',
                        postedDate: '2025-02-18',
                        deadline: '2025-03-15',
                    },
                    {
                        id: 3,
                        title: 'Data Entry Specialist',
                        company: 'Finance Corp',
                        location: 'Boston, MA',
                        type: 'Contract',
                        matchScore: 85,
                        description: 'Accurate data entry professional needed for growing financial team. Fast-paced environment.',
                        fullDescription: 'We are seeking a meticulous data entry specialist to join our financial operations team. You will be responsible for entering, verifying, and maintaining data in our systems with high accuracy and attention to detail.',
                        requiredSkills: ['Attention to Detail', 'Computer Skills', 'Excel'],
                        salary: '$22,000 - $28,000',
                        duration: '3 - 6 months',
                        postedDate: '2025-02-15',
                        deadline: '2025-03-10',
                    },
                    {
                        id: 4,
                        title: 'Warehouse Associate',
                        company: 'Logistics Plus',
                        location: 'Chicago, IL',
                        type: 'Full-time',
                        matchScore: 78,
                        description: 'Energetic team member to join our logistics operations. Physical responsibilities included.',
                        fullDescription: 'Logistics Plus is hiring warehouse associates for our distribution center. You will handle inventory management, order picking, packing, and shipping. This is a fast-paced role where teamwork is essential.',
                        requiredSkills: ['Physical Stamina', 'Teamwork', 'Attention to Detail'],
                        salary: '$24,000 - $30,000',
                        duration: '12 months',
                        postedDate: '2025-02-22',
                        deadline: '2025-03-25',
                    },
                    {
                        id: 5,
                        title: 'Junior Marketing Coordinator',
                        company: 'Creative Agency Co.',
                        location: 'Los Angeles, CA',
                        type: 'Full-time',
                        matchScore: 82,
                        description: 'Support marketing campaigns and social media management for diverse clients.',
                        fullDescription: 'Creative Agency Co. is looking for an enthusiastic junior marketing coordinator to support our team. You will assist with campaign development, social media management, and client coordination.',
                        requiredSkills: ['Communication', 'Social Media', 'Organization'],
                        salary: '$26,000 - $33,000',
                        duration: '6 - 12 months',
                        postedDate: '2025-02-19',
                        deadline: '2025-03-18',
                    },
                    {
                        id: 6,
                        title: 'Hospitality Host/Hostess',
                        company: 'Fine Dining Establishment',
                        location: 'San Francisco, CA',
                        type: 'Part-time',
                        matchScore: 75,
                        description: 'Welcoming guests and managing dining room operations at upscale restaurant.',
                        fullDescription: 'Join our upscale restaurant as a host/hostess. You will greet guests, manage reservations, and ensure excellent customer service. This is a great opportunity to work in a professional hospitality environment.',
                        requiredSkills: ['Communication', 'Customer Service', 'Organization'],
                        salary: '$18,000 - $22,000',
                        duration: 'Flexible',
                        postedDate: '2025-02-21',
                        deadline: '2025-03-25',
                    },
                    {
                        id: 7,
                        title: 'Quality Assurance Tester',
                        company: 'Software Solutions Inc.',
                        location: 'Seattle, WA',
                        type: 'Contract',
                        matchScore: 84,
                        description: 'Test software applications and identify bugs in development cycles.',
                        fullDescription: 'Software Solutions Inc. needs a QA tester to help ensure the quality of our applications. You will execute test cases, report bugs, and work closely with the development team.',
                        requiredSkills: ['Attention to Detail', 'Problem Solving', 'Documentation'],
                        salary: '$30,000 - $38,000',
                        duration: '3 - 12 months',
                        postedDate: '2025-02-17',
                        deadline: '2025-03-17',
                    },
                    {
                        id: 8,
                        title: 'Administrative Clerk',
                        company: 'Healthcare Services',
                        location: 'Miami, FL',
                        type: 'Full-time',
                        matchScore: 79,
                        description: 'Administrative support for healthcare facility scheduling and records management.',
                        fullDescription: 'Healthcare Services is seeking an administrative clerk to support our healthcare operations. Responsibilities include scheduling appointments, managing records, and general administrative duties.',
                        requiredSkills: ['Organization', 'Communication', 'Computer Skills'],
                        salary: '$23,000 - $29,000',
                        duration: '12 months',
                        postedDate: '2025-02-16',
                        deadline: '2025-03-16',
                    },
                ];

                setOpportunities(mockOpportunities);
                setFilteredOpportunities(mockOpportunities);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    // Filter and search opportunities
    useEffect(() => {
        let filtered = opportunities;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(opp =>
                opp.title.toLowerCase().includes(query) ||
                opp.company.toLowerCase().includes(query) ||
                opp.requiredSkills.some(skill =>
                    skill.toLowerCase().includes(query)
                )
            );
        }

        if (selectedType) {
            filtered = filtered.filter(opp => opp.type === selectedType);
        }

        if (selectedLocation) {
            filtered = filtered.filter(opp =>
                opp.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        setFilteredOpportunities(filtered);
    }, [searchQuery, selectedType, selectedLocation, opportunities]);

    const handleApply = async (opportunityId) => {
        try {
            // API call stub: POST /refugees/opportunities/:id/apply
            // const response = await fetch(`/api/refugees/opportunities/${opportunityId}/apply`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            setApplications(prev => new Set([...prev, opportunityId]));
            setNotification({
                type: 'success',
                message: 'Application submitted successfully!',
                opportunityId,
            });

            // Clear notification after 3 seconds
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error('Error applying to opportunity:', error);
            setNotification({
                type: 'error',
                message: 'Failed to submit application. Please try again.',
            });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const hasApplied = (opportunityId) => applications.has(opportunityId);
    const allTypes = [...new Set(opportunities.map(opp => opp.type))].sort();
    const allLocations = [...new Set(opportunities.map(opp => opp.location))].sort();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Opportunities</h1>
                <p className="text-gray-600">
                    Explore job opportunities perfectly matched for you
                </p>
            </div>

            {/* Search and Filters Section */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <svg
                        className="absolute left-4 top-3 w-5 h-5 text-gray-400"
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
                    <input
                        type="text"
                        placeholder="Search by title, company, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-3">
                    {/* Type Filter Chip */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-indigo-300 transition-all"
                    >
                        <option value="">All Types</option>
                        {allTypes.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    {/* Location Filter Chip */}
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-indigo-300 transition-all"
                    >
                        <option value="">All Locations</option>
                        {allLocations.map(location => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>

                    {/* Reset Filters */}
                    {(searchQuery || selectedType || selectedLocation) && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedType('');
                                setSelectedLocation('');
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    Showing {filteredOpportunities.length} of {opportunities.length} opportunities
                </div>
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

            {/* Opportunities List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredOpportunities.length > 0 ? (
                <div className="space-y-4">
                    {filteredOpportunities.map(opportunity => (
                        <div
                            key={opportunity.id}
                            onClick={() => setSelectedDrawer(opportunity)}
                            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer p-6 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {opportunity.title}
                                        </h3>
                                        {hasApplied(opportunity.id) && (
                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                Applied
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {opportunity.company} • {opportunity.location}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {opportunity.description}
                                    </p>

                                    {/* Bottom Row - Skills and Details */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                        {/* Skills Tags */}
                                        <div className="flex gap-2">
                                            {opportunity.requiredSkills.slice(0, 2).map(skill => (
                                                <span
                                                    key={skill}
                                                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Type Badge */}
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                            {opportunity.type}
                                        </span>

                                        {/* Match Score */}
                                        <span className="text-indigo-600 font-semibold">
                                            {opportunity.matchScore}% match
                                        </span>
                                    </div>
                                </div>

                                {/* Right Section - CTA */}
                                <div className="ml-4 flex flex-col items-end gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDrawer(opportunity);
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Details
                                    </button>
                                    {hasApplied(opportunity.id) && (
                                        <span className="text-xs text-green-600 font-medium">
                                            ✓ Already applied
                                        </span>
                                    )}
                                </div>
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
                            d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No opportunities found
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Try adjusting your search or filters to find matching opportunities
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedType('');
                            setSelectedLocation('');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Opportunities Drawer */}
            <OpportunitiesDrawer
                opportunity={selectedDrawer}
                onClose={() => setSelectedDrawer(null)}
                onApply={handleApply}
                hasApplied={hasApplied(selectedDrawer?.id)}
            />
        </div>
    );
}
