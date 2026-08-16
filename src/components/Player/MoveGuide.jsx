import React from 'react';
import Modal from '../UI/Modal.jsx';

export default function MoveGuide({ isOpen, onClose }) {
  const guideItems = [
    { notation: 'R', name: 'Right Face', desc: 'Rotate Right face 90° Clockwise ↻' },
    { notation: "R'", name: 'Right Prime', desc: 'Rotate Right face 90° Counter-Clockwise ↺' },
    { notation: 'R2', name: 'Right Double', desc: 'Rotate Right face 180° Half-Turn ⟳' },
    { notation: 'L', name: 'Left Face', desc: 'Rotate Left face 90° Clockwise ↻' },
    { notation: 'U', name: 'Up (Top) Face', desc: 'Rotate Top face 90° Clockwise ↻' },
    { notation: 'D', name: 'Down (Bottom)', desc: 'Rotate Bottom face 90° Clockwise ↻' },
    { notation: 'F', name: 'Front Face', desc: 'Rotate Front face 90° Clockwise ↻' },
    { notation: 'B', name: 'Back Face', desc: 'Rotate Back face 90° Clockwise ↻' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rubik's Cube Move Notation Guide">
      <div className="space-y-4">
        <p className="text-xs text-slate-300">
          Moves use official <strong className="text-white">Singmaster Notation</strong>. Hold the cube looking at the Front face:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {guideItems.map(item => (
            <div key={item.notation} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-base flex-shrink-0">
                {item.notation}
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">{item.name}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          💡 <strong>Tip:</strong> A prime symbol (<code className="bg-amber-950 px-1 rounded text-amber-200">'</code>) means counter-clockwise rotation, while a number <code className="bg-amber-950 px-1 rounded text-amber-200">2</code> means turn the face 180 degrees.
        </div>
      </div>
    </Modal>
  );
}
