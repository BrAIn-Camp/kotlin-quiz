import { useState } from 'react';
import type { Difficulty } from './types/question';
import { useProgress } from './hooks/useProgress';
import { useQuiz } from './hooks/useQuiz';
import HomePage from './components/HomePage';
import ModuleSelector from './components/ModuleSelector';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import SessionSummary from './components/SessionSummary';

type AppView = 'home' | 'modules' | 'quiz' | 'summary';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const { progress, recordSession, isUnlocked } = useProgress();
  const { quizState, startQuiz, selectAnswer, nextQuestion, endQuiz, getScore } = useQuiz();

  function handleSelectModule(difficulty: Difficulty) {
    startQuiz(difficulty);
    setView('quiz');
  }

  function handleSessionComplete(difficulty: Difficulty, score: number, total: number) {
    recordSession(difficulty, score, total);
    setView('summary');
  }

  function handleNext() {
    if (!quizState) return;
    if (quizState.currentIndex + 1 >= quizState.questions.length) {
      const score = getScore();
      handleSessionComplete(quizState.difficulty, score, quizState.questions.length);
    } else {
      nextQuestion();
    }
  }

  function handleRetry() {
    if (!quizState) return;
    const difficulty = quizState.difficulty;
    endQuiz();
    startQuiz(difficulty);
    setView('quiz');
  }

  function handleChooseModule() {
    endQuiz();
    setView('modules');
  }

  const score = quizState ? getScore() : 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">K</span>
          <span className="header-title">Kotlin Code Reader</span>
          {view !== 'home' && (
            <button className="header-home-btn" onClick={() => { endQuiz(); setView('home'); }}>
              Home
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === 'home' && (
          <HomePage onStart={() => setView('modules')} />
        )}

        {view === 'modules' && (
          <ModuleSelector
            progress={progress}
            isUnlocked={isUnlocked}
            onSelect={handleSelectModule}
            onBack={() => setView('home')}
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
            onRetry={handleRetry}
            onChooseModule={handleChooseModule}
          />
        )}
      </main>
    </div>
  );
}
