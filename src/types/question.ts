export type Difficulty = 'easy' | 'moderate' | 'difficult';

export interface Explanation {
  summary: string;
  lineByLine: string[];
  tip: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: Difficulty;
  snippet: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: Explanation;
}

export interface DifficultyProgress {
  bestScore: number;
  totalSeen: number;
  attempts: number;
}

export interface Progress {
  easy: DifficultyProgress;
  moderate: DifficultyProgress;
  difficult: DifficultyProgress;
}

export interface SessionResult {
  difficulty: Difficulty;
  questions: Question[];
  answers: (number | null)[];
}
