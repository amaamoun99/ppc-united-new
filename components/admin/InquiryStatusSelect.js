'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUSES = [
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function InquiryStatusSelect({ inquiryId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
      else setStatus(currentStatus);
    } catch {
      setStatus(currentStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={updating}
      className="px-3 py-2 text-sm font-semibold rounded-xl border border-[var(--blue-500)]/40 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] cursor-pointer disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
