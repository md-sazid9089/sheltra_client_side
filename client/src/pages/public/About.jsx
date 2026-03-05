import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaShieldAlt, FaBalanceScale, FaLock, FaGlobe, FaClipboardList, FaHandshake } from 'react-icons/fa';

const WHY_ITEMS = [
  {
    icon: <FaShieldAlt className="w-6 h-6 text-cyan-300" />,
    title: 'Trust-First Architecture',
    desc: 'Every profile is NGO-verified before employers ever see it — because displaced people deserve more than a checkbox.',
  },
  {
    icon: <FaBalanceScale className="w-6 h-6 text-cyan-300" />,
    title: 'Ethical AI Matching',
    desc: 'Our algorithms are transparent, bias-audited, and human-overseen. Skills and potential drive matches, not proxy signals.',
  },
  {
    icon: <FaLock className="w-6 h-6 text-cyan-300" />,
    title: 'Privacy by Design',
    desc: 'Consent-driven data sharing, end-to-end encryption, and GDPR-ready controls ensure individuals stay in control.',
  },
  {
    icon: <FaGlobe className="w-6 h-6 text-cyan-300" />,
    title: 'Built with Communities',
    desc: 'Sheltra was co-designed with refugees, field NGOs, and ethical technologists — shaped by lived experience, not assumptions.',
  },
  {
    icon: <FaClipboardList className="w-6 h-6 text-cyan-300" />,
    title: 'Full Accountability',
    desc: 'Immutable audit logs, transparent decision trails, and SDG-aligned impact reporting for every partner and donor.',
  },
  {
    icon: <FaHandshake className="w-6 h-6 text-cyan-300" />,
    title: 'Ecosystem Approach',
    desc: 'Refugees, NGOs, employers, and governments in one unified platform — reducing fragmentation across the entire journey.',
  },
];

const TEAM = [
  {
    initials: 'SA',
    name: 'Sazid',
    role: 'Co-Founder & CEO',
    bio: 'Former UNHCR field officer with 12 years of displacement response experience across East Africa and the Middle East.',
    color: 'from-teal-500/30 to-cyan-600/30',
    border: 'border-teal-400/25',
    text: 'text-teal-200',
  },
  {
    initials: 'AB',
    name: 'Abrar',
    role: 'Co-Founder & CTO',
    bio: 'Machine learning engineer specialising in ethical AI and fairness-aware systems. Previously at Oxford Internet Institute.',
    color: 'from-cyan-500/30 to-cyan-700/30',
    border: 'border-cyan-400/25',
    text: 'text-cyan-200',
  },
  {
    initials: 'IR',
    name: 'Irfan',
    role: 'Head of NGO Partnerships',
    bio: 'Built and scaled partnership networks across 40+ countries for global humanitarian organisations.',
    color: 'from-cyan-600/30 to-teal-700/30',
    border: 'border-cyan-400/25',
    text: 'text-cyan-200',
  },
  {
    initials: 'TA',
    name: 'Tawsif',
    role: 'Head of Product',
    bio: 'Product designer with deep expertise in trauma-informed UX and inclusive technology for under-resourced communities.',
    color: 'from-purple-500/30 to-pink-600/30',
    border: 'border-purple-400/25',
    text: 'text-purple-200',
  },
];

const STORY_MILESTONES = [
  { year: '2021', label: 'The Idea', desc: 'Sara and James met at a UNHCR innovation summit in Geneva and identified the critical gap between verified skills and employer reach.' },
  { year: '2022', label: 'First Pilot', desc: 'Launched a 6-month pilot with 3 NGOs in Kenya and Jordan. 120 refugees placed in employment within the program.' },
  { year: '2023', label: 'Ethical AI Core', desc: 'Embedded a fairness-audited matching engine, becoming one of the first platforms to publish bias assessments publicly.' },
  { year: '2024', label: 'Scale', desc: 'Reached 150+ NGO partners across 40 countries, 10,000+ verified profiles, and $4M in social impact funding.' },
  { year: '2025', label: 'Today', desc: 'Operating globally with 12,480 profiles, 4,350 matched jobs, and partnerships with governments and multilateral donors.' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="motion-safe-fade-in">

      {/* ─── 1. Hero ─── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center -mt-20">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/96 via-cyan-950/85 to-teal-900/55" />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/25 text-teal-300 text-sm font-medium mb-7">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Our Mission & People
            </div>

            <h1 className="text-hero text-white leading-tight">
              Redefining the Journey{' '}
              <br className="hidden sm:block" />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #5eead4 0%, #67e8f9 50%, #22d3ee 100%)',
                }}
              >
                Across Refugees
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              Sheltra was built on a single belief: that displacement does not erase capability.
              We are a team of technologists, humanitarians, and former refugees working to
              restore economic dignity — one verified profile at a time.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/register')}>
                Join Sheltra
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-white/25 hover:bg-white/8"
                onClick={() => {
                  document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Read Our Story ↓
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-surface-darkBase to-transparent" />
      </section>

      {/* ─── 2. Why Choose Us ─── */}
      <section className="py-24 bg-white dark:bg-surface-darkBase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Sheltra"
            subtitle="We built the platform we wished existed — grounded in field reality, ethical technology, and genuine human respect."
            center
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {WHY_ITEMS.map((item) => (
              <Card key={item.title} hover className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Our Story ─── */}
      <section id="our-story" className="py-24 bg-surface-base dark:bg-surface-darkCard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Story"
            subtitle="From a conversation in Geneva to a global platform — here's how Sheltra came to be."
            center
          />

          {/* Timeline */}
          <div className="mt-14 relative max-w-3xl mx-auto">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border-light dark:bg-border-dark" />

            <div className="space-y-10">
              {STORY_MILESTONES.map((m, i) => (
                <div key={m.year} className="relative flex gap-8 items-start">
                  {/* dot */}
                  <div className="shrink-0 z-10 w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {m.year.slice(2)}
                  </div>
                  {/* content */}
                  <Card className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{m.year}</span>
                      <span className="text-xs text-text-muted dark:text-text-darkMuted">·</span>
                      <span className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">{m.label}</span>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">{m.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Meet the Team ─── */}
      <section className="py-24 relative overflow-hidden bg-slate-950">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-section-title text-white">Meet Our Team</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto text-base">
              Humanitarians, engineers, and community builders united by one purpose.
            </p>
          </div>

          {/* Glass fan cards */}
          <div className="glass-fan-container">
            {TEAM.map((member, i) => {
              const rotations = [-22, -8, 8, 22];
              return (
                <div
                  key={member.name}
                  data-name={member.name}
                  className="glass-fan-card"
                  style={{ '--r': rotations[i] }}
                >
                  <div className="flex flex-col items-center gap-2 pb-14 px-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} border ${member.border} flex items-center justify-center text-xl font-bold ${member.text}`}
                    >
                      {member.initials}
                    </div>
                    <p className="text-xs font-semibold text-cyan-300 text-center leading-tight">
                      {member.role}
                    </p>
                    <p className="text-xs text-slate-400 text-center leading-snug line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hiring band */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-cyan-950 to-teal-900 p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">We're Growing</h3>
            <p className="text-cyan-200 text-sm max-w-lg mx-auto mb-5">
              We're hiring mission-driven engineers, partnership leads, and field researchers.
              If you believe in dignified work for all, we'd love to talk.
            </p>
            <Button
              className="bg-white text-slate-900 hover:bg-white/90"
              onClick={() => navigate('/register')}
            >
              View Open Roles
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 5. CTA Band ─── */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-section-title text-white mb-4">
            Ready to Be Part of the Journey?
          </h2>
          <p className="text-cyan-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you are a displaced individual, an NGO, or an employer — Sheltra gives
            you the tools to create real, lasting impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand-primary hover:bg-cyan-50"
              onClick={() => navigate('/register')}
            >
              Get Started
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
