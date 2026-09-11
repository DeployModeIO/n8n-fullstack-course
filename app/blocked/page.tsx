import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function BlockedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-500" />
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Access blocked
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        You have used up the 3 attempts allowed for the course final exam. If
        you believe this is a mistake, contact the administrator.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-6 py-3 font-medium text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
