export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lab {
  id: string;
  title: string;
  objective: string;
  instructions: string;
  starterWorkflowJson?: object;
  deliverable: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  labs?: Lab[];
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
