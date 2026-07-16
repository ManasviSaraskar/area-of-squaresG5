import { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { getStoryPanelNarration } from '../utils/narration';
import { storyPanels } from '../data/storyContent';

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [hlVisible, setHlVisible] = useState(false);

  const s = storyPanels[slide];
  const isLast = slide === storyPanels.length - 1;
  const pct = ((slide + 1) / storyPanels.length) * 100;

  // Trigger reveal animations on slide change
  useEffect(() => {
    setTextVisible(false);
    setHlVisible(false);
    const t1 = setTimeout(() => setTextVisible(true), 150);
    const t2 = setTimeout(() => setHlVisible(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  // Narrate on reveal
  useEffect(() => {
    if (textVisible && audioEnabled) {
      narrate(getStoryPanelNarration(s.id));
    }
  }, [textVisible, slide, audioEnabled, s.id]);

  const transition = useCallback((fn) => {
    if (flipping) return;
    stopNarration();
    setFlipping(true);
    setTimeout(() => { fn(); setFlipping(false); }, 380);
  }, [flipping]);

  const goNext = useCallback(() => {
    transition(() => isLast ? onComplete() : setSlide(i => i + 1));
  }, [transition, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (slide === 0) return;
    transition(() => setSlide(i => i - 1));
  }, [transition, slide]);

  const replay = useCallback(() => {
    stopNarration();
    setTimeout(() => narrate(getStoryPanelNarration(s.id)), 100);
  }, [s.id]);

  return (
    <div className="story-page">

      {/* Progress bar */}
      <div className="story-progress-strip">
        <div className="story-progress-track">
          <div className="story-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="story-progress-label">{slide + 1} / {storyPanels.length}</span>
      </div>

      {/* Story card */}
      <div className={`story-card-new${flipping ? ' story-card-flip' : ''}`}>

        {/* Image section — fixed height, rounded top corners */}
        <div className="story-card-image-wrap">
          <img
            src={s.image}
            alt={s.title}
            className="story-img"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          {/* Gradient overlay + title at bottom-left of image */}
          <div className="story-image-gradient-overlay" />
          <div className="story-image-title-overlay">
            <h2 className="story-card-title">{s.title}</h2>
          </div>
        </div>

        {/* Text body */}
        <div className="story-card-body">
          <p className={`story-card-text${textVisible ? ' story-text-visible' : ''}`}>
            {s.text}
          </p>

          {/* Gold highlight pill */}
          <div className={`story-card-highlight${hlVisible ? ' story-highlight-visible' : ''}`}>
            {s.highlight}
          </div>

          {/* Mascot + speech bubble */}
          <div className="story-mascot-row">
            <div className="story-mascot-avatar">🦊</div>
            <div className="story-mascot-bubble">{s.mascotLine}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav-row">
        <button
          className="btn-story-outline"
          onClick={goPrev}
          disabled={slide === 0}
        >
          ← Back
        </button>

        <div className="story-dots-row">
          {storyPanels.map((_, i) => (
            <div
              key={i}
              className={`story-dot-new${i === slide ? ' active' : i < slide ? ' done' : ''}`}
            />
          ))}
        </div>

        {audioEnabled && (
          <button className="btn-story-outline" onClick={replay} title="Replay narration">
            🔊 Replay
          </button>
        )}

        <button
          className={`btn-story-next${isLast ? ' btn-story-finish' : ''}`}
          onClick={goNext}
        >
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>

    </div>
  );
}
