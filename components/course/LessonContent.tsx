"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils/cn";
import GlassCard from "@/components/ui/GlassCard";
import WorkflowCopier from "@/components/course/WorkflowCopier";
import QuizViewer from "@/components/course/QuizViewer";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctIndex: number;
}

interface LessonContentProps {
  lessonId: string;
  title: string;
  markdownContent: string;
  n8nWorkflowJson?: string | object;
  n8nWorkflowTitle?: string;
  quiz?: QuizQuestion[];
  completed: boolean;
  previousLessonId?: string;
  nextLessonId?: string;
  onNavigate?: (lessonId: string) => void;
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4">
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-3 top-3 flex items-center gap-1 rounded-lg border px-2 py-1 text-xs",
          "opacity-0 transition-all duration-200 group-hover:opacity-100",
          copied
            ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
            : "border-gray-300/50 bg-white/60 text-gray-500 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
        )}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
      <pre
        className={cn(
          "overflow-x-auto rounded-xl p-4 text-sm",
          "border bg-gray-100/60 border-gray-200/50 text-gray-800",
          "dark:border-white/8 dark:bg-white/5 dark:text-gray-200",
          className
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function LessonContent({
  lessonId,
  title,
  markdownContent,
  n8nWorkflowJson,
  n8nWorkflowTitle,
  quiz,
  completed,
  previousLessonId,
  nextLessonId,
  onNavigate,
}: LessonContentProps) {
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          completed: true,
        }),
      });
      setIsCompleted(true);
    } catch {
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white/90">{title}</h1>

      <GlassCard padding="lg">
        <div
          className={cn(
            "prose max-w-none",
            "prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white/90",
            "prose-p:text-gray-700 prose-p:leading-relaxed dark:prose-p:text-white/70",
            "prose-a:text-[#1E90FF] prose-a:no-underline hover:prose-a:underline",
            "prose-strong:text-gray-900 dark:prose-strong:text-white/90",
            "prose-li:text-gray-700 dark:prose-li:text-white/70",
            "prose-blockquote:border-l-[#FF6D5A] prose-blockquote:text-gray-600 dark:prose-blockquote:text-white/60",
            "prose-img:rounded-xl prose-img:border prose-img:border-gray-200/50 dark:prose-img:border-white/10"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ children }) => <>{children}</>,
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code
                      className="rounded-md border px-1.5 py-0.5 text-sm bg-gray-100/60 border-gray-200/50 text-orange-700 dark:bg-white/8 dark:border-white/10 dark:text-[#FF8A7A]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <CodeBlock className={className}>{children}</CodeBlock>
                );
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </GlassCard>

      {n8nWorkflowJson && (
        <WorkflowCopier
          workflowJson={n8nWorkflowJson}
          title={n8nWorkflowTitle || "Workflow N8N"}
        />
      )}

      {quiz && quiz.length > 0 && (
        <QuizViewer questions={quiz} lessonId={lessonId} />
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={handleMarkComplete}
          disabled={isCompleted || markingComplete}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-6 py-3",
            "text-sm font-medium backdrop-blur-xl transition-all duration-300",
            isCompleted
              ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 cursor-default"
              : "border-[#FF6D5A]/30 bg-[#FF6D5A]/10 text-[#FF6D5A] hover:bg-[#FF6D5A]/20 hover:-translate-y-0.5"
          )}
        >
          <CheckCircle2 size={16} />
          {isCompleted
            ? "Completada"
            : markingComplete
            ? "Guardando..."
            : "Marcar como completada"}
        </button>

        <div className="flex items-center gap-3">
          {previousLessonId && (
            <button
              onClick={() => onNavigate?.(previousLessonId)}
              className={cn(
                "flex items-center gap-1 rounded-xl border px-4 py-2.5",
                "text-sm backdrop-blur-xl transition-all duration-200",
                "border-gray-200/50 bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-900",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
          )}
          {nextLessonId && (
            <button
              onClick={() => onNavigate?.(nextLessonId)}
              className={cn(
                "flex items-center gap-1 rounded-xl border px-4 py-2.5",
                "text-sm backdrop-blur-xl transition-all duration-200",
                "border-gray-200/50 bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-900",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
