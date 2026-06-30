import type { Question } from '../types/question';

interface AnswerExplanationProps {
  question: Question;
  selectedAnswer: number;
}

export default function AnswerExplanation({ question, selectedAnswer }: AnswerExplanationProps) {
  const isCorrect = selectedAnswer === question.correctIndex;
  const { explanation } = question;

  return (
    <div className={`explanation-panel ${isCorrect ? 'explanation-correct' : 'explanation-wrong'}`}>
      <div className="explanation-verdict">
        {isCorrect ? (
          <span className="verdict-icon verdict-correct">✓ Correct!</span>
        ) : (
          <span className="verdict-icon verdict-wrong">✗ Not quite</span>
        )}
        {!isCorrect && (
          <span className="correct-answer-label">
            Correct answer: <strong>{question.choices[question.correctIndex]}</strong>
          </span>
        )}
      </div>

      <p className="explanation-summary">{explanation.summary}</p>

      <div className="explanation-section">
        <h4 className="explanation-section-title">Line by line</h4>
        <ul className="line-by-line">
          {explanation.lineByLine.map((line, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineCode(line) }} />
          ))}
        </ul>
      </div>

      <div className="tip-box">
        <span className="tip-label">💡 AI Code Tip</span>
        <p>{explanation.tip}</p>
      </div>
    </div>
  );
}

// Convert `backtick code` to <code> tags for inline display
function formatInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}
