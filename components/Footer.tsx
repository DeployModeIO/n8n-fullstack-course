import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200/50 px-4 py-8 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-500 dark:text-white/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Curso Full Stack de N8N</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/curso" className="hover:text-[#FF6D5A]">
            Curso
          </Link>
          <Link href="/certificaciones-seguridad" className="hover:text-[#FF6D5A]">
            Certificaciones de Seguridad
          </Link>
          <Link href="/examen-final" className="hover:text-[#FF6D5A]">
            Examen Final
          </Link>
          <Link href="/cookies" className="hover:text-[#FF6D5A]">
            Cookies
          </Link>
          <Link href="/privacy" className="hover:text-[#FF6D5A]">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
