import React from 'react';
import { CheckCircle2, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { CUBE_COLORS } from '../../types/cube.js';
import Button from '../UI/Button.jsx';

export default function ValidationBadge({ validationResult, onSolveClick, isSolving }) {
  const { isValid, errors, warnings, counts } = validationResult;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      {/* Solvability Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isValid ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {isValid ? 'State Valid & Ready to Solve' : 'Invalid Cube State'}
              <span className={`text-xs px-2 py-0.5 rounded-full border font-normal ${
                isValid 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                {isValid ? 'Solvable' : 'Correction Needed'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isValid 
                ? 'All 54 sticker counts match standard 3x3 Rubik\'s Cube specifications.' 
                : 'Please fix misclassified stickers using the color palette above.'}
            </p>
          </div>
        </div>

        {/* Solve CTA */}
        <Button
          variant={isValid ? 'primary' : 'secondary'}
          size="lg"
          onClick={onSolveClick}
          disabled={!isValid || isSolving}
          className="w-full sm:w-auto"
        >
          {isSolving ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Solve Cube Now</span>
            </>
          )}
        </Button>
      </div>

      {/* Color Sticker Counts Breakdown */}
      <div className="grid grid-cols-6 gap-2 pt-2 border-t border-slate-800">
        {Object.entries(CUBE_COLORS).map(([key, info]) => {
          const count = counts[key] || 0;
          const isCorrect = count === 9;
          return (
            <div
              key={key}
              className={`p-2 rounded-xl border text-center transition-all ${
                isCorrect 
                  ? 'bg-slate-900/60 border-slate-800' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-1 border shadow-sm"
                style={{ backgroundColor: info.hex, borderColor: info.borderHex }}
              />
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">{info.name}</span>
              <span className={`text-xs font-mono font-bold ${isCorrect ? 'text-white' : 'text-rose-400'}`}>
                {count}/9
              </span>
            </div>
          );
        })}
      </div>

      {/* Errors & Warnings List */}
      {errors.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
          <h4 className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Validation Errors:
          </h4>
          <ul className="list-disc list-inside text-xs text-rose-200 space-y-0.5 pl-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
          💡 {warnings.join(' ')}
        </div>
      )}
    </div>
  );
}
