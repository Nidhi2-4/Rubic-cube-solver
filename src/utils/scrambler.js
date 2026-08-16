// Preset Scramble Definitions & State Generator using cubejs
import Cube from 'cubejs';
import { stringToCubeState, DEFAULT_SOLVED_STATE } from '../types/cube.js';

export const PRESET_SCRAMBLES = [
  {
    id: 'checkerboard',
    name: 'Checkerboard Pattern',
    moves: 'L2 R2 U2 D2 F2 B2',
    difficulty: 'Easy (6 moves)',
    desc: 'Classic checkerboard pattern on all 6 faces'
  },
  {
    id: 'easy5',
    name: 'Quick 5-Step Scramble',
    moves: 'R U R\' U\' R',
    difficulty: 'Beginner (5 moves)',
    desc: 'Short scramble ideal for quick 3D animation test'
  },
  {
    id: 'superflip',
    name: 'Superflip (20 Moves)',
    moves: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
    difficulty: 'Hard (20 moves)',
    desc: 'Famous 20-move position where all 12 edges are inverted'
  },
  {
    id: 'random20',
    name: 'Random 20-Move Scramble',
    moves: 'RANDOM',
    difficulty: 'Standard (20 moves)',
    desc: 'Randomly generated tournament-style 20-move scramble'
  }
];

const VALID_MOVES = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'B', "B'", 'B2'];

export function generateRandomScramble(length = 20) {
  const moves = [];
  let prevFace = '';

  for (let i = 0; i < length; i++) {
    let move;
    let face;
    do {
      move = VALID_MOVES[Math.floor(Math.random() * VALID_MOVES.length)];
      face = move[0];
    } while (face === prevFace);

    prevFace = face;
    moves.push(move);
  }

  return moves.join(' ');
}

const FACELET_TO_COLOR = {
  U: 'W',
  R: 'R',
  F: 'G',
  D: 'Y',
  L: 'O',
  B: 'B'
};

/**
 * Apply move string to a solved cube and return state object
 */
export function getScrambledState(moveSequence) {
  if (!moveSequence) return DEFAULT_SOLVED_STATE;

  let moves = moveSequence;
  if (moves === 'RANDOM') {
    moves = generateRandomScramble(20);
  }

  try {
    const cube = new Cube();
    cube.move(moves);
    const faceletStr = cube.asString(); // e.g. "UDUD..."

    // Convert facelet letters to color letters
    const colorStr = faceletStr.split('').map(char => FACELET_TO_COLOR[char] || 'W').join('');

    return {
      state: stringToCubeState(colorStr),
      appliedMoves: moves
    };
  } catch (err) {
    console.error('Error generating scramble state:', err);
    return {
      state: DEFAULT_SOLVED_STATE,
      appliedMoves: ''
    };
  }
}
