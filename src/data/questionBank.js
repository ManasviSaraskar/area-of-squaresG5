export const questionBank = [
  // World 0 (Eiffel Tower - Lines)
  {
    id: "Q1_01", type: "line_type", world: 0,
    questionText: "Look at the Eiffel Tower beams. Are the crossing lines parallel, perpendicular, or intersecting?",
    options: ["Parallel", "Perpendicular", "Intersecting"],
    correctAnswer: "Intersecting",
    image: "/assets/images/eiffel_tower.png"
  },
  {
    id: "Q1_02", type: "line_type", world: 0,
    questionText: "Look at the window grid. Are the crossing lines parallel, perpendicular, or neither?",
    options: ["Parallel", "Perpendicular", "Neither"],
    correctAnswer: "Perpendicular",
    image: "/assets/images/story_square.png"
  },
  {
    id: "Q1_03", type: "line_type", world: 0,
    questionText: "What do we call lines that never cross, no matter how far they stretch?",
    options: ["Parallel", "Perpendicular", "Intersecting"],
    correctAnswer: "Parallel",
    // No image
  },
  {
    id: "Q1_04", type: "line_type", world: 0,
    questionText: "What do we call lines that cross to make a perfect square corner?",
    options: ["Parallel", "Perpendicular", "Intersecting"],
    correctAnswer: "Perpendicular",
    // No image
  },
  {
    id: "Q1_05", type: "line_type", world: 0,
    questionText: "If two straight lines are parallel, will they ever touch?",
    options: ["Yes, eventually", "No, never"],
    correctAnswer: "No, never",
    // No image
  },

  // World 1 (Big Ben - Angles)
  {
    id: "Q2_01", type: "angle_type", world: 1,
    questionText: "Is the corner of Big Ben a right angle, an acute angle, or an obtuse angle?",
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Right angle",
    image: "/assets/images/big_ben.png"
  },
  {
    id: "Q2_02", type: "angle_type", world: 1,
    questionText: "Are the corners of this pizza slice right, acute, or obtuse angles?",
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Acute angle",
    image: "/assets/images/story_triangle.png"
  },
  {
    id: "Q2_03", type: "angle_type", world: 1,
    questionText: "What do we call an angle that is exactly 90 degrees (a perfect square corner)?",
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Right angle",
    // No image
  },
  {
    id: "Q2_04", type: "angle_type", world: 1,
    questionText: "What do we call an angle that is smaller (sharper) than a right angle?",
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Acute angle",
    // No image
  },
  {
    id: "Q2_05", type: "angle_type", world: 1,
    questionText: "What do we call an angle that is larger (wider) than a right angle?",
    options: ["Right angle", "Acute angle", "Obtuse angle"],
    correctAnswer: "Obtuse angle",
    // No image
  },

  // World 2 (Pyramids - Shapes)
  {
    id: "Q3_01", type: "shape_name", world: 2,
    questionText: "How many corners does a circle have?",
    options: ["0 corners", "1 corner", "3 corners"],
    correctAnswer: "0 corners",
    image: "/assets/images/story_circle.png"
  },
  {
    id: "Q3_02", type: "shape_name", world: 2,
    questionText: "The flat face of this pyramid is what 2D shape?",
    options: ["Square", "Triangle", "Circle"],
    correctAnswer: "Triangle",
    image: "/assets/images/pyramids_giza.png"
  },
  {
    id: "Q3_03", type: "shape_name", world: 2,
    questionText: "A shape with 4 equal sides and 4 right angles is called a...",
    options: ["Triangle", "Square", "Rectangle", "Pentagon"],
    correctAnswer: "Square",
    // No image
  },
  {
    id: "Q3_04", type: "shape_name", world: 2,
    questionText: "A shape with 5 sides and 5 corners is called a...",
    options: ["Triangle", "Square", "Rectangle", "Pentagon"],
    correctAnswer: "Pentagon",
    // No image
  },
  {
    id: "Q3_05", type: "shape_name", world: 2,
    questionText: "A shape with 3 sides and 3 corners is called a...",
    options: ["Triangle", "Square", "Rectangle", "Pentagon"],
    correctAnswer: "Triangle",
    // No image
  }
];
