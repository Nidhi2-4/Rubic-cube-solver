import React from 'react';
import { Camera, Grid, Play, Sparkles, Zap, ShieldCheck, Box, ArrowRight } from 'lucide-react';
import { PRESET_SCRAMBLES } from '../utils/scrambler.js';
import Cube3D from './Player/Cube3D.jsx';
import Button from './UI/Button.jsx';
import { DEFAULT_SOLVED_STATE } from '../types/cube.js';

export default function Home({
  onStartScan,
  onStartNet,
  onSelectScramble
}) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text Content */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Kociemba 2-Phase Solving Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Solve Any Rubik's Cube in <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Seconds</span>
          </h1>

          <p className="text-base text-slate-300 max-w-xl leading-relaxed">
            Scan your physical 3x3 Rubik's cube with your webcam, review and fix colors on the 2D net, and play back standard move-by-move solutions in 3D.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartScan}
              className="glow-blue"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Physical Cube</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onStartNet}
            >
              <Grid className="w-5 h-5 text-blue-400" />
              <span>2D Net Editor</span>
            </Button>
          </div>

          {/* Feature Badge Strip */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">Sub-second Solving</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">State Validator</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-300 font-medium">3D Orbit Player</span>
            </div>
          </div>
        </div>

        {/* Right 3D Interactive Hero Preview */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
          <Cube3D
            cubeState={DEFAULT_SOLVED_STATE}
            isAutoRotating={true}
            height="400px"
          />
        </div>
      </div>

      {/* Preset Scrambles & Demo Section */}
      <div className="space-y-6">
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Play className="w-6 h-6 text-blue-400" />
            Preset Scrambles & Demo Mode
          </h2>
          <p className="text-sm text-slate-400">
            Don't have a cube nearby? Try instant solutions for popular scrambles in 1-click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_SCRAMBLES.map(scramble => (
            <div
              key={scramble.id}
              className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    {scramble.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {scramble.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {scramble.desc}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelectScramble(scramble)}
                className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all"
              >
                <span>Solve Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
