import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  location: z.string().min(2, 'Location is required'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
  skills: z.string().min(1, 'At least one skill is required'),
  languages: z.string().min(1, 'At least one language is required'),
  education: z.string().optional(),
  work_experience: z.string().optional(),
  availability: z.string().optional(),
});

export default function ProfileForm() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: profile } = useQuery({
    queryKey: ['refugee-profile'],
    queryFn: () => api.get('/refugee/profile').then((r) => r.data),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        skills: data.skills.split(',').map((s) => s.trim()),
        languages: data.languages.split(',').map((l) => l.trim()),
      };
      return profile?.id
        ? api.put('/refugee/profile', payload)
        : api.post('/refugee/profile', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refugee-profile'] });
      toast('Profile saved successfully!', 'success');
    },
    onError: () => {
      toast('Failed to save profile. Please try again.', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          full_name: profile.full_name || '',
          location: profile.location || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
          languages: Array.isArray(profile.languages) ? profile.languages.join(', ') : '',
          education: profile.education || '',
          work_experience: profile.work_experience || '',
          availability: profile.availability || '',
        }
      : undefined,
  });



  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
          My Skill Profile
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Build your verified profile to unlock matched opportunities.
        </p>
      </div>

      {/* Face verification placeholder */}
      <Card className="border-l-4 border-l-brand-accent">
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Identity Verification (Placeholder)
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                Face verification will be available once your NGO partner initiates the process.
                This is a placeholder UI — no biometric data is collected.
              </p>
              <Button size="sm" variant="ghost" className="mt-2" disabled>
                Start Verification (Coming Soon)
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Profile form */}
      <Card>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5 p-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full Name" error={errors.full_name?.message} {...register('full_name')} />
            <Input label="Location" placeholder="Nairobi, Kenya" error={errors.location?.message} {...register('location')} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Phone (optional)" type="tel" placeholder="+254 700 000 000" {...register('phone')} />
            <Select
              label="Availability"
              options={[
                { value: 'immediate', label: 'Immediately Available' },
                { value: '2_weeks', label: 'Available in 2 Weeks' },
                { value: '1_month', label: 'Available in 1 Month' },
                { value: 'not_available', label: 'Not Currently Available' },
              ]}
              {...register('availability')}
            />
          </div>
          <Textarea label="Bio" placeholder="Tell employers about yourself, your strengths, and your goals..." error={errors.bio?.message} rows={3} {...register('bio')} />
          <Input label="Skills (comma-separated)" placeholder="Python, React, Data Analysis, Project Management" error={errors.skills?.message} {...register('skills')} />
          <Input label="Languages (comma-separated)" placeholder="English, French, Arabic" error={errors.languages?.message} {...register('languages')} />
          <Textarea label="Education" placeholder="BSc Computer Science, University of Nairobi, 2019" rows={2} {...register('education')} />
          <Textarea label="Work Experience" placeholder="Software Developer at TechCorp, 2019—2022: Built web applications..." rows={3} {...register('work_experience')} />

          <div className="flex justify-end">
            <Button type="submit" loading={mutation.isPending}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
