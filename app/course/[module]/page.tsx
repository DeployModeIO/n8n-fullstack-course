import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CourseSidebar from '@/components/CourseSidebar';
import { modules } from '@/content/modules';
import { CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ModulePageProps {
  params: Promise<{ module: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module: moduleSlug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const currentModule = modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) {
    redirect('/dashboard');
  }

  let completedLessonIds = new Set<string>();
  try {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true);

    completedLessonIds = new Set(
      progress?.map((p: { lesson_id: string }) => p.lesson_id) ?? []
    );
  } catch {}

  const firstIncomplete = currentModule.lessons.find(
    (l) => !completedLessonIds.has(l.id)
  );

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-12">
      <CourseSidebar currentModule={moduleSlug} />

      <div className="min-w-0 flex-1">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{currentModule.title}</h1>
          <p className="text-gray-400">{currentModule.description}</p>
        </div>

        {firstIncomplete && (
          <Link
            href={`/course/${moduleSlug}/${firstIncomplete.slug}`}
            className="mb-8 inline-block rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-6 py-3 font-semibold text-white shadow-lg shadow-[#FF6D5A]/25 transition hover:shadow-[#FF6D5A]/40 hover:-translate-y-0.5"
          >
            Comenzar: {firstIncomplete.title}
          </Link>
        )}

        <div className="glass-dark overflow-hidden rounded-2xl">
          <ul className="divide-y divide-white/5">
            {currentModule.lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.has(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/course/${moduleSlug}/${lesson.slug}`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-white/5"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {lesson.estimatedMinutes} min
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                        Completada
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
