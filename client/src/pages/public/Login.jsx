import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FaShieldAlt, FaHandshake, FaGlobe, FaStar } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const result = await login(data);
      const role = result?.user?.role || result?.role;
      const dashboardMap = {
        refugee: '/refugee/dashboard',
        ngo: '/ngo/dashboard',
        employer: '/employer/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(dashboardMap[role] || from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FaShieldAlt, text: 'Verified skill profiles trusted by 340+ employers' },
    { icon: FaHandshake, text: 'NGO-backed case management for every refugee' },
    { icon: FaGlobe, text: 'Operating across 28 countries and growing' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] -mt-20 pt-20 motion-safe-fade-in">

      {/* ── Left branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-cyan-950/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <FaStar className="text-cyan-400 text-xl" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Sheltra</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Redefining the<br />
            <span className="text-cyan-400">Refugee Journey</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-10">
            Connecting displaced individuals with verified opportunities, trusted NGOs, and compassionate employers worldwide.
          </p>

          {/* Feature list */}
          <div className="w-full space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Icon className="text-cyan-400" />
                </div>
                <span className="text-slate-200 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom stat strip */}
          <div className="mt-10 flex gap-8">
            {[['12k+', 'Refugees'], ['340+', 'Employers'], ['156', 'NGOs']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{num}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-950 overflow-y-auto py-12 px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <FaStar className="text-cyan-400" />
            </div>
            <span className="text-2xl font-extrabold text-white">Sheltra</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-slate-400">Sign in to continue your journey</p>
          </div>

          {serverError && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Demo Accounts &mdash; password: <code className="text-cyan-400">demo1234</code>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Refugee', email: 'refugee@sheltra.dev', cls: 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20' },
                { label: 'NGO', email: 'ngo@sheltra.dev', cls: 'bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20' },
                { label: 'Employer', email: 'employer@sheltra.dev', cls: 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20' },
                { label: 'Admin', email: 'admin@sheltra.dev', cls: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' },
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => onSubmit({ email: demo.email, password: 'demo1234' })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${demo.cls}`}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
