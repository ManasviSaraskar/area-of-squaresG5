import { say, ask, cheer, emphasize, think, instruct, encourage } from './audio';

export function getWonderNarration() {
  return [
    think("John is building a kite for the Tokyo Kite Festival."),
    think("Its frame needs two sticks that never cross, no matter how far they stretch."),
    ask("What kind of lines does John need? Let's find out!")
  ];
}

export function getStoryPanelNarration(panelId) {
  switch (panelId) {
    case 1:
      return [say("John waits at the station. The Global Shapes Express only stops at stations that follow shapes! Every door, every window, every arch around us is a shape, the conductor says.")];
    case 2:
      return [say("Sarah arrives in London. She notices Big Ben's huge circular clock face. The windows in the buildings are squares. A circle is perfectly round with no corners, says Sarah.")];
    case 3:
      return [say("Mike visits a pagoda in Tokyo. Every roof is a triangle! Even Mount Fuji in the distance is a giant triangle shape. A triangle has 3 sides and 3 corners, Mike says proudly.")];
    case 4:
      return [say("Emma stands before the Pyramids in Egypt. Each face of a pyramid is a giant triangle! The ancient Egyptians used triangle shapes to build structures that last thousands of years! Emma gasps.")];
    case 5:
      return [cheer("John, Sarah, Mike, and Emma reunite at the final station. They discovered circles, squares, triangles, and rectangles everywhere they went. Now it's your turn to find shapes in the world around you!")];
    default:
      return [];
  }
}

export function getSimulateIntro(stationId) {
  switch(stationId) {
    case 0:
      return [instruct("Tap two lines and tell me — are they parallel, perpendicular, or neither?")];
    case 1:
      return [instruct("Look at the angle. Is it a right angle, an acute angle, or an obtuse angle?")];
    case 2:
      return [instruct("Look at the shape. How many sides does it have?")];
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

export function getReflectNarration() {
  return [
    think("What a journey around the world! Can you find a right angle in your own room?"),
    cheer("Lesson complete! You are a Global Shape Quest Champion!")
  ];
}

export function getQuestionNarration(questionText) {
  return [ask(questionText)];
}
