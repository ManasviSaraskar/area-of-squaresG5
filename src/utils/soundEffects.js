const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

let audioCtx = null;

const playTone = (frequency, type, duration, vol) => {
  if (!audioCtx) audioCtx = createAudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playClick = () => {
  try {
    playTone(600, 'sine', 0.1, 0.1);
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
};

export const playSuccess = () => {
  try {
    playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(600, 'sine', 0.15, 0.15), 100);
    setTimeout(() => playTone(800, 'sine', 0.3, 0.2), 250);
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
};

export const playError = () => {
  try {
    playTone(200, 'square', 0.2, 0.1);
    setTimeout(() => playTone(150, 'square', 0.3, 0.1), 150);
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
};
