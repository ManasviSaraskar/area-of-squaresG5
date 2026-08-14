import { useState, useEffect, useCallback } from 'react';
import { playClick, playSuccess, playError } from '../utils/soundEffects';
import { narrate } from '../utils/audio';
import { getSimulateIntro } from '../utils/narration';

const STATIONS = [
  { icon: '📐', label: 'Build' },
  { icon: '✖️', label: 'Formula' },
  { icon: '🔢', label: 'Count' }
];

// ─────────────────────────────────────────────
// Shared: Hint Popup
// ─────────────────────────────────────────────
function HintPopup({ hint, onClose }) {
  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-card">
        <div className="popup-icon">💡</div>
        <h3 className="popup-title">Here's a Hint!</h3>
        <div className="hint-popup-box">
          <p>{hint}</p>
        </div>
        <div className="popup-actions">
          <button className="btn btn-primary btn-sm" onClick={onClose} id="sim-hint-close-btn">
            Got it! ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 1: Build-a-Square (3 rounds)
// ─────────────────────────────────────────────
const BUILD_ROUNDS = [
  {
    label: 'Side = 1', side: 1, area: 1, emoji: '🟦',
    dots: [{ cx: 70, cy: 70 }, { cx: 130, cy: 70 }, { cx: 130, cy: 130 }, { cx: 70, cy: 130 }],
    hint: 'Tap the glowing dot to connect the corners one by one. Start from dot 1!'
  },
  {
    label: 'Side = 2', side: 2, area: 4, emoji: '🟦',
    dots: [{ cx: 50, cy: 50 }, { cx: 150, cy: 50 }, { cx: 150, cy: 150 }, { cx: 50, cy: 150 }],
    hint: 'Connect all 4 corners in order. The sides will appear as you tap each dot!'
  },
  {
    label: 'Side = 3', side: 3, area: 9, emoji: '🟦',
    dots: [{ cx: 30, cy: 30 }, { cx: 170, cy: 30 }, { cx: 170, cy: 170 }, { cx: 30, cy: 170 }],
    hint: 'Tap dots 1 → 2 → 3 → 4 in order to draw the square. Area = Side × Side!'
  },
];

function Station1({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [dotsClicked, setDotsClicked] = useState(0);
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const shape = BUILD_ROUNDS[round];
  const n = shape.dots.length;

  useEffect(() => {
    setDotsClicked(0);
    setComplete(false);
    if (audioEnabled) narrate(getSimulateIntro(0));
  }, [round]);

  const handleClickDot = (index) => {
    if (dotsClicked === index && !complete) {
      if (audioEnabled) playClick();
      const next = dotsClicked + 1;
      setDotsClicked(next);
      if (next === n) {
        if (audioEnabled) playSuccess();
        setComplete(true);
      }
    }
  };

  const handleAdvance = () => {
    if (audioEnabled) playClick();
    if (round < BUILD_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onNext();
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>📐 Build a Square!</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.95rem' }}>
        Tap the glowing dots in order to draw a square with{' '}
        <strong style={{ color: 'var(--gold)' }}>{shape.label}</strong>!
      </p>

      {/* Round indicator */}
      <div className="round-badge">
        {BUILD_ROUNDS.map((r, i) => (
          <div key={i} className={`round-pip ${i < round ? 'done' : i === round ? 'active' : 'pending'}`}>
            {i < round ? '✓' : r.emoji}
          </div>
        ))}
      </div>

      {/* SVG Drawing */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg width="200" height="200" style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px' }}>
          {shape.dots.map((p1, i) => {
            const p2 = shape.dots[(i + 1) % n];
            const drawn = (i < dotsClicked - 1) || (dotsClicked === n && i === n - 1);
            if (!drawn) return null;
            return (
              <line key={`l${i}`} x1={p1.cx} y1={p1.cy} x2={p2.cx} y2={p2.cy}
                stroke="var(--gold)" strokeWidth="5" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,193,7,0.6))' }}
              />
            );
          })}
          {shape.dots.map((d, i) => (
            <g key={`d${i}`} onClick={() => handleClickDot(i)}
              style={{ cursor: dotsClicked === i && !complete ? 'pointer' : 'default' }}>
              <circle cx={d.cx} cy={d.cy} r="14"
                fill={dotsClicked > i ? 'var(--gold)' : dotsClicked === i ? 'var(--coral)' : 'rgba(80,80,120,0.9)'}
                style={{ transition: 'fill 0.3s', filter: dotsClicked === i && !complete ? 'drop-shadow(0 0 8px rgba(255,112,67,0.8))' : 'none' }}
              />
              {dotsClicked === i && !complete && (
                <circle cx={d.cx} cy={d.cy} r="22" fill="none"
                  stroke="var(--coral)" strokeWidth="3"
                  style={{ animation: 'pulseRing 1.2s infinite' }}
                />
              )}
              <text x={d.cx} y={d.cy + 5} textAnchor="middle" fontSize="11"
                fill="white" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>
        {dotsClicked < n ? `Tap dot ${dotsClicked + 1} of ${n}` : ''}
      </p>

      {!complete && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <button className="btn-hint" onClick={() => setShowHint(true)} id="s1-hint-btn">
            💡 Need a Hint?
          </button>
        </div>
      )}

      {complete && (
        <div className="station-success-box">
          <div className="station-success-formula">
            Area = {shape.side} × {shape.side} = <strong>{shape.area}</strong> sq unit{shape.area !== 1 ? 's' : ''}
          </div>
          <div className="station-success-perimeter">
            Perimeter = 4 × {shape.side} = <strong>{shape.side * 4}</strong> units
          </div>
          <button className="btn btn-primary" onClick={handleAdvance} id="s1-advance-btn">
            {round < BUILD_ROUNDS.length - 1 ? 'Next Square ➡️' : '✓ Done!'}
          </button>
        </div>
      )}

      {showHint && <HintPopup hint={shape.hint} onClose={() => setShowHint(false)} />}

      <style>{`
        @keyframes pulseRing {
          0% { r: 22; opacity: 1; }
          100% { r: 34; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 2: Formula Builder
// ─────────────────────────────────────────────
const FORMULA_ROUNDS = [
  { side: 3, area: 9,  options: [3, 4, 6, 9],   hint: 'Fill in: Side × Side = Area. The side is 3, so tap 3, then 3, then 3×3=?' },
  { side: 4, area: 16, options: [4, 8, 12, 16],  hint: 'Side = 4. So tap 4 for both sides, then calculate 4 × 4 for the area.' },
  { side: 5, area: 25, options: [5, 10, 20, 25], hint: 'Side = 5. Fill Side × Side = Area. What is 5 × 5?' },
];

function Station2({ audioEnabled, onNext }) {
  const [round, setRound] = useState(0);
  const [slots, setSlots] = useState([null, null, null]);
  const [showHint, setShowHint] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);

  const currentRound = FORMULA_ROUNDS[round];
  const expectedSlots = [currentRound.side, currentRound.side, currentRound.area];

  useEffect(() => {
    setSlots([null, null, null]);
    if (audioEnabled) narrate(getSimulateIntro(1));
  }, [round]);

  const activeSlotIndex = slots.findIndex(s => s === null);
  const isComplete = activeSlotIndex === -1;

  const handleOptionClick = (val) => {
    if (isComplete) return;
    if (val === expectedSlots[activeSlotIndex]) {
      if (audioEnabled) playClick();
      const newSlots = [...slots];
      newSlots[activeSlotIndex] = val;
      setSlots(newSlots);
      if (newSlots.findIndex(s => s === null) === -1 && audioEnabled) playSuccess();
    } else {
      if (audioEnabled) playError();
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 600);
    }
  };

  const handleAdvance = () => {
    if (audioEnabled) playClick();
    if (round < FORMULA_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onNext();
    }
  };

  const slotStyle = (val, colorFilled) => ({
    width: 52, height: 52, border: `2px dashed ${val ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700,
    background: val ? colorFilled : 'rgba(255,255,255,0.05)',
    color: val ? '#1a1a2e' : 'rgba(255,255,255,0.4)',
    transition: 'all 0.3s',
    animation: val ? 'popIn 0.3s ease' : 'none',
  });

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>✖️ Formula Builder</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.95rem' }}>
        A square has <strong style={{ color: 'var(--coral)' }}>Side = {currentRound.side}</strong>. Tap the correct values to complete the formula!
      </p>

      {/* Round indicator */}
      <div className="round-badge">
        {FORMULA_ROUNDS.map((_, i) => (
          <div key={i} className={`round-pip ${i < round ? 'done' : i === round ? 'active' : 'pending'}`}>
            {i < round ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {/* Visual square reference */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, background: 'rgba(255,160,0,0.12)', border: '2px solid var(--gold)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 700 }}>{currentRound.side}</span>
          <span style={{ position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontSize: '0.88rem', fontWeight: 700 }}>{currentRound.side}</span>
          <span style={{ fontSize: '2rem' }}>🟦</span>
        </div>
      </div>

      {/* Equation slots */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
        fontSize: '1.6rem', fontWeight: 700, marginBottom: 28, flexWrap: 'wrap',
        animation: wrongFlash ? 'shake 0.4s ease' : 'none',
      }}>
        <div style={slotStyle(slots[0], 'var(--gold)')}>{slots[0] ?? '?'}</div>
        <span style={{ color: 'var(--text-secondary)' }}>×</span>
        <div style={slotStyle(slots[1], 'var(--gold)')}>{slots[1] ?? '?'}</div>
        <span style={{ color: 'var(--text-secondary)' }}>=</span>
        <div style={{ ...slotStyle(slots[2], 'var(--coral)'), width: 62 }}>{slots[2] ?? '?'}</div>
      </div>

      {/* Options */}
      {!isComplete && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {currentRound.options.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() => handleOptionClick(opt)}
              style={{ minWidth: 64, padding: '12px 20px', fontSize: '1.3rem', borderRadius: 12 }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {!isComplete && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button className="btn-hint" onClick={() => setShowHint(true)} id="s2-hint-btn">
            💡 Need a Hint?
          </button>
        </div>
      )}

      {isComplete && (
        <div className="station-success-box">
          <div className="station-success-formula">
            🎉 {currentRound.side} × {currentRound.side} = {currentRound.area} — Correct!
          </div>
          <button className="btn btn-primary" onClick={handleAdvance} id="s2-advance-btn">
            {round < FORMULA_ROUNDS.length - 1 ? 'Next Formula ➡️' : '✓ Done!'}
          </button>
        </div>
      )}

      {showHint && <HintPopup hint={currentRound.hint} onClose={() => setShowHint(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// Station 3: Area Counter
// ─────────────────────────────────────────────
const COUNT_ROUNDS = [
  { side: 2, label: '2×2 Square', hint: 'Tap each small square inside the grid one at a time. Count as you go!' },
  { side: 3, label: '3×3 Square', hint: 'There are 3 rows of 3 tiles. Tap them all — that\'s 3 × 3 = 9 tiles!' },
  { side: 4, label: '4×4 Square', hint: 'A 4×4 square has 4 rows of 4 tiles. Tap all 16 tiles to find the area!' },
];

function Station3({ audioEnabled, onComplete }) {
  const [round, setRound] = useState(0);
  const [clickedTiles, setClickedTiles] = useState(new Set());
  const [showHint, setShowHint] = useState(false);

  const currentRound = COUNT_ROUNDS[round];
  const totalTiles = currentRound.side * currentRound.side;

  useEffect(() => {
    setClickedTiles(new Set());
    if (audioEnabled) narrate(getSimulateIntro(2));
  }, [round]);

  const handleTileClick = (index) => {
    if (!clickedTiles.has(index)) {
      if (audioEnabled) playClick();
      const newClicked = new Set(clickedTiles);
      newClicked.add(index);
      setClickedTiles(newClicked);
      if (newClicked.size === totalTiles && audioEnabled) playSuccess();
    }
  };

  const doneCount = clickedTiles.size;
  const isComplete = doneCount === totalTiles;

  const handleAdvance = () => {
    if (audioEnabled) playClick();
    if (round < COUNT_ROUNDS.length - 1) {
      setRound(r => r + 1);
    } else {
      onComplete();
    }
  };

  const maxGridPx = 200;
  const tileSize = Math.floor(maxGridPx / currentRound.side) - 4;

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="station-header"><h2>🔢 Area Counter</h2></div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.95rem' }}>
        Tap every tile inside the{' '}
        <strong style={{ color: 'var(--gold)' }}>{currentRound.label}</strong> to find its Area!
      </p>

      {/* Round indicator */}
      <div className="round-badge">
        {COUNT_ROUNDS.map((r, i) => (
          <div key={i} className={`round-pip ${i < round ? 'done' : i === round ? 'active' : 'pending'}`}>
            {i < round ? '✓' : `${r.side}²`}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 12 }}>
        {/* Tile grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${currentRound.side}, ${tileSize}px)`,
          gap: '4px',
          background: 'rgba(0,0,0,0.2)',
          padding: '10px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {Array.from({ length: totalTiles }).map((_, i) => (
            <div
              key={i}
              onClick={() => handleTileClick(i)}
              style={{
                width: tileSize, height: tileSize,
                background: clickedTiles.has(i)
                  ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${clickedTiles.has(i) ? 'var(--gold-dark)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px',
                cursor: clickedTiles.has(i) ? 'default' : 'pointer',
                transition: 'background 0.25s, transform 0.15s',
                transform: clickedTiles.has(i) ? 'scale(0.93)' : 'scale(1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1a1a2e', fontWeight: 800,
                fontSize: `${Math.max(10, tileSize * 0.38)}px`,
                boxShadow: clickedTiles.has(i) ? '0 2px 8px rgba(255,193,7,0.3)' : 'none',
              }}
            >
              {clickedTiles.has(i) ? '✓' : ''}
            </div>
          ))}
        </div>

        {/* Live count */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
            {doneCount}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            of {totalTiles} tiles
          </div>
          <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {Math.round((doneCount / totalTiles) * 100)}% done
          </div>
        </div>
      </div>

      {!isComplete && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <button className="btn-hint" onClick={() => setShowHint(true)} id="s3-hint-btn">
            💡 Need a Hint?
          </button>
        </div>
      )}

      {isComplete && (
        <div className="station-success-box">
          <div className="station-success-formula">
            🎉 The area is <strong>{totalTiles}</strong> square unit{totalTiles !== 1 ? 's' : ''}!
          </div>
          <button className="btn btn-primary" onClick={handleAdvance} id="s3-advance-btn">
            {round < COUNT_ROUNDS.length - 1 ? 'Next Square ➡️' : '🚀 Complete Simulation!'}
          </button>
        </div>
      )}

      {showHint && <HintPopup hint={currentRound.hint} onClose={() => setShowHint(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main SimulatePhase
// ─────────────────────────────────────────────
export default function SimulatePhase({ onComplete, onBack, audioEnabled }) {
  const [station, setStation] = useState(0);

  const nextStation = useCallback(() => {
    if (audioEnabled) playClick();
    if (station < 2) setStation(s => s + 1);
  }, [station, audioEnabled]);

  const handleSkip = () => {
    if (audioEnabled) playClick();
    onComplete();
  };

  return (
    <div className="simulate-phase w-full flex flex-col items-center">
      <div className="simulate-header w-full max-w-4xl text-center" style={{ marginBottom: '32px' }}>
        <h3 className="simulate-label flex items-center justify-center gap-3" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
          🧪 Time Sandbox
        </h3>
      </div>

      <div className="progress-dots" style={{ marginBottom: '32px' }}>
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} style={{ width: '16px', height: '16px', marginBottom: '8px' }} />
            <span className="simulate-dot-label" style={{ fontSize: '1.5rem' }}>{s.icon}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl mt-6" style={{ minHeight: '420px' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>

      <div className="sim-nav w-full max-w-4xl" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => { onBack(); }} className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)' }}>← Back</button>
        <button onClick={() => { onComplete(); }} className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)' }}>Skip Phase →</button>
      </div>
    </div>
  );
}
