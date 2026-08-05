"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  estimatedTime: string;
  completed: boolean;
  active?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface SidebarProps {
  modules: Module[];
  onLessonClick?: (lessonId: string) => void;
  className?: string;
}

export default function Sidebar({
  modules,
  onLessonClick,
  className,
}: SidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );
  const [collapsed, setCollapsed] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  if (collapsed) {
    return (
      <div
        className={cn(
          "flex h-full w-12 flex-col items-center border-r backdrop-blur-xl py-4",
          "bg-white/70 border-gray-200/50",
          "dark:bg-white/10 dark:border-white/15",
          className
        )}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-all"
        >
          <PanelLeftOpen size={18} />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r backdrop-blur-xl overflow-hidden",
        "bg-white/70 border-gray-200/50",
        "dark:bg-white/10 dark:border-white/15",
        className
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3 border-gray-200/50 dark:border-white/15">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white/90">Contenido del Curso</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-all lg:hidden"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10">
        {modules.map((module) => {
          const isExpanded = expandedModules.has(module.id);
          const progress = getModuleProgress(module);

          return (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left",
                  "hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                )}
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="shrink-0 text-gray-500 dark:text-white/50" />
                ) : (
                  <ChevronRight size={14} className="shrink-0 text-gray-500 dark:text-white/50" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800 dark:text-white/80">
                    {module.title}
                  </p>
                  <div className="mt-1">
                    <ProgressBar value={progress} className="h-1" />
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-gray-500 dark:text-white/40">
                  {progress}%
                </span>
              </button>

              {isExpanded && (
                <div className="ml-3 mt-1 space-y-0.5 border-l pl-3 border-gray-200 dark:border-white/5">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonClick?.(lesson.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all duration-200",
                        lesson.active
                          ? "bg-[#FF6D5A]/15 border border-[#FF6D5A]/30"
                          : "hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <CheckCircle2
                        size={14}
                        className={cn(
                          "shrink-0",
                          lesson.completed
                            ? "text-[#FF6D5A]"
                            : "text-gray-300 dark:text-white/20"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-xs",
                            lesson.active
                              ? "font-medium text-[#FF6D5A]"
                              : lesson.completed
                              ? "text-gray-600 dark:text-white/60"
                              : "text-gray-700 dark:text-white/70"
                          )}
                        >
                          {lesson.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <Clock size={10} className="text-gray-400 dark:text-white/30" />
                          <span className="text-[10px] text-gray-400 dark:text-white/30">
                            {lesson.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
