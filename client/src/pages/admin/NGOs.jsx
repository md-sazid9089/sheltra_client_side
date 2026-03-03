import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';

export default function NGOs() {
  const { data: ngos, isLoading } = useQuery({
    queryKey: ['admin-ngos'],
    queryFn: () => api.get('/admin/ngos').then((r) => r.data),
    retry: false,
    placeholderData: [
      { id: 1, name: 'RefugeAid International', country: 'Kenya', cases_handled: 342, status: 'active', joined: '2025-06-15' },
      { id: 2, name: 'Hope Without Borders', country: 'Jordan', cases_handled: 189, status: 'active', joined: '2025-08-20' },
      { id: 3, name: 'GreenFuture Foundation', country: 'Uganda', cases_handled: 104, status: 'active', joined: '2025-10-05' },
      { id: 4, name: 'PathForward Africa', country: 'Ghana', cases_handled: 78, status: 'pending', joined: '2026-01-12' },
    ],
  });

  const columns = [
    { key: 'name', label: 'Organization' },
    { key: 'country', label: 'Country' },
    { key: 'cases_handled', label: 'Cases Handled' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'warning'}>{val}</Badge>
      ),
    },
    { key: 'joined', label: 'Joined' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 motion-safe-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton.Card />
      </div>
    );
  }

  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">NGO Partners</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Registered verification partner organizations
        </p>
      </div>
      <Table columns={columns} data={ngos || []} />
    </div>
  );
}
