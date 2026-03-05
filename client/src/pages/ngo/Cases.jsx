import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table } from '@/components/ui/Table';

export default function Cases() {
  const navigate = useNavigate();

  const { data: cases } = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: () => api.get('/ngo/cases').then((r) => r.data),
    retry: false,
    initialData: [
      { id: 1, name: 'Amara Mensah', location: 'Nairobi', skills: 'Python, React', verified: false, submitted: '2026-02-28' },
      { id: 2, name: 'Fatima Al-Rashid', location: 'Amman', skills: 'Nursing, Arabic', verified: true, submitted: '2026-02-25' },
      { id: 3, name: 'Daniel Osei', location: 'Accra', skills: 'Electrician, English', verified: false, submitted: '2026-03-01' },
      { id: 4, name: 'Hana Tadesse', location: 'Addis Ababa', skills: 'Teaching, Amharic', verified: true, submitted: '2026-02-20' },
    ],
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'skills', label: 'Skills' },
    {
      key: 'verified',
      label: 'Status',
      render: (val) => (
        <Badge variant={val ? 'success' : 'warning'}>
          {val ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    { key: 'submitted', label: 'Submitted' },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/ngo/cases/${row.id}`)}>
          View →
        </Button>
      ),
    },
  ];



  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Cases</h1>
          <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
            Review and verify refugee profiles
          </p>
        </div>
      </div>

      {(!cases || cases.length === 0) ? (
        <EmptyState
          title="No Cases Yet"
          description="Cases will appear here when refugees submit their profiles for verification."
          icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
      ) : (
        <Table columns={columns} data={cases} onRowClick={(row) => navigate(`/ngo/cases/${row.id}`)} />
      )}
    </div>
  );
}
