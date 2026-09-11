import Link from 'next/link';

export const metadata = { title: 'Privacy Policy | N8N Course' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Privacy Policy
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-white/70">
        <p>
          This policy describes how the N8N Full Stack Course collects, uses and
          protects your personal data.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Data we collect
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Email address and role (created by the administrator).</li>
          <li>Course progress, completed lessons and quiz results.</li>
          <li>Exam attempts and, where applicable, the issued certificate.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          How the data is used
        </h2>
        <p>
          We use it solely to run the platform, track your progress, issue
          verifiable certificates and improve the content. We do not sell your
          data.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security
        </h2>
        <p>
          Passwords are stored with a bcrypt hash. Sessions use JWT tokens in
          httpOnly cookies. Course content includes watermarks and copy
          protection to prevent piracy.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Your rights
        </h2>
        <p>
          You can request access to, correction of, or deletion of your data by
          writing to the administrator.
        </p>

        <p className="pt-4">
          <Link href="/cookies" className="text-[#1E90FF] underline">
            View Cookie Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
