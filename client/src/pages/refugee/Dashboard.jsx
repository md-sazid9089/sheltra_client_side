import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'react-router-dom';

export default function RefugeeDashboard() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['refugee-profile'],
    queryFn: () => api.get('/refugees/profile').then((r) => r.data),
    retry: false,
  });



  return (
    <div className="space-y-8 motion-safe-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
          Welcome back, {user?.name || 'there'}
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Here&apos;s an overview of your journey on Sheltra.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          label="Profile Status"
          value={profile?.verified ? 'Verified' : 'Pending'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Matched Opportunities"
          value={profile?.matched_jobs || 0}
          trend="up"
          trendLabel="3 new this week"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Skills Listed"
          value={profile?.skills?.length || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card hover>
          <Card.Header>
            <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Complete Your Profile</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">
              A complete profile increases your chances of being matched with relevant opportunities by 73%.
            </p>
            <Link to="/refugee/profile">
              <Button size="sm">Update Profile</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card hover>
          <Card.Header>
            <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Browse Opportunities</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">
              View roles matched to your verified skills, with transparent AI explanations for every recommendation.
            </p>
            <Link to="/refugee/opportunities">
              <Button size="sm" variant="accent">View Opportunities</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>

      {/* Verification status */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Verification Status</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile?.verified ? 'bg-semantic-success-light text-semantic-success' : 'bg-semantic-warning-light text-semantic-warning'}`}>
              {profile?.verified ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
              )}
            </div>
            <div>
              <p className="font-medium text-text-primary dark:text-text-darkPrimary">
                {profile?.verified ? 'Profile Verified by NGO Partner' : 'Awaiting NGO Verification'}
              </p>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                {profile?.verified
                  ? 'Your identity and credentials have been verified. Employers can now view your profile.'
                  : 'An NGO partner will review your profile and verify your identity and credentials.'}
              </p>
            </div>
            <Badge variant={profile?.verified ? 'success' : 'warning'} className="ml-auto">
              {profile?.verified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
