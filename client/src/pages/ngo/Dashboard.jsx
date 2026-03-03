import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'react-router-dom';

export default function NGODashboard() {
  const { user } = useAuth();

  const { data: cases } = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: () => api.get('/ngo/cases').then((r) => r.data),
    retry: false,
    initialData: [],
  });

  const pending = cases?.filter((c) => !c.verified)?.length || 0;
  const verified = cases?.filter((c) => c.verified)?.length || 0;



  return (
    <div className="space-y-8 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
          NGO Dashboard
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Welcome back, {user?.name || 'Partner'}. Manage verifications and cases.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Cases"
          value={cases?.length || 0}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          label="Pending Verification"
          value={pending}
          trend={pending > 0 ? 'up' : undefined}
          trendLabel={pending > 0 ? 'Action needed' : undefined}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Verified"
          value={verified}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-3">
            <Link to="/ngo/cases">
              <Button size="sm">Review Pending Cases</Button>
            </Link>
            <Button size="sm" variant="secondary" disabled>
              Export Reports (Coming Soon)
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
