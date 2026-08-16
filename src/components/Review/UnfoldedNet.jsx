import React, { useState } from 'react';
import { CUBE_COLORS, FACE_NAMES } from '../../types/cube.js';
import ColorPicker from './ColorPicker.jsx';

export default function UnfoldedNet({
  cubeState,
  onStickerChange,
  showLabels = false
}) {
  const [selectedColor, setSelectedColor] = useState('W');
  const [activeSticker, setActiveSticker] = useState(null); // { face: 'U', index: 0 }

  const handleStickerClick = (face, index) => {
    // If user clicks center sticker (index 4), allow override or show notification
    onStickerChange(face, index, selectedColor);
    setActiveSticker({ face, index });
  };

  const renderFaceGrid = (faceKey) => {
    const stickers = cubeState[faceKey] || Array(9).fill('W');
    const faceName = FACE_NAMES[faceKey];

    return (
      <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl glass-card border border-slate-800">
        <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1">
          {faceKey} - {faceName}
        </span>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
          {stickers.map((colorKey, idx) => {
            const colorInfo = CUBE_COLORS[colorKey] || CUBE_COLORS.W;
            const isCenter = idx === 4;
            const isActive = activeSticker?.face === faceKey && activeSticker?.index === idx;

            return (
              <button
                key={idx}
                onClick={() => handleStickerClick(faceKey, idx)}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg transition-all duration-150 flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm relative ${
                  isActive ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10' : 'hover:scale-105 hover:opacity-90'
                }`}
                style={{
                  backgroundColor: colorInfo.hex,
                  color: colorInfo.textHex,
                  border: `1.5px solid ${colorInfo.borderHex}`
                }}
                title={`${faceKey} Face Sticker #${idx + 1}: ${colorInfo.name}${isCenter ? ' (Center)' : ''}`}
              >
                {/* Center marker dot */}
                {isCenter && (
                  <span className="absolute w-2 h-2 rounded-full bg-current opacity-40" />
                )}

                {/* Color Letter Accessibility Overlay */}
                {showLabels && (
                  <span className="relative font-mono font-extrabold text-xs drop-shadow-md">
                    {colorKey}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Active Color Palette Selector */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Select Active Paint Color:</span>
        <ColorPicker
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
        <p className="text-[11px] text-slate-400">
          Click any sticker below to paint it with <strong className="text-white">{CUBE_COLORS[selectedColor]?.name}</strong>.
        </p>
      </div>

      {/* 2D Unfolded Cross Layout */}
      <div className="flex flex-col items-center gap-3 select-none">
        {/* Top Row: U Face */}
        <div className="flex justify-center">
          {renderFaceGrid('U')}
        </div>

        {/* Middle Row: L, F, R, B Faces */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderFaceGrid('L')}
          {renderFaceGrid('F')}
          {renderFaceGrid('R')}
          {renderFaceGrid('B')}
        </div>

        {/* Bottom Row: D Face */}
        <div className="flex justify-center">
          {renderFaceGrid('D')}
        </div>
      </div>
    </div>
  );
}
