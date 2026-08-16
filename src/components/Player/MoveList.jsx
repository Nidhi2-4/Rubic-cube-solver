import React, { useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

export default function MoveList({ moves, currentStep, onSelectMove, onOpenGuide }) {
  const containerRef = useRef();
  const activeMoveRef = useRef();

  useEffect(() => {
    if (activeMoveRef.current && containerRef.current) {
      activeMoveRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStep]);

  if (!moves || moves.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm glass-panel rounded-2xl border border-slate-800">
        No solution sequence generated yet. Scan a cube or choose a scramble preset to solve!
      </div>
    );
  }

  const activeMove = currentStep > 0 ? moves[currentStep - 1] : null;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>Solution Sequence</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            {moves.length} moves
          </span>
        </h4>
        <button
          onClick={onOpenGuide}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Notation Guide
        </button>
      </div>

      {/* Move Chips Horizontal Scroll List */}
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar"
      >
        {moves.map((m, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isPassed = stepNum < currentStep;

          return (
            <button
              key={idx}
              ref={isActive ? activeMoveRef : null}
              onClick={() => onSelectMove(stepNum)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-lg shadow-blue-500/30'
                  : isPassed
                  ? 'bg-slate-800/90 text-slate-400 border border-slate-700/60'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span className="text-[10px] font-sans text-slate-400 font-normal">#{stepNum}</span>
              <span>{m.notation}</span>
            </button>
          );
        })}
      </div>

      {/* Active Move Description Banner */}
      {activeMove ? (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-200">
          <div>
            <span className="font-semibold text-blue-400">Step {currentStep}: </span>
            <span>{activeMove.description}</span>
          </div>
          <span className="font-mono font-bold text-sm text-blue-300 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
            {activeMove.notation}
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 text-center">
          Click <span className="text-white font-medium">Play</span> or <span className="text-white font-medium">Next Step</span> to begin solving walkthrough.
        </div>
      )}
    </div>
  );
}
