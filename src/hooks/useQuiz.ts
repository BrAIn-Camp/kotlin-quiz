import { useState, useCallback } from 'react';
import type { Question, Difficulty } from '../types/question';

import easyQuestions from '../data/easy.json';
import moderateQuestions from '../data/moderate.json';
import difficultQuestions from '../data/difficult.json';

const QUESTIONS_PER_SESSION = 10;

const allQuestions: Record<Difficulty, Question[]> = {
  easy: easyQuestions as Question[],
  moderate: moderateQuestions as Question[],
  difficult: difficultQuestions as Question[],
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface QuizState {
  difficulty: Difficulty;
  questions: Question[];
  currentIndex: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  isComplete: boolean;
}

export function useQuiz() {
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  const startQuiz = useCallback((difficulty: Difficulty) => {
    const pool = allQuestions[difficulty];
    const selected = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
    setQuizState({
      difficulty,
      questions: selected,
      currentIndex: 0,
      selectedAnswer: null,
      answers: new Array(selected.length).fill(null),
      isComplete: false,
    });
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    setQuizState(prev => {
      if (!prev || prev.selectedAnswer !== null) return prev;
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentIndex] = answerIndex;
      return { ...prev, selectedAnswer: answerIndex, answers: newAnswers };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setQuizState(prev => {
      if (!prev) return prev;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return { ...prev, isComplete: true, selectedAnswer: null };
      }
      return { ...prev, currentIndex: nextIndex, selectedAnswer: null };
    });
  }, []);

  const endQuiz = useCallback(() => {
    setQuizState(null);
  }, []);

  const getScore = useCallback((): number => {
    if (!quizState) return 0;
    return quizState.answers.reduce<number>((count, answer, i) => {
      return answer === quizState.questions[i].correctIndex ? count + 1 : count;
    }, 0);
  }, [quizState]);

  return { quizState, startQuiz, selectAnswer, nextQuestion, endQuiz, getScore };
}
