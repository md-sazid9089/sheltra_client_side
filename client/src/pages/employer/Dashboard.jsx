import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const { user } = useAuth();

  const { data: jobs } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => api.get('/employer/jobs').then((r) => r.data),
    retry: false,
    initialData: [],
  });



  return (
    <div className="space-y-8 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
          Employer Dashboard
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Welcome back, {user?.name || 'Partner'}. Manage jobs and browse verified talent.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Job Posts"
          value={jobs?.length || 0}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Applicants"
          value="24"
          trend="up"
          trendLabel="8 new this week"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Hires Made"
          value="6"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card hover>
          <Card.Header>
            <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Post a New Job</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">
              Create a new opportunity and get matched with verified, skilled candidates.
            </p>
            <Link to="/employer/jobs">
              <Button size="sm">Create Job Post</Button>
            </Link>
          </Card.Body>
        </Card>
        <Card hover>
          <Card.Header>
            <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Browse Talent</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">
              Explore verified profiles of skilled individuals matched to your requirements.
            </p>
            <Link to="/employer/talent">
              <Button size="sm" variant="accent">Browse Talent</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
