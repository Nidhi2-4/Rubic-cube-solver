// Kociemba 2-Phase Solving Algorithm Engine Wrapper using cubejs
import Cube from 'cubejs';
import { FACES, stringToCubeState, FACE_TO_COLOR } from '../types/cube.js';

let solverInitialized = false;

/**
 * Initialize Kociemba solver pre-computation tables
 */
export function initSolver() {
  if (solverInitialized) return;
  try {
    Cube.initSolver();
    solverInitialized = true;
  } catch (err) {
    console.error('Cubejs initSolver error:', err);
  }
}

/**
 * Map scanned state (which has color letters W, Y, R, O, B, G)
 * to face letters U, R, F, D, L, B based on center sticker positions.
 */
export function mapStateToFacelets(state) {
  // Find center color of each face (index 4)
  const centerToFace = {};
  FACES.forEach(face => {
    const centerColor = state[face]?.[4] || FACE_TO_COLOR[face];
    centerToFace[centerColor] = face;
  });

  // Convert each sticker color to its corresponding face letter
  let faceletsStr = '';
  FACES.forEach(face => {
    const stickers = state[face] || [];
    stickers.forEach(color => {
      const mappedFace = centerToFace[color] || {
        W: 'U', R: 'R', G: 'F', Y: 'D', O: 'L', B: 'B'
      }[color] || face;
      faceletsStr += mappedFace;
    });
  });

  return faceletsStr;
}

/**
 * Parse standard Singmaster move string (e.g. "R2 U' F B2 R' U2 D") into structured animation sequence
 */
export function parseMoveSequence(solveString) {
  if (!solveString || solveString.trim() === '') return [];

  const rawMoves = solveString.trim().split(/\s+/);
  return rawMoves.map((move, index) => {
    const face = move[0];
    const modifier = move.slice(1);
    const prime = modifier.includes("'");
    const double = modifier.includes("2");

    let degrees = 90;
    if (double) degrees = 180;

    let dir = prime ? -1 : 1;

    const axisMap = {
      R: { axis: 'x', layer: 1, sign: -1 },
      L: { axis: 'x', layer: -1, sign: 1 },
      U: { axis: 'y', layer: 1, sign: -1 },
      D: { axis: 'y', layer: -1, sign: 1 },
      F: { axis: 'z', layer: 1, sign: -1 },
      B: { axis: 'z', layer: -1, sign: 1 }
    };

    const info = axisMap[face] || { axis: 'y', layer: 1, sign: -1 };

    const faceNameMap = {
      R: 'Right', L: 'Left', U: 'Top (Up)', D: 'Bottom (Down)', F: 'Front', B: 'Back'
    };

    let desc = `Turn ${faceNameMap[face]} face `;
    if (double) desc += '180°';
    else if (prime) desc += '90° Counter-Clockwise ↺';
    else desc += '90° Clockwise ↻';

    return {
      stepIndex: index + 1,
      notation: move,
      face,
      prime,
      double,
      degrees,
      direction: dir,
      axis: info.axis,
      layer: info.layer,
      sign: info.sign,
      description: desc
    };
  });
}

/**
 * Solve a 54-sticker state object
 */
export function solveCubeState(state) {
  initSolver();

  const faceletsStr = typeof state === 'string' ? state : mapStateToFacelets(state);

  const startTime = performance.now();
  try {
    const cube = Cube.fromString(faceletsStr);
    const solutionStr = cube.solve();
    const endTime = performance.now();
    const solveTimeMs = Math.round(endTime - startTime);

    const moves = parseMoveSequence(solutionStr);

    return {
      success: true,
      solutionString: solutionStr,
      moves,
      totalMoves: moves.length,
      solveTimeMs,
      error: null
    };
  } catch (err) {
    return {
      success: false,
      solutionString: '',
      moves: [],
      totalMoves: 0,
      solveTimeMs: 0,
      error: err.message || 'Unable to find solution for this cube state.'
    };
  }
}

/**
 * Compute resulting state object after applying N moves to initial state
 */
export function getStateAtStep(initialState, moves, stepIndex) {
  if (stepIndex === 0 || !moves || moves.length === 0) {
    return initialState;
  }

  try {
    const faceletsStr = mapStateToFacelets(initialState);
    const cube = Cube.fromString(faceletsStr);
    const moveSubSequence = moves.slice(0, stepIndex).map(m => m.notation).join(' ');
    cube.move(moveSubSequence);
    const resultFacelets = cube.asString();

    const centerToColor = {
      U: initialState.U?.[4] || 'W',
      R: initialState.R?.[4] || 'R',
      F: initialState.F?.[4] || 'G',
      D: initialState.D?.[4] || 'Y',
      L: initialState.L?.[4] || 'O',
      B: initialState.B?.[4] || 'B'
    };

    const colorStr = resultFacelets.split('').map(f => centerToColor[f] || FACE_TO_COLOR[f]).join('');
    return stringToCubeState(colorStr);
  } catch (err) {
    console.error('Error getting state at step:', err);
    return initialState;
  }
}
