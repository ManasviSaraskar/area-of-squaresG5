import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getReflectNarration } from '../utils/narration';

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    setShowConfetti(true);
    if (audioEnabled) {
      narrate(getReflectNarration());
    }
    return () => { stopNarration(); };
  }, [audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`, animationDelay: `${p.delay}s`,
              backgroundColor: p.color, width: p.size, height: p.size,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Journey Complete!</h2>
        <p className="cert-subtitle">You are a Global Shape Quest Champion!</p>
        
        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered}</span>
        </div>
        
        <div style={{ fontSize: '2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <span key={i} style={{ opacity: i <= totalStars ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>
        
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Max Streak</div>
          </div>
        </div>
        
        <div className="mascot-container" style={{ marginTop: 16 }}>
          <div className="mascot happy" style={{ width: 80, height: 80, fontSize: '2rem' }}>🤖</div>
          <div className="speech-bubble">
            {pct >= 80 ? 'Incredible! You are a Geometry Master! 🏆' : pct >= 50 ? 'Great effort! Keep practicing! 👏' : 'Good start! Try again to improve! ✨'}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-primary btn-lg" onClick={() => { stopNarration(); onRestart(); }}>🔄 Play Again</button>
          <button className="btn btn-secondary" onClick={() => { stopNarration(); onGoHome(); }}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
