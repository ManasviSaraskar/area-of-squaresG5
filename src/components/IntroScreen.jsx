import { useEffect } from 'react';
import { stopNarration } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🤔', label: 'Wonder', desc: 'An area mystery awaits!' },
  { icon: '📖', label: 'Story', desc: 'See area in real life' },
  { icon: '🎮', label: 'Simulate', desc: 'Build & calculate' },
  { icon: '🎯', label: 'Play', desc: '21 gamified challenges' },
  { icon: '✨', label: 'Reflect', desc: 'What did you learn?' },
];

const FEATURE_CARDS = [
  { icon: '🟦', label: '3 Square Worlds' },
  { icon: '✖️', label: 'Area Formula' },
  { icon: '⭐', label: 'Badges & Stars' },
  { icon: '🔊', label: 'Audio Narration' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {

  const handleStart = () => {
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">

      {/* Curriculum badge */}
      <div className="intro-badge" style={{ animationDelay: '0s' }}>
        ✔️ Grade 5 Mathematics
      </div>

      {/* Title */}
      <h1 className="intro-title intro-fade-in" style={{ animationDelay: '0.1s' }}>
        <span style={{ color: 'var(--gold)' }}>Area of Squares</span>
      </h1>
      <p style={{
        color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4,
        fontFamily: 'var(--font-display)', fontWeight: 600,
      }}
        className="intro-fade-in"
      >
        Lesson 8.2 – Calculating Area &amp; Perimeter of Squares
      </p>

      {/* Mascot */}
      <div className="mascot-container intro-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="mascot">🤖</div>
        <div className="speech-bubble">
          Let's explore the <strong>Area of Squares!</strong> 🟦
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc intro-fade-in" style={{ animationDelay: '0.3s' }}>
        Learn to calculate the{' '}
        <strong style={{ color: 'var(--gold)' }}>area and perimeter of squares</strong>{' '}
        by counting tiles, building grids, and using the{' '}
        <strong style={{ color: 'var(--coral)' }}>Side × Side</strong> formula!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map intro-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && (
                <div className="intro-journey-arrow">➡️</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-lg intro-start-btn"
        onClick={handleStart}
        id="start-journey-btn"
        style={{ animationDelay: '0.5s' }}
      >
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards intro-fade-in" style={{ animationDelay: '0.6s' }}>
        {FEATURE_CARDS.map((fc, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-card-icon">{fc.icon}</div>
            <div className="feature-card-label">{fc.label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
