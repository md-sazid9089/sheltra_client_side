import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => api.get('/admin/impact-metrics').then((r) => r.data),
    retry: false,
    placeholderData: {
      total_users: 15200,
      total_refugees: 12480,
      total_ngos: 156,
      total_employers: 340,
      verified_profiles: 8920,
      jobs_matched: 4350,
      active_jobs: 890,
      verifications_this_month: 412,
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 motion-safe-fade-in">
        <Skeleton className="h-8 w-64" />
        <div className="grid sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton.Card key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Platform overview and impact metrics
        </p>
      </div>

      {/* Top-level stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={metrics.total_users?.toLocaleString()}
          trend="up"
          trendLabel="8% this month"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          label="Verified Profiles"
          value={metrics.verified_profiles?.toLocaleString()}
          trend="up"
          trendLabel="24% this quarter"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Jobs Matched"
          value={metrics.jobs_matched?.toLocaleString()}
          trend="up"
          trendLabel="31% this quarter"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Partner NGOs"
          value={metrics.total_ngos}
          trend="up"
          trendLabel="12 new this month"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Refugees" value={metrics.total_refugees?.toLocaleString()} />
        <StatCard label="Total Employers" value={metrics.total_employers} />
        <StatCard label="Verifications This Month" value={metrics.verifications_this_month} />
      </div>

      {/* Chart placeholder */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Platform Growth</h2>
        </Card.Header>
        <Card.Body>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-card">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-text-muted dark:text-text-darkMuted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm text-text-muted dark:text-text-darkMuted">
                Chart placeholder — connect Recharts or Chart.js for live data
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card hover>
          <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">Manage Users</h3>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-3">View and manage all platform users.</p>
          <Link to="/admin/users"><Button size="sm" variant="secondary">View Users</Button></Link>
        </Card>
        <Card hover>
          <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">NGO Partners</h3>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-3">Review and manage NGO organizations.</p>
          <Link to="/admin/ngos"><Button size="sm" variant="secondary">View NGOs</Button></Link>
        </Card>
        <Card hover>
          <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">Audit Logs</h3>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-3">Full transparency trail of platform actions.</p>
          <Link to="/admin/audit-logs"><Button size="sm" variant="secondary">View Logs</Button></Link>
        </Card>
      </div>
    </div>
  );
}
