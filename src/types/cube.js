// Core Cube Types, Color Maps, and Constants

export const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];

export const FACE_NAMES = {
  U: 'Up (Top)',
  R: 'Right',
  F: 'Front',
  D: 'Down (Bottom)',
  L: 'Left',
  B: 'Back'
};

export const CUBE_COLORS = {
  W: { key: 'W', name: 'White', hex: '#FFFFFF', textHex: '#000000', borderHex: '#E2E8F0', defaultFace: 'U' },
  Y: { key: 'Y', name: 'Yellow', hex: '#FACC15', textHex: '#000000', borderHex: '#EAB308', defaultFace: 'D' },
  R: { key: 'R', name: 'Red', hex: '#DC2626', textHex: '#FFFFFF', borderHex: '#B91C1C', defaultFace: 'R' },
  O: { key: 'O', name: 'Orange', hex: '#F97316', textHex: '#FFFFFF', borderHex: '#EA580C', defaultFace: 'L' },
  B: { key: 'B', name: 'Blue', hex: '#2563EB', textHex: '#FFFFFF', borderHex: '#1D4ED8', defaultFace: 'B' },
  G: { key: 'G', name: 'Green', hex: '#16A34A', textHex: '#FFFFFF', borderHex: '#15803D', defaultFace: 'F' }
};

export const FACE_TO_COLOR = {
  U: 'W',
  R: 'R',
  F: 'G',
  D: 'Y',
  L: 'O',
  B: 'B'
};

export const DEFAULT_SOLVED_STATE = {
  U: Array(9).fill('W'),
  R: Array(9).fill('R'),
  F: Array(9).fill('G'),
  D: Array(9).fill('Y'),
  L: Array(9).fill('O'),
  B: Array(9).fill('B')
};

// Return standard 54-char string representation ("UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB")
export function cubeStateToString(state) {
  return FACES.map(f => state[f].join('')).join('');
}

// Parse 54-char string back to face object
export function stringToCubeState(str) {
  if (!str || str.length !== 54) return DEFAULT_SOLVED_STATE;
  const state = {};
  FACES.forEach((f, idx) => {
    state[f] = str.slice(idx * 9, (idx + 1) * 9).split('');
  });
  return state;
}
