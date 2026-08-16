import React from 'react';
import { Camera, Grid, Play, Eye, RotateCcw, Box } from 'lucide-react';
import Button from './UI/Button.jsx';

export default function Navbar({
  activeTab,
  setActiveTab,
  showLabels,
  setShowLabels,
  onResetScan
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Box },
    { id: 'scan', label: 'Webcam Scanner', icon: Camera },
    { id: 'net', label: '2D Net Editor', icon: Grid },
    { id: 'player', label: '3D Solver Player', icon: Play }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Box className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Rubik's Solver <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">AI 3D</span>
            </h1>
            <p className="text-xs text-slate-400">Scanner & Kociemba Move Player</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle color letters for high contrast / colorblind accessibility"
            className={`border border-slate-700/60 ${showLabels ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : ''}`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Color Letters</span> ({showLabels ? 'ON' : 'OFF'})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onResetScan}
            title="Reset cube state to solved"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
