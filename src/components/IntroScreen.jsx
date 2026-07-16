import { useEffect, useRef } from 'react';
import { stopNarration } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🤔', label: 'Wonder', desc: 'A geometry mystery!' },
  { icon: '📖', label: 'Story', desc: 'See shapes in action' },
  { icon: '🎮', label: 'Simulate', desc: 'Build and classify' },
  { icon: '🎯', label: 'Play', desc: 'Gamified challenges' },
  { icon: '✨', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {

  const handleStart = () => {
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✔️ Grade 3 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Global Shape Quest</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 8.1 - Geometry: Lines, Angles, Shapes, Perimeter & Area
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🤖</div>
        <div className="speech-bubble">
          Let's explore geometry around the world! 🌍
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to see <strong style={{ color: 'var(--gold)' }}>lines, angles, and shapes</strong> everywhere, measure perimeter, and discover the secrets of geometry!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">➡️</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🗺️</div>
          <div className="feature-card-label">3 Landmark Worlds</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">📐</div>
          <div className="feature-card-label">Geometry Skills</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✔️</div>
          <div className="feature-card-label">Badges & Stars</div>
        </div>
      </div>
    </div>
  );
}
