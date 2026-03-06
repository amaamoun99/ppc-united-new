import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NewsForm from '@/components/admin/forms/NewsForm';

export default async function EditNewsPage({ params }) {
  const article = await prisma.news.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Article</h1>
        <p className="text-[var(--blue-400)]">Update article information</p>
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl p-8">
        <NewsForm initialData={article} />
      </div>
    </div>
  );
}
