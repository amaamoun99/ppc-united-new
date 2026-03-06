import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">News & Media</h1>
        <Link
          href="/admin/news/new"
          className="px-6 py-3 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300"
        >
          + New Article
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
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Published Date
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
              {news.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-white/60">
                    No articles found. Create your first article!
                  </td>
                </tr>
              ) : (
                news.map((article) => (
                  <tr key={article.id} className="hover:bg-[var(--blue-800)]/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{article.title}</td>
                    <td className="px-6 py-4 text-white/80">{article.priority ?? 0}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          article.published
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/news/${article.id}/edit`}
                        className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={article.id}
                        endpoint="/api/news"
                        itemName={article.title}
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
