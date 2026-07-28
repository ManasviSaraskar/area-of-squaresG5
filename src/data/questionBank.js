// ─────────────────────────────────────────────────────
// Question Bank — Area of Squares (21 Questions, 3 Worlds)
// Grade 3 Mathematics: Calculating Area & Perimeter of Squares
// 7 questions per world, progressively harder, all with hints
// ─────────────────────────────────────────────────────

export const questionBank = [

  // =====================================================
  // World 0: The Tile Courtyard — Counting tiles for area
  // =====================================================
  {
    id: "Q1_01", type: "area_count", world: 0,
    questionText: "If a square courtyard is made of 2 rows of 2 tiles, what is its area?",
    options: ["2 tiles", "4 tiles", "6 tiles", "8 tiles"],
    correctAnswer: "4 tiles",
    hint: "Count the tiles in each row and multiply by the number of rows. 2 rows × 2 tiles = ?",
    image: "/assets/images/courtyard.png"
  },
  {
    id: "Q1_02", type: "area_count", world: 0,
    questionText: "A small square mosaic has 3 columns and 3 rows. How many total tiles (area) is it?",
    options: ["6 tiles", "9 tiles", "12 tiles", "15 tiles"],
    correctAnswer: "9 tiles",
    hint: "Multiply the number of columns by the number of rows: 3 × 3 = ?"
  },
  {
    id: "Q1_03", type: "area_count", world: 0,
    questionText: "What do we call the total space covered by the tiles inside a square?",
    options: ["Length", "Width", "Perimeter", "Area"],
    correctAnswer: "Area",
    hint: "Think about the space inside a shape — which word means 'space covered'?"
  },
  {
    id: "Q1_04", type: "area_count", world: 0,
    questionText: "If a square has a side length of 1 unit, what is its area?",
    options: ["1 square unit", "2 square units", "3 square units", "4 square units"],
    correctAnswer: "1 square unit",
    hint: "A 1×1 square fits exactly one unit square inside it. So Area = 1 × 1 = ?"
  },
  {
    id: "Q1_05", type: "area_count", world: 0,
    questionText: "If we double the side length of a 1×1 square to 2×2, what happens to its area?",
    options: ["It becomes 2", "It becomes 3", "It becomes 4", "It becomes 8"],
    correctAnswer: "It becomes 4",
    hint: "Use the formula: Side × Side. For a 2×2 square, Area = 2 × 2 = ?"
  },
  {
    id: "Q1_06", type: "area_count", world: 0,
    questionText: "A square garden has 4 rows and 4 columns of flower pots. What is the total area of the garden?",
    options: ["8 square units", "12 square units", "16 square units", "20 square units"],
    correctAnswer: "16 square units",
    hint: "Count the rows and the columns, then multiply them together: 4 × 4 = ?"
  },
  {
    id: "Q1_07", type: "area_count", world: 0,
    questionText: "Alex draws a square on grid paper with 5 tiles along each side. How many unit squares does it cover in total?",
    options: ["10", "20", "25", "30"],
    correctAnswer: "25",
    hint: "Use the formula: Side × Side = Area. What is 5 × 5?"
  },

  // =====================================================
  // World 1: Pixel Art Studio — Side × Side multiplication
  // =====================================================
  {
    id: "Q2_01", type: "area_calc", world: 1,
    questionText: "A pixel art block is a square with side length 4. What is its area?",
    options: ["8", "12", "16", "20"],
    correctAnswer: "16",
    hint: "Use the formula: Side × Side. What is 4 × 4?",
    image: "/assets/images/pixel_studio.png"
  },
  {
    id: "Q2_02", type: "area_calc", world: 1,
    questionText: "If a square window pane has a side of 5 units, what is its area?",
    options: ["10", "15", "20", "25"],
    correctAnswer: "25",
    hint: "Area = Side × Side. What is 5 × 5?"
  },
  {
    id: "Q2_03", type: "area_calc", world: 1,
    questionText: "Which formula is correct for finding the Area of a Square?",
    options: ["Side + Side", "Side × Side", "Side ÷ Side", "Side − Side"],
    correctAnswer: "Side × Side",
    hint: "Think about which operation (add, multiply, divide, subtract) gives us the total tiles in a square grid."
  },
  {
    id: "Q2_04", type: "area_calc", world: 1,
    questionText: "If a square has a side length of 6, what is its area?",
    options: ["12", "24", "30", "36"],
    correctAnswer: "36",
    hint: "Use Area = Side × Side. Try: 6 × 6 = ?"
  },
  {
    id: "Q2_05", type: "area_calc", world: 1,
    questionText: "What is the area of a square with a side length of 7?",
    options: ["14", "21", "28", "49"],
    correctAnswer: "49",
    hint: "Use Area = Side × Side. Try: 7 × 7 = ?"
  },
  {
    id: "Q2_06", type: "area_calc", world: 1,
    questionText: "A square stamp has a side of 8 units. What is its area?",
    options: ["16", "32", "48", "64"],
    correctAnswer: "64",
    hint: "Use Area = Side × Side. What is 8 × 8?"
  },
  {
    id: "Q2_07", type: "area_calc", world: 1,
    questionText: "Square A has a side of 3 units and Square B has a side of 6 units. How many times larger is Square B's area than Square A's area?",
    options: ["2 times", "3 times", "4 times", "6 times"],
    correctAnswer: "4 times",
    hint: "Calculate both: Area A = 3×3 = 9, Area B = 6×6 = 36. Now divide: 36 ÷ 9 = ?"
  },

  // =====================================================
  // World 2: The Grid City — Area & side relationships
  // =====================================================
  {
    id: "Q3_01", type: "area_reverse", world: 2,
    questionText: "A square plaza in Grid City has an area of 100 square blocks. What is its side length?",
    options: ["10 blocks", "20 blocks", "25 blocks", "50 blocks"],
    correctAnswer: "10 blocks",
    hint: "What number multiplied by itself gives 100? Try 10 × 10.",
    image: "/assets/images/grid_city.png"
  },
  {
    id: "Q3_02", type: "area_reverse", world: 2,
    questionText: "If a square carpet has an area of 64 square units, how long is one side?",
    options: ["6 units", "8 units", "16 units", "32 units"],
    correctAnswer: "8 units",
    hint: "What number times itself equals 64? Try 8 × 8 = ?"
  },
  {
    id: "Q3_03", type: "area_reverse", world: 2,
    questionText: "Which square has the largest area?",
    options: ["Side = 5", "Side = 7", "Side = 9", "Side = 11"],
    correctAnswer: "Side = 11",
    hint: "Calculate each area: Side × Side. The largest answer wins! Try 11 × 11."
  },
  {
    id: "Q3_04", type: "area_reverse", world: 2,
    questionText: "If you have 81 small square tiles, can you make a perfect large square? If yes, what would be the side length?",
    options: ["Yes, side 8", "Yes, side 9", "Yes, side 10", "No"],
    correctAnswer: "Yes, side 9",
    hint: "What number multiplied by itself gives 81? Try 9 × 9 = ?"
  },
  {
    id: "Q3_05", type: "area_reverse", world: 2,
    questionText: "A perfect square with a side of 10 has an area of...",
    options: ["20", "40", "50", "100"],
    correctAnswer: "100",
    hint: "Use the formula: Area = Side × Side. What is 10 × 10?"
  },
  {
    id: "Q3_06", type: "area_reverse", world: 2,
    questionText: "A square room needs 36 square tiles to cover its entire floor. How long is one wall of the room?",
    options: ["4 tiles", "6 tiles", "9 tiles", "18 tiles"],
    correctAnswer: "6 tiles",
    hint: "What number times itself gives 36? Try 6 × 6 = 36. So the side is 6!"
  },
  {
    id: "Q3_07", type: "area_reverse", world: 2,
    questionText: "Alex wants to frame a square photo. The photo has an area of 49 square centimetres. How long is each side of the photo?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm"],
    correctAnswer: "7 cm",
    hint: "Think: which number times itself equals 49? Try 7 × 7 = ?"
  },
];
