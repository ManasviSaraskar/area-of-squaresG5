import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { stopNarration } from './utils/audio';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];
const JOURNEY_ITEMS = [
  { id: 'wonder', icon: '🔍', label: 'Wonder' },
  { id: 'story', icon: '📖', label: 'Story' },
  { id: 'simulate', icon: '🧪', label: 'Simulate' },
  { id: 'play', icon: '🎮', label: 'Practice' },
  { id: 'reflect', icon: '📓', label: 'Reflect' },
];

// Page transition variants — matching reffolder style
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } },
};

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
      {/* Floating background elements */}
      <div className="floating-numbers">
        <div className="floating-number" style={{ top: '10%', left: '8%', animationDelay: '0s' }}>📐</div>
        <div className="floating-number" style={{ top: '25%', right: '12%', animationDelay: '3s' }}>🟦</div>
        <div className="floating-number" style={{ bottom: '30%', left: '15%', animationDelay: '6s' }}>✖️</div>
        <div className="floating-number" style={{ bottom: '15%', right: '8%', animationDelay: '9s' }}>🔢</div>
      </div>

      <div className="app-container">
        {/* Audio Mute Button — lucide icons like reffolder */}
        <button
          onClick={toggleAudio}
          className="audio-toggle-btn"
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled
            ? <Volume2 className="w-6 h-6 text-white" />
            : <VolumeX className="w-6 h-6 text-red-400" />}
        </button>

        {/* Home Button */}
        {showJourney && (
          <button className="home-btn" onClick={requestHome} aria-label="Return to home">
            🏠 Home
          </button>
        )}

        {/* Journey Progress Bar — reffolder style */}
        {showJourney && (
          <div className="journey-bar" role="navigation" aria-label="Learning journey progress">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1;
              const isActive = phaseIndex === stepPhaseIndex;
              const isPast = phaseIndex > stepPhaseIndex;
              return (
                <div key={i} className="journey-step-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`journey-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                    <div className="journey-step-dot">
                      {isPast ? '✓' : item.icon}
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

        {/* Phase Content — AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" {...pageVariants} style={{ width: '100%' }}>
              <IntroScreen
                onStart={() => setPhase('wonder')}
                audioEnabled={audioEnabled}
                onToggleAudio={toggleAudio}
              />
            </motion.div>
          )}
          {phase === 'wonder' && (
            <motion.div key="wonder" {...pageVariants} style={{ width: '100%' }}>
              <WonderPhase
                onComplete={() => setPhase('story')}
                onBack={() => setPhase('intro')}
                audioEnabled={audioEnabled}
              />
            </motion.div>
          )}
          {phase === 'story' && (
            <motion.div key="story" {...pageVariants} style={{ width: '100%' }}>
              <StoryPhase
                onComplete={() => setPhase('simulate')}
                onBack={() => setPhase('wonder')}
                audioEnabled={audioEnabled}
              />
            </motion.div>
          )}
          {phase === 'simulate' && (
            <motion.div key="simulate" {...pageVariants} style={{ width: '100%' }}>
              <SimulatePhase
                onComplete={() => setPhase('play')}
                onBack={() => setPhase('story')}
                audioEnabled={audioEnabled}
              />
            </motion.div>
          )}
          {phase === 'play' && (
            <motion.div key="play" {...pageVariants} style={{ width: '100%' }}>
              <PlayPhase
                onComplete={(stats) => { setPlayStats(stats); setPhase('reflect'); }}
                onBack={() => setPhase('simulate')}
                audioEnabled={audioEnabled}
              />
            </motion.div>
          )}
          {phase === 'reflect' && (
            <motion.div key="reflect" {...pageVariants} style={{ width: '100%' }}>
              <ReflectPhase
                stats={playStats}
                onRestart={restart}
                onGoHome={confirmHome}
                onBack={() => setPhase('play')}
                audioEnabled={audioEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
