import React from 'react';
import { FACES, FACE_NAMES, CUBE_COLORS } from '../../types/cube.js';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function FaceProgress({
  activeFaceIndex,
  capturedFaces, // { U: ['W', ...], R: [...] }
  onSelectFace,
  onResetCaptures
}) {
  const currentFace = FACES[activeFaceIndex];

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-300">Scan Progression Guide</h4>
          <p className="text-[11px] text-slate-400">Step {activeFaceIndex + 1} of 6: Hold <span className="text-blue-400 font-bold">{FACE_NAMES[currentFace]}</span> face to camera</p>
        </div>
        <button
          onClick={onResetCaptures}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart Scan
        </button>
      </div>

      {/* 6 Face Thumbnails */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {FACES.map((faceKey, idx) => {
          const isCaptured = !!capturedFaces[faceKey];
          const isActive = idx === activeFaceIndex;
          const stickers = capturedFaces[faceKey] || Array(9).fill(isCaptured ? 'W' : 'W');

          return (
            <button
              key={faceKey}
              onClick={() => onSelectFace(idx)}
              className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1.5 relative ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50 shadow-md'
                  : isCaptured
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              {/* Checkmark badge */}
              {isCaptured && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
              )}

              {/* Mini 3x3 Preview */}
              <div className="grid grid-cols-3 gap-0.5 w-9 h-9 p-0.5 bg-slate-950 rounded-md border border-slate-800">
                {stickers.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-[1px]"
                    style={{ backgroundColor: isCaptured ? CUBE_COLORS[c]?.hex : '#334155' }}
                  />
                ))}
              </div>

              <span className="text-[11px] font-bold font-mono text-slate-200">
                {faceKey}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
