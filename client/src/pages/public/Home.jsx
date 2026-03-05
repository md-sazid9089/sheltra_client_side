import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import ActionButton from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stepper } from '@/components/ui/Stepper';
import { StatCard } from '@/components/ui/StatCard';
import {
  FaExclamationTriangle, FaLock, FaGlobe, FaCheckCircle, FaHandshake,
  FaSitemap, FaUser, FaBuilding, FaBriefcase, FaChartBar,
  FaShieldAlt, FaClipboardList, FaBullseye, FaBalanceScale,
} from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="motion-safe-fade-in">
      {/* ─── 1. Hero Section ─── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center -mt-20">
        {/* Background image — displaced people on a hopeful journey */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80')",
          }}
        />

        {/* Multi-stop gradient overlay: dark left to translucent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 via-cyan-950/88 to-teal-900/60" />

        {/* Ambient glow blobs */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-96 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />

        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Copy ── */}
            <div className="motion-safe-slide-up">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/25 text-teal-300 text-sm font-medium mb-7">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Trusted by 156 NGO Partners Worldwide
              </div>

              <h1 className="text-hero text-white leading-tight">
                From Displacement to{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #5eead4 0%, #67e8f9 50%, #22d3ee 100%)',
                  }}
                >
                  Dignified Employment
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-300 max-w-lg leading-relaxed">
                Sheltra connects displaced individuals with verified opportunities through
                skill-based matching, NGO verification, and ethical AI — creating trust-first
                pathways to economic independence.
              </p>

              <div className="mt-9 flex flex-wrap gap-4 items-center">
                {/* Create Skill Profile — cyan sweep */}
                <button
                  onClick={() => navigate('/register')}
                  className="flex justify-center gap-2 items-center shadow-xl text-base lg:font-semibold isolation-auto border-white/30 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-cyan-500 hover:text-white before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-6 py-3 overflow-hidden border-2 rounded-full group text-white bg-white/10 backdrop-blur-sm"
                >
                  Create Skill Profile
                  <svg
                    className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-white/20 text-white ease-linear duration-300 rounded-full border border-white/40 group-hover:border-none p-2 rotate-45"
                    viewBox="0 0 16 19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                      className="fill-white group-hover:fill-white"
                    />
                  </svg>
                </button>

                {/* Partner as NGO — teal sweep */}
                <button
                  onClick={() => navigate('/register')}
                  className="flex justify-center gap-2 items-center shadow-xl text-base lg:font-semibold isolation-auto border-teal-400/40 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-teal-500 hover:text-white before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-6 py-3 overflow-hidden border-2 rounded-full group text-teal-300 bg-teal-500/10 backdrop-blur-sm"
                >
                  Partner as NGO
                  <svg
                    className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-white/20 text-teal-300 ease-linear duration-300 rounded-full border border-teal-400/50 group-hover:border-none p-2 rotate-45"
                    viewBox="0 0 16 19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                      className="fill-teal-300 group-hover:fill-white"
                    />
                  </svg>
                </button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white border-white/25 hover:bg-white/8"
                  onClick={() => {
                    document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Impact ↓
                </Button>
              </div>

              {/* Inline stats strip */}
              <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                {[
                  { value: '12K+', label: 'Profiles Created' },
                  { value: '4,350', label: 'Jobs Matched' },
                  { value: '156', label: 'NGO Partners' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Glassmorphism card stack ── */}
            <div className="motion-safe-slide-up" style={{ animationDelay: '200ms' }}>
              {/* Main profile card */}
              <div className="relative bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl shadow-black/40">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 border border-green-400/25 text-green-300">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Profile
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500/30 to-cyan-600/30 border border-teal-400/25 flex items-center justify-center text-xl font-bold text-teal-200">
                    AM
                  </div>
                  <div>
                    <p className="font-semibold text-white">Amara M.</p>
                    <p className="text-sm text-slate-400">Software Developer · Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {['Python', 'React', 'Data Analysis', 'Fluent English'].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-full bg-cyan-500/15 border border-cyan-400/20 text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  NGO-Verified · 3 Matching Opportunities
                </div>

                {/* Quote */}
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "Sheltra gave me a way to prove my skills after I lost everything.
                    I found a job within three weeks."
                  </p>
                  <p className="mt-2 text-xs text-slate-500">— Amara M., Software Developer, Kenya</p>
                </div>
              </div>

              {/* Floating notification badge */}
              <div className="mt-3 ml-4 inline-flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3 shadow-lg">
                <div className="w-9 h-9 rounded-full bg-brand-primary/30 border border-brand-primary/25 flex items-center justify-center">
                  <FaHandshake className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">New Match Found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tech Lead role · Berlin, Germany</p>
                </div>
                <span className="ml-2 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade transition into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-surface-darkBase to-transparent" />
      </section>

      {/* ─── 2. Problem → Solution Bridge ─── */}
      <section className="py-20 relative overflow-hidden bg-slate-950">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-red-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-section-title text-white">Bridging the Gap</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto text-base">
              Displaced individuals face systemic barriers. Sheltra transforms each into a pathway.
            </p>
          </div>

          {/* Barriers fan */}
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">The Barriers</p>
          <div className="glass-fan-container">
            {[
              { icon: <FaExclamationTriangle className="w-8 h-8 text-red-400" />, title: 'No Credential Proof', desc: 'Documents lost during displacement leave skills unverifiable.' },
              { icon: <FaLock className="w-8 h-8 text-red-400" />, title: 'Trust Deficit', desc: 'Employers lack confidence without established identity verification.' },
              { icon: <FaGlobe className="w-8 h-8 text-red-400" />, title: 'Fragmented Access', desc: 'Scattered resources across NGOs, governments, and private sector.' },
            ].map((item, i) => {
              const rotations = [-18, 0, 18];
              return (
                <div
                  key={item.title}
                  data-name={item.title}
                  className="glass-fan-card glass-fan-card--danger"
                  style={{ '--r': rotations[i] }}
                >
                  <div className="flex flex-col items-center gap-3 pb-14 px-5">
                    {item.icon}
                    <p className="text-xs text-red-200 text-center leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm font-semibold text-cyan-300 bg-cyan-900/30 border border-cyan-500/20 px-5 py-1.5 rounded-full">
              Sheltra's Solution ↓
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Solutions fan */}
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">The Solutions</p>
          <div className="glass-fan-container">
            {[
              { icon: <FaCheckCircle className="w-8 h-8 text-emerald-400" />, title: 'Verified Skill Profiles', desc: 'NGO-backed verification restores credential trust without traditional documents.' },
              { icon: <FaHandshake className="w-8 h-8 text-emerald-400" />, title: 'Ethical AI Matching', desc: 'Transparent, bias-aware algorithms match skills to opportunities with full audit trails.' },
              { icon: <FaSitemap className="w-8 h-8 text-emerald-400" />, title: 'Unified Platform', desc: 'One hub connecting refugees, NGOs, employers, and government partners.' },
            ].map((item, i) => {
              const rotations = [-18, 0, 18];
              return (
                <div
                  key={item.title}
                  data-name={item.title}
                  className="glass-fan-card glass-fan-card--success"
                  style={{ '--r': rotations[i] }}
                >
                  <div className="flex flex-col items-center gap-3 pb-14 px-5">
                    {item.icon}
                    <p className="text-xs text-emerald-200 text-center leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
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
              { role: 'Refugees', color: 'brand-primary', desc: 'Build verified skill profiles, find matched opportunities, and track your journey to employment.', cta: 'Create Profile', icon: <FaUser className="w-8 h-8 mx-auto text-cyan-400" /> },
              { role: 'NGOs', color: 'brand-accent', desc: 'Verify refugee identities, manage cases, and coordinate with employers on placement.', cta: 'Partner With Us', icon: <FaBuilding className="w-8 h-8 mx-auto text-teal-400" /> },
              { role: 'Employers', color: 'brand-amber', desc: 'Post opportunities, browse verified talent, and provide feedback on placements.', cta: 'Post Opportunities', icon: <FaBriefcase className="w-8 h-8 mx-auto text-amber-400" /> },
              { role: 'Donors & Gov', color: 'brand-primary', desc: 'Track impact metrics, view audit trails, and see real-time progress on SDG alignment.', cta: 'View Impact', icon: <FaChartBar className="w-8 h-8 mx-auto text-cyan-400" /> },
            ].map((item) => (
              <Card key={item.role} hover className="text-center">
                <div className="mb-3">{item.icon}</div>
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
              { icon: <FaShieldAlt className="w-8 h-8 mx-auto text-cyan-400" />, title: 'Privacy-First Design', desc: 'Personal data is encrypted, consent-based, and never shared without explicit permission. GDPR-ready from day one.' },
              { icon: <FaCheckCircle className="w-8 h-8 mx-auto text-cyan-400" />, title: 'NGO Verification Layer', desc: 'Every refugee profile is verified by a registered NGO partner before being visible to employers.' },
              { icon: <FaClipboardList className="w-8 h-8 mx-auto text-cyan-400" />, title: 'Immutable Audit Logs', desc: 'All verification actions, matches, and decisions are logged with timestamps for full accountability.' },
            ].map((item) => (
              <Card key={item.title} className="text-center">
                <div className="mb-3">{item.icon}</div>
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
              <div className="flex justify-center mb-3"><FaBullseye className="w-10 h-10 text-cyan-400" /></div>
              <h3 className="font-bold text-lg text-text-primary dark:text-text-darkPrimary mb-2">SDG 8</h3>
              <p className="text-sm font-medium text-brand-primary mb-2">Decent Work &amp; Economic Growth</p>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                Promoting inclusive economic growth through verified employment pathways for displaced populations.
              </p>
            </Card>
            <Card hover className="text-center border-l-4 border-l-pink-500">
              <div className="flex justify-center mb-3"><FaBalanceScale className="w-10 h-10 text-pink-400" /></div>
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
          <p className="text-cyan-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you are a displaced individual, an NGO partner, or an employer — Sheltra
            helps you create impact that matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ActionButton variant="primary" onClick={() => navigate('/register')}>
              GET STARTED TODAY
            </ActionButton>
            <ActionButton variant="primary" onClick={() => navigate('/login')}>
              SIGN IN
            </ActionButton>
          </div>
        </div>
      </section>
    </div>
  );
}
