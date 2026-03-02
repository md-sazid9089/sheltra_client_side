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
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-3xl blur-3xl -z10"></div>
                <Card variant="glass" className="shadow-lg border border-primary-200/20">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Opportunities</h1>
                            <p className="text-gray-600">
                                Explore job opportunities perfectly matched for you
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{filteredOpportunities.length} Opportunities</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-success-50 text-success-700 rounded-lg">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-medium">Matched for you</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filters Section */}
            <Card variant="glass" className="shadow-md">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
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
                        <input
                            type="text"
                            placeholder="Search by title, company, or skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap gap-3">
                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-primary-300 transition-all"
                        >
                            <option value="">All Types</option>
                            {allTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        {/* Location Filter */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-primary-300 transition-all"
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
                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </Card>

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
                        <Card key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </Card>
                    ))}
                </div>
            ) : filteredOpportunities.length > 0 ? (
                <div className="space-y-4">
                    {filteredOpportunities.map(opportunity => (
                        <Card
                            key={opportunity.id}
                            onClick={() => setSelectedDrawer(opportunity)}
                            variant="glass"
                            className="border-2 border-gray-200/50 hover:border-primary-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    {/* Title and Match Score */}
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {opportunity.title}
                                        </h3>
                                        <Badge variant="primary" size="lg" className="flex-shrink-0 shadow-lg shadow-primary-500/20">
                                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {opportunity.matchScore}% Match
                                        </Badge>
                                    </div>

                                    {/* Company and Location */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-semibold text-gray-900">{opportunity.company}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">{opportunity.location}</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <Badge variant="secondary">{opportunity.type}</Badge>
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
                                                className="inline-flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {hasApplied(opportunity.id) && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-50 border border-success-200 rounded-lg">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-semibold text-success-700">Application Submitted</span>
                                        </div>
                                    )}
                                </div>

                                {/* View Details Button */}
                                <div className="flex-shrink-0 lg:self-start">
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="w-full lg:w-auto lg:min-w-[160px] shadow-lg shadow-primary-500/20"
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        }
                                        iconPosition="right"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDrawer(opportunity);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                /* No Results */
                <Card variant="glass" className="shadow-lg">
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                            <svg
                                className="w-10 h-10 text-gray-400"
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
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            No opportunities found
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Try adjusting your search or filters to find matching opportunities
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedType('');
                                setSelectedLocation('');
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </Card>
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
