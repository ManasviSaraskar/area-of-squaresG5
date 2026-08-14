import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getFeedbackNarration, getQuestionNarration, getAchievementNarration } from '../utils/narration';
import { questionBank } from '../data/questionBank';
import { worldMap } from '../data/worldMap';
import QuestionRenderer from './QuestionRenderer';

// World theming
const WORLD_THEMES = [
  { color: '#ff7043', bg: 'rgba(255,112,67,0.15)', icon: '🏛️', border: 'rgba(255,112,67,0.35)' },
  { color: '#6366f1', bg: 'rgba(99,102,241,0.15)', icon: '🎨', border: 'rgba(99,102,241,0.35)' },
  { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🌆', border: 'rgba(16,185,129,0.35)' },
];

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_correct', icon: '🎯', name: 'First Hit!',        xpBonus: 5,  trigger: (s, st) => s === 1 && st === 0 },
  { id: 'streak_3',      icon: '🔥', name: 'On Fire!',          xpBonus: 15, trigger: (s, st) => st === 3 },
  { id: 'half_way',      icon: '⚡', name: 'Halfway Champion!', xpBonus: 20, trigger: (s, st, qi, wl) => qi === Math.floor(wl / 2) - 1 },
  { id: 'perfect_world', icon: '🏆', name: 'Perfect World!',    xpBonus: 30, trigger: (s, st, qi, wl) => qi === wl - 1 && s === wl },
];

function AchievementPopup({ achievement, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="popup-overlay" style={{ zIndex: 600 }}>
      <div className="achievement-card">
        <div className="achievement-badge-icon">{achievement.icon}</div>
        <div className="achievement-title">Achievement Unlocked!</div>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-xp">+{achievement.xpBonus} Bonus XP</div>
        <button className="btn btn-primary btn-sm" onClick={onClose} id="achievement-close-btn">
          Awesome! 🎉
        </button>
      </div>
    </div>
  );
}

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
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [currentAchievement, setCurrentAchievement] = useState(null);

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

  // Narrate question when it appears
  useEffect(() => {
    if (q && !answered && audioEnabled) {
      setTimeout(() => narrate(getQuestionNarration(q.questionText)), 300);
    }
  }, [q?.id, answered, audioEnabled]);

  const finishWorld = useCallback(() => {
    const stars = score >= 6 ? 3 : score >= 4 ? 2 : score >= 2 ? 1 : 0;
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
      worldResults: {
        ...worldResults,
        [currentWorld]: {
          score, total: worldQuestions.length,
          stars: score >= 6 ? 3 : score >= 4 ? 2 : score >= 2 ? 1 : 0,
        },
      },
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

  const checkAchievements = useCallback((newScore, newStreak, newQIndex) => {
    for (const ach of ACHIEVEMENTS) {
      if (!unlockedAchievements.has(ach.id)) {
        if (ach.trigger(newScore, newStreak, newQIndex, worldQuestions.length)) {
          setUnlockedAchievements(prev => new Set([...prev, ach.id]));
          setCurrentAchievement(ach);
          setTotalXP(x => x + ach.xpBonus);
          if (audioEnabled) setTimeout(() => narrate(getAchievementNarration(ach.name)), 500);
          break;
        }
      }
    }
  }, [unlockedAchievements, worldQuestions.length, audioEnabled]);

  const handleAnswer = useCallback((isCorrect) => {
    setAnswered(true);
    if (isCorrect) {
      const ns = streak + 1;
      const earned = 10 + (ns >= 3 ? 5 : 0);
      const newScore = score + 1;
      setScore(newScore);
      setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      setTotalXP(x => x + earned);
      setXpPopup(`+${earned} XP`);
      setTimeout(() => setXpPopup(null), 1500);
      setFeedback({
        type: 'correct',
        message: ns >= 5 ? `🔥 ${ns} Streak! Incredible!` : ns >= 3 ? `🔥 ${ns} Streak!` : 'Correct! 🎉',
        sub: ns >= 3 ? 'Streak bonus earned!' : 'Well done, keep it up!',
      });
      if (audioEnabled) setTimeout(() => narrate(getFeedbackNarration(true, 1)), 400);
      setTimeout(() => checkAchievements(newScore, ns, qIndex), 500);
      setTimeout(advance, 2200);
    } else {
      setStreak(0);
      setLives(l => l - 1);
      setFeedback({
        type: 'wrong',
        message: 'Not quite!',
        sub: 'Check the correct answer highlighted below.',
        correctAnswer: q?.correctAnswer,
      });
      if (audioEnabled) setTimeout(() => narrate(getFeedbackNarration(false, 1)), 400);
      if (lives - 1 <= 0) setTimeout(finishWorld, 2800);
      else setTimeout(advance, 2800);
    }
  }, [streak, score, advance, lives, finishWorld, audioEnabled, q, qIndex, checkAchievements]);

  // ── World Map View ──
  if (currentWorld < 0) {
    const allDone = worldMap.every((_, i) => worldResults[i]);
    return (
      <div className="practice-phase w-full flex flex-col items-center">
        <div className="play-header">
          <h2 className="play-title">🎯 Choose Your World!</h2>
          <p className="play-subtitle">Complete each world to unlock the next. Earn stars and XP!</p>
          {totalXP > 0 && <div className="play-xp-badge">✨ {totalXP} XP Earned</div>}
        </div>

        <div className="world-map">
          {worldMap.map((w, i) => {
            const theme = WORLD_THEMES[i];
            const unlocked = i === 0 || worldResults[i - 1];
            const completed = worldResults[i];
            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{
                  borderColor: completed ? 'var(--green)' : unlocked ? theme.border : 'rgba(255,255,255,0.08)',
                  boxShadow: unlocked && !completed ? `0 0 20px ${theme.bg}` : 'none',
                }}
                id={`world-card-${i}`}
              >
                {!unlocked && <div className="world-lock">🔒</div>}

                <div className="world-card-icon" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                  {theme.icon}
                </div>

                <div className="world-card-info">
                  <div className="world-name" style={{ color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {w.name}
                  </div>
                  <div className="world-desc">{w.focus}</div>

                  {completed ? (
                    <div className="world-stars">
                      {[1, 2, 3].map(s => (
                        <span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2 }}>⭐</span>
                      ))}
                      <span className="world-score">{completed.score}/{completed.total}</span>
                    </div>
                  ) : unlocked ? (
                    <div className="world-play-badge" style={{ color: theme.color, borderColor: theme.border, background: theme.bg }}>
                      ▶ PLAY
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {allDone && (
          <button
            className="btn btn-green btn-lg"
            onClick={handleAllComplete}
            style={{ marginTop: 24, animation: 'popIn 0.5s ease' }}
            id="complete-challenge-btn"
          >
            🏆 Complete Challenge!
          </button>
        )}
      </div>
    );
  }

  // ── World Complete View ──
  if (worldComplete) {
    const w = worldMap[currentWorld];
    const theme = WORLD_THEMES[currentWorld];
    const stars = score >= 6 ? 3 : score >= 4 ? 2 : score >= 2 ? 1 : 0;
    const isLastWorld = currentWorld === worldMap.length - 1;
    const pct = Math.round((score / worldQuestions.length) * 100);
    return (
      <div className="practice-phase w-full flex flex-col items-center">
        <div className="world-complete-card">
          <div className="world-complete-icon">🎉</div>
          <h2 className="world-complete-title">{w.name} Complete!</h2>
          <div className="world-complete-score">
            {score}/{worldQuestions.length}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: 8 }}>({pct}%)</span>
          </div>
          <div className="world-complete-stars">
            {[1, 2, 3].map(s => (
              <span key={s} className={`world-star ${s <= stars ? 'earned' : ''}`} style={{ animationDelay: `${s * 0.2}s` }}>⭐</span>
            ))}
          </div>
          <div className="world-complete-xp">✨ {totalXP} XP earned so far</div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={backToMap} id="back-to-map-btn">
              ⬅️ World Map
            </button>
            {isLastWorld ? (
              <button className="btn btn-green" onClick={handleAllComplete} id="finish-btn">
                🏆 Finish!
              </button>
            ) : (
              <button
                className="btn btn-primary"
                id="next-world-btn"
                onClick={() => {
                  setWorldResults(prev => ({
                    ...prev,
                    [currentWorld]: { score, total: worldQuestions.length, stars },
                  }));
                  startWorld(currentWorld + 1);
                }}
              >
                Next World ➡️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Question View ──
  if (!q) return null;
  const w = worldMap[currentWorld];
  const theme = WORLD_THEMES[currentWorld];
  const pct = Math.round((qIndex / worldQuestions.length) * 100);

  return (
    <div className="practice-phase w-full flex flex-col items-center">
      {/* World badge */}
      <div
        className="play-world-badge"
        style={{ background: theme.color + 'cc', border: `1px solid ${theme.border}` }}
      >
        {theme.icon} {w.name}
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-item xp-hud">✨ {totalXP} XP</div>
        <div className="hearts" aria-label={`${lives} lives remaining`}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2, transition: 'opacity 0.3s' }}>❤️</span>
          ))}
        </div>
        <div className={`hud-item streak-hud ${streak >= 3 ? 'streak-fire' : ''}`}>
          🔥 {streak}x
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 700, marginBottom: 16 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Question {qIndex + 1} of {worldQuestions.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="glass-card shadow-2xl relative" style={{ width: "100%", maxWidth: "800px", padding: "40px", borderRadius: "24px", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", animation: 'slideUp 0.3s ease' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb703] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00f5d4] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <QuestionRenderer
          question={q}
          onAnswer={handleAnswer}
          disabled={answered}
          audioEnabled={audioEnabled}
        />
      </div>

      {/* XP popup */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Feedback overlay */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '💡'}</div>
            <div className="feedback-message">{feedback.message}</div>
            {feedback.sub && <div className="feedback-sub">{feedback.sub}</div>}
            {feedback.type === 'wrong' && feedback.correctAnswer && (
              <div className="feedback-correct-answer">
                ✅ Correct: {feedback.correctAnswer}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
      )}
    </div>
  );
}
