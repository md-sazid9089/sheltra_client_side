import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserInfo } from '../utils/tokenUtils';

export default function EmployerJobsList() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch employer's job postings
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                // API call: GET /api/employer/jobs
                // const response = await axios.get('/api/employer/jobs');
                // setJobs(response.data);

                // Simulate API call with mock data
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockJobs = [
                    {
                        id: 1,
                        title: 'Software Developer',
                        type: 'Job',
                        location: 'New York, NY',
                        requiredSkills: [
                            { skillName: 'JavaScript', proficiency: 'intermediate' },
                            { skillName: 'React', proficiency: 'intermediate' },
                        ],
                        description: 'We are looking for a motivated software developer to join our team...',
                        applicationInfo: 'Apply at careers@techcompany.com',
                        postedDate: '2025-02-25',
                        status: 'active',
                    },
                    {
                        id: 2,
                        title: 'Marketing Training Program',
                        type: 'Training',
                        location: 'Remote',
                        requiredSkills: [
                            { skillName: 'Communication', proficiency: 'beginner' },
                            { skillName: 'Social Media', proficiency: 'beginner' },
                        ],
                        description: '6-week intensive marketing training program for beginners...',
                        applicationInfo: 'Email training@marketingpro.com to apply',
                        postedDate: '2025-02-20',
                        status: 'active',
                    },
                ];

                setJobs(mockJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case 'Job':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Training':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Apprenticeship':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Postings</h1>
                    <p className="text-gray-600">
                        Manage your job, training, and apprenticeship postings
                    </p>
                </div>
                <button
                    onClick={() => navigate('/jobs/new')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Create New Posting
                </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <svg
                            className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <p className="text-gray-600">Loading your job postings...</p>
                    </div>
                </div>
            ) : jobs.length > 0 ? (
                /* Jobs List */
                <div className="grid grid-cols-1 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            {/* Job Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {job.title}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                                                job.type
                                            )}`}
                                        >
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Posted {new Date(job.postedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-300">
                                    {job.status === 'active' ? '● Active' : 'Inactive'}
                                </span>
                            </div>

                            {/* Description Preview */}
                            <p className="text-gray-700 mb-4 line-clamp-2">
                                {job.description}
                            </p>

                            {/* Required Skills */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                    Required Skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-300"
                                        >
                                            {skill.skillName} ({skill.proficiency})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                    View Details
                                </button>
                                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Edit
                                </button>
                                <button className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                    <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No job postings yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Create your first job, training, or apprenticeship posting to start finding
                        qualified candidates
                    </p>
                    <button
                        onClick={() => navigate('/jobs/new')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Create Your First Posting
                    </button>
                </div>
            )}
        </div>
    );
}
