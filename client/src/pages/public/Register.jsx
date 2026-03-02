import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 motion-safe-fade-in">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
            Join Sheltra
          </h1>
          <p className="mt-2 text-sm text-text-secondary dark:text-text-darkSecondary">
            Create your account and start building a dignified pathway
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-input bg-semantic-error-light dark:bg-red-900/30 text-semantic-error text-sm" role="alert">
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

        <p className="mt-6 text-center text-sm text-text-secondary dark:text-text-darkSecondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
