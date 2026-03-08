import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  const statusColors = {
    ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
    COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    UPCOMING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-6 py-3 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300"
        >
          + New Project
        </Link>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--blue-800)]/50 border-b border-[var(--blue-500)]/20">
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Start / Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  visible
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--blue-500)]/10">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-white/60">
                    No projects found. Create your first project!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--blue-800)]/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{project.title}</td>
                    <td className="px-6 py-4 text-white/80">{project.category}</td>
                    <td className="px-6 py-4 text-white/80">{project.location}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'}
                      {project.budget && ` / ${project.budget}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/80">{project.priority ?? 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          project.isActive !== false
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {project.isActive !== false ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={project.id}
                        endpoint="/api/projects"
                        itemName={project.title}
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
