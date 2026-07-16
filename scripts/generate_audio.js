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
  { text: "John is building a kite for the Tokyo Kite Festival.", style: 'thinking' },
  { text: "Its frame needs two sticks that never cross, no matter how far they stretch.", style: 'thinking' },
  { text: "What kind of lines does John need? Let's find out!", style: 'question' },
  
  // Story
  { text: "John waits at the station. The Global Shapes Express only stops at stations that follow shapes! Every door, every window, every arch around us is a shape, the conductor says.", style: 'statement' },
  { text: "Sarah arrives in London. She notices Big Ben's huge circular clock face. The windows in the buildings are squares. A circle is perfectly round with no corners, says Sarah.", style: 'statement' },
  { text: "Mike visits a pagoda in Tokyo. Every roof is a triangle! Even Mount Fuji in the distance is a giant triangle shape. A triangle has 3 sides and 3 corners, Mike says proudly.", style: 'statement' },
  { text: "Emma stands before the Pyramids in Egypt. Each face of a pyramid is a giant triangle! The ancient Egyptians used triangle shapes to build structures that last thousands of years! Emma gasps.", style: 'statement' },
  { text: "John, Sarah, Mike, and Emma reunite at the final station. They discovered circles, squares, triangles, and rectangles everywhere they went. Now it's your turn to find shapes in the world around you!", style: 'celebration' },
  
  // Simulate
  { text: "Tap two lines and tell me — are they parallel, perpendicular, or neither?", style: 'instruction' },
  { text: "Look at the angle. Is it a right angle, an acute angle, or an obtuse angle?", style: 'instruction' },
  { text: "Look at the shape. How many sides does it have?", style: 'instruction' },
  
  // Feedback
  { text: "Amazing! You found the shape's secret! You're a geometry star!", style: 'celebration' },
  { text: "Not quite! Let's look at this shape again.", style: 'encouragement' },
  { text: "Let's count together!", style: 'thinking' },
  
  // Reflect
  { text: "What a journey around the world! Can you find a right angle in your own room?", style: 'thinking' },
  { text: "Lesson complete! You are a Global Shape Quest Champion!", style: 'celebration' },

  // World 1 Questions
  { text: "Look at the railway tracks. Are they parallel, perpendicular, or neither?", style: 'question' },
  { text: "Look at the window grid. Are the crossing lines parallel, perpendicular, or neither?", style: 'question' },
  { text: "Look at the bridge cables. Are they parallel, perpendicular, or neither?", style: 'question' },
  { text: "Look at the road crossing. Are the lines parallel, perpendicular, or neither?", style: 'question' },
  { text: "Look at the fence posts. Are they parallel, perpendicular, or neither?", style: 'question' },

  // World 2 Questions
  { text: "Is the corner of this book a right angle, an acute angle, or an obtuse angle?", style: 'question' },
  { text: "Is the tip of this pizza slice a right angle, an acute angle, or an obtuse angle?", style: 'question' },
  { text: "Is the roof of this house a right angle, an acute angle, or an obtuse angle?", style: 'question' },
  { text: "Is the corner of a square a right angle, an acute angle, or an obtuse angle?", style: 'question' },
  { text: "Is the point of this star a right angle, an acute angle, or an obtuse angle?", style: 'question' },

  // World 3 Questions
  { text: "This shape has 3 sides and 3 corners. What is it called?", style: 'question' },
  { text: "This shape has 4 equal sides and 4 right angles. What is it called?", style: 'question' },
  { text: "This shape has 5 sides and 5 corners. What is it called?", style: 'question' },
  { text: "This shape has 6 sides and 6 corners. What is it called?", style: 'question' },
  { text: "This shape has 4 sides, but only the opposite sides are equal. What is it called?", style: 'question' },
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
