import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AuditLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => api.get('/admin/audit-logs').then((r) => r.data),
    retry: false,
    placeholderData: [
      { id: 1, action: 'PROFILE_VERIFIED', actor: 'Sarah Kim (NGO)', target: 'Amara Mensah', timestamp: '2026-03-02 14:32', ip: '192.168.1.xx' },
      { id: 2, action: 'JOB_POSTED', actor: 'TechBridge HR', target: 'Junior Developer Role', timestamp: '2026-03-02 11:15', ip: '10.0.0.xx' },
      { id: 3, action: 'USER_REGISTERED', actor: 'System', target: 'Daniel Osei', timestamp: '2026-03-01 09:45', ip: '172.16.0.xx' },
      { id: 4, action: 'MATCH_GENERATED', actor: 'AI Engine', target: 'Amara Mensah ↔ TechBridge', timestamp: '2026-03-01 08:00', ip: 'internal' },
      { id: 5, action: 'NOTE_ADDED', actor: 'Sarah Kim (NGO)', target: 'Case #1 — Amara Mensah', timestamp: '2026-02-28 16:20', ip: '192.168.1.xx' },
      { id: 6, action: 'PROFILE_UPDATED', actor: 'Fatima Al-Rashid', target: 'Self', timestamp: '2026-02-28 10:00', ip: '203.0.113.xx' },
    ],
  });

  const actionBadge = (action) => {
    const map = {
      PROFILE_VERIFIED: 'success',
      JOB_POSTED: 'primary',
      USER_REGISTERED: 'accent',
      MATCH_GENERATED: 'warning',
      NOTE_ADDED: 'default',
      PROFILE_UPDATED: 'default',
    };
    return <Badge variant={map[action] || 'default'}>{action.replace(/_/g, ' ')}</Badge>;
  };

  const columns = [
    { key: 'timestamp', label: 'Time' },
    { key: 'action', label: 'Action', render: (val) => actionBadge(val) },
    { key: 'actor', label: 'Actor' },
    { key: 'target', label: 'Target' },
    { key: 'ip', label: 'IP' },
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
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">Audit Logs</h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mt-1">
          Immutable record of all platform actions for full transparency
        </p>
      </div>
      <Table columns={columns} data={logs || []} />
    </div>
  );
}
