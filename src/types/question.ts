export type Difficulty = 'easy' | 'moderate' | 'difficult';
export type QuizMode = 'difficulty' | 'chapter';

export interface Explanation {
  summary: string;
  lineByLine: string[];
  tip: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: Difficulty;
  chapter?: string;
  snippet: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: Explanation;
}

export interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  folder: string;
  description: string;
}

export interface DifficultyProgress {
  bestScore: number;
  totalSeen: number;
  attempts: number;
}

export interface ChapterProgress {
  bestScore: number;
  totalSeen: number;
  attempts: number;
}

export interface Progress {
  easy: DifficultyProgress;
  moderate: DifficultyProgress;
  difficult: DifficultyProgress;
  chapters: Record<string, ChapterProgress>;
}

export interface SessionResult {
  difficulty: Difficulty;
  questions: Question[];
  answers: (number | null)[];
}
