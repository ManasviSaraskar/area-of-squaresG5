import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice

const STYLE_SETTINGS = {
  celebration: { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question: { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis: { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking: { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction: { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const phrases = [
  // Wonder
  { text: "John wants to cover his bedroom floor with cool new square tiles.", style: 'thinking' },
  { text: "If his room is a big square, how many tiles will he need? Let's find out about area!", style: 'question' },
  
  // Story
  { text: "John is waiting at the station. He looks down at the floor and notices the beautiful square tiles. Wow, if I count the tiles in a square, I can find its area! he says.", style: 'statement' },
  { text: "Sarah looks at a giant square window. It's divided into smaller square glass panes. If the window has 3 panes across and 3 down, there are 9 panes total! she calculates.", style: 'statement' },
  { text: "Mike is drawing pixel art on his computer. Every character is made of tiny squares! A 4 by 4 pixel block takes 16 squares to fill, Mike explains to his friends.", style: 'statement' },
  { text: "Emma weaves a cozy carpet using square patches. If I want an area of 25, I need a side length of 5 patches! she realizes. She carefully stitches them together.", style: 'statement' },
  { text: "John, Sarah, Mike, and Emma reunite. They discovered that area is everywhere! Now it's your turn to measure the world around you using squares!", style: 'celebration' },
  
  // Simulate
  { text: "Tap the glowing dots in order to draw a square!", style: 'instruction' },
  { text: "Tap the tiles to paint a square with the target area!", style: 'instruction' },
  { text: "Tap every tile inside the square to find its area!", style: 'instruction' },
  
  // Feedback
  { text: "Amazing! You found the shape's secret! You're a geometry star!", style: 'celebration' },
  { text: "Not quite! Let's look at this shape again.", style: 'encouragement' },
  { text: "Let's count together!", style: 'thinking' },
  
  // Reflect
  { text: "What a journey around the world! Can you find a square in your own room and calculate its area?", style: 'thinking' },
  { text: "Lesson complete! You are an Area of Squares Champion!", style: 'celebration' },

  // World 1 Questions
  { text: "If a square courtyard is made of 2 rows of 2 tiles, what is its area?", style: 'question' },
  { text: "A small square mosaic has 3 columns and 3 rows. How many total tiles (area) is it?", style: 'question' },
  { text: "What do we call the total space covered by the tiles inside a square?", style: 'question' },
  { text: "If a square has side length of 1 unit, what is its area?", style: 'question' },
  { text: "If we double the side length of a 1x1 square to 2x2, what happens to its area?", style: 'question' },

  // World 2 Questions
  { text: "A pixel art block is a square with side length 4. What is its area?", style: 'question' },
  { text: "If a square window pane has a side of 5 units, what is its area?", style: 'question' },
  { text: "Which formula is correct for finding the Area of a Square?", style: 'question' },
  { text: "If a square has side length of 6, what is its area?", style: 'question' },
  { text: "What is the area of a square with a side length of 7?", style: 'question' },

  // World 3 Questions
  { text: "A square plaza in Grid City has an area of 100 square blocks. What is its side length?", style: 'question' },
  { text: "If a square carpet has an area of 64 square units, how long is one side?", style: 'question' },
  { text: "Which square has the largest area?", style: 'question' },
  { text: "If you have 81 small square tiles, can you make a perfect large square?", style: 'question' },
  { text: "A perfect square with a side of 10 has an area of...", style: 'question' }
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 50).replace(/_+$/, '');
}

async function generateAudio() {
  const audioDir = path.join(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const audioMap = {};
  
  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = slugify(text);
    const filename = `audio_${slug}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    audioMap[text] = `/assets/audio/${filename}`;
    
    if (fs.existsSync(filepath)) {
      console.log(`Skipping existing: ${filename}`);
      continue;
    }
    
    console.log(`Generating: ${text}`);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: STYLE_SETTINGS[style] || STYLE_SETTINGS.statement
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      
      // Rate limiting 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error(`Error generating audio for "${text}":`, e);
    }
  }

  const mapPath = path.join(__dirname, '../src/utils/audioMap.js');
  const mapContent = `export const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  
  const utilsDir = path.join(__dirname, '../src/utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  fs.writeFileSync(mapPath, mapContent);
  console.log('Done generating audio and audioMap.js');
}

generateAudio();
