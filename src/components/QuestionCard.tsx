import type { Question } from '../types/question';
import CodeSnippet from './CodeSnippet';
import AnswerExplanation from './AnswerExplanation';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  const hasAnswered = selectedAnswer !== null;

  function choiceClass(index: number): string {
    if (!hasAnswered) return 'choice-btn';
    if (index === question.correctIndex) return 'choice-btn choice-correct';
    if (index === selectedAnswer) return 'choice-btn choice-wrong';
    return 'choice-btn choice-dimmed';
  }

  return (
    <div className="question-card">
      <div className="question-meta">
        <span className="question-number">Question {questionNumber} of {totalQuestions}</span>
        <span className={`topic-badge topic-${question.difficulty}`}>{question.topic}</span>
      </div>

      <CodeSnippet code={question.snippet} />

      <p className="question-text">{question.question}</p>

      <div className="choices-grid">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            className={choiceClass(i)}
            onClick={() => onSelectAnswer(i)}
            disabled={hasAnswered}
          >
            <span className="choice-label">{CHOICE_LABELS[i]}</span>
            <span className="choice-text">{choice}</span>
          </button>
        ))}
      </div>

      {hasAnswered && (
        <>
          <AnswerExplanation question={question} selectedAnswer={selectedAnswer} />
          <div className="next-btn-row">
            <button className="next-btn" onClick={onNext}>
              {isLastQuestion ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
