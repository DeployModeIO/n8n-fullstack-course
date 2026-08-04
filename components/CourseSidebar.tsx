"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { modules as courseModules } from "@/content/modules";

interface CourseSidebarProps {
  currentModule: string;
  currentLesson?: string;
  className?: string;
}

export default function CourseSidebar({
  currentModule,
  currentLesson,
  className,
}: CourseSidebarProps) {
  const router = useRouter();

  const sidebarModules = courseModules.map((mod) => ({
    id: mod.slug,
    title: mod.title,
    lessons: mod.lessons.map((lesson) => ({
      id: `${mod.slug}/${lesson.slug}`,
      title: lesson.title,
      estimatedTime: `${lesson.estimatedMinutes} min`,
      completed: false,
      active:
        currentModule === mod.slug && currentLesson === lesson.slug,
    })),
  }));

  const handleLessonClick = (lessonId: string) => {
    router.push(`/course/${lessonId}`);
  };

  return (
    <Sidebar
      modules={sidebarModules}
      onLessonClick={handleLessonClick}
      className={className}
    />
  );
}
