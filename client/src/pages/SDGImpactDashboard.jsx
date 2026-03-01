import { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ── Mock data generator ──────────────────────────────────────────────
function generateMockMetrics(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

    while (cursor <= end) {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
    }

    const placementsOverTime = months.map((d) => ({
        month: d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        placements: Math.floor(Math.random() * 40) + 5,
        completed: Math.floor(Math.random() * 30) + 2,
    }));

    const verifiedSkills = [
        { skill: 'Carpentry', count: Math.floor(Math.random() * 60) + 10 },
        { skill: 'Tailoring', count: Math.floor(Math.random() * 50) + 8 },
        { skill: 'Software Dev', count: Math.floor(Math.random() * 45) + 12 },
        { skill: 'Agriculture', count: Math.floor(Math.random() * 35) + 6 },
        { skill: 'Healthcare', count: Math.floor(Math.random() * 40) + 10 },
        { skill: 'Teaching', count: Math.floor(Math.random() * 30) + 5 },
        { skill: 'Cooking', count: Math.floor(Math.random() * 55) + 15 },
        { skill: 'Electrical', count: Math.floor(Math.random() * 25) + 4 },
    ];

    const totalPlacements = placementsOverTime.reduce((s, d) => s + d.placements, 0);
    const opportunityBreakdown = [
        { name: 'Jobs', value: Math.round(totalPlacements * 0.48) },
        { name: 'Training', value: Math.round(totalPlacements * 0.32) },
        { name: 'Apprenticeship', value: Math.round(totalPlacements * 0.20) },
    ];

    const summaryCards = {
        totalPlacements,
        completedPlacements: placementsOverTime.reduce((s, d) => s + d.completed, 0),
        totalVerifiedSkills: verifiedSkills.reduce((s, d) => s + d.count, 0),
        activeRefugees: Math.floor(Math.random() * 200) + 80,
        employersOnboarded: Math.floor(Math.random() * 30) + 10,
        sdg8Score: (Math.random() * 2 + 7).toFixed(1),
        sdg10Score: (Math.random() * 2 + 6.5).toFixed(1),
    };

    return { placementsOverTime, verifiedSkills, opportunityBreakdown, summaryCards };
}

async function fetchImpactMetrics(startDate, endDate) {
    // Replace with actual API call: GET /api/admin/impact-metrics?start=...&end=...
    // const response = await fetch(`/api/admin/impact-metrics?start=${startDate}&end=${endDate}`);
    // return await response.json();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return generateMockMetrics(startDate, endDate);
}

// ── Constants ────────────────────────────────────────────────────────
const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B'];
const DATE_PRESETS = [
    { label: 'Last 3 months', months: 3 },
    { label: 'Last 6 months', months: 6 },
    { label: 'Last 12 months', months: 12 },
];

function toInputDate(date) {
    return date.toISOString().split('T')[0];
}
function monthsAgo(n) {
    const d = new Date();
    d.setMonth(d.getMonth() - n);
    return d;
}

// ── Component ────────────────────────────────────────────────────────
export default function SDGImpactDashboard() {
    const [startDate, setStartDate] = useState(toInputDate(monthsAgo(6)));
    const [endDate, setEndDate] = useState(toInputDate(new Date()));
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMetrics = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchImpactMetrics(startDate, endDate);
            setMetrics(data);
        } catch (err) {
            setError(err.message || 'Failed to load impact metrics.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, [startDate, endDate]);

    const applyPreset = (months) => {
        setStartDate(toInputDate(monthsAgo(months)));
        setEndDate(toInputDate(new Date()));
    };

    // ── Loading state ────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">SDG Impact Dashboard</h2>
                {/* Skeleton summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-28 animate-pulse" />
                    ))}
                </div>
                {/* Skeleton charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-200 rounded-lg h-72 animate-pulse" />
                    <div className="bg-gray-200 rounded-lg h-72 animate-pulse" />
                </div>
                <div className="bg-gray-200 rounded-lg h-72 animate-pulse" />
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">SDG Impact Dashboard</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Metrics</p>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={loadMetrics}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty state ──────────────────────────────────────────────────
    if (!metrics || (metrics.summaryCards.totalPlacements === 0 && metrics.summaryCards.totalVerifiedSkills === 0)) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">SDG Impact Dashboard</h2>
                <DateRangeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onPreset={applyPreset}
                />
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-500 text-5xl mb-4">📊</p>
                    <p className="text-gray-600 text-lg font-semibold mb-2">No Impact Data Available</p>
                    <p className="text-gray-400">
                        No metrics found for the selected date range. Try expanding the range.
                    </p>
                </div>
            </div>
        );
    }

    const { placementsOverTime, verifiedSkills, opportunityBreakdown, summaryCards } = metrics;

    // ── Main render ──────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">SDG Impact Dashboard</h2>
                    <p className="text-gray-500 mt-1">
                        Real-time metrics aligned with SDG 8 (Decent Work) &amp; SDG 10 (Reduced Inequalities)
                    </p>
                </div>
            </div>

            {/* Date range selector */}
            <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onPreset={applyPreset}
            />

            {/* SDG Alignment Badges */}
            <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                    🎯 SDG 8 Score: {summaryCards.sdg8Score}/10
                </span>
                <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                    🎯 SDG 10 Score: {summaryCards.sdg10Score}/10
                </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <SummaryCard
                    title="Total Placements"
                    value={summaryCards.totalPlacements}
                    gradient="from-indigo-500 to-indigo-600"
                    subtitle="All-time placements"
                />
                <SummaryCard
                    title="Completed"
                    value={summaryCards.completedPlacements}
                    gradient="from-green-500 to-green-600"
                    subtitle="Successfully completed"
                />
                <SummaryCard
                    title="Verified Skills"
                    value={summaryCards.totalVerifiedSkills}
                    gradient="from-amber-500 to-amber-600"
                    subtitle="NGO-verified skills"
                />
                <SummaryCard
                    title="Active Refugees"
                    value={summaryCards.activeRefugees}
                    gradient="from-purple-500 to-purple-600"
                    subtitle="On the platform"
                />
                <SummaryCard
                    title="Employers"
                    value={summaryCards.employersOnboarded}
                    gradient="from-pink-500 to-pink-600"
                    subtitle="Onboarded employers"
                />
            </div>

            {/* Charts row 1: Placements over time + Opportunity breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Placements over time (line chart) - 2/3 width */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Placements Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={placementsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="placements"
                                stroke="#4F46E5"
                                strokeWidth={2}
                                dot={{ fill: '#4F46E5', r: 4 }}
                                name="New Placements"
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={{ fill: '#10B981', r: 4 }}
                                name="Completed"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Opportunity breakdown (pie chart) - 1/3 width */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">By Opportunity Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={opportunityBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                            >
                                {opportunityBreakdown.map((_, idx) => (
                                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts row 2: Verified skills (bar chart) */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Verified Skills Count</h3>
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={verifiedSkills} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis
                            dataKey="skill"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                            stroke="#9CA3AF"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '13px',
                            }}
                        />
                        <Bar dataKey="count" name="Verified Count" fill="#4F46E5" radius={[0, 6, 6, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">📈 About These Metrics</h3>
                <p className="text-blue-800 text-sm">
                    This dashboard tracks impact aligned with <strong>SDG 8</strong> (Decent Work and Economic Growth) and{' '}
                    <strong>SDG 10</strong> (Reduced Inequalities). Metrics are derived from verified placements,
                    NGO-verified skill assessments, and employer participation. Data updates reflect real-time platform activity
                    within the selected date range.
                </p>
            </div>
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────────────

function SummaryCard({ title, value, gradient, subtitle }) {
    return (
        <div className={`bg-gradient-to-br ${gradient} rounded-lg shadow-md p-5 text-white`}>
            <h4 className="text-sm font-medium opacity-90">{title}</h4>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
    );
}

function DateRangeSelector({ startDate, endDate, onStartChange, onEndChange, onPreset }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Date Range:</span>
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                />
                <span className="text-gray-400">→</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                />
            </div>
            <div className="flex gap-2">
                {DATE_PRESETS.map((p) => (
                    <button
                        key={p.months}
                        onClick={() => onPreset(p.months)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg transition-colors border border-gray-200"
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
