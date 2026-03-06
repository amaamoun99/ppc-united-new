import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [projectsCount, newsCount, usersCount] = await Promise.all([
    prisma.project.count(),
    prisma.news.count(),
    prisma.user.count(),
  ]);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      createdAt: true,
    },
  });

  const recentNews = await prisma.news.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
  });

  const stats = [
    {
      label: 'Total Projects',
      value: projectsCount,
      icon: '🏗️',
      color: 'from-blue-600 to-blue-500',
      href: '/admin/projects',
    },
    {
      label: 'News Articles',
      value: newsCount,
      icon: '📰',
      color: 'from-purple-600 to-purple-500',
      href: '/admin/news',
    },
    {
      label: 'Admin Users',
      value: usersCount,
      icon: '👥',
      color: 'from-teal-600 to-teal-500',
      href: '/admin/users',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[var(--blue-400)]">
          Overview of your content and system statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-6 hover:border-[var(--blue-400)]/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
            <p className="text-[var(--blue-400)] font-semibold group-hover:text-white transition-colors">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-[var(--blue-400)] hover:text-[var(--blue-300)] text-sm font-semibold transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-white/60 text-sm py-4 text-center">
                No projects yet
              </p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}/edit`}
                  className="block p-3 bg-[var(--blue-800)]/30 hover:bg-[var(--blue-800)]/50 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {project.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1">
                        {project.category} • {project.status}
                      </p>
                    </div>
                    <span className="text-white/40 text-xs">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent News</h2>
            <Link
              href="/admin/news"
              className="text-[var(--blue-400)] hover:text-[var(--blue-300)] text-sm font-semibold transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.length === 0 ? (
              <p className="text-white/60 text-sm py-4 text-center">
                No articles yet
              </p>
            ) : (
              recentNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/news/${article.id}/edit`}
                  className="block p-3 bg-[var(--blue-800)]/30 hover:bg-[var(--blue-800)]/50 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {article.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1">
                        {article.published ? '✓ Published' : '○ Draft'}
                      </p>
                    </div>
                    <span className="text-white/40 text-xs">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 p-4 bg-[var(--blue-800)]/30 hover:bg-[var(--blue-800)]/50 rounded-xl transition-all"
          >
            <span className="text-2xl">➕</span>
            <span className="text-white font-semibold">New Project</span>
          </Link>
          <Link
            href="/admin/news/new"
            className="flex items-center gap-3 p-4 bg-[var(--blue-800)]/30 hover:bg-[var(--blue-800)]/50 rounded-xl transition-all"
          >
            <span className="text-2xl">📝</span>
            <span className="text-white font-semibold">New Article</span>
          </Link>
          <Link
            href="/admin/users/new"
            className="flex items-center gap-3 p-4 bg-[var(--blue-800)]/30 hover:bg-[var(--blue-800)]/50 rounded-xl transition-all"
          >
            <span className="text-2xl">👤</span>
            <span className="text-white font-semibold">New User</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
