interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="home-page">
      <div className="home-logo">
        <span className="kotlin-k">K</span>
      </div>
      <h1 className="home-title">Kotlin Code Reader</h1>
      <p className="home-subtitle">
        Train your eye to read AI-generated Kotlin — fast.
      </p>
      <ul className="home-features">
        <li>🟢 <strong>Easy</strong> — null safety, string templates, val vs var</li>
        <li>🟡 <strong>Moderate</strong> — scope functions, data classes, collections</li>
        <li>🔴 <strong>Difficult</strong> — coroutines, sealed classes, higher-order functions</li>
      </ul>
      <p className="home-description">
        Each question shows a real Kotlin snippet. Pick what the code does, then
        read a line-by-line explanation with tips on how that pattern shows up in
        AI-written code.
      </p>
      <button className="btn-primary btn-large" onClick={onStart}>
        Start Learning →
      </button>
    </div>
  );
}
