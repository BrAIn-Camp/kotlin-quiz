interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

export default function ProgressBar({ current, total, score }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-bar-labels">
        <span>{current} / {total} questions</span>
        <span>{score} correct</span>
      </div>
    </div>
  );
}
