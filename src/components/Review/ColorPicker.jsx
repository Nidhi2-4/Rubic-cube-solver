import React from 'react';
import { CUBE_COLORS } from '../../types/cube.js';

export default function ColorPicker({ selectedColor, onSelectColor }) {
  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
      {Object.values(CUBE_COLORS).map(color => {
        const isSelected = selectedColor === color.key;
        return (
          <button
            key={color.key}
            onClick={() => onSelectColor(color.key)}
            className={`w-9 h-9 rounded-xl transition-all duration-200 flex items-center justify-center font-bold text-xs shadow-md ${
              isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'hover:scale-105 opacity-85 hover:opacity-100'
            }`}
            style={{
              backgroundColor: color.hex,
              color: color.textHex,
              border: `1px solid ${color.borderHex}`
            }}
            title={`Select ${color.name} (${color.key})`}
          >
            {color.key}
          </button>
        );
      })}
    </div>
  );
}
