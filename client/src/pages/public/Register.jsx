import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FaCheckCircle, FaStar, FaUserFriends, FaLock } from 'react-icons/fa';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['refugee', 'ngo', 'employer'], { required_error: 'Please select a role' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const result = await authRegister(payload);
      const role = result?.user?.role || data.role;
      const dashboardMap = {
        refugee: '/refugee/dashboard',
        ngo: '/ngo/dashboard',
        employer: '/employer/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(dashboardMap[role] || '/', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: FaUserFriends, text: 'Join 12,000+ refugees building new futures' },
    { icon: FaCheckCircle, text: 'NGO-verified profiles trusted by top employers' },
    { icon: FaLock, text: 'Your data is encrypted and stays private' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] -mt-20 pt-20 motion-safe-fade-in">

      {/* ── Left branding panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-900/80 to-teal-950/70" />

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <FaStar className="text-cyan-400 text-xl" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Sheltra</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Start Your<br />
            <span className="text-cyan-400">New Chapter</span>
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-10">
            Whether you&apos;re seeking employment, supporting refugees, or hiring talent — Sheltra is your platform.
          </p>

          <div className="w-full space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-left">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Icon className="text-cyan-400" />
                </div>
                <span className="text-slate-200 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-8">
            {[['Free', 'Always'], ['2 min', 'Setup'], ['24/7', 'Support']].map(([num, label]) => (
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
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-slate-400">Start building a dignified pathway today</p>
          </div>

          {serverError && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Amara Mensah"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="I am a..."
              placeholder="Select your role"
              options={[
                { value: 'refugee', label: 'Displaced Individual / Refugee' },
                { value: 'ngo', label: 'NGO Partner' },
                { value: 'employer', label: 'Employer' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
