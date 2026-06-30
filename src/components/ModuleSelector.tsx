import type { Difficulty, Progress } from '../types/question';

interface ModuleSelectorProps {
  progress: Progress;
  isUnlocked: (d: Difficulty) => boolean;
  onSelect: (d: Difficulty) => void;
  onBack: () => void;
}

const TIERS: { difficulty: Difficulty; label: string; emoji: string; description: string }[] = [
  {
    difficulty: 'easy',
    label: 'Easy',
    emoji: '🟢',
    description: 'val/var, string templates, null safety basics, if/when expressions, default parameters',
  },
  {
    difficulty: 'moderate',
    label: 'Moderate',
    emoji: '🟡',
    description: 'Data classes, scope functions (let/apply/run/with/also), map/filter, extension functions',
  },
  {
    difficulty: 'difficult',
    label: 'Difficult',
    emoji: '🔴',
    description: 'Higher-order functions, sealed classes, collection pipelines, coroutines, reified generics',
  },
];

function pct(progress: { bestScore: number; totalSeen: number }): number {
  if (progress.totalSeen === 0) return 0;
  return Math.round((progress.bestScore / progress.totalSeen) * 100);
}

export default function ModuleSelector({ progress, isUnlocked, onSelect, onBack }: ModuleSelectorProps) {
  return (
    <div className="module-selector">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="module-title">Choose a Difficulty</h2>
      <p className="module-subtitle">Complete 70% of a tier to unlock the next one.</p>

      <div className="tier-list">
        {TIERS.map(({ difficulty, label, emoji, description }) => {
          const unlocked = isUnlocked(difficulty);
          const prog = progress[difficulty];
          const score = pct(prog);
          const attempted = prog.attempts > 0;

          return (
            <button
              key={difficulty}
              className={`tier-card ${unlocked ? 'tier-unlocked' : 'tier-locked'}`}
              onClick={() => unlocked && onSelect(difficulty)}
              disabled={!unlocked}
            >
              <div className="tier-header">
                <span className="tier-emoji">{emoji}</span>
                <span className="tier-label">{label}</span>
                {!unlocked && <span className="tier-lock">🔒</span>}
                {attempted && unlocked && (
                  <span className={`tier-score ${score >= 70 ? 'score-pass' : 'score-fail'}`}>
                    Best: {score}%
                  </span>
                )}
              </div>
              <p className="tier-description">{description}</p>
              {attempted && (
                <div className="tier-progress-bar">
                  <div className="tier-progress-fill" style={{ width: `${score}%` }} />
                </div>
              )}
              {!unlocked && (
                <p className="tier-unlock-hint">
                  Score 70%+ on {difficulty === 'moderate' ? 'Easy' : 'Moderate'} to unlock
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
