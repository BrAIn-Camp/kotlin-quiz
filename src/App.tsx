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
          <a
            className="header-github-link"
            href="https://github.com/BrAIn-Camp/kotlin-quiz"
            target="_blank"
            rel="noopener noreferrer"
            title="View the quiz app repository on GitHub"
          >
            <svg height="18" viewBox="0 0 16 16" width="18" aria-hidden="true" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
                2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
                0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82
                .44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
                0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38
                A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>Course Repo</span>
          </a>
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
