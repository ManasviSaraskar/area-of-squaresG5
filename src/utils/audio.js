import { audioMap } from './audioMap.js';

let currentAudio = null;
let currentQueue = Symbol();

export function getAudioUrl(text) {
  if (audioMap[text]) {
    return audioMap[text];
  }
  console.warn("Audio not found for text:", text);
  return null;
}

export function playAudio(url) {
  return new Promise((resolve) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = resolve;
    audio.onerror = resolve;
    audio.play().catch(resolve);
  });
}

export async function narrate(segments) {
  const queueId = Symbol();
  currentQueue = queueId;

  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== queueId) return;

    const { text } = segments[i];
    const url = getAudioUrl(text);
    
    if (url) {
      // Preload next
      if (i + 1 < segments.length) {
        const nextUrl = getAudioUrl(segments[i + 1].text);
        if (nextUrl) {
          const preload = new Audio();
          preload.src = nextUrl;
          preload.load();
        }
      }
      
      await playAudio(url);
    }
  }
}

export function stopNarration() {
  currentQueue = Symbol();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}

export function say(text) { return { text, style: 'statement' }; }
export function ask(text) { return { text, style: 'question' }; }
export function cheer(text) { return { text, style: 'celebration' }; }
export function emphasize(text) { return { text, style: 'emphasis' }; }
export function think(text) { return { text, style: 'thinking' }; }
export function instruct(text) { return { text, style: 'instruction' }; }
export function encourage(text) { return { text, style: 'encouragement' }; }
