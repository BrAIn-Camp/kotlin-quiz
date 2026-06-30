import { useState, useCallback } from 'react';
import type { Progress, DifficultyProgress, Difficulty } from '../types/question';

const STORAGE_KEY = 'kotlin-quiz-progress';

const defaultProgress = (): DifficultyProgress => ({
  bestScore: 0,
  totalSeen: 0,
  attempts: 0,
});

const initialProgress = (): Progress => ({
  easy: defaultProgress(),
  moderate: defaultProgress(),
  difficult: defaultProgress(),
});

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress();
    return JSON.parse(raw) as Progress;
  } catch {
    return initialProgress();
  }
}

function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const recordSession = useCallback(
    (difficulty: Difficulty, score: number, total: number) => {
      setProgress(prev => {
        const tier = prev[difficulty];
        const updated: Progress = {
          ...prev,
          [difficulty]: {
            bestScore: Math.max(tier.bestScore, score),
            totalSeen: total,
            attempts: tier.attempts + 1,
          },
        };
        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    const fresh = initialProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  // A tier is unlocked when the previous tier has a best score >= 70% of its questions
  const isUnlocked = useCallback(
    (difficulty: Difficulty): boolean => {
      if (difficulty === 'easy') return true;
      if (difficulty === 'moderate') {
        const { bestScore, totalSeen } = progress.easy;
        return totalSeen > 0 && bestScore / totalSeen >= 0.7;
      }
      // difficult
      const { bestScore, totalSeen } = progress.moderate;
      return totalSeen > 0 && bestScore / totalSeen >= 0.7;
    },
    [progress]
  );

  return { progress, recordSession, resetProgress, isUnlocked };
}
