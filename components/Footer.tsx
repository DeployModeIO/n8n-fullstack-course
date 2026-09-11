import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200/50 px-4 py-8 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 dark:text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} N8N Full Stack Course</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/courses" className="hover:text-[#FF6D5A]">
            Courses
          </Link>
          <Link href="/security-certifications" className="hover:text-[#FF6D5A]">
            Security Certifications
          </Link>
          <Link href="/final-exam" className="hover:text-[#FF6D5A]">
            Final Exam
          </Link>
          <Link href="/cookies" className="hover:text-[#FF6D5A]">
            Cookies
          </Link>
          <Link href="/privacy" className="hover:text-[#FF6D5A]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
