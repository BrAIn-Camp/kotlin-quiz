import { useState } from 'react';
import type { Difficulty } from './types/question';
import { CHAPTERS } from './data/chapterList';
import { useProgress } from './hooks/useProgress';
import { useQuiz } from './hooks/useQuiz';
import HomePage from './components/HomePage';
import PathSelector from './components/PathSelector';
import ModuleSelector from './components/ModuleSelector';
import ChapterSelector from './components/ChapterSelector';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import SessionSummary from './components/SessionSummary';

type AppView = 'home' | 'path' | 'modules' | 'chapters' | 'quiz' | 'summary';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const { progress, recordSession, isUnlocked } = useProgress();
  const { quizState, startDifficultyQuiz, startChapterQuiz, selectAnswer, nextQuestion, endQuiz, getScore } = useQuiz();

  function handleSelectDifficultyModule(difficulty: Difficulty) {
    startDifficultyQuiz(difficulty);
    setView('quiz');
  }

  function handleSelectChapter(chapterId: string) {
    startChapterQuiz(chapterId);
    setView('quiz');
  }

  function handleNext() {
    if (!quizState) return;
    if (quizState.currentIndex + 1 >= quizState.questions.length) {
      const score = getScore();
      if (quizState.mode === 'chapter' && quizState.chapterId) {
        recordSession(quizState.chapterId, score, quizState.questions.length, true);
      } else {
        recordSession(quizState.difficulty, score, quizState.questions.length, false);
      }
      setView('summary');
    } else {
      nextQuestion();
    }
  }

  function handleRetry() {
    if (!quizState) return;
    if (quizState.mode === 'chapter' && quizState.chapterId) {
      const id = quizState.chapterId;
      endQuiz();
      startChapterQuiz(id);
    } else {
      const d = quizState.difficulty;
      endQuiz();
      startDifficultyQuiz(d);
    }
    setView('quiz');
  }

  function handleChooseMore() {
    endQuiz();
    setView(quizState?.mode === 'chapter' ? 'chapters' : 'modules');
  }

  function goHome() { endQuiz(); setView('home'); }

  const score = quizState ? getScore() : 0;

  const chapterTitle = quizState?.chapterId
    ? CHAPTERS.find(c => c.id === quizState.chapterId)?.title
    : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">K</span>
          <span className="header-title">Kotlin Code Reader</span>
          {view !== 'home' && (
            <button className="header-home-btn" onClick={goHome}>Home</button>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === 'home' && <HomePage onStart={() => setView('path')} />}

        {view === 'path' && (
          <PathSelector
            onSelectDifficulty={() => setView('modules')}
            onSelectChapter={() => setView('chapters')}
            onBack={() => setView('home')}
          />
        )}

        {view === 'modules' && (
          <ModuleSelector
            progress={progress}
            isUnlocked={isUnlocked}
            onSelect={handleSelectDifficultyModule}
            onBack={() => setView('path')}
          />
        )}

        {view === 'chapters' && (
          <ChapterSelector
            progress={progress}
            onSelect={handleSelectChapter}
            onBack={() => setView('path')}
          />
        )}

        {view === 'quiz' && quizState && (
          <div className="quiz-container">
            <ProgressBar
              current={quizState.currentIndex + 1}
              total={quizState.questions.length}
              score={score}
            />
            <QuestionCard
              key={quizState.currentIndex}
              question={quizState.questions[quizState.currentIndex]}
              questionNumber={quizState.currentIndex + 1}
              totalQuestions={quizState.questions.length}
              selectedAnswer={quizState.selectedAnswer}
              onSelectAnswer={selectAnswer}
              onNext={handleNext}
              isLastQuestion={quizState.currentIndex + 1 === quizState.questions.length}
            />
          </div>
        )}

        {view === 'summary' && quizState && (
          <SessionSummary
            difficulty={quizState.difficulty}
            questions={quizState.questions}
            answers={quizState.answers}
            chapterTitle={chapterTitle}
            onRetry={handleRetry}
            onChooseModule={handleChooseMore}
          />
        )}
      </main>
    </div>
  );
}
