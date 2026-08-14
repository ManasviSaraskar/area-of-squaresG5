import { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { motion } from 'framer-motion';
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
    <div className="story-phase w-full flex flex-col items-center">
      <div className="story-card shadow-2xl" style={{ width: "100%", maxWidth: "1000px", height: "580px", background: "#1d1f3b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", display: "flex", overflow: "hidden", flexDirection: "row" }}>
        
        {/* Left Side: Image area */}
        <div style={{ flex: 1, position: "relative", background: "#090a15", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} onError={e => { e.currentTarget.style.display = 'none'; }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "80px", background: "linear-gradient(to left, #1d1f3b, transparent)" }} />
        </div>

        {/* Right Side: Content area */}
        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left", zIndex: 10, fontSize: "1.5rem" }}>
          <motion.h2 
            key={`title-${slide}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-black text-[#ffb703] mb-6 drop-shadow-md" style={{ fontSize: "3rem" }}
          >
            {s.title}
          </motion.h2>

          <motion.p 
            key={`text-${slide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/90 font-medium" style={{ fontSize: "1.8rem", lineHeight: "1.6" }}
          >
            {s.text}
          </motion.p>
          
          <motion.div
            key={`hl-${slide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px", padding: "12px 20px", background: "rgba(255,193,7,0.1)", border: "1px solid rgba(255,193,7,0.3)", borderRadius: "12px" }}
          >
             <span style={{ fontSize: "1.5rem" }}>🦊</span>
             <span style={{ color: "var(--gold)", fontSize: "1.2rem", fontWeight: "bold" }}>{s.mascotLine}</span>
          </motion.div>
        </div>

      </div>

      {/* Nav */}
      <div className="flex justify-between w-full max-w-6xl mt-8 px-4 items-center">
        <button onClick={() => { stopNarration(); goPrev(); }} className="btn btn-outline text-lg" disabled={slide === 0}>← Back</button>
        <div className="flex gap-2">
          {storyPanels.map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === slide ? 'bg-[#ffb703] scale-125' : 'bg-white/20'}`} />
          ))}
        </div>
        <button 
          onClick={goNext} 
          className="btn btn-primary text-lg"
        >
          {isLast ? "To Sandbox →" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
