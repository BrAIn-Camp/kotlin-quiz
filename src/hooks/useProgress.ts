import { useState, useCallback } from 'react';
import type { Progress, DifficultyProgress, ChapterProgress, Difficulty } from '../types/question';

const STORAGE_KEY = 'kotlin-quiz-progress';

const defaultTier = (): DifficultyProgress => ({ bestScore: 0, totalSeen: 0, attempts: 0 });
const defaultChapter = (): ChapterProgress => ({ bestScore: 0, totalSeen: 0, attempts: 0 });

const initialProgress = (): Progress => ({
  easy: defaultTier(),
  moderate: defaultTier(),
  difficult: defaultTier(),
  chapters: {},
});

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress();
    const parsed = JSON.parse(raw) as Progress;
    if (!parsed.chapters) parsed.chapters = {};
    return parsed;
  } catch {
    return initialProgress();
  }
}

function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* silently ignore */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  const recordSession = useCallback(
    (key: Difficulty | string, score: number, total: number, isChapter = false) => {
      setProgress(prev => {
        let updated: Progress;
        if (isChapter) {
          const tier = prev.chapters[key] ?? defaultChapter();
          updated = {
            ...prev,
            chapters: {
              ...prev.chapters,
              [key]: {
                bestScore: Math.max(tier.bestScore, score),
                totalSeen: total,
                attempts: tier.attempts + 1,
              },
            },
          };
        } else {
          const d = key as Difficulty;
          const tier = prev[d];
          updated = {
            ...prev,
            [d]: {
              bestScore: Math.max(tier.bestScore, score),
              totalSeen: total,
              attempts: tier.attempts + 1,
            },
          };
        }
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

  const isUnlocked = useCallback(
    (difficulty: Difficulty): boolean => {
      if (difficulty === 'easy') return true;
      if (difficulty === 'moderate') {
        const { bestScore, totalSeen } = progress.easy;
        return totalSeen > 0 && bestScore / totalSeen >= 0.7;
      }
      const { bestScore, totalSeen } = progress.moderate;
      return totalSeen > 0 && bestScore / totalSeen >= 0.7;
    },
    [progress]
  );

  return { progress, recordSession, resetProgress, isUnlocked };
}
