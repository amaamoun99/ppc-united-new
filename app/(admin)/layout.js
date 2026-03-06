import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-[var(--blue-950)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader session={session} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[var(--blue-950)] to-[var(--blue-900)] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
