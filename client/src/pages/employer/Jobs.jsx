import { useState } from 'react';
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
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(1, 'Job type is required'),
  skills_required: z.string().min(1, 'At least one skill is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  salary_range: z.string().optional(),
});

export default function Jobs() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => api.get('/employer/jobs').then((r) => r.data),
    retry: false,
    placeholderData: [
      { id: 1, title: 'Junior Software Developer', location: 'Nairobi', type: 'Full-time', skills_required: 'Python, React', applicants: 12, status: 'active', created_at: '2026-02-20' },
      { id: 2, title: 'Data Analyst', location: 'Remote', type: 'Contract', skills_required: 'SQL, Excel, Tableau', applicants: 8, status: 'active', created_at: '2026-02-25' },
    ],
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        skills_required: data.skills_required.split(',').map((s) => s.trim()),
      };
      return api.post('/employer/jobs', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast('Job posted successfully!', 'success');
      setShowModal(false);
      reset();
    },
    onError: () => toast('Failed to post job.', 'error'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { title: '', location: '', type: '', skills_required: '', description: '', salary_range: '' },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 motion-safe-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Job Posts</h1>
          <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
            Create and manage your job opportunities
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Job Post</Button>
      </div>

      {(!jobs || jobs.length === 0) ? (
        <EmptyState
          title="No Job Posts"
          description="Create your first job post to start attracting verified talent."
          action={<Button onClick={() => setShowModal(true)}>Create Job Post</Button>}
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} hover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">{job.title}</h2>
                    <Badge variant={job.status === 'active' ? 'success' : 'default'}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                    {job.location} · {job.type}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(typeof job.skills_required === 'string' ? job.skills_required.split(',') : job.skills_required || []).map((s) => (
                      <Badge key={s.trim()} variant="primary">{s.trim()}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-text-primary dark:text-text-darkPrimary">{job.applicants || 0}</p>
                  <p className="text-xs text-text-muted dark:text-text-darkMuted">applicants</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Job Post"
      >
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <Input label="Job Title" placeholder="Junior Software Developer" error={errors.title?.message} {...register('title')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" placeholder="Nairobi, Kenya" error={errors.location?.message} {...register('location')} />
            <Select
              label="Job Type"
              options={[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
              ]}
              error={errors.type?.message}
              {...register('type')}
            />
          </div>
          <Input label="Required Skills (comma-separated)" placeholder="Python, React, SQL" error={errors.skills_required?.message} {...register('skills_required')} />
          <Input label="Salary Range (optional)" placeholder="$30,000 — $50,000" {...register('salary_range')} />
          <Textarea label="Job Description" placeholder="Describe the role, responsibilities, and what makes this opportunity unique..." error={errors.description?.message} rows={4} {...register('description')} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Post Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
