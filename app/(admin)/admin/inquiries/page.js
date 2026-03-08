import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import InquiryStatusSelect from '@/components/admin/InquiryStatusSelect';

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Inquiries</h1>
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
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[var(--blue-400)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--blue-500)]/10">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-white/60">
                    No inquiries yet. Submissions from the Get in Touch form will appear here.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-[var(--blue-800)]/30 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{inquiry.name}</td>
                    <td className="px-6 py-4 text-white/90 text-sm">{inquiry.email}</td>
                    <td className="px-6 py-4 text-white/70 text-sm">{inquiry.phone || '—'}</td>
                    <td className="px-6 py-4 text-white/70 text-sm max-w-[200px] truncate" title={inquiry.message}>
                      {inquiry.message}
                    </td>
                    <td className="px-6 py-4">
                      <InquiryStatusSelect inquiryId={inquiry.id} currentStatus={inquiry.status} />
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium transition-colors"
                      >
                        View
                      </Link>
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
