import { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getWonderNarration } from '../utils/narration';

const WONDER = {
  question: "John wants to cover his bedroom floor with cool new square tiles.",
  subtext: "If his room is a big square, how many tiles will he need? Let's find out about area!",
  bgEmojis: ["📐", "✨", "🔢"],
};

// Spiral order for 4×4 grid — clockwise from outside in
const SPIRAL = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];

// ─── Animated 4×4 grid hero that fills/drains in a spiral ───
function SquareHero() {
  const [filledSet, setFilledSet] = useState(new Set());
  const [labelText, setLabelText] = useState('Area of Squares');

  useEffect(() => {
    const reverse = [...SPIRAL].reverse();
    let tos = [];

    const cycle = () => {
      tos.forEach(clearTimeout);
      tos = [];

      // Fill spiral tile-by-tile
      SPIRAL.forEach((idx, step) => {
        const t = setTimeout(() => {
          setFilledSet(prev => new Set([...prev, idx]));
          if (step === 0) setLabelText('Counting tiles...');
        }, step * 85);
        tos.push(t);
      });

      // Pause at full
      const fullAt = SPIRAL.length * 85;
      tos.push(setTimeout(() => setLabelText('4 × 4 = 16 sq. units ✓'), fullAt));

      // Drain in reverse
      const drainStart = fullAt + 1100;
      reverse.forEach((idx, step) => {
        const t = setTimeout(() => {
          setFilledSet(prev => { const n = new Set(prev); n.delete(idx); return n; });
          if (step === reverse.length - 1) setLabelText('Area of Squares');
        }, drainStart + step * 60);
        tos.push(t);
      });

      // Loop
      const loopAt = drainStart + reverse.length * 60 + 500;
      tos.push(setTimeout(cycle, loopAt));
    };

    cycle();
    return () => tos.forEach(clearTimeout);
  }, []);

  return (
    <div className="wonder-square-hero">
      <div className="wonder-hero-grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className={`wonder-hero-tile ${filledSet.has(i) ? 'filled' : ''}`} />
        ))}
      </div>
      <div className="wonder-hero-label">{labelText}</div>
    </div>
  );
}

// ─── Floating geometric squares with 3 distinct motion paths ───
const FLOAT_SQUARES = Array.from({ length: 18 }, (_, i) => {
  const tier = i < 12 ? 'small' : i < 16 ? 'medium' : 'large';
  const size = tier === 'large' ? 110 + (i - 16) * 50 : tier === 'medium' ? 44 + (i - 12) * 12 : 14 + (i % 6) * 9;
  const opacity = tier === 'large' ? 0.035 : tier === 'medium' ? 0.08 : 0.14;
  const palette = [
    { bg: `rgba(99,102,241,${opacity})`,  border: `rgba(99,102,241,${opacity * 2.2})`,  glow: `rgba(99,102,241,${opacity * 1.8})`  },
    { bg: `rgba(255,193,7,${opacity})`,   border: `rgba(255,193,7,${opacity * 2.2})`,   glow: `rgba(255,193,7,${opacity * 1.8})`   },
    { bg: `rgba(255,112,67,${opacity})`,  border: `rgba(255,112,67,${opacity * 2.2})`,  glow: `rgba(255,112,67,${opacity * 1.8})`  },
  ][i % 3];
  return {
    id: i,
    size,
    x: (i * 5.7 + 1.5) % 97,
    y: (i * 9.3 + 3.5) % 94,
    delay: (i * 0.55) % 9,
    duration: tier === 'large' ? 22 + (i % 3) * 5 : tier === 'medium' ? 14 + (i % 4) * 2 : 9 + (i % 5) * 2,
    anim: ['squareFloatA', 'squareFloatB', 'squareFloatC'][i % 3],
    initRotate: (i * 19) % 60,
    ...palette,
  };
});

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      emoji: WONDER.bgEmojis[i % WONDER.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.2,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) narrate(getWonderNarration());
  }, [stage, audioEnabled]);

  const handleDiscover = useCallback(() => {
    stopNarration();
    onComplete();
  }, [onComplete]);

  return (
    <div className="wonder-phase">
      {/* Floating geometric squares */}
      <div className="wonder-squares-bg">
        {FLOAT_SQUARES.map(sq => (
          <div
            key={sq.id}
            className="wonder-geo-square"
            style={{
              width: sq.size,
              height: sq.size,
              left: `${sq.x}%`,
              top: `${sq.y}%`,
              background: sq.bg,
              border: `1.5px solid ${sq.border}`,
              boxShadow: `0 0 14px ${sq.glow}, inset 0 0 8px ${sq.bg}`,
              animationName: sq.anim,
              animationDelay: `${sq.delay}s`,
              animationDuration: `${sq.duration}s`,
              transform: `rotate(${sq.initRotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* Emoji particles */}
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
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <SquareHero />
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
