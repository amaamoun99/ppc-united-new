import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UserForm from '@/components/admin/forms/UserForm';

export default async function EditUserPage({ params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit User</h1>
        <p className="text-[var(--blue-400)]">Update user information</p>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-8">
        <UserForm initialData={user} />
      </div>
    </div>
  );
}
