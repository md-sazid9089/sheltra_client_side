import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

const AI_DISCLAIMER =
  'AI supports matching and recommendations only; it does not make legal or employment decisions.';

// ── Match score bar ───────────────────────────────────────────────────────────
function MatchBar({ score }) {
  const color =
    score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-cyan-500' : 'bg-amber-500';
  return (
    <div className="flex items-center gap-2" aria-label={`Match score ${score}%`}>
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums text-slate-400">{score}%</span>
    </div>
  );
}

export default function Opportunities() {
  const [expandedId, setExpandedId] = useState(null);

  const { data: opportunities } = useQuery({
    queryKey: ['refugee-opportunities'],
    queryFn: () => api.get('/refugee/opportunities').then((r) => r.data),
    retry: false,
    initialData: [
      {
        id: 1,
        title: 'Junior Software Developer',
        company: 'TechBridge Africa',
        location: 'Nairobi, Kenya',
        type: 'Full-time',
        match_score: 92,
        match_reason:
          'Your Python and React skills strongly align with the role requirements. Your 3 years of experience exceeds the minimum 1-year requirement. Location preference matches.',
        posted: '2 days ago',
        skills: ['Python', 'React', 'REST APIs'],
      },
      {
        id: 2,
        title: 'Data Analyst Intern',
        company: 'GreenFuture NGO',
        location: 'Remote',
        type: 'Internship',
        match_score: 85,
        match_reason:
          'Your data analysis skills and fluency in English and French match this role. The remote format accommodates your current situation.',
        posted: '5 days ago',
        skills: ['Data Analysis', 'Excel', 'French'],
      },
      {
        id: 3,
        title: 'Community Liaison Officer',
        company: 'RefugeAid International',
        location: 'Kampala, Uganda',
        type: 'Contract',
        match_score: 78,
        match_reason:
          'Your multilingual capabilities and community experience are strong fits. Travel requirement partially matches your availability.',
        posted: '1 week ago',
        skills: ['Community Outreach', 'Arabic', 'English'],
      },
    ],
  });

  return (
    <div className="space-y-8 motion-safe-fade-in">

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Matched Opportunities</h1>
        <p className="text-slate-400 mt-2 text-base max-w-xl">
          Roles matched to your verified skill profile — sorted by relevance. Every match comes with a transparent AI explanation.
        </p>
      </div>

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/6 border border-cyan-500/18">
        <svg className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-cyan-300 font-medium leading-relaxed">{AI_DISCLAIMER}</p>
      </div>

      {/* Opportunity list */}
      {(!opportunities || opportunities.length === 0) ? (
        <EmptyState
          title="No Opportunities Yet"
          description="Complete your profile and get verified by an NGO partner to see matched opportunities."
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <article key={opp.id} className="fancy-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title + match badge */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="font-semibold text-lg text-slate-100">
                      {opp.title}
                    </h2>
                    <Badge variant={opp.match_score >= 85 ? 'success' : opp.match_score >= 70 ? 'primary' : 'warning'}>
                      {opp.match_score}% Match
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-400">
                    {opp.company} · {opp.location}
                  </p>

                  {/* Match bar */}
                  <div className="mt-3 max-w-xs">
                    <MatchBar score={opp.match_score} />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="accent">{opp.type}</Badge>
                    {opp.skills?.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 mt-2">Posted {opp.posted}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm">Apply</Button>
                </div>
              </div>

              {/* "Why this match?" accordion */}
              <div className="mt-4 border-t border-white/6 pt-3">
                <button
                  onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                  className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded px-1"
                  aria-expanded={expandedId === opp.id}
                  aria-controls={`why-${opp.id}`}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${expandedId === opp.id ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Why this match?
                </button>
                {expandedId === opp.id && (
                  <div
                    id={`why-${opp.id}`}
                    className="mt-3 ml-6 p-4 rounded-xl bg-slate-900/60 border border-white/6 text-sm text-slate-300 leading-relaxed motion-safe-fade-in"
                  >
                    <p>{opp.match_reason}</p>
                    <p className="mt-3 text-xs text-slate-500 italic">
                      {AI_DISCLAIMER}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
