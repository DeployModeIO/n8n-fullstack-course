import { createClient } from '@/lib/supabase/server';
import { Users, Mail, Clock, UserPlus } from 'lucide-react';

interface RecentUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: invitationsCount } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCount } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    totalUsers: usersCount || 0,
    totalInvitations: invitationsCount || 0,
    pendingInvitations: pendingCount || 0,
  };

  const statCards = [
    {
      label: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: '#FF6D5A',
    },
    {
      label: 'Total Invitaciones',
      value: stats.totalInvitations,
      icon: Mail,
      color: '#EA4B71',
    },
    {
      label: 'Invitaciones Pendientes',
      value: stats.pendingInvitations,
      icon: Clock,
      color: '#1E90FF',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-[#FF6D5A]" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Usuarios Recientes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Email
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Rol
                </th>
                <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400">
                  Registrado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {(recentUsers || []).map((user: RecentUser) => (
                <tr key={user.id}>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full bg-[#FF6D5A]/10 px-2 py-0.5 text-xs font-medium text-[#FF6D5A]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
              {(!recentUsers || recentUsers.length === 0) && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
