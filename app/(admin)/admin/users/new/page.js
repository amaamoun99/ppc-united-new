import UserForm from '@/components/admin/forms/UserForm';

export default function NewUserPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New User</h1>
        <p className="text-[var(--blue-400)]">Add a new admin user to the system</p>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-8">
        <UserForm />
      </div>
    </div>
  );
}
