import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import CameraScanner from './components/Scanner/CameraScanner.jsx';
import UnfoldedNet from './components/Review/UnfoldedNet.jsx';
import ValidationBadge from './components/Review/ValidationBadge.jsx';
import Cube3D from './components/Player/Cube3D.jsx';
import MoveControls from './components/Player/MoveControls.jsx';
import MoveList from './components/Player/MoveList.jsx';
import MoveGuide from './components/Player/MoveGuide.jsx';

import { DEFAULT_SOLVED_STATE } from './types/cube.js';
import { validateCubeState } from './utils/cubeValidator.js';
import { solveCubeState, getStateAtStep, initSolver } from './utils/solverEngine.js';
import { getScrambledState } from './utils/scrambler.js';
import Card from './components/UI/Card.jsx';
import Button from './components/UI/Button.jsx';
import { Sparkles, Trophy, Play, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'scan' | 'net' | 'player'
  const [cubeState, setCubeState] = useState(DEFAULT_SOLVED_STATE);
  const [showLabels, setShowLabels] = useState(false);

  // Solution State
  const [initialScannedState, setInitialScannedState] = useState(DEFAULT_SOLVED_STATE);
  const [solution, setSolution] = useState(null); // { moves: [], totalMoves: 0, solveTimeMs: 0 }
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isNotationGuideOpen, setIsNotationGuideOpen] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  const playbackTimerRef = useRef(null);

  // Initialize Solver pre-computations on app mount
  useEffect(() => {
    initSolver();
  }, []);

  // Validation
  const validationResult = validateCubeState(cubeState);

  // Sticker edit handler
  const handleStickerChange = (face, index, newColor) => {
    setCubeState(prev => {
      const nextFace = [...(prev[face] || [])];
      nextFace[index] = newColor;
      return { ...prev, [face]: nextFace };
    });
  };

  // Reset scan state
  const handleResetScan = () => {
    setCubeState(DEFAULT_SOLVED_STATE);
    setInitialScannedState(DEFAULT_SOLVED_STATE);
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setActiveTab('home');
  };

  // Webcam camera scan completion handler
  const handleFacesComplete = (scannedFaces) => {
    setCubeState(scannedFaces);
    setInitialScannedState(scannedFaces);
    setActiveTab('net');
  };

  // Preset scramble selection
  const handleSelectScramble = (scramblePreset) => {
    const { state } = getScrambledState(scramblePreset.moves);
    setCubeState(state);
    setInitialScannedState(state);

    // Auto solve preset
    const sol = solveCubeState(state);
    if (sol.success) {
      setSolution(sol);
      setCurrentStep(0);
      setIsPlaying(false);
      setActiveTab('player');
    } else {
      setActiveTab('net');
    }
  };

  // Solve Cube Trigger
  const handleSolveCube = () => {
    setIsSolving(true);
    setTimeout(() => {
      const sol = solveCubeState(cubeState);
      setSolution(sol);
      setInitialScannedState(cubeState);
      setCurrentStep(0);
      setIsPlaying(false);
      setIsSolving(false);
      if (sol.success) {
        setActiveTab('player');
      }
    }, 150);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPlaying && solution && solution.moves.length > 0) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      playbackTimerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < solution.moves.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            // Trigger Confetti victory!
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, solution]);

  // Compute 3D displayed state at current move step
  const displayed3DCubeState = solution && solution.moves
    ? getStateAtStep(initialScannedState, solution.moves, currentStep)
    : cubeState;

  const currentMove = solution && solution.moves && currentStep > 0
    ? solution.moves[currentStep - 1]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient background light glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        onResetScan={handleResetScan}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 z-10">
        {/* 1. Landing Page / Home */}
        {activeTab === 'home' && (
          <Home
            onStartScan={() => setActiveTab('scan')}
            onStartNet={() => setActiveTab('net')}
            onSelectScramble={handleSelectScramble}
          />
        )}

        {/* 2. Webcam Scanner */}
        {activeTab === 'scan' && (
          <CameraScanner
            onFacesComplete={handleFacesComplete}
            onSwitchToNet={() => setActiveTab('net')}
          />
        )}

        {/* 3. 2D Net Editor & Review Studio */}
        {activeTab === 'net' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <ValidationBadge
              validationResult={validationResult}
              onSolveClick={handleSolveCube}
              isSolving={isSolving}
            />

            <UnfoldedNet
              cubeState={cubeState}
              onStickerChange={handleStickerChange}
              showLabels={showLabels}
            />
          </div>
        )}

        {/* 4. 3D Solution Move Player */}
        {activeTab === 'player' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Solution Summary */}
            {solution && (
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Solution Found in {solution.totalMoves} Moves
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                        {solution.solveTimeMs} ms
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kociemba 2-phase algorithm optimal solution sequence.
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('net')}
                >
                  Edit 2D Net
                </Button>
              </div>
            )}

            {/* Main Player Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 3D Canvas viewport */}
              <div className="lg:col-span-7 space-y-4">
                <Cube3D
                  cubeState={displayed3DCubeState}
                  currentMove={currentMove}
                  showLabels={showLabels}
                  height="480px"
                />

                <MoveControls
                  currentStep={currentStep}
                  totalSteps={solution?.moves?.length || 0}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onNext={() => setCurrentStep(prev => Math.min(prev + 1, solution?.moves?.length || 0))}
                  onPrev={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
                  onRestart={() => { setIsPlaying(false); setCurrentStep(0); }}
                  onSkipToEnd={() => { setIsPlaying(false); setCurrentStep(solution?.moves?.length || 0); }}
                  onSpeedChange={setPlaybackSpeed}
                />
              </div>

              {/* Move Sequence Sidebar */}
              <div className="lg:col-span-5 space-y-4">
                <MoveList
                  moves={solution?.moves || []}
                  currentStep={currentStep}
                  onSelectMove={(step) => { setIsPlaying(false); setCurrentStep(step); }}
                  onOpenGuide={() => setIsNotationGuideOpen(true)}
                />

                {/* Cube Status Card */}
                {currentStep === (solution?.moves?.length || 0) && (
                  <Card className="bg-emerald-500/10 border-emerald-500/30 text-center py-6 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                    <h4 className="text-lg font-bold text-white">Rubik's Cube Solved!</h4>
                    <p className="text-xs text-emerald-200">
                      Congratulations! You have completed all {solution?.totalMoves} moves.
                    </p>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => { setCurrentStep(0); setIsPlaying(true); }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Replay Solution
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Move Notation Modal Guide */}
      <MoveGuide
        isOpen={isNotationGuideOpen}
        onClose={() => setIsNotationGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 mt-auto glass-panel">
        <p>FixMyCube • AI 3x3 Rubik's Cube Scanner & 3D Solver Studio</p>
      </footer>
    </div>
  );
}
