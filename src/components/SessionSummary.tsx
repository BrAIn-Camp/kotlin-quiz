import type { Question, Difficulty } from '../types/question';

interface SessionSummaryProps {
  difficulty: Difficulty;
  questions: Question[];
  answers: (number | null)[];
  onRetry: () => void;
  onChooseModule: () => void;
}

const DIFFICULTY_NEXT: Partial<Record<Difficulty, Difficulty>> = {
  easy: 'moderate',
  moderate: 'difficult',
};

export default function SessionSummary({
  difficulty,
  questions,
  answers,
  onRetry,
  onChooseModule,
}: SessionSummaryProps) {
  const total = questions.length;
  const score = answers.reduce<number>((count, answer, i) => {
    return answer === questions[i].correctIndex ? count + 1 : count;
  }, 0);
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 70;
  const nextTier = DIFFICULTY_NEXT[difficulty];

  const missed = questions
    .map((q, i) => ({ q, i }))
    .filter(({ i }) => answers[i] !== questions[i].correctIndex);

  return (
    <div className="summary-card">
      <div className={`summary-score-ring ${passed ? 'ring-pass' : 'ring-fail'}`}>
        <span className="score-pct">{pct}%</span>
        <span className="score-fraction">{score} / {total}</span>
      </div>

      <h2 className="summary-title">
        {passed ? '🎉 Great work!' : '📚 Keep practicing!'}
      </h2>
      <p className="summary-subtitle">
        {passed
          ? `You scored ${pct}% on the ${difficulty} tier.`
          : `You scored ${pct}%. Hit 70% to advance.`}
      </p>

      {missed.length > 0 && (
        <div className="missed-section">
          <h3 className="missed-title">Topics to review</h3>
          <ul className="missed-list">
            {missed.map(({ q, i }) => (
              <li key={i} className="missed-item">
                <span className="missed-topic">{q.topic}</span>
                <span className="missed-your-answer">
                  You chose: <em>{q.choices[answers[i]!]}</em>
                </span>
                <span className="missed-correct-answer">
                  Correct: <strong>{q.choices[q.correctIndex]}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="summary-actions">
        <button className="btn-secondary" onClick={onRetry}>
          🔄 Retry {difficulty}
        </button>
        {passed && nextTier ? (
          <button className="btn-primary" onClick={onChooseModule}>
            Next: {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} →
          </button>
        ) : (
          <button className="btn-primary" onClick={onChooseModule}>
            Choose Module
          </button>
        )}
      </div>
    </div>
  );
}
