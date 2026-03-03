import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

const profileSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  location: z.string().min(2, 'Location is required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  description: z.string().max(1000).optional(),
  contact_email: z.string().email('Enter a valid email'),
});

export default function EmployerProfile() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: profile } = useQuery({
    queryKey: ['employer-profile'],
    queryFn: () => api.get('/employer/profile').then((r) => r.data),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      profile?.id
        ? api.put('/employer/profile', data)
        : api.post('/employer/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });
      toast('Company profile saved!', 'success');
    },
    onError: () => toast('Failed to save profile.', 'error'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: profile || undefined,
  });



  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Company Profile</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Complete your company profile so candidates know who you are.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5 p-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Company Name" error={errors.company_name?.message} {...register('company_name')} />
            <Input label="Industry" placeholder="Technology, Healthcare, etc." error={errors.industry?.message} {...register('industry')} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Location" placeholder="Nairobi, Kenya" error={errors.location?.message} {...register('location')} />
            <Input label="Website" placeholder="https://example.com" error={errors.website?.message} {...register('website')} />
          </div>
          <Input label="Contact Email" type="email" error={errors.contact_email?.message} {...register('contact_email')} />
          <Textarea label="Company Description" placeholder="Tell candidates about your company, mission, and culture..." rows={4} error={errors.description?.message} {...register('description')} />

          <div className="flex justify-end">
            <Button type="submit" loading={mutation.isPending}>Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
