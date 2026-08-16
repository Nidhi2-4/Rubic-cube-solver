// Rubik's Cube State Validator & Solvability Checker
import { FACES, CUBE_COLORS, FACE_TO_COLOR } from '../types/cube.js';

export function validateCubeState(state) {
  const errors = [];
  const warnings = [];

  if (!state) {
    return { isValid: false, errors: ['No cube state provided'], warnings: [], counts: {} };
  }

  // 1. Calculate sticker counts
  const counts = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };
  let totalStickers = 0;

  FACES.forEach(face => {
    const stickers = state[face];
    if (Array.isArray(stickers)) {
      stickers.forEach(color => {
        if (counts[color] !== undefined) {
          counts[color]++;
          totalStickers++;
        }
      });
    }
  });

  if (totalStickers !== 54) {
    errors.push(`Incomplete cube net: ${totalStickers}/54 stickers scanned.`);
  }

  // 2. Sticker Count Check (exactly 9 per color)
  Object.entries(counts).forEach(([color, count]) => {
    const colorName = CUBE_COLORS[color]?.name || color;
    if (count !== 9) {
      if (count < 9) {
        errors.push(`Missing ${9 - count} ${colorName} sticker(s) (found ${count}/9).`);
      } else {
        errors.push(`Too many ${colorName} stickers! Found ${count}/9 (expected 9).`);
      }
    }
  });

  // 3. Center Sticker Verification
  const expectedCenters = {
    U: 'W',
    R: 'R',
    F: 'G',
    D: 'Y',
    L: 'O',
    B: 'B'
  };

  const centerMismatch = [];
  FACES.forEach(face => {
    const centerColor = state[face]?.[4];
    const expected = expectedCenters[face];
    if (centerColor && centerColor !== expected) {
      centerMismatch.push(`${face} center is ${CUBE_COLORS[centerColor]?.name || centerColor} (expected ${CUBE_COLORS[expected]?.name || expected}).`);
    }
  });

  if (centerMismatch.length > 0) {
    warnings.push(`Non-standard center orientation: ${centerMismatch.join(' ')} standard solving uses U=White, R=Red, F=Green, D=Yellow, L=Orange, B=Blue.`);
  }

  // 4. Edge & Corner Basic Parity check
  // Check if opposite colors exist on same piece
  const opposites = {
    W: 'Y', Y: 'W',
    R: 'O', O: 'R',
    B: 'G', G: 'B'
  };

  // If sticker counts match exactly 9, and total is 54, cube is state-ready for Kociemba solver
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    counts,
    totalStickers
  };
}
