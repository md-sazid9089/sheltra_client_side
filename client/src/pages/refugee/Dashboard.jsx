import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'react-router-dom';

// Quick-access cards config
const QUICK_LINKS = [
  {
    to: '/refugee/profile',
    title: 'Complete Your Profile',
    description: 'A complete profile increases your match rate by 73%. Add your skills, experience, and languages.',
    cta: 'Update Profile',
    variant: 'primary',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    ),
  },
  {
    to: '/refugee/nid-check',
    title: 'Get Virtual NID',
    description: 'Get a verified National Identification Document (NID) after NGO verification.',
    cta: 'Check Status',
    variant: 'primary',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h5m0 0V4m0 12h9a2 2 0 012 2v2a2 2 0 01-2 2h-2.5" />
        </svg>
      </div>
    ),
  },
  {
    to: '/refugee/opportunities',
    title: 'Browse Opportunities',
    description: 'View roles matched to your verified skills, with transparent AI explanations for every recommendation.',
    cta: 'View Opportunities',
    variant: 'accent',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-teal-500/12 border border-teal-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
  },
  {
    to: '/refugee/cv-rating',
    title: 'Rate My CV (AI)',
    description: 'Paste your CV and get instant feedback on structure, content, and improvements to stand out.',
    cta: 'Check CV',
    variant: 'secondary',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6zM9 3v6h6M9 13h6M9 17h4" />
        </svg>
      </div>
    ),
  },
  {
    to: '/refugee/blogs',
    title: 'Resources & Stories',
    description: 'Rights guides, training tips, and inspiring stories from refugees who found their path.',
    cta: 'Read Articles',
    variant: 'ghost',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    ),
  },
];

export default function RefugeeDashboard() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['refugee-profile'],
    queryFn: () => api.get('/refugees/profile').then((r) => r.data),
    retry: false,
  });

  return (
    <div className="space-y-10 motion-safe-fade-in">

      {/* â”€â”€ Hero welcome banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative rounded-2xl overflow-hidden border border-white/6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 px-6 py-8 sm:px-10 sm:py-10">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 31px,#fff 31px,#fff 32px),repeating-linear-gradient(90deg,transparent,transparent 31px,#fff 31px,#fff 32px)' }} aria-hidden="true" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500 mb-2">Your portal</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome back,{' '}
              <span className="text-cyan-400">{user?.name?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="mt-2 text-slate-400 text-base max-w-lg">
              Here&apos;s an overview of your journey on Sheltra. Keep building â€” every step forward matters.
            </p>
          </div>

          {/* Verification pill */}
          <div className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${profile?.verified ? 'bg-green-500/8 border-green-500/20' : 'bg-amber-500/8 border-amber-500/20'}`}>
            {profile?.verified ? (
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className={`text-xs font-semibold ${profile?.verified ? 'text-green-400' : 'text-amber-400'}`}>
                {profile?.verified ? 'NGO Verified' : 'Pending Verification'}
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                {profile?.verified ? 'Visible to employers' : 'NGO review in progress'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Stats row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Your statistics">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Your progress</h2>
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
      </section>

      {/* â”€â”€ Quick actions grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Quick actions">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((item) => (
            <Card key={item.to} className="flex flex-col gap-4 hover-lift group">
              <div className="flex items-start gap-4">
                {item.icon}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/6">
                <Link to={item.to}>
                  <Button size="sm" variant={item.variant} className="w-full sm:w-auto">
                    {item.cta}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* â”€â”€ Verification status detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Verification status">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Verification status</h2>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${profile?.verified ? 'bg-green-500/12 text-green-400' : 'bg-amber-500/12 text-amber-400'}`}>
              {profile?.verified ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-100">
                {profile?.verified ? 'Profile Verified by NGO Partner' : 'Awaiting NGO Verification'}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                {profile?.verified
                  ? 'Your identity and credentials have been verified. Employers can now view your full profile.'
                  : 'An NGO partner will review your profile and verify your identity and credentials. This usually takes 1â€“3 business days.'}
              </p>
            </div>
            <Badge variant={profile?.verified ? 'success' : 'warning'} className="shrink-0">
              {profile?.verified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </Card>
      </section>

    </div>
  );
}
