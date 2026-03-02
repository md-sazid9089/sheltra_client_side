import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 motion-safe-fade-in">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-text-secondary dark:text-text-darkSecondary">
            Sign in to continue your journey with Sheltra
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-input bg-semantic-error-light dark:bg-red-900/30 text-semantic-error text-sm" role="alert">
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

        <p className="mt-6 text-center text-sm text-text-secondary dark:text-text-darkSecondary">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-primary hover:underline">
            Create one
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 pt-5 border-t border-border-light dark:border-border-dark">
          <p className="text-xs font-semibold text-text-muted dark:text-text-darkMuted uppercase tracking-wider mb-3 text-center">
            Demo Accounts (password: <code className="text-brand-primary">demo1234</code>)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Refugee', email: 'refugee@sheltra.dev', color: 'bg-blue-50 dark:bg-blue-900/30 text-brand-primary' },
              { label: 'NGO', email: 'ngo@sheltra.dev', color: 'bg-teal-50 dark:bg-teal-900/30 text-brand-accent' },
              { label: 'Employer', email: 'employer@sheltra.dev', color: 'bg-amber-50 dark:bg-amber-900/30 text-brand-amber' },
              { label: 'Admin', email: 'admin@sheltra.dev', color: 'bg-red-50 dark:bg-red-900/30 text-semantic-error' },
            ].map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => onSubmit({ email: demo.email, password: 'demo1234' })}
                className={`px-3 py-2 rounded-btn text-xs font-semibold transition-colors hover-lift ${demo.color}`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
