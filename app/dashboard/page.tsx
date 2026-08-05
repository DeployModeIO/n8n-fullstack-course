import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth/server';
import { modules } from '@/content/modules';
import { Clock, BookOpen, Trophy, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = createClient();
  const totalLessons = modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );
  const totalMinutes = modules.reduce(
    (sum, m) =>
      sum + m.lessons.reduce((s, l) => s + l.estimatedMinutes, 0),
    0
  );

  let completedLessonIds = new Set<string>();
  try {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .eq('user_id', session.userId)
      .eq('completed', true);

    completedLessonIds = new Set(
      progress?.map((p: { lesson_id: string }) => p.lesson_id) ?? []
    );
  } catch {}

  const completedLessons = completedLessonIds.size;
  const overallPercent = Math.round(
    (completedLessons / totalLessons) * 100
  );

  const moduleProgress = modules.map((mod) => {
    const completed = mod.lessons.filter((l) =>
      completedLessonIds.has(l.id)
    ).length;
    const percent = Math.round((completed / mod.lessons.length) * 100);
    return { ...mod, completed, percent };
  });

  const userName = session.email?.split('@')[0] || 'Estudiante';

  let certificate: {
    certificateNo: string;
    verificationUrl: string;
    issuedAt: string;
  } | null = null;
  try {
    const { data: cert } = await supabase
      .from('certificates')
      .select('certificate_no, verification_url, issued_at')
      .eq('user_id', session.userId)
      .order('issued_at', { ascending: false })
      .maybeSingle();
    if (cert) {
      certificate = {
        certificateNo: cert.certificate_no,
        verificationUrl: cert.verification_url,
        issuedAt: cert.issued_at,
      };
    }
  } catch {}

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          Hola, {userName}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Continúa donde lo dejaste y avanza en tu camino a dominar N8N.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6D5A]/10">
            <BookOpen size={24} className="text-[#FF6D5A]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLessons}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Lecciones</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EA4B71]/10">
            <Clock size={24} className="text-[#EA4B71]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMinutes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Minutos de contenido</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E90FF]/10">
            <Trophy size={24} className="text-[#1E90FF]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedLessons}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completadas</p>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-gray-900 dark:text-white">Progreso General</span>
          <span className="text-sm text-[#FF6D5A]">
            {completedLessons}/{totalLessons} lecciones ({overallPercent}%)
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {certificate ? (
        <div className="mb-10 flex items-center gap-4 rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-r from-[#1E90FF]/10 to-[#FF6D5A]/10 border border-[#1E90FF]/30">
          <Award size={36} className="text-[#1E90FF]" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              ¡Certificado emitido!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Código {certificate.certificateNo} ·{' '}
              {new Date(certificate.issuedAt).toLocaleDateString('es')}
            </p>
          </div>
          <a
            href={certificate.verificationUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-4 py-2 text-sm font-medium text-white"
          >
            Ver certificado
          </a>
        </div>
      ) : (
        <div className="mb-10 rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Examen Final
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aprueba con 70% para obtener tu certificación verificable.
              </p>
            </div>
            <Link
              href="/examen-final"
              className="rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-5 py-2.5 text-sm font-medium text-white"
            >
              Rendir examen
            </Link>
          </div>
        </div>
      )}

      <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Módulos del Curso</h2>
      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {moduleProgress.map((mod) => (
          <div
            key={mod.slug}
            className="flex flex-col rounded-2xl p-6 transition backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg hover:border-[#FF6D5A]/30 dark:bg-white/10 dark:border-white/15 dark:shadow-none"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{mod.title}</h3>
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
              {mod.lessons.length} lecciones
            </p>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-500">
              {mod.completed}/{mod.lessons.length} completadas
            </p>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] transition-all duration-500"
                style={{ width: `${mod.percent}%` }}
              />
            </div>
            <Link
              href={`/course/${mod.slug}`}
              className="mt-auto inline-block rounded-lg bg-[#FF6D5A]/10 px-4 py-2 text-center text-sm font-semibold text-[#FF6D5A] transition hover:bg-[#FF6D5A]/20"
            >
              {mod.completed > 0 ? 'Continuar' : 'Comenzar'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
