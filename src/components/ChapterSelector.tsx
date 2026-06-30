import type { ChapterInfo, Progress } from '../types/question';
import { CHAPTERS } from '../data/chapterList';

interface ChapterSelectorProps {
  progress: Progress;
  onSelect: (chapterId: string) => void;
  onBack: () => void;
}

function chapterPct(progress: Progress, chapterId: string): number {
  const p = progress.chapters[chapterId];
  if (!p || p.totalSeen === 0) return -1;
  return Math.round((p.bestScore / p.totalSeen) * 100);
}

function statusIcon(pct: number): string {
  if (pct < 0) return '';
  if (pct >= 80) return '✓';
  return '↺';
}

export default function ChapterSelector({ progress, onSelect, onBack }: ChapterSelectorProps) {
  return (
    <div className="chapter-selector">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="module-title">Choose a Chapter</h2>
      <p className="module-subtitle">
        23 chapters from the book — quiz yourself on any one, anytime.
      </p>

      <div className="chapter-grid">
        {CHAPTERS.map((ch: ChapterInfo) => {
          const pct = chapterPct(progress, ch.id);
          const attempted = pct >= 0;
          const passed = pct >= 80;

          return (
            <button
              key={ch.id}
              className={`chapter-card ${attempted ? (passed ? 'ch-passed' : 'ch-attempted') : ''}`}
              onClick={() => onSelect(ch.id)}
            >
              <div className="ch-card-header">
                <span className="ch-number">Ch {String(ch.number).padStart(2, '0')}</span>
                {attempted && (
                  <span className={`ch-status ${passed ? 'ch-status-pass' : 'ch-status-try'}`}>
                    {statusIcon(pct)} {pct}%
                  </span>
                )}
              </div>
              <div className="ch-title">{ch.title}</div>
              <div className="ch-description">{ch.description}</div>
              {attempted && (
                <div className="ch-progress-bar">
                  <div
                    className={`ch-progress-fill ${passed ? 'ch-fill-pass' : 'ch-fill-try'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
