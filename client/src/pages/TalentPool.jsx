import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TalentPool() {
    const navigate = useNavigate();
    const [refugees, setRefugees] = useState([]);
    const [filteredRefugees, setFilteredRefugees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        skill: '',
        proficiency: '',
        camp: '',
        availability: '',
    });

    // Mock data - replace with API call
    useEffect(() => {
        const fetchRefugees = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockRefugees = [
                    {
                        id: 1,
                        name: 'Amina Hassan',
                        email: 'amina@example.com',
                        avatar: '👩‍💼',
                        skills: ['Python', 'JavaScript', 'Data Analysis'],
                        proficiency: 'Advanced',
                        camp: 'Camp A',
                        availability: 'Full-time',
                        verified: true,
                        matchScore: 92,
                        bio: 'Software developer with 5 years of experience',
                    },
                    {
                        id: 2,
                        name: 'Mohammad Karim',
                        email: 'mohammad@example.com',
                        avatar: '👨‍💻',
                        skills: ['Project Management', 'Communication', 'Leadership'],
                        proficiency: 'Advanced',
                        camp: 'Camp B',
                        availability: 'Part-time',
                        verified: true,
                        matchScore: 88,
                        bio: 'Project manager with international experience',
                    },
                    {
                        id: 3,
                        name: 'Fatima Ali',
                        email: 'fatima@example.com',
                        avatar: '👩‍🏫',
                        skills: ['Teaching', 'English', 'Tutoring'],
                        proficiency: 'Intermediate',
                        camp: 'Camp A',
                        availability: 'Part-time',
                        verified: true,
                        matchScore: 85,
                        bio: 'Teacher with passion for helping students',
                    },
                    {
                        id: 4,
                        name: 'Hassan Omar',
                        email: 'hassan@example.com',
                        avatar: '👨‍🍳',
                        skills: ['Cooking', 'Food Safety', 'Kitchen Management'],
                        proficiency: 'Advanced',
                        camp: 'Camp C',
                        availability: 'Full-time',
                        verified: true,
                        matchScore: 82,
                        bio: 'Professional chef with restaurant experience',
                    },
                    {
                        id: 5,
                        name: 'Layla Mahmoud',
                        email: 'layla@example.com',
                        avatar: '👩‍⚕️',
                        skills: ['Healthcare', 'Patient Care', 'Medical Assistance'],
                        proficiency: 'Intermediate',
                        camp: 'Camp B',
                        availability: 'Full-time',
                        verified: true,
                        matchScore: 79,
                        bio: 'Healthcare worker dedicated to patient care',
                    },
                    {
                        id: 6,
                        name: 'Ahmed Ibrahim',
                        email: 'ahmed@example.com',
                        avatar: '👨‍🔧',
                        skills: ['Electrical Work', 'Plumbing', 'Construction'],
                        proficiency: 'Advanced',
                        camp: 'Camp A',
                        availability: 'Full-time',
                        verified: true,
                        matchScore: 87,
                        bio: 'Skilled tradesman with diverse technical expertise',
                    },
                    {
                        id: 7,
                        name: 'Zahra Anwar',
                        email: 'zahra@example.com',
                        avatar: '👩‍💼',
                        skills: ['Accounting', 'Excel', 'Financial Reporting'],
                        proficiency: 'Intermediate',
                        camp: 'Camp C',
                        availability: 'Part-time',
                        verified: true,
                        matchScore: 84,
                        bio: 'Accountant with experience in financial management',
                    },
                    {
                        id: 8,
                        name: 'Khalid Rashid',
                        email: 'khalid@example.com',
                        avatar: '👨‍💼',
                        skills: ['JavaScript', 'React', 'UI Design'],
                        proficiency: 'Advanced',
                        camp: 'Camp B',
                        availability: 'Full-time',
                        verified: true,
                        matchScore: 90,
                        bio: 'Frontend developer specializing in React',
                    },
                ];

                setRefugees(mockRefugees);
                setFilteredRefugees(mockRefugees);
            } catch (error) {
                console.error('Error fetching refugees:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRefugees();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = refugees;

        if (filters.skill) {
            filtered = filtered.filter(refugee =>
                refugee.skills.some(skill =>
                    skill.toLowerCase().includes(filters.skill.toLowerCase())
                )
            );
        }

        if (filters.proficiency) {
            filtered = filtered.filter(refugee =>
                refugee.proficiency.toLowerCase() === filters.proficiency.toLowerCase()
            );
        }

        if (filters.camp) {
            filtered = filtered.filter(refugee =>
                refugee.camp.toLowerCase() === filters.camp.toLowerCase()
            );
        }

        if (filters.availability) {
            filtered = filtered.filter(refugee =>
                refugee.availability.toLowerCase() === filters.availability.toLowerCase()
            );
        }

        setFilteredRefugees(filtered);
    }, [filters, refugees]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({
            skill: '',
            proficiency: '',
            camp: '',
            availability: '',
        });
    };

    const handleViewProfile = (refugeeId) => {
        navigate(`/refugee/${refugeeId}`);
    };

    // Get unique values for filter dropdowns
    const allSkills = [...new Set(refugees.flatMap(r => r.skills))].sort();
    const allProficiencies = [...new Set(refugees.map(r => r.proficiency))].sort();
    const allCamps = [...new Set(refugees.map(r => r.camp))].sort();
    const allAvailabilities = [...new Set(refugees.map(r => r.availability))].sort();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Talent Pool</h1>
                <p className="text-gray-600">
                    Discover verified refugee professionals matched to your hiring needs
                </p>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {Object.values(filters).some(v => v) && (
                        <button
                            onClick={resetFilters}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Skill Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill
                        </label>
                        <select
                            value={filters.skill}
                            onChange={(e) => handleFilterChange('skill', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Skills</option>
                            {allSkills.map(skill => (
                                <option key={skill} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Proficiency Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proficiency Level
                        </label>
                        <select
                            value={filters.proficiency}
                            onChange={(e) => handleFilterChange('proficiency', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Levels</option>
                            {allProficiencies.map(level => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Camp Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Camp
                        </label>
                        <select
                            value={filters.camp}
                            onChange={(e) => handleFilterChange('camp', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Camps</option>
                            {allCamps.map(camp => (
                                <option key={camp} value={camp}>
                                    {camp}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability
                        </label>
                        <select
                            value={filters.availability}
                            onChange={(e) => handleFilterChange('availability', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Availability</option>
                            {allAvailabilities.map(avail => (
                                <option key={avail} value={avail}>
                                    {avail}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredRefugees.length} of {refugees.length} candidates
                </div>
            </div>

            {/* Talent Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 rounded-lg h-96 animate-pulse"
                        ></div>
                    ))}
                </div>
            ) : filteredRefugees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRefugees.map(refugee => (
                        <div
                            key={refugee.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
                        >
                            {/* Card Header with Verified Badge and Match Score */}
                            <div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-5xl">{refugee.avatar}</div>
                                    <div className="flex gap-2">
                                        {/* Verified Badge */}
                                        {refugee.verified && (
                                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
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
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Match Score */}
                                <div className="inline-block bg-white rounded-lg p-3 border border-indigo-200">
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-600">
                                            Match Score
                                        </div>
                                        <div className="text-2xl font-bold text-indigo-600">
                                            {refugee.matchScore}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                {/* Name and Email */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {refugee.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{refugee.email}</p>
                                </div>

                                {/* Bio */}
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {refugee.bio}
                                </p>

                                {/* Skills Tags */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-2">
                                        Skills
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {refugee.skills.slice(0, 3).map(skill => (
                                            <span
                                                key={skill}
                                                className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {refugee.skills.length > 3 && (
                                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                +{refugee.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">
                                            Proficiency
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {refugee.proficiency}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">
                                            Camp
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {refugee.camp}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                                        <p className="text-xs text-gray-600 font-medium">
                                            Availability
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {refugee.availability}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer - View Profile Button */}
                            <div className="border-t border-gray-200 p-6 bg-gray-50">
                                <button
                                    onClick={() => handleViewProfile(refugee.id)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* No Results */
                <div className="text-center py-16">
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
                        No candidates found
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Try adjusting your filters to find matching talents
                    </p>
                    <button
                        onClick={resetFilters}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
