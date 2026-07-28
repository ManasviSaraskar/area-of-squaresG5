import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getReflectNarration } from '../utils/narration';
import { worldMap } from '../data/worldMap';

const WORLD_ICONS = ['🏛️', '🎨', '🌆'];

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  const mascotMessage = pct >= 85
    ? 'Incredible! You are a Geometry Master! 🏆'
    : pct >= 60
    ? 'Great effort! Keep practicing! 👏'
    : 'Good start! Try again to improve! ✨';

  const completeMessage = pct >= 85
    ? 'Outstanding Performance!'
    : pct >= 60
    ? 'Well Done!'
    : 'Keep Practising!';

  useEffect(() => {
    setShowConfetti(true);
    if (audioEnabled) {
      setTimeout(() => narrate(getReflectNarration()), 400);
    }
    return () => stopNarration();
  }, [audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const COLORS = ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0', '#00bcd4', '#ff9800'];
      const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2.5,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 12,
        duration: 2.5 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  return (
    <div className="reflect-phase">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }} />
          ))}
        </div>
      )}

      {/* Certificate */}
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Journey Complete!</h2>
        <p className="cert-subtitle">
          {completeMessage} — You are an <strong>Area of Squares Champion!</strong>
        </p>

        {/* Score circle */}
        <div className="score-circle" style={{ margin: '0 auto 20px' }}>
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered} correct</span>
        </div>

        {/* Total stars */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '0 0 20px', flexWrap: 'wrap' }}>
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              style={{
                fontSize: '1.5rem',
                opacity: i < totalStars ? 1 : 0.18,
                transition: `opacity 0.3s ${i * 0.08}s`,
                filter: i < totalStars ? 'drop-shadow(0 0 6px rgba(255,193,7,0.7))' : 'none',
              }}
            >⭐</span>
          ))}
        </div>

        <hr className="cert-divider" />

        {/* Per-world breakdown */}
        <div className="cert-world-results">
          {worldMap.map((w, i) => {
            const res = worldResults[i];
            return (
              <div className="cert-world-row" key={i}>
                <span style={{ fontSize: '1.2rem', marginRight: 6 }}>{WORLD_ICONS[i]}</span>
                <span className="cert-world-name">{w.name}</span>
                {res ? (
                  <>
                    <div className="cert-world-stars">
                      {[1, 2, 3].map(s => (
                        <span key={s} style={{ opacity: s <= res.stars ? 1 : 0.2 }}>⭐</span>
                      ))}
                    </div>
                    <span className="cert-world-score">{res.score}/{res.total}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: 'auto' }}>Not played</span>
                )}
              </div>
            );
          })}
        </div>

        <hr className="cert-divider" />

        {/* Stats */}
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Max Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>⭐ {totalStars}</div>
            <div className="cert-stat-label">Total Stars</div>
          </div>
        </div>

        {/* Mascot */}
        <div className="mascot-container" style={{ marginTop: 20 }}>
          <div className="mascot happy">🤖</div>
          <div className="speech-bubble">{mascotMessage}</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => { stopNarration(); onRestart(); }}
            id="play-again-btn"
          >
            🔄 Play Again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { stopNarration(); onGoHome(); }}
            id="go-home-btn"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
