interface PathSelectorProps {
  onSelectDifficulty: () => void;
  onSelectChapter: () => void;
  onBack: () => void;
}

export default function PathSelector({ onSelectDifficulty, onSelectChapter, onBack }: PathSelectorProps) {
  return (
    <div className="path-selector">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="module-title">How do you want to learn?</h2>
      <p className="module-subtitle">Choose a learning path that fits your goal.</p>

      <div className="path-cards">
        <button className="path-card" onClick={onSelectDifficulty}>
          <div className="path-icon">🎯</div>
          <div className="path-body">
            <h3 className="path-title">By Difficulty</h3>
            <p className="path-description">
              Mixed questions across all topics, sorted by skill level.
              Earn 70% to unlock the next tier.
            </p>
            <div className="path-tiers">
              <span className="tier-pip pip-easy">🟢 Easy</span>
              <span className="tier-pip pip-mod">🟡 Moderate</span>
              <span className="tier-pip pip-hard">🔴 Difficult</span>
            </div>
          </div>
        </button>

        <button className="path-card" onClick={onSelectChapter}>
          <div className="path-icon">📖</div>
          <div className="path-body">
            <h3 className="path-title">By Chapter</h3>
            <p className="path-description">
              Quiz yourself on one specific chapter at a time.
              All 23 chapters from the book are available immediately.
            </p>
            <div className="path-tiers">
              <span className="tier-pip pip-easy">Ch 01 Hello Kotlin</span>
              <span className="tier-pip pip-mod">Ch 12 Data Classes</span>
              <span className="tier-pip pip-hard">Ch 23 Higher-Order</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
