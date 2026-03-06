import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const roleColors = {
    ADMIN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SUPER_ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <Link
          href="/admin/users/new"
          className="px-6 py-3 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300"
        >
          + New User
        </Link>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--blue-800)]/50 border-b border-[var(--blue-500)]/20">
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--blue-500)]/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-white/60">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--blue-800)]/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-white/80">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${roleColors[user.role]}`}>
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={user.id}
                        endpoint="/api/users"
                        itemName={user.name}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
