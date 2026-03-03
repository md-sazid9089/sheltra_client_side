import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';

export default function Users() {
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    retry: false,
    initialData: [
      { id: 1, name: 'Amara Mensah', email: 'amara@example.com', role: 'refugee', status: 'active', created_at: '2026-01-15' },
      { id: 2, name: 'Sarah Kim', email: 'sarah@ngo.org', role: 'ngo', status: 'active', created_at: '2026-01-10' },
      { id: 3, name: 'TechBridge HR', email: 'hr@techbridge.com', role: 'employer', status: 'active', created_at: '2026-02-01' },
      { id: 4, name: 'Fatima Al-Rashid', email: 'fatima@example.com', role: 'refugee', status: 'active', created_at: '2026-02-10' },
      { id: 5, name: 'Daniel Osei', email: 'daniel@example.com', role: 'refugee', status: 'suspended', created_at: '2026-02-20' },
    ],
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => {
        const map = { refugee: 'primary', ngo: 'accent', employer: 'warning', admin: 'error' };
        return <Badge variant={map[val] || 'default'}>{val}</Badge>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'active' ? 'success' : 'error'}>{val}</Badge>
      ),
    },
    { key: 'created_at', label: 'Joined' },
  ];



  return (
    <div className="space-y-6 motion-safe-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Users</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          All registered platform users
        </p>
      </div>
      <Table columns={columns} data={users || []} />
    </div>
  );
}
