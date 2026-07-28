import React, { useState, useCallback } from 'react';

function Visual({ question }) {
  if (!question.image) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <img
        src={question.image}
        alt="Geometry Visual"
        style={{ maxWidth: '240px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
      />
    </div>
  );
}

function HintPopup({ hint, onClose }) {
  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" aria-label="Hint">
      <div className="popup-card">
        <div className="popup-icon">💡</div>
        <h3 className="popup-title">Here's a Hint!</h3>
        <div className="hint-popup-box">
          <p>{hint}</p>
        </div>
        <div className="popup-actions">
          <button className="btn btn-primary btn-sm" onClick={onClose} id="hint-close-btn">
            Got it! ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionRenderer({ question, onAnswer, disabled, audioEnabled }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredState, setAnsweredState] = useState(null); // 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);

  const handleOptionClick = useCallback((option) => {
    if (disabled || answeredState) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setAnsweredState(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
      setAnsweredState(null);
    }, isCorrect ? 800 : 1200);
  }, [disabled, answeredState, question.correctAnswer, onAnswer]);

  const getOptionClass = (opt) => {
    const base = 'option-btn';
    const isCorrect = String(opt) === String(question.correctAnswer);
    if (selectedOption === opt) {
      if (answeredState === 'correct') return `${base} correct`;
      if (answeredState === 'wrong') return `${base} wrong`;
    }
    // After wrong answer: reveal correct answer
    if (answeredState === 'wrong' && isCorrect) return `${base} reveal-correct`;
    if (disabled && isCorrect) return `${base} reveal-correct`;
    if (disabled) return `${base} disabled`;
    return base;
  };

  const typeLabel = {
    area_count: '🟦 COUNTING AREA',
    area_calc:  '✖️ FORMULA',
    area_reverse: '🔢 RELATIONSHIPS',
  }[question.type] || '📐 AREA OF SQUARES';

  return (
    <div>
      {/* Question type badge */}
      <div
        className="question-badge"
        style={{
          background: 'var(--coral)',
          color: 'white',
        }}
      >
        {typeLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{question.questionText}</p>

      {/* Optional image */}
      <Visual question={question} />

      {/* Answer options */}
      {question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={getOptionClass(opt)}
              onClick={() => handleOptionClick(opt)}
              disabled={disabled || !!answeredState}
              id={`option-${i}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Hint button */}
      {question.hint && !disabled && !answeredState && (
        <div className="hint-row">
          <button
            className="btn-hint"
            onClick={() => setShowHint(true)}
            id="hint-btn"
            aria-label="Show hint"
          >
            💡 Need a Hint?
          </button>
        </div>
      )}

      {/* Hint popup */}
      {showHint && (
        <HintPopup
          hint={question.hint}
          onClose={() => setShowHint(false)}
        />
      )}
    </div>
  );
}
