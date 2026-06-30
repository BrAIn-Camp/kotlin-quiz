import { useState, useCallback } from 'react';
import type { Question, Difficulty } from '../types/question';

import easyQuestions from '../data/easy.json';
import moderateQuestions from '../data/moderate.json';
import difficultQuestions from '../data/difficult.json';

import ch01 from '../data/chapters/ch-01.json';
import ch02 from '../data/chapters/ch-02.json';
import ch03 from '../data/chapters/ch-03.json';
import ch04 from '../data/chapters/ch-04.json';
import ch05 from '../data/chapters/ch-05.json';
import ch06 from '../data/chapters/ch-06.json';
import ch07 from '../data/chapters/ch-07.json';
import ch08 from '../data/chapters/ch-08.json';
import ch09 from '../data/chapters/ch-09.json';
import ch10 from '../data/chapters/ch-10.json';
import ch11 from '../data/chapters/ch-11.json';
import ch12 from '../data/chapters/ch-12.json';
import ch13 from '../data/chapters/ch-13.json';
import ch14 from '../data/chapters/ch-14.json';
import ch15 from '../data/chapters/ch-15.json';
import ch16 from '../data/chapters/ch-16.json';
import ch17 from '../data/chapters/ch-17.json';
import ch18 from '../data/chapters/ch-18.json';
import ch19 from '../data/chapters/ch-19.json';
import ch20 from '../data/chapters/ch-20.json';
import ch21 from '../data/chapters/ch-21.json';
import ch22 from '../data/chapters/ch-22.json';
import ch23 from '../data/chapters/ch-23.json';

const QUESTIONS_PER_SESSION = 10;

const allDifficultyQuestions: Record<Difficulty, Question[]> = {
  easy: easyQuestions as Question[],
  moderate: moderateQuestions as Question[],
  difficult: difficultQuestions as Question[],
};

export const chapterQuestions: Record<string, Question[]> = {
  'ch-01': ch01 as Question[], 'ch-02': ch02 as Question[], 'ch-03': ch03 as Question[],
  'ch-04': ch04 as Question[], 'ch-05': ch05 as Question[], 'ch-06': ch06 as Question[],
  'ch-07': ch07 as Question[], 'ch-08': ch08 as Question[], 'ch-09': ch09 as Question[],
  'ch-10': ch10 as Question[], 'ch-11': ch11 as Question[], 'ch-12': ch12 as Question[],
  'ch-13': ch13 as Question[], 'ch-14': ch14 as Question[], 'ch-15': ch15 as Question[],
  'ch-16': ch16 as Question[], 'ch-17': ch17 as Question[], 'ch-18': ch18 as Question[],
  'ch-19': ch19 as Question[], 'ch-20': ch20 as Question[], 'ch-21': ch21 as Question[],
  'ch-22': ch22 as Question[], 'ch-23': ch23 as Question[],
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
  mode: 'difficulty' | 'chapter';
  difficulty: Difficulty;
  chapterId?: string;
  questions: Question[];
  currentIndex: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  isComplete: boolean;
}

export function useQuiz() {
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  const startDifficultyQuiz = useCallback((difficulty: Difficulty) => {
    const pool = allDifficultyQuestions[difficulty];
    const selected = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
    setQuizState({
      mode: 'difficulty', difficulty, questions: selected,
      currentIndex: 0, selectedAnswer: null,
      answers: new Array(selected.length).fill(null), isComplete: false,
    });
  }, []);

  const startChapterQuiz = useCallback((chapterId: string) => {
    const pool = chapterQuestions[chapterId] ?? [];
    const selected = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
    setQuizState({
      mode: 'chapter', difficulty: 'easy', chapterId, questions: selected,
      currentIndex: 0, selectedAnswer: null,
      answers: new Array(selected.length).fill(null), isComplete: false,
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

  const endQuiz = useCallback(() => { setQuizState(null); }, []);

  const getScore = useCallback((): number => {
    if (!quizState) return 0;
    return quizState.answers.reduce<number>((count, answer, i) => {
      return answer === quizState.questions[i].correctIndex ? count + 1 : count;
    }, 0);
  }, [quizState]);

  return { quizState, startDifficultyQuiz, startChapterQuiz, selectAnswer, nextQuestion, endQuiz, getScore };
}
