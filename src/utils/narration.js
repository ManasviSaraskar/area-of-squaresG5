import { say, ask, cheer, emphasize, think, instruct, encourage } from './audio';

export function getWonderNarration() {
  return [
    think("John wants to cover his bedroom floor with cool new square tiles."),
    ask("If his room is a big square, how many tiles will he need? Let's find out about area!")
  ];
}

export function getStoryPanelNarration(panelId) {
  switch (panelId) {
    case 1:
      return [say("John is waiting at the station. He looks down at the floor and notices the beautiful square tiles. Wow, if I count the tiles in a square, I can find its area! he says.")];
    case 2:
      return [say("Sarah looks at a giant square window. It's divided into smaller square glass panes. If the window has 3 panes across and 3 down, there are 9 panes total! she calculates.")];
    case 3:
      return [say("Mike is drawing pixel art on his computer. Every character is made of tiny squares! A 4 by 4 pixel block takes 16 squares to fill, Mike explains to his friends.")];
    case 4:
      return [say("Emma weaves a cozy carpet using square patches. If I want an area of 25, I need a side length of 5 patches! she realizes. She carefully stitches them together.")];
    case 5:
      return [cheer("John, Sarah, Mike, and Emma reunite. They discovered that area is everywhere! Now it's your turn to measure the world around you using squares!")];
    default:
      return [];
  }
}

export function getSimulateIntro(stationId) {
  switch(stationId) {
    case 0:
      return [instruct("Tap the glowing dots in order to draw a square!")];
    case 1:
      return [instruct("Tap the tiles to paint a square with the target area!")];
    case 2:
      return [instruct("Tap every tile inside the square to find its area!")];
    default:
      return [];
  }
}

export function getFeedbackNarration(isCorrect, attemptCount) {
  if (isCorrect) {
    return [cheer("Amazing! You found the shape's secret! You're a geometry star!")];
  } else if (attemptCount === 1) {
    return [encourage("Not quite! Let's look at this shape again.")];
  } else {
    return [think("Let's count together!")];
  }
}

export function getHintNarration(hintText) {
  return [think(hintText)];
}

export function getAchievementNarration(achievementName) {
  return [cheer(`Fantastic! You unlocked the achievement: ${achievementName}! Keep going!`)];
}

export function getReflectNarration() {
  return [
    think("What a journey around the world! Can you find a square in your own room and calculate its area?"),
    cheer("Lesson complete! You are an Area of Squares Champion!")
  ];
}

export function getQuestionNarration(questionText) {
  return [ask(questionText)];
}
