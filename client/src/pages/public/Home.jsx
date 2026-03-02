import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stepper } from '@/components/ui/Stepper';
import { StatCard } from '@/components/ui/StatCard';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="motion-safe-fade-in">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-surface-darkBase dark:via-surface-darkBase dark:to-surface-darkBase py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="motion-safe-slide-up">
              <h1 className="text-hero text-text-primary dark:text-text-darkPrimary leading-tight">
                From Displacement to{' '}
                <span className="text-brand-primary">Dignified Employment</span>
              </h1>
              <p className="mt-6 text-lg text-text-secondary dark:text-text-darkSecondary max-w-lg">
                Sheltra connects displaced individuals with verified opportunities through
                skill-based matching, NGO verification, and ethical AI — creating trust-first
                pathways to economic independence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Create Skill Profile
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
                  Partner as NGO
                </Button>
                <Button size="lg" variant="ghost" onClick={() => {
                  document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  View Impact ↓
                </Button>
              </div>
            </div>

            {/* Product preview card */}
            <div className="motion-safe-slide-up" style={{ animationDelay: '200ms' }}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-semantic-success-light text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    ✓ Verified Profile
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl font-bold text-brand-primary">
                    AM
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-darkPrimary">Amara M.</p>
                    <p className="text-sm text-text-secondary dark:text-text-darkSecondary">Software Developer · Nairobi</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Python', 'React', 'Data Analysis', 'Fluent English'].map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-brand-primary dark:bg-blue-900/30 dark:text-blue-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-semantic-success">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  NGO-Verified · 3 Matching Opportunities
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Problem → Solution Bridge ─── */}
      <section className="py-20 bg-white dark:bg-surface-darkBase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Bridging the Gap"
            subtitle="Displaced individuals face systemic barriers. Sheltra transforms each into a pathway."
            center
          />

          {/* Barriers */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '🚧', title: 'No Credential Proof', desc: 'Documents lost during displacement leave skills unverifiable.' },
              { icon: '🔒', title: 'Trust Deficit', desc: 'Employers lack confidence without established identity verification.' },
              { icon: '🌍', title: 'Fragmented Access', desc: 'Scattered resources across NGOs, governments, and private sector.' },
            ].map((item) => (
              <Card key={item.title} className="text-center border-semantic-error/20 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{item.desc}</p>
              </Card>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            <span className="text-sm font-semibold text-brand-primary bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full">
              Sheltra's Solution ↓
            </span>
            <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          </div>

          {/* Solutions */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: 'Verified Skill Profiles', desc: 'NGO-backed verification restores credential trust without traditional documents.' },
              { icon: '🤝', title: 'Ethical AI Matching', desc: 'Transparent, bias-aware algorithms match skills to opportunities with full audit trails.' },
              { icon: '🌐', title: 'Unified Platform', desc: 'One hub connecting refugees, NGOs, employers, and government partners.' },
            ].map((item) => (
              <Card key={item.title} hover className="text-center border-semantic-success/20 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. How It Works ─── */}
      <section className="py-20 bg-surface-base dark:bg-surface-darkCard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How It Works"
            subtitle="Four steps from registration to employment, powered by trust and verification."
            center
          />
          <Stepper
            steps={[
              { title: 'Create Profile', description: 'Register and build your verified skill profile with work history and certifications.' },
              { title: 'Get Verified', description: 'An NGO partner reviews and verifies your identity and credentials.' },
              { title: 'Match & Connect', description: 'Ethical AI matches your skills with employer opportunities in your region.' },
              { title: 'Gain Employment', description: 'Connect directly with employers and start your path to economic independence.' },
            ]}
          />
        </div>
      </section>

      {/* ─── 4. Role-Based Entry ─── */}
      <section className="py-20 bg-white dark:bg-surface-darkBase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Built for Every Stakeholder"
            subtitle="Purpose-built experiences for each role in the displacement-to-employment journey."
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'Refugees', color: 'brand-primary', desc: 'Build verified skill profiles, find matched opportunities, and track your journey to employment.', cta: 'Create Profile', icon: '👤' },
              { role: 'NGOs', color: 'brand-accent', desc: 'Verify refugee identities, manage cases, and coordinate with employers on placement.', cta: 'Partner With Us', icon: '🏢' },
              { role: 'Employers', color: 'brand-amber', desc: 'Post opportunities, browse verified talent, and provide feedback on placements.', cta: 'Post Opportunities', icon: '💼' },
              { role: 'Donors & Gov', color: 'brand-primary', desc: 'Track impact metrics, view audit trails, and see real-time progress on SDG alignment.', cta: 'View Impact', icon: '📊' },
            ].map((item) => (
              <Card key={item.role} hover className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">{item.role}</h3>
                <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">{item.desc}</p>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/register')}>
                  {item.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Trust & Verification ─── */}
      <section className="py-20 bg-surface-base dark:bg-surface-darkCard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Trust-First Architecture"
            subtitle="Every interaction on Sheltra is built on transparency, privacy, and accountability."
            center
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🛡️', title: 'Privacy-First Design', desc: 'Personal data is encrypted, consent-based, and never shared without explicit permission. GDPR-ready from day one.' },
              { icon: '✓', title: 'NGO Verification Layer', desc: 'Every refugee profile is verified by a registered NGO partner before being visible to employers.' },
              { icon: '📋', title: 'Immutable Audit Logs', desc: 'All verification actions, matches, and decisions are logged with timestamps for full accountability.' },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Impact Metrics ─── */}
      <section id="impact" className="py-20 bg-white dark:bg-surface-darkBase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Measurable Impact"
            subtitle="Real numbers, real lives changed. Track our collective progress."
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Profiles Created"
              value="12,480"
              trend="up"
              trendLabel="18% this quarter"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />
            <StatCard
              label="Verified by NGOs"
              value="8,920"
              trend="up"
              trendLabel="24% this quarter"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Jobs Matched"
              value="4,350"
              trend="up"
              trendLabel="31% this quarter"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            <StatCard
              label="Partner NGOs"
              value="156"
              trend="up"
              trendLabel="12 new this month"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>}
            />
          </div>

          {/* Chart placeholder */}
          <Card className="p-8">
            <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-4">
              Employment Outcomes Over Time
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-card">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-text-muted dark:text-text-darkMuted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-text-muted dark:text-text-darkMuted">
                  Chart placeholder — connect a charting library (Recharts, Chart.js)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── 7. SDG Alignment ─── */}
      <section className="py-20 bg-surface-base dark:bg-surface-darkCard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Aligned with the UN Sustainable Development Goals"
            subtitle="Sheltra directly contributes to global targets for decent work and reduced inequalities."
            center
          />
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card hover className="text-center border-l-4 border-l-red-500">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg text-text-primary dark:text-text-darkPrimary mb-2">SDG 8</h3>
              <p className="text-sm font-medium text-brand-primary mb-2">Decent Work &amp; Economic Growth</p>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                Promoting inclusive economic growth through verified employment pathways for displaced populations.
              </p>
            </Card>
            <Card hover className="text-center border-l-4 border-l-pink-500">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="font-bold text-lg text-text-primary dark:text-text-darkPrimary mb-2">SDG 10</h3>
              <p className="text-sm font-medium text-brand-accent mb-2">Reduced Inequalities</p>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                Reducing systemic barriers through skill-based matching that values ability over circumstance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── 8. Final CTA Band ─── */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-section-title text-white mb-4">
            Ready to Build Dignified Pathways?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you are a displaced individual, an NGO partner, or an employer — Sheltra
            helps you create impact that matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand-primary hover:bg-blue-50"
              onClick={() => navigate('/register')}
            >
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
