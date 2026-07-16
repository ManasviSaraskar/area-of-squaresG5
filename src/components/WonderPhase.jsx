import { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getWonderNarration } from '../utils/narration';

const WONDER = {
  question: "John is building a kite for the Tokyo Kite Festival.",
  subtext: "Its frame needs two sticks that never cross, no matter how far they stretch. What kind of lines does John need? Let's find out!",
  emoji: "🪁",
  bgEmojis: ["📐", "📏", "🪁", "✨"],
};

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: WONDER.bgEmojis[i % WONDER.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrate(getWonderNarration());
    }
  }, [stage, audioEnabled]);

  const handleDiscover = useCallback(() => {
    stopNarration();
    onComplete();
  }, [onComplete]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`} style={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
          <div className="mascot thinking">🦊</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{WONDER.emoji}</div>
          <h2 className="wonder-question-text">{WONDER.question}</h2>
          <p className="wonder-subtext">{WONDER.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
