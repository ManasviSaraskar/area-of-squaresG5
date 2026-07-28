import { useState, useCallback, useEffect } from 'react';
import { stopNarration } from './utils/audio';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { icon: '🤔', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🎮', label: 'Simulate' },
  { icon: '🎯', label: 'Play' },
  { icon: '✨', label: 'Reflect' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      if (prev) stopNarration();
      return !prev;
    });
  }, []);

  const requestHome = useCallback(() => {
    if (phase === 'intro') return;
    setShowExitConfirm(true);
  }, [phase]);

  const confirmHome = useCallback(() => {
    stopNarration();
    setShowExitConfirm(false);
    setPhase('intro');
    setPlayStats(null);
  }, []);

  const cancelHome = useCallback(() => setShowExitConfirm(false), []);

  const restart = useCallback(() => {
    stopNarration();
    setPhase('wonder');
    setPlayStats(null);
  }, []);

  useEffect(() => {
    return () => stopNarration();
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  const showJourney = phase !== 'intro';

  return (
    <>
      <div className="app-container">
        {/* Audio Toggle — right-center */}
        <button
          className="audio-toggle-btn"
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Home Button */}
        {showJourney && (
          <button className="home-btn" onClick={requestHome} aria-label="Return to home">
            🏠 Home
          </button>
        )}

        {/* Journey Progress Bar */}
        {showJourney && (
          <div className="journey-bar" role="navigation" aria-label="Learning journey progress">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1;
              const isActive = phaseIndex === stepPhaseIndex;
              const isCompleted = phaseIndex > stepPhaseIndex;
              return (
                <div key={i} className="journey-step-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="journey-step-dot">
                      {isCompleted ? '✔' : item.icon}
                    </div>
                    <div className="journey-step-label">{item.label}</div>
                  </div>
                  {i < JOURNEY_ITEMS.length - 1 && (
                    <div className={`journey-connector ${phaseIndex > stepPhaseIndex ? 'filled' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Phase Content */}
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            audioEnabled={audioEnabled}
            onToggleAudio={toggleAudio}
          />
        )}
        {phase === 'wonder' && (
          <WonderPhase
            onComplete={() => setPhase('story')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'story' && (
          <StoryPhase
            onComplete={() => setPhase('simulate')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'simulate' && (
          <SimulatePhase
            onComplete={() => setPhase('play')}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }}
            audioEnabled={audioEnabled}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase
            stats={playStats}
            onRestart={restart}
            onGoHome={confirmHome}
            audioEnabled={audioEnabled}
          />
        )}
      </div>

      {/* Exit Confirm Modal */}
      {showExitConfirm && (
        <div className="popup-overlay" role="dialog" aria-modal="true" aria-label="Exit confirmation">
          <div className="exit-popup-card">
            <div className="popup-icon">🏠</div>
            <h2 className="popup-title">Go Back to Home?</h2>
            <p className="popup-text">
              Your current progress in this phase will be lost. Are you sure you want to exit?
            </p>
            <div className="popup-actions">
              <button className="btn btn-outline btn-sm" onClick={cancelHome}>
                ✖ Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={confirmHome}>
                🏠 Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
