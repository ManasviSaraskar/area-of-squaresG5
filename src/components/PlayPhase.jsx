import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getFeedbackNarration, getQuestionNarration } from '../utils/narration';
import { questionBank } from '../data/questionBank';
import { worldMap } from '../data/worldMap';
import QuestionRenderer from './QuestionRenderer';

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState({});
  const [worldComplete, setWorldComplete] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [xpPopup, setXpPopup] = useState(null);

  const narrationRef = useRef(null);

  const worldQuestions = currentWorld >= 0 ? questionBank.filter(q => q.world === currentWorld) : [];
  const q = worldQuestions[qIndex];

  const startWorld = (idx) => {
    setCurrentWorld(idx);
    setQIndex(0);
    setScore(0);
    setLives(3);
    setWorldComplete(false);
    setAnswered(false);
    setFeedback(null);
  };

  useEffect(() => {
    if (q && !answered && audioEnabled) {
      narrate(getQuestionNarration(q.questionText));
    }
  }, [q, answered, audioEnabled]);

  const finishWorld = useCallback(() => {
    const stars = score >= 4 ? 3 : score >= 3 ? 2 : score >= 2 ? 1 : 0;
    setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
    setWorldComplete(true);
    stopNarration();
  }, [currentWorld, score, worldQuestions.length]);

  const backToMap = useCallback(() => {
    stopNarration();
    setCurrentWorld(-1); setWorldComplete(false); setFeedback(null);
  }, []);

  const handleAllComplete = useCallback(() => {
    stopNarration();
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0) + score;
    const totalQ = Object.values(worldResults).reduce((a, r) => a + r.total, 0) + (worldQuestions.length || 0);
    onComplete({
      score: totalScore, xp: totalXP, maxStreak,
      totalAnswered: totalQ,
      worldResults: { ...worldResults, [currentWorld]: { score, total: worldQuestions.length, stars: score >= 4 ? 3 : 0 } },
    });
  }, [worldResults, score, totalXP, maxStreak, worldQuestions, currentWorld, onComplete]);

  const advance = useCallback(() => {
    setFeedback(null); setAnswered(false);
    if (qIndex + 1 < worldQuestions.length && lives > 0) {
      setQIndex(i => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, lives, finishWorld]);

  const handleAnswer = useCallback((isCorrect) => {
    setAnswered(true);
    stopNarration();
    if (isCorrect) {
      const ns = streak + 1;
      const earned = 10 + (ns >= 3 ? 5 : 0);
      setScore(s => s + 1); setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      setTotalXP(x => x + earned);
      
      setXpPopup(`+${earned} XP`);
      setTimeout(() => setXpPopup(null), 1500);
      setFeedback({ type: 'correct', message: ns >= 3 ? `🔥 ${ns} Streak!` : 'Correct! 🎉' });
      
      if (audioEnabled) narrate(getFeedbackNarration(true, 1));
      setTimeout(advance, 1800);
    } else {
      setStreak(0); setLives(l => l - 1);
      setFeedback({ type: 'wrong', message: 'Not quite!' });
      
      if (audioEnabled) narrate(getFeedbackNarration(false, 1));
      if (lives - 1 <= 0) setTimeout(finishWorld, 2000);
      else setTimeout(advance, 2000);
    }
  }, [streak, advance, lives, finishWorld, audioEnabled]);

  // World Map View
  if (currentWorld < 0) {
    const allDone = worldMap.every((_, i) => worldResults[i]);
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🎯 Play — Choose Your World!</h2>
          <p className="play-subtitle">Beat each world to unlock the next one. Earn stars and XP!</p>
          {totalXP > 0 && <div className="play-xp-badge">✨ {totalXP} XP</div>}
        </div>
        <div className="world-map">
          {worldMap.map((w, i) => {
            const unlocked = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div key={w.id} className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}>
                {!unlocked && <div className="world-lock">🔒</div>}
                <div className="world-icon" style={{fontSize: '2rem'}}>🌍</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.focus}</div>
                {completed && (
                  <div className="world-stars">
                    {[1, 2, 3].map(s => (<span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2 }}>⭐</span>))}
                    <span className="world-score">{completed.score}/{completed.total}</span>
                  </div>
                )}
                {unlocked && !completed && <div className="world-play-btn">▶️ PLAY</div>}
              </div>
            );
          })}
        </div>
        {allDone && (
          <button className="btn btn-green btn-lg" onClick={handleAllComplete} style={{ marginTop: 24, animation: 'bounceIn 0.5s ease' }}>
            🏆 Complete Challenge!
          </button>
        )}
      </div>
    );
  }

  // World Complete View
  if (worldComplete) {
    const w = worldMap[currentWorld];
    const stars = score >= 4 ? 3 : score >= 3 ? 2 : score >= 2 ? 1 : 0;
    const isLastWorld = currentWorld === worldMap.length - 1;
    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">🎉</div>
          <h2 className="world-complete-title">{w.name} Complete!</h2>
          <div className="world-complete-score">{score}/{worldQuestions.length}</div>
          <div className="world-complete-stars">
            {[1, 2, 3].map(s => (
              <span key={s} className={`world-star ${s <= stars ? 'earned' : ''}`} style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
            ))}
          </div>
          <div className="world-complete-xp">✨ {totalXP} XP earned</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap}>⬅️ World Map</button>
            {isLastWorld ? (
              <button className="btn btn-green" onClick={handleAllComplete}>🏆 Finish!</button>
            ) : (
              <button className="btn btn-primary" onClick={() => {
                setWorldResults(prev => ({ ...prev, [currentWorld]: { score, total: worldQuestions.length, stars } }));
                startWorld(currentWorld + 1);
              }}>Next World ➡️</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question View
  if (!q) return null;
  const w = worldMap[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="play-phase">
      <div className="play-world-badge" style={{ background: 'var(--coral)' }}>🌍 {w.name}</div>
      <div className="hud">
        <div className="hud-item">✨ {totalXP}</div>
        <div className="hearts">
          {Array.from({ length: 3 }, (_, i) => (<span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>))}
        </div>
        <div className={`hud-item ${streak >= 3 ? 'streak-fire' : ''}`}>🔥 {streak}x</div>
      </div>
      <div style={{ width: '100%', maxWidth: 700, marginBottom: 16 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Question {qIndex + 1}/{worldQuestions.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
      <div className="question-card" style={{ animation: 'slideUp 0.3s ease' }}>
        <QuestionRenderer question={q} onAnswer={handleAnswer} disabled={answered} />
      </div>
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '❌'}</div>
            <div className="feedback-message">{feedback.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
