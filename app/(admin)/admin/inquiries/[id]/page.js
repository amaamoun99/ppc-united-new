import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InquiryStatusSelect from '@/components/admin/InquiryStatusSelect';

export default async function InquiryDetailPage({ params }) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
  });

  if (!inquiry) {
    notFound();
  }

  const dateStr = new Date(inquiry.createdAt).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/admin/inquiries"
            className="text-[var(--blue-400)] hover:text-[var(--blue-300)] text-sm font-medium mb-2 inline-block"
          >
            ← Back to Inquiries
          </Link>
          <h1 className="text-3xl font-bold text-white">Inquiry</h1>
          <p className="text-white/60 text-sm mt-1">{dateStr}</p>
        </div>
        <InquiryStatusSelect inquiryId={inquiry.id} currentStatus={inquiry.status} />
      </div>

      <div className="bg-[var(--blue-900)]/40 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider mb-2">Name</label>
              <p className="text-white font-medium">{inquiry.name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider mb-2">Email</label>
              <p className="text-white">
                <a href={`mailto:${inquiry.email}`} className="text-[var(--blue-400)] hover:underline">
                  {inquiry.email}
                </a>
              </p>
            </div>
          </div>
          {inquiry.phone && (
            <div>
              <label className="block text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider mb-2">Phone</label>
              <p className="text-white">
                <a href={`tel:${inquiry.phone}`} className="text-[var(--blue-400)] hover:underline">
                  {inquiry.phone}
                </a>
              </p>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider mb-2">Message</label>
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
