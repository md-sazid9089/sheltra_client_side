import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import ActionButton from '@/components/ui/ActionButton';
import {
  FaEnvelope, FaMapMarkerAlt, FaTwitter, FaLinkedin, FaGithub,
  FaCheckCircle, FaChevronDown, FaChevronUp, FaPaperPlane,
} from 'react-icons/fa';

const CONTACT_CARDS = [
  {
    icon: <FaEnvelope className="w-6 h-6 text-cyan-300" />,
    label: 'Email Us',
    value: 'support@sheltra.org',
    sub: 'Contact: Support Team - Reply in 24 hours.',
    href: 'mailto:support@sheltra.org',
  },
  {
    icon: <FaMapMarkerAlt className="w-6 h-6 text-cyan-300" />,
    label: 'Headquarters',
    value: 'Geneva, Switzerland',
    sub: 'Led by Sazid (CEO). Field offices in Nairobi & Amman.',
    href: null,
  },
  {
    icon: <FaTwitter className="w-6 h-6 text-cyan-300" />,
    label: 'Twitter / X',
    value: '@SheltraTeam',
    sub: 'Follow for impact stories & updates.',
    href: 'https://twitter.com/SheltraTeam',
  },
  {
    icon: <FaLinkedin className="w-6 h-6 text-cyan-300" />,
    label: 'LinkedIn',
    value: 'Sheltra Team',
    sub: 'Partnerships with Irfan (Head of NGO Partnerships).',
    href: 'https://linkedin.com/company/sheltra',
  },
];

const FAQS = [
  {
    q: 'How long does it take to verify a refugee profile?',
    a: 'Verification is completed by the assigned NGO partner, typically within 3–5 business days depending on the complexity of the case.',
  },
  {
    q: 'Can employers contact refugees directly?',
    a: "Employers communicate through the platform's messaging system after a match is confirmed. Direct contact information is never shared without explicit refugee consent.",
  },
  {
    q: 'How do I register my NGO as a partner?',
    a: "Fill out the partner registration form and our partnerships team will reach out within 48 hours to complete the onboarding process.",
  },
  {
    q: 'Is Sheltra free for refugees?',
    a: "Yes — Sheltra is fully free for displaced individuals. We operate on a subscription model for NGOs and employers, with non-profit pricing available.",
  },
  {
    q: 'Where is refugee data stored and who can access it?',
    a: "Data is stored on EU-region GDPR-compliant infrastructure. Access is strictly role-based and refugees control what is shared with which parties.",
  },
];

const SUBJECTS = [
  'General Enquiry',
  'NGO Partnership',
  'Employer Onboarding',
  'Press & Media',
  'Technical Support',
  'Report an Issue',
];

export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  const field = 'w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all';

  return (
    <div className="motion-safe-fade-in">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[52vh] flex items-center -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/97 via-cyan-950/88 to-teal-900/60" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/25 text-teal-300 text-sm font-medium mb-7">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Get in Touch
            </div>
            <h1 className="text-hero text-white leading-tight">
              We'd Love to{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #5eead4 0%, #67e8f9 50%, #22d3ee 100%)' }}
              >
                Hear From You
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-300 max-w-xl leading-relaxed">
              Whether you're a refugee seeking help, an NGO exploring partnership, or an employer
              looking to hire verified talent — our team is ready to assist.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_CARDS.map((card) => {
              const inner = (
                <div className="fancy-card p-5 h-full flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-200">
                  <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-0.5">{card.label}</p>
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{card.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
                  </div>
                </div>
              );
              return card.href ? (
                <a key={card.label} href={card.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={card.label}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="py-16 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Send a Message</h2>
              <p className="text-slate-400 text-sm mb-8">Fill out the form and someone from our team will be in touch shortly.</p>

              {sent ? (
                <div className="fancy-card p-10 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <FaCheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Thank you for reaching out. We'll get back to you at <span className="text-cyan-300">{form.email}</span> within 24 hours.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }); }}
                  >
                    Send Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="fancy-card p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input
                        className={field}
                        placeholder="Sara Al-Amin"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        className={field}
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subject</label>
                    <select
                      className={field}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      {SUBJECTS.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      rows={5}
                      className={`${field} resize-none`}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-shimmer w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <FaPaperPlane className="w-4 h-4" />
                    )}
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Frequently Asked</h2>
              <p className="text-slate-400 text-sm mb-8">Quick answers to the most common questions.</p>

              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="fancy-card overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-sm font-semibold text-white leading-snug">{faq.q}</span>
                      {openFaq === i
                        ? <FaChevronUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        : <FaChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Social strip */}
              <div className="mt-10 fancy-card p-6 flex items-center gap-5">
                <p className="text-sm text-slate-400 flex-1">Follow our work and stay updated on impact stories.</p>
                <div className="flex gap-3">
                  <a href="https://twitter.com/sheltraorg" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/12 transition-all">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com/company/sheltra" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/12 transition-all">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                  <a href="https://github.com/sheltraorg" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/12 transition-all">
                    <FaGithub className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-brand-primary text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Make an Impact?</h2>
          <p className="text-cyan-100 text-base mb-7 max-w-xl mx-auto">
            Join thousands of organisations and individuals already using Sheltra to restore economic dignity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ActionButton variant="primary" onClick={() => navigate('/register')}>
              GET STARTED
            </ActionButton>
            <Button size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10" onClick={() => navigate('/about')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
