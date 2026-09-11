import Link from 'next/link';

export const metadata = { title: 'Cookie Policy | N8N Course' };

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Cookie Policy
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-white/70">
        <p>
          This policy explains which cookies the N8N Full Stack Course uses and
          what they are for.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          What are cookies?
        </h2>
        <p>
          They are small files a website stores in your browser to remember
          information about your visit.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Types of cookies we use
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Necessary cookies:</strong> keep your session authenticated
            (the <code>session</code> cookie) and remember your light/dark theme
            preference. They cannot be disabled.
          </li>
          <li>
            <strong>Consent cookie:</strong> records your choice in the cookies
            banner (<code>cookie_consent</code>).
          </li>
          <li>
            <strong>Analytics cookies:</strong> only with your consent, they help
            us understand which content improves learning.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Managing cookies
        </h2>
        <p>
          You can change your decision at any time by deleting this
          site&apos;s cookies in your browser, or by contacting the
          administrator. The consent banner will appear again the next time you
          open the site.
        </p>

        <p className="pt-4">
          <Link href="/privacy" className="text-[#1E90FF] underline">
            View Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
