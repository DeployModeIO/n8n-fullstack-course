import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth/server';
import CourseSidebar from '@/components/CourseSidebar';
import LessonContent from '@/components/course/LessonContent';
import { modules } from '@/content/modules';

export const dynamic = 'force-dynamic';

interface LessonPageProps {
  params: Promise<{ module: string; lesson: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;

  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const supabase = createClient();

  const currentModule = modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) {
    redirect('/dashboard');
  }

  const lessonIndex = currentModule.lessons.findIndex(
    (l) => l.slug === lessonSlug
  );
  if (lessonIndex === -1) {
    redirect(`/course/${moduleSlug}`);
  }

  const lesson = currentModule.lessons[lessonIndex];
  const previousLesson =
    lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < currentModule.lessons.length - 1
      ? currentModule.lessons[lessonIndex + 1]
      : null;

  let isCompleted = false;
  try {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('completed')
      .eq('user_id', session.userId)
      .eq('lesson_id', lesson.id)
      .maybeSingle();
    isCompleted = progress?.completed ?? false;

    await supabase.from('user_progress').upsert({
      user_id: session.userId,
      lesson_id: lesson.id,
      last_accessed_at: new Date().toISOString(),
      completed: isCompleted,
    }, { onConflict: 'user_id,lesson_id' });
  } catch {}

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-12">
      <CourseSidebar
        currentModule={moduleSlug}
        currentLesson={lessonSlug}
      />

      <div className="min-w-0 flex-1">
        <LessonContent
          lessonId={lesson.id}
          title={lesson.title}
          markdownContent={lesson.content}
          n8nWorkflowJson={lesson.n8nWorkflowJson}
          n8nWorkflowTitle={`Workflow: ${lesson.title}`}
          quiz={lesson.quiz?.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options.map((opt, idx) => ({
              id: `${q.id}-opt-${idx}`,
              text: opt,
            })),
            correctIndex: q.correctIndex,
          }))}
          completed={isCompleted}
          previousLessonId={previousLesson ? `${moduleSlug}/${previousLesson.slug}` : undefined}
          nextLessonId={nextLesson ? `${moduleSlug}/${nextLesson.slug}` : undefined}
        />
      </div>
    </div>
  );
}
