export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleSlug: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  estimatedMinutes: number;
  videoUrl?: string;
  n8nWorkflowJson?: object;
  quiz?: QuizQuestion[];
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: string;
}
