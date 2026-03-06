import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/forms/ProjectForm';

export default async function EditProjectPage({ params }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
        <p className="text-[var(--blue-400)]">Update project information</p>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-8">
        <ProjectForm initialData={project} />
      </div>
    </div>
  );
}
