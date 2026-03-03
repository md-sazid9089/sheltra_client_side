import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

const AI_DISCLAIMER =
  'AI supports matching and recommendations only; it does not make legal or employment decisions.';

export default function Talent() {
  const toast = useToast();
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const { data: talent } = useQuery({
    queryKey: ['employer-talent'],
    queryFn: () => api.get('/employer/talent').then((r) => r.data),
    retry: false,
    initialData: [
      { id: 1, name: 'Amara Mensah', location: 'Nairobi', skills: ['Python', 'React', 'Data Analysis'], verified: true, match_score: 92, languages: ['English', 'French'] },
      { id: 2, name: 'Fatima Al-Rashid', location: 'Amman', skills: ['Nursing', 'Community Health'], verified: true, match_score: 85, languages: ['Arabic', 'English'] },
      { id: 3, name: 'Daniel Osei', location: 'Accra', skills: ['Electrical Engineering', 'Solar Installation'], verified: true, match_score: 78, languages: ['English', 'Twi'] },
      { id: 4, name: 'Hana Tadesse', location: 'Addis Ababa', skills: ['Teaching', 'Curriculum Design'], verified: false, match_score: 74, languages: ['Amharic', 'English'] },
    ],
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ refugeeId, feedback }) =>
      api.post(`/employer/feedback/${refugeeId}`, { feedback }),
    onSuccess: () => {
      toast('Feedback submitted. Thank you!', 'success');
      setFeedbackTarget(null);
      setFeedbackText('');
    },
    onError: () => toast('Failed to send feedback.', 'error'),
  });



  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Browse Talent</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Discover verified, skilled individuals matched to your needs
        </p>
      </div>

      {/* AI Disclaimer */}
      <div className="fancy-card flex items-start gap-3 p-4">
        <svg className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-cyan-300 font-medium">{AI_DISCLAIMER}</p>
      </div>

      {(!talent || talent.length === 0) ? (
        <EmptyState
          title="No Talent Available"
          description="Verified candidates will appear here once they complete their profiles."
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {talent.map((person) => (
            <Card key={person.id} hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-lg font-bold text-brand-primary shrink-0">
                  {person.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary truncate">{person.name}</h3>
                    {person.verified && <Badge variant="success">Verified</Badge>}
                    {!person.verified && <Badge variant="warning">Pending</Badge>}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-darkSecondary">{person.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {person.skills.map((s) => (
                      <Badge key={s} variant="primary">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.languages.map((l) => (
                      <Badge key={l}>{l}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-brand-accent">
                      {person.match_score}% match
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => setFeedbackTarget(person)}>
                      Send Feedback
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      <Modal
        open={!!feedbackTarget}
        onClose={() => setFeedbackTarget(null)}
        title={`Feedback for ${feedbackTarget?.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFeedbackTarget(null)}>Cancel</Button>
            <Button
              loading={feedbackMutation.isPending}
              onClick={() =>
                feedbackMutation.mutate({
                  refugeeId: feedbackTarget?.id,
                  feedback: feedbackText,
                })
              }
              disabled={!feedbackText.trim()}
            >
              Submit Feedback
            </Button>
          </>
        }
      >
        <Textarea
          label="Your Feedback"
          placeholder="Share your thoughts on this candidate's qualifications, or request more information..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-text-muted dark:text-text-darkMuted mt-2 italic">{AI_DISCLAIMER}</p>
      </Modal>
    </div>
  );
}
