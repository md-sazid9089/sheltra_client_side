import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

const noteSchema = z.object({
  note: z.string().min(3, 'Note must be at least 3 characters'),
});

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch single case (falls back to placeholder)
  const { data: caseData, isLoading } = useQuery({
    queryKey: ['ngo-case', id],
    queryFn: () => api.get(`/ngo/cases`).then((r) => {
      const cases = r.data;
      return Array.isArray(cases) ? cases.find((c) => String(c.id) === String(id)) : null;
    }),
    retry: false,
    placeholderData: {
      id: Number(id),
      name: 'Amara Mensah',
      location: 'Nairobi, Kenya',
      skills: ['Python', 'React', 'Data Analysis'],
      languages: ['English', 'French'],
      bio: 'Experienced software developer seeking new opportunities after displacement. Passionate about using technology to create social impact.',
      education: 'BSc Computer Science, University of Nairobi, 2019',
      work_experience: 'Software Developer at TechCorp (2019–2022)',
      verified: false,
      submitted: '2026-02-28',
      notes: [
        { id: 1, text: 'Initial review complete. Identity documents checked.', created_at: '2026-02-28', author: 'Sarah K.' },
      ],
    },
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: () => api.post(`/ngo/verify/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ngo-cases'] });
      queryClient.invalidateQueries({ queryKey: ['ngo-case', id] });
      toast('Profile verified successfully!', 'success');
    },
    onError: () => toast('Verification failed. Please try again.', 'error'),
  });

  // Add note mutation
  const noteMutation = useMutation({
    mutationFn: (data) => api.post(`/ngo/cases/${id}/notes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ngo-case', id] });
      toast('Note added successfully!', 'success');
      reset();
    },
    onError: () => toast('Failed to add note.', 'error'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: '' },
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

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Case not found.</p>
        <Button variant="ghost" onClick={() => navigate('/ngo/cases')} className="mt-4">
          ← Back to Cases
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 motion-safe-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/ngo/cases')} className="text-sm text-brand-primary hover:underline mb-2 inline-block">
            ← Back to Cases
          </button>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">
            {caseData.name}
          </h1>
          <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
            Case #{caseData.id} · Submitted {caseData.submitted}
          </p>
        </div>
        <Badge variant={caseData.verified ? 'success' : 'warning'} className="text-sm px-3 py-1">
          {caseData.verified ? 'Verified' : 'Pending Verification'}
        </Badge>
      </div>

      {/* Profile details */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Profile Information</h2>
        </Card.Header>
        <Card.Body>
          <dl className="grid sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Location</dt>
              <dd className="text-sm text-text-primary dark:text-text-darkPrimary mt-1">{caseData.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Skills</dt>
              <dd className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(caseData.skills) ? caseData.skills : [caseData.skills]).map((s) => (
                  <Badge key={s} variant="primary">{s}</Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Languages</dt>
              <dd className="flex flex-wrap gap-1 mt-1">
                {(caseData.languages || []).map((l) => (
                  <Badge key={l}>{l}</Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Education</dt>
              <dd className="text-sm text-text-primary dark:text-text-darkPrimary mt-1">{caseData.education || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Bio</dt>
              <dd className="text-sm text-text-primary dark:text-text-darkPrimary mt-1">{caseData.bio || 'Not provided'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-text-muted dark:text-text-darkMuted uppercase tracking-wider">Work Experience</dt>
              <dd className="text-sm text-text-primary dark:text-text-darkPrimary mt-1">{caseData.work_experience || 'Not provided'}</dd>
            </div>
          </dl>
        </Card.Body>
      </Card>

      {/* Verification action */}
      {!caseData.verified && (
        <Card className="border-l-4 border-l-brand-accent">
          <Card.Header>
            <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Verification Action</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary mb-4">
              After reviewing the profile information and completing identity checks, mark this profile as verified.
              This action enables the individual to be matched with employer opportunities.
            </p>
            <div className="flex gap-3">
              <Button
                variant="accent"
                onClick={() => verifyMutation.mutate()}
                loading={verifyMutation.isPending}
              >
                ✓ Verify Profile
              </Button>
              <Button variant="ghost">Request More Info</Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Case notes */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-text-primary dark:text-text-darkPrimary">Case Notes</h2>
        </Card.Header>
        <Card.Body>
          {/* Existing notes */}
          <div className="space-y-3 mb-6">
            {(caseData.notes || []).map((note) => (
              <div key={note.id} className="fancy-card p-3">
                <p className="text-sm text-text-primary dark:text-text-darkPrimary">{note.text}</p>
                <p className="text-xs text-text-muted dark:text-text-darkMuted mt-1">
                  {note.author} · {note.created_at}
                </p>
              </div>
            ))}
            {(!caseData.notes || caseData.notes.length === 0) && (
              <p className="text-sm text-text-muted dark:text-text-darkMuted">No notes yet.</p>
            )}
          </div>

          {/* Add note form */}
          <form onSubmit={handleSubmit((data) => noteMutation.mutate(data))} className="space-y-3">
            <Textarea
              label="Add a Note"
              placeholder="Document verification steps, observations, or follow-up actions..."
              error={errors.note?.message}
              rows={3}
              {...register('note')}
            />
            <Button type="submit" size="sm" loading={noteMutation.isPending}>
              Add Note
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
