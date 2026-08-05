"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

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

interface QuizViewerProps {
  questions: QuizQuestion[];
  lessonId: string;
}

export default function QuizViewer({ questions, lessonId }: QuizViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const passed = score >= 70;

  const selectAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);

    setSaving(true);
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          score: percentage,
          total_questions: questions.length,
          passed: percentage >= 70,
          answers,
        }),
      });
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (submitted) {
    return (
      <GlassCard className="mt-6" padding="lg">
        <div className="flex flex-col items-center text-center">
          {passed ? (
            <CheckCircle2 size={56} className="mb-4 text-green-400" />
          ) : (
            <XCircle size={56} className="mb-4 text-red-400" />
          )}
          <h3 className="text-2xl font-bold text-white/90">
            {passed ? "¡Aprobado!" : "No aprobado"}
          </h3>
          <p className="mt-2 text-lg text-white/60">
            Puntuación: <span className="font-bold text-white/90">{score}%</span>
          </p>
          <div className="mt-4 w-full max-w-xs">
            <ProgressBar value={score} showLabel />
          </div>
          <p className="mt-3 text-xs text-white/40">
            Se requiere 70% para aprobar
          </p>
          {!passed && (
            <button
              onClick={handleRetry}
              className={cn(
                "mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5",
                "text-sm font-medium text-white/80 backdrop-blur-xl",
                "hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              )}
            >
              <RotateCcw size={16} />
              Reintentar
            </button>
          )}
          {saving && (
            <p className="mt-3 text-xs text-white/30">Guardando resultado...</p>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="mt-6" padding="lg">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-white/50">
          Pregunta {currentIndex + 1} de {questions.length}
        </span>
        <span className="text-xs text-white/30">
          {Object.keys(answers).length}/{questions.length} respondidas
        </span>
      </div>

      <ProgressBar value={progress} className="mb-6 h-1" />

      <h4 className="mb-5 text-lg font-semibold text-white/90">
        {currentQuestion.question}
      </h4>

      <div className="space-y-2.5">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => selectAnswer(currentQuestion.id, idx)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200",
              answers[currentQuestion.id] === idx
                ? "border-[#FF6D5A]/50 bg-[#FF6D5A]/10 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                answers[currentQuestion.id] === idx
                  ? "border-[#FF6D5A] bg-[#FF6D5A]"
                  : "border-white/20"
              )}
            >
              {answers[currentQuestion.id] === idx && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            {option.text}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className={cn(
            "flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2",
            "text-sm text-white/60 backdrop-blur-xl transition-all duration-200",
            "hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className={cn(
              "rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-6 py-2",
              "text-sm font-medium text-white transition-all duration-300",
              "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6D5A]/20",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            )}
          >
            Enviar Respuestas
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            className={cn(
              "flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2",
              "text-sm text-white/60 backdrop-blur-xl transition-all duration-200",
              "hover:bg-white/10"
            )}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </GlassCard>
  );
}
