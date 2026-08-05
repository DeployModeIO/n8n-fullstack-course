import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth/server';
import { modules } from '@/content/modules';
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CursoPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = createClient();
  const { data: progress } = await supabase
    .from('user_progress')
    .select('lesson_id, completed')
    .eq('user_id', session.userId)
    .eq('completed', true);

  const completedLessonIds = new Set(
    progress?.map((p: { lesson_id: string }) => p.lesson_id) || []
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Curso Completo de N8N
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Domina la automatización de workflows desde cero hasta nivel experto
        </p>
      </div>

      <div className="grid gap-8">
        {modules.map((mod) => {
          const totalLessons = mod.lessons.length;
          const completedLessons = mod.lessons.filter((l) =>
            completedLessonIds.has(l.id)
          ).length;
          const progressPercent = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

          return (
            <div
              key={mod.slug}
              className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/10 dark:border-white/15 dark:shadow-none"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6D5A]/10 text-[#FF6D5A]">
                      <BookOpen size={20} />
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mod.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-13">
                    {mod.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-[#FF6D5A]">
                    {progressPercent}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {completedLessons}/{totalLessons} lecciones
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="h-2 bg-gray-200 dark:bg-gray-600/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                {mod.lessons.map((lesson, index) => {
                  const isCompleted = completedLessonIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/course/${mod.slug}/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200/50 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        <span>{lesson.estimatedMinutes} min</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
