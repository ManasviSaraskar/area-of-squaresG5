import { useState, useEffect, useCallback } from 'react';
const STATIONS = [
  { icon: '📐', label: 'Build' },
  { icon: '📥', label: 'Sort' },
  { icon: '🔢', label: 'Count' }
];

// ===========================
// Station 1: Build-a-Shape (3 rounds: triangle, square, pentagon)
// ===========================
const BUILD_ROUNDS = [
  {
    label: 'Triangle',
    emoji: '🔺',
    dots: [{ cx: 100, cy: 25 }, { cx: 25, cy: 160 }, { cx: 175, cy: 160 }],
  },
  {
    label: 'Square',
    emoji: '🟦',
    dots: [{ cx: 40, cy: 40 }, { cx: 160, cy: 40 }, { cx: 160, cy: 160 }, { cx: 40, cy: 160 }],
  },
  {
    label: 'Pentagon',
    emoji: '⬠',
    dots: [
      { cx: 100, cy: 25 },
      { cx: 175, cy: 80 },
      { cx: 148, cy: 170 },
      { cx: 52, cy: 170 },
      { cx: 25, cy: 80 },
    ],
  }
];

function Station1({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [dotsClicked, setDotsClicked] = useState(0);
  const [complete, setComplete] = useState(false);

  const shape = BUILD_ROUNDS[round];
  const n = shape.dots.length;

  useEffect(() => {
    setDotsClicked(0);
    setComplete(false);
  }, [round]);

  const handleClickDot = (index) => {
    if (dotsClicked === index && !complete) {
      const next = dotsClicked + 1;
      setDotsClicked(next);
      if (next === n) {
        setComplete(true);
      }
    }
  };

  const handleAdvance = () => {
    if (round < BUILD_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onNext();
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>📐 Build a Shape!</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
        Tap the glowing dots in order to draw a <strong style={{ color: 'var(--gold)' }}>{shape.label}</strong>! {shape.emoji}
      </p>

      {/* Round indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {BUILD_ROUNDS.map((r, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            background: i < round ? 'var(--gold)' : i === round ? 'var(--coral)' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }}>{r.emoji}</div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <svg width="200" height="200" style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px' }}>
          {/* Drawn lines */}
          {shape.dots.map((p1, i) => {
            const p2 = shape.dots[(i + 1) % n];
            const drawn = (i < dotsClicked - 1) || (dotsClicked === n && i === n - 1);
            if (!drawn) return null;
            return <line key={`l${i}`} x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy} stroke="var(--gold)" strokeWidth="6" strokeLinecap="round" />;
          })}

          {/* Dots */}
          {shape.dots.map((d, i) => (
            <g key={`d${i}`} onClick={() => handleClickDot(i)} style={{ cursor: dotsClicked === i && !complete ? 'pointer' : 'default' }}>
              <circle cx={d.cx} cy={d.cy} r="15" fill={dotsClicked > i ? 'var(--gold)' : (dotsClicked === i ? 'var(--coral)' : '#444')} style={{ transition: 'fill 0.3s' }} />
              {dotsClicked === i && !complete && (
                <circle cx={d.cx} cy={d.cy} r="26" fill="none" stroke="var(--coral)" strokeWidth="3" style={{ animation: 'pulseRing 1.2s infinite' }} />
              )}
              <text x={d.cx} y={d.cy + 5} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" style={{ pointerEvents: 'none' }}>{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}>
        {dotsClicked < n ? `Tap dot ${dotsClicked + 1} of ${n}` : ''}
      </div>

      {complete && (
        <div style={{ animation: 'bounceIn 0.5s' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 12 }}>
            ✨ You built a {shape.label}! ({n} sides, {n} corners)
          </div>
          <button className="btn btn-primary" onClick={handleAdvance}>
            {round < BUILD_ROUNDS.length - 1 ? `Next Shape ➡️` : 'Done! ➡️'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulseRing {
          0% { r: 22; opacity: 1; }
          100% { r: 32; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ===========================
// Station 2: Shape Sorter (3 shapes to drop)
// ===========================
const SORT_ROUNDS = [
  { shape: '■', label: 'Square', color: 'var(--coral)', emoji: '🟦' },
  { shape: '▲', label: 'Triangle', color: 'var(--gold)', emoji: '🔺' },
  { shape: '⬠', label: 'Pentagon', color: '#7c5cbf', emoji: '⬠' },
];

function Station2({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    setDropped(false);
  }, [round]);

  const handleDrop = () => {
    if (dropped) return;
    setDropped(true);
  };

  const handleAdvance = () => {
    if (round < SORT_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onNext();
    }
  };

  const s = SORT_ROUNDS[round];

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>📥 Shape Sorter</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
        Tap the <strong style={{ color: s.color }}>{s.label}</strong> block to drop it into the matching hole!
      </p>

      {/* Round indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {SORT_ROUNDS.map((r, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            background: i < round ? 'var(--gold)' : i === round ? s.color : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }}>{r.emoji}</div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, alignItems: 'flex-start' }}>
        {/* The sorter well */}
        <div style={{ position: 'relative', width: '120px', height: '200px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', overflow: 'visible' }}>
          {/* hole */}
          <div style={{ position: 'absolute', bottom: '16px', left: '10px', width: '100px', height: '80px', border: '3px dashed #666', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '2rem' }}>
            {s.shape}
          </div>
          {/* falling block */}
          <div
            onClick={handleDrop}
            style={{
              position: 'absolute',
              top: dropped ? '104px' : '12px',
              left: '10px',
              width: '100px',
              height: '80px',
              background: s.color,
              borderRadius: '8px',
              cursor: dropped ? 'default' : 'pointer',
              transition: 'top 0.55s cubic-bezier(0.4, 0, 0.2, 1.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '2.2rem',
              boxShadow: dropped ? 'none' : '0 6px 24px rgba(0,0,0,0.4)',
              userSelect: 'none',
            }}
          >
            {s.shape}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ paddingTop: 60, textAlign: 'left', maxWidth: 140 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {dropped
              ? <span style={{ color: 'var(--gold)' }}>✅ Perfect fit!</span>
              : <>Tap the <strong style={{ color: s.color }}>{s.shape}</strong> block to drop it!</>
            }
          </div>
        </div>
      </div>

      {dropped && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <button className="btn btn-primary" onClick={handleAdvance}>
            {round < SORT_ROUNDS.length - 1 ? 'Next Shape ➡️' : 'Done! ➡️'}
          </button>
        </div>
      )}
    </div>
  );
}

// ===========================
// Station 3: Side Counter (count sides of triangle, square, hexagon)
// ===========================
const COUNT_ROUNDS = [
  {
    label: 'Triangle',
    answer: 3,
    points: [{ x: 100, y: 25 }, { x: 25, y: 165 }, { x: 175, y: 165 }],
  },
  {
    label: 'Rectangle',
    answer: 4,
    points: [{ x: 30, y: 55 }, { x: 170, y: 55 }, { x: 170, y: 155 }, { x: 30, y: 155 }],
  },
  {
    label: 'Hexagon',
    answer: 6,
    points: [
      { x: 100, y: 20 },
      { x: 170, y: 60 },
      { x: 170, y: 140 },
      { x: 100, y: 180 },
      { x: 30, y: 140 },
      { x: 30, y: 60 },
    ],
  }
];

function Station3({ audioEnabled, onComplete }) {
  const [round, setRound] = useState(0);
  const [clickedSides, setClickedSides] = useState([]);

  const shape = COUNT_ROUNDS[round];
  const n = shape.points.length;

  useEffect(() => {
    setClickedSides(Array(COUNT_ROUNDS[round].points.length).fill(false));
  }, [round]);

  const handleSideClick = (index) => {
    const newSides = [...clickedSides];
    newSides[index] = true;
    setClickedSides(newSides);
  };

  const doneCount = clickedSides.filter(Boolean).length;
  const isComplete = doneCount === n;

  const handleAdvance = () => {
    if (round < COUNT_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>🔢 Side Counter</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
        Tap each side of the <strong style={{ color: 'var(--gold)' }}>{shape.label}</strong> to count them!
      </p>

      {/* Round indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {COUNT_ROUNDS.map((r, i) => (
          <div key={i} style={{
            width: 30, height: 30, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700,
            background: i < round ? 'var(--gold)' : i === round ? 'var(--coral)' : 'rgba(255,255,255,0.1)',
            color: 'white', transition: 'all 0.3s',
          }}>{r.answer}</div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width="200" height="200" style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px' }}>
          <polygon points={shape.points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(255,255,255,0.04)" />
          {shape.points.map((p1, i) => {
            const p2 = shape.points[(i + 1) % n];
            return (
              <g key={i} onClick={() => handleSideClick(i)} style={{ cursor: clickedSides[i] ? 'default' : 'pointer' }}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="transparent" strokeWidth="22" />
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={clickedSides[i] ? 'var(--gold)' : '#555'}
                  strokeWidth="8" strokeLinecap="round"
                  style={{ transition: 'stroke 0.25s' }}
                />
              </g>
            );
          })}
          {shape.points.map((p, i) => (
            <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="5" fill={doneCount > i ? 'var(--gold)' : '#888'} style={{ pointerEvents: 'none' }} />
          ))}
        </svg>

        {/* Live count */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>{doneCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>sides tapped</div>
          <div style={{ marginTop: 12 }}>
            {shape.points.map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: clickedSides[i] ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                display: 'inline-block', margin: '2px',
                transition: 'background 0.25s'
              }} />
            ))}
          </div>
        </div>
      </div>

      {isComplete && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 12 }}>
            🎉 {shape.label} has {n} sides!
          </div>
          <button className="btn btn-primary" onClick={handleAdvance}>
            {round < COUNT_ROUNDS.length - 1 ? 'Next Shape ➡️' : '🚀 Complete Simulation!'}
          </button>
        </div>
      )}
    </div>
  );
}

// ===========================
// Main SimulatePhase
// ===========================
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => { if (station < 2) setStation(s => s + 1); }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🎮 Simulate</h3>
        <p className="simulate-sublabel">Build, sort, and count — interact with the shapes!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon} {s.label}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 700, width: '100%', animation: 'slideUp 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
