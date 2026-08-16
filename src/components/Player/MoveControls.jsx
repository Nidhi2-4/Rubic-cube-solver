import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle2, Gauge } from 'lucide-react';
import Button from '../UI/Button.jsx';

export default function MoveControls({
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSkipToEnd,
  onSpeedChange
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col gap-4">
      {/* Progress Bar & Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{currentStep === totalSteps ? 'Cube Solved 🎉' : `${totalSteps - currentStep} moves remaining`}</span>
      </div>

      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
        <div 
          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRestart}
            disabled={currentStep === 0}
            title="Restart to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onPrev}
            disabled={currentStep === 0 || isPlaying}
            title="Previous Move"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {isPlaying ? (
            <Button
              variant="primary"
              size="md"
              onClick={onPause}
              className="px-5 shadow-lg shadow-blue-500/30"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onPlay}
              disabled={currentStep >= totalSteps}
              className="px-5 shadow-lg shadow-blue-500/30"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onNext}
            disabled={currentStep >= totalSteps || isPlaying}
            title="Next Move"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSkipToEnd}
            disabled={currentStep >= totalSteps}
            title="Skip to Solved"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Gauge className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Speed:</span>
          {[0.5, 1.0, 1.5, 2.0].map(speed => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                playbackSpeed === speed
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
