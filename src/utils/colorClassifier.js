// Computer Vision Color Classifier (RGB to HSV & Euclidean distance)
import { CUBE_COLORS } from '../types/cube.js';

/**
 * Convert RGB (0-255) to HSV (H: 0-360, S: 0-1, V: 0-1)
 */
export function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

// Reference RGB values for Euclidean fallback distance
const REFERENCE_RGB = {
  W: { r: 240, g: 240, b: 240 },
  Y: { r: 245, g: 215, b: 25 },
  R: { r: 210, g: 30, b: 35 },
  O: { r: 245, g: 110, b: 20 },
  B: { r: 25, g: 90, b: 215 },
  G: { r: 25, g: 165, b: 65 }
};

/**
 * Classify single RGB sample into W, Y, R, O, B, or G
 */
export function classifyColor(r, g, b) {
  const { h, s, v } = rgbToHsv(r, g, b);

  // 1. HSV Rule-Based Detection
  let primaryKey = null;

  // Very low saturation & high brightness -> White
  if (s < 0.24 && v > 0.40) {
    primaryKey = 'W';
  } else if (s < 0.32 && v > 0.70) {
    primaryKey = 'W';
  } else {
    // Hue-based classification
    if ((h >= 342 || h <= 18) && s >= 0.25) {
      primaryKey = 'R';
    } else if (h > 18 && h <= 42) {
      primaryKey = 'O';
    } else if (h > 42 && h <= 70) {
      primaryKey = 'Y';
    } else if (h > 70 && h <= 165) {
      primaryKey = 'G';
    } else if (h > 165 && h <= 260) {
      primaryKey = 'B';
    } else if (h > 260 && h < 342) {
      // Purple / Magenta noise -> closest to Blue or Red
      primaryKey = s < 0.3 ? 'W' : (h < 300 ? 'B' : 'R');
    }
  }

  // 2. Euclidean RGB Distance check as confirmation
  let bestDist = Infinity;
  let closestKey = 'W';

  Object.entries(REFERENCE_RGB).forEach(([key, ref]) => {
    const dist = Math.sqrt(
      Math.pow(r - ref.r, 2) +
      Math.pow(g - ref.g, 2) +
      Math.pow(b - ref.b, 2)
    );
    if (dist < bestDist) {
      bestDist = dist;
      closestKey = key;
    }
  });

  const finalKey = primaryKey || closestKey;
  const confidence = Math.max(0.6, 1 - (bestDist / 441));

  return {
    colorKey: finalKey,
    hex: CUBE_COLORS[finalKey]?.hex || '#FFFFFF',
    name: CUBE_COLORS[finalKey]?.name || 'White',
    confidence: Number(confidence.toFixed(2)),
    hsv: { h, s: Math.round(s * 100), v: Math.round(v * 100) }
  };
}

/**
 * Sample HTML5 Canvas ROI (Region of Interest) average RGB around point (cx, cy)
 */
export function sampleCanvasROI(ctx, cx, cy, radius = 8) {
  try {
    const imageData = ctx.getImageData(cx - radius, cy - radius, radius * 2, radius * 2);
    const data = imageData.data;
    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      count++;
    }

    if (count === 0) return classifyColor(255, 255, 255);

    const rAvg = Math.round(rSum / count);
    const gAvg = Math.round(gSum / count);
    const bAvg = Math.round(bSum / count);

    return classifyColor(rAvg, gAvg, bAvg);
  } catch (err) {
    return classifyColor(255, 255, 255);
  }
}
